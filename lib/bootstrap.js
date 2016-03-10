'use strict';

const AWS = require('aws-sdk');
const File = require('./file');
const S3 = require('./s3');
const Server = require('./server');
const Utils = require('./utils');

class Bootstrap {
  constructor(config, log) {
    this.config = config;
    this.log = log;

    this.client = new AWS.S3({
      s3ForcePathStyle: true,
      endpoint: new AWS.Endpoint(`http://${this.config.get('hostname')}:${this.config.get('port')}`)
    });
    this.path = this.config.get('directory');

    return this;
  }

  init() {
    File.isValidDir(this.path)
      .then(() => {
        const bucketInfo = Utils.generateBucketInfo(this.path);
        const bucket = Utils.normalizePath(bucketInfo.path);
        const bucketName = (this.config.has('bucket')) ? this.config.get('bucket') : bucketInfo.name; // eslint-disable-line max-len
        this.port = this.config.get('port');
        this.hostname = this.config.get('hostname');

        const tmpDir = File.createTempDirForBucket(bucket);

        this.config.set('bucket', bucketName);
        this.config.set('tmpDir', tmpDir);
        this.createServer(tmpDir, bucketName);
      })
      .catch((err, msg) => {
        this.log.error(err, msg);
        process.exit(1);
      });
  }

  createServer(tmpDir, bucketName) {
    this.server = new Server(this.hostname, this.port, tmpDir);
    this.server.start((serverStartErr, host, p) => {
      if (serverStartErr) {
        throw serverStartErr;
      }

      Promise.all([
        S3.createBucket(bucketName, this.client),
        S3.copyAllFiles(bucketName, this.path, this.client)
      ])
      .then(() => File.watchDir(bucketName, this.path, this.client))
      .catch((err) => {
        throw err;
      });

      this.log.info(`listening for S3 requests at http://${host}:${p}`);
    });
  }

  get running() {
    return this.server.running;
  }
}

module.exports = Bootstrap;
