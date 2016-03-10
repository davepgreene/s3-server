'use strict';

const S3rver = require('s3rver');

class Server {
  constructor(hostname, port, dir) {
    this.hostname = hostname;
    this.port = port;
    this.directory = dir;
    this.running = false;

    this.client = new S3rver({
      port,
      hostname,
      silent: false,
      directory: dir
    });
  }

  start(callback) {
    this.client.run(callback);
    this.running = true;
  }
}

module.exports = Server;
