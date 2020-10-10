import express from 'express';
import accountsRouter from './routes/accounts';
import { promises as fs } from 'fs';

const { readFile, writeFile } = fs;

global.filename = 'accounts.json'; // <- Definindo o arquivo de forma global

const app = express();
app.use(express.json());

app.use('/account', accountsRouter);

app.listen(3000, async () => {
  try {
    await readFile(global.filename);
    console.log('API Started!');
  } catch (error) {
    const initialJson = {
      nextId: 1,
      accounts: [],
    };

    writeFile(global.filename, JSON.stringify(initialJson))
      .then(() => {
        console.log('API Started and File Created!');
      })
      .catch((err) => {
        console.log(err);
      });
  }
});
