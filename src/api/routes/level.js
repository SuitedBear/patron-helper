import { Router } from 'express';
import ServiceManager from '../../services/serviceManager';
import logger from '../../loaders/logger';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const subLevelsList =
      await ServiceManager.ListSubLevels(Number.parseInt(req.context.serviceId, 10));
    return res.send(subLevelsList);
  } catch (e) {
    return next(e);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, value, limit } = req.body;
    logger.info(`creating sub level ${name} in service ${req.context.serviceId}`);
    const newLevel =
      await ServiceManager.AddSubLevel(
        name, value, req.context.serviceId, limit
      );
    return res.send(newLevel);
  } catch (e) {
    return next(e);
  }
});

export default router;
