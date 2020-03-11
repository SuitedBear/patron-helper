import models from '../models';
import logger from '../loaders/logger';

const Todo = {
  ListTodos: async () => {
    logger.info('Todo List');
    const todoList = await models.Todo.findAll();
    return todoList;
  }

  // autogeneration of todo list
};

export default Todo;
