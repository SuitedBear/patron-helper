import { Router } from 'express';
import StatusManager from '../../services/statusManager';
import logger from '../../loaders/logger';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const statusList = await StatusManager.GetAllStatuses();
    return res.send(statusList);
  } catch (e) {
    next(e);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const newStatus = await StatusManager.CreateStatus(req.params.name);
    return newStatus;
  } catch (e) {
    next(e);
  }
});

router.post('/assign', async (req, res, next) => {
  try {
    const { statusId, levelId } = req.params;
    const assignment = await StatusManager.AssignStatusToLevel(
      statusId, levelId
    );
    return assignment;
  } catch (e) {
    next(e);
  }
});

router.get('/:levelId', async (req, res, next) => {
  try {
    const levelId = Number.parseInt(req.params.levelId);
    logger.info(`getting status list for level ${levelId}`);
    const statusList =
      await StatusManager.GetLevelStatuses(levelId);
    return res.send(statusList);
  } catch (e) {
    next(e);
  }
});

export default router;
