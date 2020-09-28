import models, { sequelize } from '../models';
import logger from '../loaders/logger';

const LevelManager = {
  // should check service Id
  // level management
  AddSubLevel: async (params) => {
    const queryParams = {
      // name needs sanitization
      name: params.name,
      serviceId: Number.parseInt(params.serviceId),
      value: Number.parseInt(params.value),
      limit: (Number.parseInt(params.limit) || 0),
      cyclic: (Number.parseInt(params.cyclic) || 0),
      multi: (params.multi === 'true'),
      individual: (params.individual === 'true'),
      once: (params.once === 'true')
    };
    logger.info(`creating new level in service:${params.serviceId}`);
    const newSubLevel = await models.Level.create(queryParams);
    await models.LevelStatus.bulkCreate([
      {
        levelId: newSubLevel.id,
        statusId: 1
      },
      {
        levelId: newSubLevel.id,
        statusId: 2
      }
    ]);
    return { newSubLevel };
  },

  RemoveSubLevel: async (subLevelId) => {
    logger.info(`removing subscription level: ${subLevelId}`);
    const transactionOutput = await sequelize.transaction(t => {
      return models.LevelStatus.destroy({
        where: {
          levelId: subLevelId
        }
      }, { transaction: t }).then(() => {
        return models.Level.destroy({
          where: {
            id: subLevelId
          }
        }, { transaction: t });
      });
    }).catch(e => {
      logger.error(`Error while removing level ${subLevelId}:\n${e}`);
    });
    return transactionOutput;
  },

  ListSubLevels: async (serviceId) => {
    const output = await models.Level.findAll({
      where: {
        serviceId: serviceId
      }
    });
    return output;
  },

  GetSubLevel: async (subLevelId, serviceId) => {
    const output = await models.Level.findOne({
      where: {
        id: subLevelId,
        serviceId
      }
    });
    return output;
  },

  EditSubLevel: async (params) => {
    const record = await models.Level.findByPk(params.subLevelId);
    if (record) {
      logger.info('updating...');
      const queryParams = {
        // name needs sanitization
        name: (params.name || record.name),
        serviceId: Number.parseInt(params.serviceId),
        value: (Number.parseInt(params.value) || record.value),
        limit: (Number.parseInt(params.limit) || record.limit),
        cyclic: (Number.parseInt(params.cyclic) || record.cyclic),
        multi: (params.multi !== undefined) ? (params.multi === 'true') : record.multi,
        individual: (params.individual !== undefined) ? (params.individual === 'true') : record.multi,
        once: (params.once !== undefined) ? (params.once === 'true') : record.once
      };
      const output = await record.update(queryParams);
      return output;
    }
    return null;
  }
};

export default LevelManager;
