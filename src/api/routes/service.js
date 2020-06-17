import { Router } from 'express';
import level from './level';
import patron from './patronInService';
import ServiceManager from '../../services/serviceManager';
import Todo from '../../services/todo';
import RewardGenerator from '../../services/rewardGenerator';
import logger from '../../loaders/logger';

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
    const { name, link } = req.body;
    const newService =
      await ServiceManager.AddService(name, link, user.id);
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

router.use('/:serviceId', (req, _res, next) => {
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

router.get('/:serviceId/complex', async (req, res, next) => {
  try {
    logger.debug(`get complex todo list for service: ${req.context.serviceId}`);
    const todoList =
      await Todo.ComplexListTodos(req.context.serviceId);
    return res.send(todoList);
  } catch (e) {
    return next(e);
  }
});

router.post('/:serviceId/bulkedittodo', async (req, res, next) => {
  try {
    const { data, fields } = req.body;
    const result = await Todo.BulkEdit(
      data,
      fields
    );
    logger.debug(result);
    const todoComplexList = await Todo.ComplexListTodos(
      Number.parseInt(req.context.serviceId)
    );
    return res.send(todoComplexList);
  } catch (e) {
    return next(e);
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

router.use('/:serviceId/levels', level);
router.use('/:serviceId/patrons', patron);

export default router;
