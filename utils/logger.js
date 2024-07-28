const winston = require('winston');
const { combine, timestamp, json } = winston.format;

const logger = winston.createLogger({
  level: 'info',
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.File({
      filename: './resources/logs/app.log',
      level: 'info',
    }),
    new winston.transports.File({
      filename: './resources/logs/errors.log',
      level: 'error',
    }),
  ],
});

module.exports = logger;
