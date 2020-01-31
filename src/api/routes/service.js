import { Router } from 'express';
import level from './level';
import ServiceManager from '../../services/serviceManager';
import logger from '../../loaders/logger';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const serviceList = await req.context.models.Service.findAll();
    return res.send(serviceList);
  } catch (e) {
    return next(e);
  }
});

router.post('/new', async (req, res, next) => {
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

router.use('/:serviceId', (req, res, next) => {
  // check if id exists in db
  req.context.serviceId = req.params.serviceId;
  return next();
});

router.delete('/:serviceId',
  async (req, res, next) => {
    const user = req.context.me;
    if (!user) return res.status(401).send('Not logged in');
    try {
      const output =
        await ServiceManager.RemoveService(req.context.serviceId);
      logger.debug(output); // 1-deleted
      return res.send(`Service id:${req.params.serviceId} deleted`);
    } catch (e) {
      return next(e);
    }
  }
);

router.use('/:serviceId/levels', level);

export default router;
