import Sequelize from 'sequelize';

import models from '../models';
import logger from '../loaders/logger';

const getPastDate = (monthsPast) => {
  const date = new Date();
  date.setMonth(date.getMonth() - monthsPast + 1);
  date.setDate(1);
  date.setHours(0, 0, 0);
  logger.debug(`${monthsPast} months from today: ${date}`);
  return date;
};

// clause generators for level types
const twoMonthCyclic = async (lvl) => {
  const date = new Date();
  const rewardNameTemplate = ` ${date.getMonth() - 1}-${date.getFullYear()}`;
  try {
    const reward = await models.Reward.findOrCreate({
      where: {
        levelId: lvl.id,
        createdAt: {
          [Sequelize.Op.gt]: getPastDate(2)
        }
      },
      defaults: {
        name: `${lvl.name} ${rewardNameTemplate}`,
        createdAt: new Date()
      }
    });
    logger.debug(reward);
    return reward;
  } catch (e) {
    logger.error(`error creating reward for level:${lvl.name}`);
    logger.error(e);
  }
};

const onceForEach = (lvl) => {
  // const monthsToQualify = lvl.cyclic;
  const output = [];
  logger.debug('onceForEach placeholder');
  return output;
};

const RewardGenerator = {
  GenerateRewards: async () => {
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
      // should include different types (once, 2-month etc)
      if (lvl.multi) {
        if (lvl.cyclic === 2) twoMonthCyclic(lvl);
      } else {
        onceForEach(lvl);
      }
    });
    return levels;
  }
};

export default RewardGenerator;
