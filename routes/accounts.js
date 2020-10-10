import express from 'express';
import { promises as fs, readFile, writeFile } from 'fs';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    let account = req.body;
    const data = JSON.parse(await readFile(global.filename));

    account = { id: data.nextId++, ...account };
    data.account.push(account);

    await writeFile(global.filename, JSON.stringify(data, null, 2));

    res.send(account);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const data = JSON.parse(await readFile(global.filename));

    res.send(data);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const data = JSON.parse(await readFile(global.filename));
    const account = data.accounts.find((account) => account.id === parseInt(req.params.id));

    res.send(account);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const data = JSON.parse(await readFile(global.filename));

    data.accounts = data.accounts.filter((account) => account.id !== parseInt(req.params.id));

    await writeFile(global.filename, JSON.stringify(data, null, 2));

    res.end();
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.put('/', async (req, res) => {
  try {
    const account = req.body;
    const data = JSON.parse(await readFile(global.filename));

    const index = data.findIndex((accnt) => accnt.id === account.id);

    data.accounts[index] = account;

    await writeFile(global.filename, JSON.stringify(data));

    res.send(account);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.patch('/updateBalance', async (req, res) => {
  try {
    const account = req.body;
    const data = JSON.parse(await readFile(global.filename));

    const index = data.findIndex((accnt) => accnt.id === account.id);

    data.accounts[index].balance = account.balance;

    await writeFile(global.filename, JSON.stringify(data));

    res.send(data.accounts[index]);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

export default router;
