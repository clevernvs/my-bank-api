import express from 'express';
import winston, { silly } from 'winston';
import accountsRouter from './routes/accounts';
import { promises as fs } from 'fs';

const { readFile, writeFile } = fs;

// <- Definindo o arquivo de forma global
global.filename = 'accounts.json';

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});
global.logger = winston.createLogger({
  level: 'silly',
  transports: [new winston.transports.Console(), new winston.transports.File({ filename: 'my-bank-api.log' })],
  format: combine(label({ label: 'my-bank-api' }), timestamp(), myFormat),
});
// <- Definindo o arquivo de forma global

const app = express();
app.use(express.json());
app.use('/account', accountsRouter);
app.listen(3000, async () => {
  try {
    await readFile(global.filename);

    logger.info('API Started!');
  } catch (error) {
    const initialJson = {
      nextId: 1,
      accounts: [],
    };

    writeFile(global.filename, JSON.stringify(initialJson))
      .then(() => {
        logger.info('API Started and File Created!');
      })
      .catch((err) => {
        logger.error(err);
      });
  }
});
