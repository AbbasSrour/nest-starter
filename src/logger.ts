import { utilities } from 'nest-winston';
import winston = require('winston');
// import LokiTransport = require('winston-loki');

export const loggerConfig = (name: string) => {
  if (process.env.NODE_ENV !== 'production')
    return {
      level: 'silly',
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            utilities.format.nestLike()
          ),
        }),
      ],
    };
  return {
    level: 'silly',
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          utilities.format.nestLike()
        ),
      }),
      // new LokiTransport({
      //   host: process.env.LOKI_HOST || '',
      //   labels: { app: name },
      //   replaceTimestamp: true,
      //   format: winston.format.json(),
      //   json: true,
      //   onConnectionError: (err) => console.error(err),
      // }),
    ],
  };
};
