import { Router } from 'express';
import PatronManager from '../../services/patronManager';
import logger from '../../loaders/logger';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const patronList = await PatronManager.ListPatrons();
    return res.send(patronList);
  } catch (e) {
    return next(e);
  }
});

router.get('/:patronId', async (req, res, next) => {
  try {
    const patron = await PatronManager.FindPatronById(req.params.patronId);
    return res.send(patron);
  } catch (e) {
    return next(e);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, email } = req.body;
    if (name || email) {
      const patron = await PatronManager.FindPatron(name, email);
      return res.send(patron);
    } else {
      return res.status(401).send('Invalid search params.');
    }
  } catch (e) {
    return next(e);
  }
});

router.post('/new', async (req, res, next) => {
  try {
    const { name, email, data } = req.body;
    const newPatron =
      await PatronManager.AddPatron(name, email, data);
    return res.send(newPatron);
  } catch (e) {
    return next(e);
  }
});

router.delete('/:patronId', async (req, res, next) => {
  try {
    const output =
      await PatronManager.RemovePatron(req.params.patronId);
    logger.debug(output); // 1 - deleted
    return (output === 1)
      ? res.send(`Patron id:${req.params.patronId} removed`)
      : res.status(404).send('Patron not found.');
  } catch (e) {
    return next(e);
  }
});

export default router;
