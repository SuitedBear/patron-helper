import Sequelize from 'sequelize';

import logger from '../loaders/logger';
import models from '../models';

const getPastDate = (months) => {
  let date = new Date();
  // workaround for getting start of the given month
  date = new Date(date.getFullYear(),
    (date.getMonth() - months + 1));
  return date;
};

const generateSingle = async (reward) => {
  const todo = await models.Todo.findOrCreate({
    where: {
      rewardId: reward.id
    },
    defaults: {
      status: 'new',
      patronId: reward.patronId
    }
  });
  return (todo[1]) ? todo[0] : null;
};

const generateMultiple = async (reward, lvl) => {
  const todos = [];
  const updateTreshold = (lvl.once)
    ? getPastDate(lvl.cyclic)
    : reward.createdAt;
  const eligiblePatrons = await models.PatronInService.findAll({
    where: {
      active: true,
      supportAmount: {
        [Sequelize.Op.gte]: lvl.value
      },
      updatedAt: {
        [Sequelize.Op.lte]: updateTreshold
      }
    }
  });
  for (const patron of eligiblePatrons) {
    const todo = await models.Todo.findOrCreate({
      where: {
        rewardId: reward.id,
        patronId: patron.id
      },
      defaults: {
        status: 'new'
      }
    });
    if (todo[1]) todos.push(todo[0]);
  }
  return todos;
};

const TodoFactory = async (reward, lvl) => {
  const todoList = [];
  try {
    if (lvl.individual || lvl.multi) {
      const todo = await generateSingle(reward);
      if (todo) todoList.push(todo);
    } else {
      const todos = await generateMultiple(reward, lvl);
      if (todos.length > 0) todoList.push(...todos);
    }
  } catch (e) {
    logger.error(`error creating todos for reward:${reward.name}`);
    logger.error(e);
  }
  logger.debug(todoList);
  return todoList;
};

export default TodoFactory;
