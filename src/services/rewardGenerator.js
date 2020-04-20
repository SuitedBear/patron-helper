import Sequelize from 'sequelize';

import models from '../models';
import logger from '../loaders/logger';
import RewardFactory from './rewardFactory';

const getPastDate = (months) => {
  let date = new Date();
  if (months === 0) return date;
  const yearsPast = (Math.trunc(months / 12));
  const monthsPast = months % 12;
  logger.debug(monthsPast, yearsPast);
  date = new Date((date.getFullYear() - yearsPast),
    (date.getMonth() - monthsPast + 1));
  // date.setFullYear(date.getFullYear() - yearsPast);
  // date.setMonth(date.getMonth() - monthsPast + 1);
  // date.setDate(1);
  // date.setHours(0, 0, 0);
  logger.debug(`${months} months from today: ${date}`);
  return date;
};

const onceForEach = async (lvl) => {
  logger.debug('onceForEach');
  const qualifiedPatrons = await models.PatronInService.findAll({
    where: {
      supportAmount: {
        [Sequelize.Op.gte]: lvl.value
      },
      updatedAt: {
        [Sequelize.Op.lte]: getPastDate(lvl.cyclic)
      }
    }
  });
  const rewardList = [];
  for (const patron of qualifiedPatrons) {
    try {
      const patronData = await models.Patron.findByPk(patron.patronId);
      const reward = await models.Reward.findOrCreate({
        where: {
          levelId: lvl.id,
          patronId: patron.id
        },
        defaults: {
          name: `${lvl.name} for ${patronData.name}`
        }
      });
      logger.debug(reward);
      if (reward[1] === true) {
        logger.debug(`adding ${reward[0]} to list`);
        rewardList.push(reward);
      } else {
        logger.debug(`${reward[0]} exists`);
      }
    } catch (e) {
      logger.error(`error creating reward for level:${lvl.name}`);
      logger.error(e);
    }
  }
  return rewardList;
};

const filterUnusedLevels = async (levels) => {
  const isActive = async (lvl) => {
    const activePatron = await models.PatronInService.findOne({
      where: {
        supportAmount: {
          [Sequelize.Op.gte]: lvl.value
        }
      }
    });
    return (activePatron !== null);
  };
  const tempLevels = await Promise.all(levels.map(isActive));
  const filteredLevels = levels.filter((_lvl, i) => tempLevels[i]);
  logger.debug(filteredLevels);
  return filteredLevels;
};

const RewardGenerator = {
  GenerateRewards: async () => {
    // find way to filter this differently
    const levels = await filterUnusedLevels(await models.Level.findAll());
    for (const lvl of levels) {
      await RewardFactory(lvl);
    }
    return levels;
  }
};

export default RewardGenerator;
