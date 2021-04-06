import models, { sequelize } from '../models';
import logger from '../loaders/logger';
import TodoFactory from './todoFactory';
import PatronInServiceManager from './patronInServiceManager';

const Todo = {
  ListTodos: async () => {
    logger.info('Todo List');
    const todoList = await models.Todo.findAll();
    return todoList;
  },

  ComplexListTodos: async (serviceId) => {
    const todoList = models.Todo.findAll({
      where: {
        '$reward.level.serviceId$': serviceId
      },
      include: [
        {
          model: models.PatronInService,
          attributes: ['id', 'patronId', 'notes', 'active', 'supportAmount'],
          include: {
            model: models.Patron,
            attributes: ['id', 'name', 'firstName', 'lastName', 'email', 'address']
          }
        },
        {
          model: models.Reward,
          as: 'reward',
          attributes: ['id', 'name', 'levelId'],
          include: {
            model: models.Level,
            as: 'level',
            attributes: ['id', 'serviceId']
          }
        },
        {
          model: models.Status,
          as: 'status',
          attributes: ['id', 'name']
        }
      ],
      attributes: ['id', 'name', 'statusId', 'rewardId', 'updatedAt'],
      raw: false
    });
    return todoList;
  },

  CountableList: async (serviceId) => {
    const todoList = models.Todo.findAll({
      where: {
        '$reward.level.serviceId$': serviceId
      },
      include: {
        model: models.Reward,
        as: 'reward',
        include: {
          model: models.Level,
          as: 'level',
          attributes: ['id', 'serviceId']
        },
        attributes: ['id', 'levelId']
      },
      attributes: ['id', 'patronId', 'statusId']
    });
    return todoList;
  },

  // apparently doesn't affect updatedAt
  BulkEdit: async (objList, fieldList) => {
    const patronsInServiceList = objList.map(obj => obj.patronInService);
    const result = await sequelize.transaction(t => {
      const queryTable =
        PatronInServiceManager.PatronQueryArray(
          patronsInServiceList,
          t
        );
      for (const pos of objList) {
        queryTable.push(
          // review method and add status check
          models.Todo.findByPk(pos.id, { transaction: t })
            .then(record => record.update({
              name: pos.name,
              statusId: pos.statusId,
              rewardId: pos.rewardId
            }, { transaction: t }))
        );
      }
      return Promise.all(queryTable);
    })
      .catch(e => {
        logger.error(e);
        throw new Error(e);
      });
    return result;
  },

  // // TODO: rewrite
  // EditTodo: async (todoId, statusNr = 0) => {
  //   const status = ['done', 'for shipment', 'in progress', 'new'];
  //   logger.info(`Changing todo #${todoId} status to ${status[statusNr]}`);
  //   const record = await models.Todo.findByPk(todoId);
  //   if (record) {
  //     logger.info('updating...');
  //     try {
  //       const output = await record.update({
  //         status: status[statusNr]
  //       });
  //       return output;
  //     } catch (e) {
  //       logger.debug(`error updating todo #${todoId} status: ${e}`);
  //       return null;
  //     }
  //   }
  //   return null;
  // },

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

  GenerateTodos: async (serviceId) => {
    const levels = await models.Level.findAll({
      where: {
        serviceId
      }
    });
    const todoList = [];
    for (const lvl of levels) {
      const todos = await TodoFactory(lvl);
      if (todos.length > 0) todoList.push(...todos);
    }
    logger.debug('should have all todos generated');
    return todoList;
  }
};

export default Todo;
