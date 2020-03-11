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
    next(e);
  }
});

export default router;
