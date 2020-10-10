import express from 'express';
import { promises as fs, readFile, writeFile } from 'fs';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    let account = req.body;
    const data = JSON.parse(await readFile('account.json'));

    account = { id: data.nextId++, ...account };
    data.account.push(account);

    await writeFile('account.json', JSON.stringify(data, null, 2));

    res.send(account);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

export default router;
