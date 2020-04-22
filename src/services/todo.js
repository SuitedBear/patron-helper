import models from '../models';
import logger from '../loaders/logger';
import TodoFactory from './todoFactory';

const Todo = {
  ListTodos: async () => {
    logger.info('Todo List');
    const todoList = await models.Todo.findAll();
    return todoList;
  },

  EditTodo: async (todoId, statusNr = 0) => {
    const status = ['done', 'for shipment', 'in progress', 'new'];
    logger.info(`Changing todo #${todoId} status to ${status[statusNr]}`);
    const record = await models.Todo.findByPk(todoId);
    if (record) {
      logger.info('updating...');
      try {
        const output = await record.update({
          status: status[statusNr]
        });
        return output;
      } catch (e) {
        logger.debug(`error updating todo #${todoId} status: ${e}`);
        return null;
      }
    }
    return null;
  },

  // where to put this one?
  EditReward: async (rewardId, rewardName) => {
    const record = await models.Reward.findByPk(rewardId);
    if (record) {
      logger.info('updating...');
      const output = await record.update({
        name: rewardName
      });
      return output;
    }
    return null;
  },

  GenerateTodos: async () => {
    const levels = await models.Level.findAll();
    const todoList = [];
    for (const lvl of levels) {
      const rewards = await models.Reward.findAll({
        where: {
          levelId: lvl.id
        }
      });
      for (const reward of rewards) {
        const todos = await TodoFactory(reward, lvl);
        if (todos.length > 0) todoList.push(...todos);
      }
    }
    logger.debug(todoList);
    return todoList;
  }
};

export default Todo;
