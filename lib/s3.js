'use strict';

const walk = require('walk');
const Path = require('path');
const fs = require('fs-extra');

/**
 * Replace an object that exists in the bucket.
 *
 * If it turns out the object doesn't exist, it'll upload a
 * new version anyway.
 *
 * @param {String} bucket
 * @param {String} path
 * @param {AWS.S3} client
 * @param {String} root
 * @returns {Promise}
 */
function replaceOrCreateObject(bucket, path, client, root) {
  const pathToFile = Path.relative(root, path);
  const stream = fs.createReadStream(path);

  return new Promise((resolve, reject) => {
    client.putObject({
      Bucket: bucket,
      Key: pathToFile,
      Body: stream
    }, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

/**
 * Delete an object in the bucket
 * @param {String} bucket
 * @param {String} path
 * @param {AWS.S3} client
 * @param {String} root
 * @returns {Promise}
 */
function deleteObject(bucket, path, client, root) {
  const pathToFile = Path.relative(root, path);

  return new Promise((resolve, reject) => {
    client.deleteObject({
      Bucket: bucket,
      Key: pathToFile
    }, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

/**
 * Copies files from the watched folder for the "bucket"
 * @param {String} bucket
 * @param {String} path
 * @param {AWS.S3} client
 * @returns {Promise}
 */
function copyAllFiles(bucket, path, client) {
  return new Promise((resolve, reject) => {
    const walker = walk.walk(path);

    walker.on('file', (root, fileStats, next) => {
      const pathToFile = Path.join(Path.relative(path, root), fileStats.name);
      const stream = fs.createReadStream(Path.join(path, pathToFile));

      client.putObject({
        Bucket: bucket,
        Key: pathToFile,
        Body: stream
      }, (err) => {
        if (err) {
          reject(err);
        }
        next();
      });
    });
    walker.on('end', resolve);
  });
}

/**
 * Creates a bucket
 * @param {String} bucket
 * @param {AWS.S3} client
 * @returns {Promise}
 */
function createBucket(bucket, client) {
  return new Promise((resolve, reject) => {
    client.createBucket({ Bucket: bucket }, (createBucketErr) => {
      if (createBucketErr) {
        reject(createBucketErr);
      }
      resolve();
    });
  });
}

module.exports = {
  createBucket,
  copyAllFiles,
  replaceOrCreateObject,
  deleteObject
};
