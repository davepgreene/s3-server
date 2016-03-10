const Path = require('path');
const os = require('os');
const fs = require('fs-extra');
const chokidar = require('chokidar');
const S3 = require('./s3');

/**
 * Removes the "bucket" created in the temp folder
 * @param {String} dir
 */
function cleanupDir(dir) {
  try {
    fs.removeSync(dir);
  } catch (err) {
    throw err;
  }
}

/**
 * Creates a directory for the "bucket" in the temp folder
 * @param {String} bucket
 * @returns {String}
 */
function createTempDirForBucket(bucket) {
  const tmpDirBucketPath = Path.resolve(os.tmpdir(), `${bucket}-temp-s3-server`);

  try {
    cleanupDir(tmpDirBucketPath);
    fs.mkdirSync(tmpDirBucketPath);
  } catch (err) {
    throw err;
  }

  return tmpDirBucketPath;
}

/**
 * Checks if the specified data directory is actually a directory
 * @param path
 * @returns {Promise}
 */
function isValidDir(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        return reject(err, err.stack);
      }
      if (!stats.isDirectory()) {
        return reject(err, `${path} is not a directory`);
      }
      return resolve();
    });
  });
}

/**
 * Sets a file watcher on a given directory
 * @param {String} bucket
 * @param {String} path
 * @param {AWS.S3} client
 */
function watchDir(bucket, path, client) {
  const watcher = chokidar.watch(path, { persistent: true });

  watcher.on('change', (filePath) => {
    S3.replaceOrCreateObject(bucket, filePath, client, path);
  });
  watcher.on('add', (filePath) => {
    S3.replaceOrCreateObject(bucket, filePath, client, path);
  });
  watcher.on('unlink', (filePath) => {
    S3.deleteObject(bucket, filePath, client, path);
  });
}

module.exports = {
  cleanupDir,
  createTempDirForBucket,
  isValidDir,
  watchDir
};
