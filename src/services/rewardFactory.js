import Sequelize from 'sequelize';

import logger from '../loaders/logger';
import models from '../models';

// check year reverting for months > actual month
const getPastDate = (months) => {
  let date = new Date();
  if (months === 0) return date;
  const yearsPast = (Math.trunc(months / 12));
  const monthsPast = months % 12;
  logger.debug(monthsPast, yearsPast);
  date = new Date((date.getFullYear() - yearsPast),
    (date.getMonth() - monthsPast + 1));
  return date;
};

// multi:                 check cyclic,     single todo
// once:                  chceck if exists  todo check cyclic
// no individual no once: check cyclic,     todo for each patron
// individual: generate user list, check once, check cyclic

const generateIndividual = async (lvl) => {
  const qualifiedPatrons = await models.PatronInService.findAll({
    where: {
      supportAmount: {
        [Sequelize.Op.gte]: lvl.value
      }
    }
  });
  logger.debug(qualifiedPatrons);
};

const generateOnce = async (lvl) => {
  const reward = await models.Reward.findOrCreate({
    where: {
      levelId: lvl.id
    }
  });
  logger.debug(reward);
};

const generateGeneral = async (lvl) => {
  const date = new Date();
  const reward = await models.Reward.findOrCreate({
    where: {
      levelId: lvl.id,
      createdAt: {
        [Sequelize.Op.gt]: getPastDate(lvl.cyclic)
      }
    },
    defaults: {
      name: `${lvl.name} ${date.getFullYear()}-${date.getMonth() + 1}`,
      createdAt: date
    }
  });
  logger.debug(reward);
};

const RewardFactory = async (lvl) => {
  try {
    if (lvl.individual) {
      generateIndividual(lvl);
    } else if (lvl.once) {
      generateOnce(lvl);
    } else {
      generateGeneral(lvl);
    }
  } catch (e) {
    logger.error(`error creating reward for level:${lvl.name}`);
    logger.error(e);
  }
};

export default RewardFactory;
