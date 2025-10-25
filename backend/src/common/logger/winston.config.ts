import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';
import { format } from 'winston';

const { combine, timestamp, printf, colorize, errors, json } = format;

// Custom log format
const customFormat = printf(({ level, message, timestamp, context, trace, ...metadata }) => {
  let msg = `${timestamp} [${context || 'Application'}] ${level}: ${message}`;

  // Add metadata if present
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }

  // Add stack trace for errors
  if (trace) {
    msg += `\n${trace}`;
  }

  return msg;
});

// Console format with colors (for development)
const consoleFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  customFormat,
);

// File format (for production)
const fileFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  json(),
);

export const winstonConfig: WinstonModuleOptions = {
  transports: [
    // Console logging (always enabled)
    new winston.transports.Console({
      format: consoleFormat,
      level: process.env.LOG_LEVEL || 'info',
    }),

    // Error log file
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),

    // Combined log file
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: 'logs/exceptions.log',
      format: fileFormat,
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: 'logs/rejections.log',
      format: fileFormat,
    }),
  ],
};
