import { Router } from 'express';
import Todo from '../../services/todo';
import RewardGenerator from '../../services/rewardGenerator';
import logger from '../../loaders/logger';
import models from '../../models';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    logger.info('getting todo list');
    const todoList = await Todo.ListTodos();
    return res.send(todoList);
  } catch (e) {
    return next(e);
  }
});

router.get('/rewards', async (req, res, next) => {
  try {
    logger.info('getting reward list');
    const rewardList = await models.Reward.findAll();
    return res.send(rewardList);
  } catch (e) {
    return next(e);
  }
});

router.get('/reward-gen', async (req, res, next) => {
  try {
    logger.debug('generating rewards');
    const output = await RewardGenerator.GenerateRewards();
    return res.send(output);
  } catch (e) {
    return next(e);
  }
});

router.get('/todo-gen', async (req, res, next) => {
  try {
    logger.debug('generating todos');
    const output = await Todo.GenerateTodos();
    return res.send(output);
  } catch (e) {
    return next(e);
  }
});

router.post('/:id', async (req, res, next) => {
  try {
    const { status, rewardId } = req.body;
    const rIdConverted =
      (rewardId) ? Number.parseInt(rewardId, 10) : null;
    const output =
      await models.Todo.setTodo(req.params.id, status, rIdConverted);
    return res.send(output);
  } catch (e) {
    return next(e);
  }
});

export default router;
