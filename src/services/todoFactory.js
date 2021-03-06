import Sequelize from 'sequelize';

import logger from '../loaders/logger';
import { getPastDate } from './utils';
import models from '../models';

// lvl.multi: cyclic -> get reward in cyclic
// lvl.once: get reward -> per user -> cyclic
// individual: per user -> cyclic+once -> get reward in cyclic+once
// no indi no once: get reward in cyclic -> per user -> cyclic

const generateMulti = async (lvl) => {
  const reward = await models.Reward.findOne({
    where: {
      levelId: lvl.id,
      createdAt: {
        [Sequelize.Op.gte]: getPastDate(lvl.cyclic)
      }
    }
  });
  const multipatron = await models.Patron.findOne({
    where: {
      name: 'multiuser'
    }
  });
  if (reward && multipatron) {
    const todo = await models.Todo.findOrCreate({
      where: {
        rewardId: reward.id
      },
      defaults: {
        name: `${reward.name}`,
        // multi patron template
        patronId: multipatron.id,
        statusId: 1
      }
    });
    if (todo[1]) return todo[0];
  }
  return null;
};

const generateOnce = async (lvl) => {
  const todoList = [];
  const reward = await models.Reward.findOne({
    where: {
      levelId: lvl.id
    }
  });
  if (reward) {
    const eligiblePatrons = await models.PatronInService.findAll({
      where: {
        id: {
          [Sequelize.Op.ne]: 1
        },
        supportAmount: {
          [Sequelize.Op.gte]: lvl.value
        },
        // check, seems fishy
        updatedAt: getPastDate(lvl.cyclic)
      }
    });
    for (const patron of eligiblePatrons) {
      const todo = await models.Todo.findOrCreate({
        where: {
          rewardId: reward.id,
          patronId: patron.id
        },
        defaults: {
          name: `${reward.name} for ${patron.patronId}`,
          statusId: 1
        }
      });
      if (todo[1]) todoList.push(todo[0]);
    }
  }
  return todoList;
};

const generateGeneric = async (lvl) => {
  const todoList = [];
  const rewardList = await models.Reward.findAll({
    where: {
      levelId: lvl.id
    },
    order: [['updatedAt', 'DESC']]
  });
  logger.debug('should have reward list for todo generation');
  if (rewardList.length > 0) {
    const eligiblePatrons = await models.PatronInService.findAll({
      where: {
        id: {
          [Sequelize.Op.ne]: 1
        },
        supportAmount: {
          [Sequelize.Op.gte]: lvl.value
        }
      }
    });
    for (const patron of eligiblePatrons) {
      const todo = await models.Todo.findOrCreate({
        where: {
          '$reward.levelId$': lvl.id,
          patronId: patron.id,
          createdAt: {
            [Sequelize.Op.gte]: getPastDate(lvl.cyclic)
          }
        },
        include: {
          model: models.Reward,
          as: 'reward',
          attributes: ['levelId']
        },
        defaults: {
          name: `${rewardList[0].name} for ${patron.patronId}`,
          createdAt: new Date(),
          rewardId: rewardList[0].id,
          statusId: 1
        }
      });
      if (todo[1]) todoList.push(todo[0]);
    }
  }
  return todoList;
};

// applicable for cyclic and once, generated once for each reward
// reward generation handles condition chcecks
// const generateIndividual = async (lvl) => {
//   const todoList = [];
//   const rewardList = await models.Reward.findAll({
//     where: {
//       levelId: lvl.id
//     }
//   });
//   for (const reward of rewardList) {
//     // check if patron still active
//     const todo = await models.Todo.findOrCreate({
//       where: {
//         levelId: lvl.id,
//         rewardId: reward.id,
//         patronId: reward.patronId
//       }
//     });
//     if (todo[1]) todoList.push(todo[0]);
//   }
//   return todoList;
// };

const TodoFactory = async (lvl) => {
  const todoList = [];
  try {
    if (lvl.multi) { // ok
      const todo = await generateMulti(lvl);
      if (todo) todoList.push(todo);
    } else if (lvl.once) {
      const todos = await generateOnce(lvl);
      todoList.push(...todos);
    // not significant
    // } else if (lvl.individual) {
    //   const todos = await generateIndividual(lvl);
    //   todoList.push(...todos);
    } else {
      const todos = await generateGeneric(lvl);
      todoList.push(...todos);
    }
  } catch (e) {
    logger.error(`error creating todos for level:${lvl.name}`);
    logger.error(e);
  }
  logger.debug('should have todo list generated');
  return todoList;
};

export default TodoFactory;
