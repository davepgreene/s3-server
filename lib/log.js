const Winston = require('winston');

function Log(config) {
  const logger = new Winston.Logger({
    level: config.get('log.level'),
    transports: [
      new Winston.transports.Console({
        colorize: true,
        timestamp: true
      })
    ]
  });

  if (config.has('log.filename')) {
    const filename = config.get('log.filename');
    logger.add(Winston.transports.File, {
      filename
    });
  }

  return logger;
}

module.exports = Log;
