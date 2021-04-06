import { Router } from 'express';
import levelRoute from './level';
import patronRoute from './patronInService';
import todoRoute from './todo'
import rewardRoute from './reward'
import ServiceManager from '../../services/serviceManager';
import Todo from '../../services/todo';
import RewardGenerator from '../../services/rewardGenerator';
import logger from '../../loaders/logger';
// import models from '../../models';
import { ApiHandler } from '../../services/apiHandler';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const serviceList = await req.context.models.Service.findAll({
      where: {
        userId: req.context.me.id
      }
    });
    return res.send(serviceList);
  } catch (e) {
    return next(e);
  }
});

router.post('/new', async (req, res, next) => {
  const user = req.context.me;
  if (!user) return res.status(401).send('Not logged in');
  try {
    const { name, apiLink, apiKey } = req.body;
    const newService =
      await ServiceManager.AddService(
        name, apiLink, apiKey, user.id
      );
    return res.send(newService);
  } catch (e) {
    return next(e);
  }
});

router.get('/:serviceId', async (req, res, next) => {
  try {
    const service =
      await ServiceManager.FindServiceById(req.params.serviceId);
    if (!service) {
      return res.status(404).send(
        `Service id:${req.params.serviceId} not found.`
      );
    }
    return res.send(service);
  } catch (e) {
    next(e);
  }
});

// check
router.delete('/:serviceId',
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

router.use('/:serviceId', (req, _res, next) => {
  // check if id exists in db
  req.context.serviceId = req.params.serviceId;
  return next();
});

router.get('/:serviceId/api', async (req, res, next) => {
  try {
    const service =
      await ServiceManager.FindServiceById(req.context.serviceId);
    if (service) {
      logger.debug(`calling API ${service.apiLink}`);
      const apiInsert = await ApiHandler.GetPatronsFromApi(
        service.apiLink, service.apiKey, req.context.serviceId);
      logger.debug(apiInsert);
      return res.send(apiInsert);
    }
  } catch (e) {
    logger.error(`Error in API call:\n${e}`);
    next(e);
  }
});



router.get('/:serviceId/generate', async (req, res, next) => {
  try {
    logger.debug('generating rewards and todos');
    await RewardGenerator.GenerateRewards(req.context.serviceId);
    logger.debug('rewards generated');
    await Todo.GenerateTodos(req.context.serviceId);
    logger.info('rewards and todos generated');
    return res.send('rewards and todos generated');
  } catch (e) {
    return next(e);
  }
});

router.use('/:serviceId/levels', levelRoute);
router.use('/:serviceId/patrons', patronRoute);
router.use('/:serviceId/todo', todoRoute);
router.use('/:serviceId/rewards', rewardRoute);

export default router;
