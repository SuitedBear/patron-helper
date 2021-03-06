import Sequelize from 'sequelize';

import logger from '../loaders/logger';
import { getDateString, getPastDateString } from './utils';
import models from '../models';

// multi:                 check cyclic,     single todo
// once:                  chceck if exists  todo check cyclic
// no individual no once: check cyclic,     todo for each patron
// individual: generate user list, check once, check cyclic

// const generateIndividualOnce = async (lvl, patron, patronData) => {
//   if (patron.updatedAt < getPastDate(lvl.cyclic)) {
//     const reward = await models.Reward.findOrCreate({
//       where: {
//         levelId: lvl.id,
//         // patronId: patron.id
//       },
//       defaults: {
//         name: `${lvl.name} for ${patronData.name}`
//       }
//     });
//     return (reward[1]) ? reward[0] : null;
//   }
//   return null;
// };

// const generateIndividualCyclic = async (lvl, patron, patronData) => {
//   const currentDate = new Date();
//   const dateString = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`;
//   const reward = await models.Reward.findOrCreate({
//     where: {
//       levelId: lvl.id,
//       patronId: patron.id,
//       createdAt: {
//         [Sequelize.Op.gte]: getPastDate(lvl.cyclic)
//       }
//     },
//     defaults: {
//       name: `${lvl.name} for ${patronData.name} from ${dateString}`,
//       createdAt: currentDate
//     }
//   });
//   return (reward[1]) ? reward[0] : null;
// };

// const generateIndividual = async (lvl) => {
//   const qualifiedPatrons = await models.PatronInService.findAll({
//     where: {
//       supportAmount: {
//         [Sequelize.Op.gte]: lvl.value
//       },
//       active: true
//     }
//   });
//   logger.debug('should have qualified patrons for generateIndividual');
//   const rewardList = [];
//   for (const patron of qualifiedPatrons) {
//     let reward = null;
//     const patronData = await models.Patron.findByPk(patron.patronId);
//     if (lvl.once) {
//       reward = await generateIndividualOnce(lvl, patron, patronData);
//     } else {
//       reward = await generateIndividualCyclic(lvl, patron, patronData);
//     }
//     if (reward) {
//       rewardList.push(reward);
//     }
//   }
//   logger.debug(`added ${rewardList.length} rewards`);
//   return rewardList;
// };

// returns date string in format YYYY-MM-DD

const generateOnce = async (lvl) => {
  const reward = await models.Reward.findOrCreate({
    where: {
      levelId: lvl.id
    },
    defaults: {
      name: `${lvl.name}`,
      dateFor: getDateString()
    }
  });
  return (reward[1]) ? [reward[0]] : null;
};

const generateGeneral = async (lvl) => {
  const date = new Date();
  const dateString = `${date.getFullYear()}-${date.getMonth() + 1}`;
  const reward = await models.Reward.findOrCreate({
    where: {
      levelId: lvl.id,
      dateFor: {
        [Sequelize.Op.gt]: getPastDateString(lvl.cyclic)
      }
    },
    defaults: {
      name: `${lvl.name} ${dateString}`,
      // createdAt: date,
      dateFor: getDateString()
    }
  });
  return (reward[1]) ? [reward[0]] : null;
};

const RewardFactory = async (lvl) => {
  let reward = null;
  try {
    if (lvl.once) {
      reward = generateOnce(lvl);
    } else {
      reward = generateGeneral(lvl);
    }
  } catch (e) {
    logger.error(`error creating reward for level:${lvl.name}`);
    logger.error(e);
  }
  logger.debug('RewardFactory should return reward');
  return reward;
};

export default RewardFactory;
