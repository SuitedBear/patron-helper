import { Router } from 'express';
import Todo from '../../services/todo';
import logger from '../../loaders/logger';

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

router.get('/reward-gen', async (req, res, next) => {
  try {
    logger.debug('generating rewards');
    const output = await Todo.GenerateRewards();
    return res.send(output);
  } catch (e) {
    return next(e);
  }
})

export default router;
