import Sequelize from 'sequelize';

import models from '../models';
import logger from '../loaders/logger';

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

  // autogeneration methods
  GenerateRewards: async () => {
    const date = new Date();
    // JS returns month nr in 0-11 range
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0);
    logger.debug(`currentMonth: ${currentMonth}`);
    const rewardNameTemplate = ` ${date.getMonth() - 1}-${date.getFullYear()}`;
    const levels = await models.Level.findAll({
      include: [{
        model: models.PatronInService,
        where: {
          active: true
        }
      }]
    });
    await levels.forEach(async lvl => {
      logger.debug(`id:${lvl.id}, ${lvl.name} val:${lvl.value} type:${typeof lvl.value}`);
      try {
        const reward = await models.Reward.findOrCreate({
          where: {
            levelId: lvl.id,
            createdAt: {
              [Sequelize.Op.gt]: currentMonth
            }
          },
          defaults: {
            name: `${lvl.name} ${rewardNameTemplate}`,
            createdAt: new Date()
          }
        });
        logger.debug(reward);
      } catch (e) {
        logger.error(`error creating reward for level:${lvl.name}`);
        logger.error(e);
      }
    });
    return levels;
  },

  GenerateTodos: async () => {

  }
};

export default Todo;
