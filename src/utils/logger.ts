import {createLogger, format, transports} from 'winston';
import {server} from '../config';

const {combine, timestamp, printf, colorize} = format;

const myFormat = printf(({level, message, timestamp}) => {
  return `${timestamp} - [${level}]: ${message}`;
});
export const logger = createLogger({
  level: server.logLevel,
  format: combine(timestamp(), colorize(), myFormat),
  transports: [new transports.Console()]
});
