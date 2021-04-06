import { Router } from 'express';
import Todo from '../../services/todo';
import logger from '../../loaders/logger';

const router = Router();

router.get('/complex', async (req, res, next) => {
  try {
    logger.debug(`get complex todo list for service: ${req.context.serviceId}`);
    const todoList =
      await Todo.ComplexListTodos(req.context.serviceId);
    return res.send(todoList);
  } catch (e) {
    return next(e);
  }
});

router.get('/countable', async (req, res, next) => {
  try {
    const countableTodos =
      await Todo.CountableList(req.context.serviceId);
    return res.send(countableTodos);
  } catch (e) {
    return next(e);
  }
});

router.post('/bulkedittodo', async (req, res, next) => {
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

export default router;
