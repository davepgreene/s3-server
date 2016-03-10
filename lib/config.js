const convict = require('convict');
const Path = require('path');
const appRoot = require('app-root-path');

const DEFAULT_HTTP_PORT = 4569;
const DEFAULT_HOST = '127.0.0.1';

const schema = {
  log: {
    level: {
      doc: 'Logging level',
      format: String,
      default: 'info'
    }
  },
  hostname: {
    doc: 'IP address to bind',
    format: 'ipaddress',
    default: DEFAULT_HOST

  },
  port: {
    doc: 'Port to bind',
    format: 'port',
    default: DEFAULT_HTTP_PORT
  },
  directory: {
    doc: 'The data directory',
    format: String,
    default: Path.resolve(__dirname, '../data')
  },
  bucket: {
    doc: 'The bucket name',
    format: String,
    default: 'data'
  }
};

const conf = convict(schema);

/**
 * Populates the config object with the specific config file or cli args
 * @param {yargs} args
 * @returns {convict}
 */
function load(args) {
  if (args.c) {
    conf.loadFile(args.c);

    // Test if the directory given is a relative path, if so, make it absolute
    if (conf.has('directory')) {
      const absPath = Path.resolve(appRoot.toString(), Path.dirname(args.c), conf.get('directory'));
      conf.set('directory', absPath);
    }
  } else {
    if (args.h) {
      conf.set('hostname', args.h);
    }
    if (args.p) {
      conf.set('port', args.p);
    }
    if (args.b) {
      conf.set('bucket', args.b);
    }
    if (args.d) {
      const dataPath = Path.resolve(process.cwd(), args.d);

      conf.set('directory', dataPath);
      if (!args.b) {
        conf.set('bucket', Path.parse(dataPath).name);
      }
    }
  }

  return conf;
}

module.exports = load;
