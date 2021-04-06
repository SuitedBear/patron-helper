import models, { sequelize } from '../models';
import logger from '../loaders/logger';

const Reward = {
  ListRewards: async (serviceId) => {
    const rewardList = await models.Reward.findAll({
      where: {
        '$level.serviceId$': serviceId
      },
      include: {
        model: models.Level,
        as: 'level',
        attributes: ['id', 'name', 'serviceId']
      },
      attributes: ['id', 'name', 'levelId', 'dateFor']      
    });
    return rewardList;
  },

  AddReward: async (params) => {
    const queryParams = {
      name: params.name,
      levelId: params.levelId,
      dateFor: params.dateFor
    }
    const reward = await models.Reward.create(queryParams);
    return reward;
  },

  EditReward: async (id, name) => {
    const reward = await models.Reward.findByPk(id);
    if (reward) {
      const editedReward = await reward.update({
        name: name
      });
      // will fail if edit fails!
      return editedReward;
    }
    return null;
  },

  BulkEdit: async (data) => {
    const result = await sequelize.transaction(t => {
      const queryTable = [];
      for (const pos of data) {
        queryTable.push(
          models.Reward.findByPk(pos.id, { transaction: t })
            .then(record => record.update({
              name: pos.name
            }, { transaction: t }))
        );
      }
      return Promise.all(queryTable);
    })
      .catch(e => {
        logger.error(e);
        throw new Error(e);
      })
    return result;
  }
}

export default Reward
