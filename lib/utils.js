'use strict';

const Path = require('path');
const File = require('./file');

/**
 * Normalize a path so it's a valid bucket name
 * @param p
 * @returns {string}
 */
function normalizePath(p) {
  const path = p.replace(/\//g, '-').toLowerCase();

  return (path[0] === '-') ? path.replace('-', '') : path;
}

/**
 * Gets bucket path name and directory
 * @param p
 * @returns {{name: *, path: (*|console.dir|string|string|string)}}
 */
function generateBucketInfo(p) {
  const parsed = Path.parse(p);

  return {
    name: parsed.name,
    path: p
  };
}

/**
 * Handles cleanup on app exit
 */
function exitHandler(log, tmpDir, code) {
  if (tmpDir) {
    log.info(`Cleaning up temp directory: ${tmpDir}`);
    File.cleanupDir(tmpDir);
  }
  process.exit(code);
}

module.exports = {
  normalizePath,
  generateBucketInfo,
  exitHandler
};
