import Sequelize from 'sequelize';

import models from '../models';
import logger from '../loaders/logger';
import RewardFactory from './rewardFactory';

// replace with a db function
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
  logger.debug('levels promise mapping');
  const tempLevels = await Promise.all(levels.map(isActive));
  logger.debug('level filtering');
  const filteredLevels = levels.filter((_lvl, i) => tempLevels[i]);
  logger.debug('should have filtered levels');
  return filteredLevels;
};

const RewardGenerator = {
  GenerateRewards: async (serviceId) => {
    // find way to filter this differently
    const levels = await filterUnusedLevels(await models.Level.findAll({
      where: {
        serviceId
      }
    }));
    const rewards = [];
    for (const lvl of levels) {
      const reward = await RewardFactory(lvl);
      if (reward) rewards.push(...reward);
    }
    return rewards;
  }
};

export default RewardGenerator;
