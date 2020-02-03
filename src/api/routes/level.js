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

router.get('/:subLevelId', async (req, res, next) => {
  try {
    const result = await ServiceManager.GetSubLevel(req.params.subLevelId);
    if (!result) return res.status(404).send('Such sub level don\'t exist');
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

router.post('/:subLevelId', async (req, res, next) => {
  try {
    const { name, value, limit, cyclic, multi } = req.body;
    const result = await ServiceManager.EditSubLevel(
      Number.parseInt(req.params.subLevelId),
      name,
      value,
      limit,
      cyclic,
      multi
    );
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

router.delete('/:subLevelId', async (req, res, next) => {
  try {
    logger.info(`deleting sub level id:${req.params.subLevelId} in service ${req.context.serviceId}`);
    const result = await ServiceManager.RemoveSubLevel(Number.parseInt(req.params.subLevelId));
    logger.debug(result); // 1-deleted
    return res.send(`Sub level id:${req.params.subLevelId} deleted`);
  } catch (e) {
    return next(e);
  }
});

export default router;
