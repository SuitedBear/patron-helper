import { Router } from 'express';
import { isAuth, attachCurrentUser } from '../middlewares';
import ServiceManager from '../../services/serviceManager';
import logger from '../../loaders/logger';

const router = Router();

router.post('/new', isAuth, attachCurrentUser, async (req, res, next) => {
  const user = req.context.me;
  if (!user) return res.status(401).send('Not logged in');
  try {
    const { name, link } = req.body;
    const newService =
      await ServiceManager.AddService(name, link, user.id);
    return res.send(newService);
  } catch (e) {
    return next(e);
  }
});

router.delete('/:serviceId', isAuth, attachCurrentUser,
  async (req, res, next) => {
    const user = req.context.me;
    if (!user) return res.status(401).send('Not logged in');
    try {
      const output =
        await ServiceManager.RemoveService(req.params.serviceId);
      logger.debug(output); // 1-deleted
      return res.send(`Service id:${req.params.serviceId} deleted`);
    } catch (e) {
      return next(e);
    }
  }
);

export default router;
