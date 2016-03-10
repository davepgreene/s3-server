# S3 Dev Server

[![npm version](https://badge.fury.io/js/s3-server.svg)](https://badge.fury.io/js/s3-server)
[![Dependency Status](https://david-dm.org/davepgreene/s3-server.svg)](https://david-dm.org/davepgreene/s3-server)

## Installation

```bash
$ npm install s3-server -g
$ s3-server
```
Alternatively, to integrate into a project:
```bash
$ npm install s3-server --save-dev
```
and add `s3-server` to your `package.json` script line.

## Usage
```
Usage: s3-server [args]

Options:
  -c, --config    Load a config file from the filesystem. This supersedes all
                  other settings                                        [string]
  -d, --data      Load data directory from filesystem                   [string]
  -h, --hostname  The hostname or ip for the server                     [string]
  -p, --port      The port number of the http server                    [number]
  -b, --bucket    The bucket name (if unspecified, defaults to the name of the
                  data folder)                                          [string]
  --help          Show help                                            [boolean]
```

## TODO
* Tests! Tests! Tests!
* Add ability to use programmatically
