import { Router } from 'express';
import { isAuth, attachCurrentUser } from '../middlewares';
import logger from '../../loaders/logger';

const router = Router();

// test endpoint - remove it
router.get('/list', async (req, res, next) => {
  const users = await req.context.models.User.findAll();
  return res.send(users);
});

router.get('/session', isAuth, attachCurrentUser, (req, res) => {
  const user = req.context.me;
  if (!user) return res.status(401).send('Session not found');
  logger.info(user.id);
  return res.send(`logged as ${user.name}`);
});

export default router;
