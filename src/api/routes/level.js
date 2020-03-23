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

router.post('/new', async (req, res, next) => {
  try {
    logger.info(`creating sub level ${req.body.name} in service ${req.context.serviceId}`);
    const queryParams = { serviceId: req.context.serviceId, ...req.body };
    const newLevel = await ServiceManager.AddSubLevel(queryParams);
    return res.send(newLevel);
  } catch (e) {
    return next(e);
  }
});

router.get('/:subLevelId', async (req, res, next) => {
  try {
    const result = await ServiceManager.GetSubLevel(
      req.params.subLevelId,
      Number.parseInt(req.context.serviceId)
    );
    if (!result) return res.status(404).send('Such sub level don\'t exist');
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

router.post('/:subLevelId', async (req, res, next) => {
  try {
    logger.info(`editing sub level ${req.body.name} in service ${req.context.serviceId}`);
    const queryParams = {
      subLevelId: Number.parseInt(req.params.subLevelId),
      serviceId: req.context.serviceId,
      ...req.body
    };
    const result = await ServiceManager.EditSubLevel(queryParams);
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
