import express from 'express';
import { promises as fs, readFile, writeFile } from 'fs';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    let account = req.body;
    const data = JSON.parse(await readFile(global.filename));

    account = { id: data.nextId++, ...account };
    data.account.push(account);

    await writeFile(global.filename, JSON.stringify(data, null, 2));

    res.send(account);

    global.logger.info(`POST /account - ${JSON.stringify(account)}`);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(global.filename));

    res.send(data);

    global.logger.info('GET /account');
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(global.filename));
    const account = data.accounts.find((account) => account.id === parseInt(req.params.id));

    res.send(account);

    global.logger.info('GET /account/:id');
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(global.filename));

    data.accounts = data.accounts.filter((account) => account.id !== parseInt(req.params.id));

    await writeFile(global.filename, JSON.stringify(data, null, 2));

    res.end();

    global.logger.info(`DELETE /account/:id - ${req.params.id}`);
  } catch (err) {
    next(err);
  }
});

router.put('/', async (req, res, next) => {
  try {
    const account = req.body;
    const data = JSON.parse(await readFile(global.filename));
    const index = data.findIndex((accnt) => accnt.id === account.id);

    data.accounts[index] = account;

    await writeFile(global.filename, JSON.stringify(data));

    res.send(account);

    global.logger.info(`PUT /account - ${JSON.stringify(account)}`);
  } catch (err) {
    next(err);
  }
});

router.patch('/updateBalance', async (req, res, next) => {
  try {
    const account = req.body;
    const data = JSON.parse(await readFile(global.filename));
    const index = data.findIndex((accnt) => accnt.id === account.id);

    data.accounts[index].balance = account.balance;

    await writeFile(global.filename, JSON.stringify(data));

    res.send(data.accounts[index]);

    global.logger.info(`PATCH /account/updateBalance - ${JSON.stringify(account)}`);
  } catch (err) {
    next(err);
  }
});

router.use((err, req, res, next) => {
  global.logger.error(`${req.method} ${req.baseUrl} - ${err.message}`);
  res.status(400).send({ error: err.message });
});

export default router;
