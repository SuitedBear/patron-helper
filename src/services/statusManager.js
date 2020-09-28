import models from '../models';
import logger from '../loaders/logger';

const StatusManager = {
  // could use filtering by service
  GetAllStatuses: async () => {
    const statusList = await models.Status.findAll();
    return statusList;
  },

  // status methods for level
  GetLevelStatuses: async (levelId) => {
    const statusList = await models.Status.findAll({
      include: {
        model: models.LevelStatus,
        where: {
          levelId
        },
        attributes: ['id', 'name'],
        raw: false
      }
    });
    return statusList;
  },

  CreateStatus: async (name) => {
    const newStatus = await models.Status.findOrCreate({
      where: {
        name
      }
    });
    return newStatus;
  },

  AssignStatusToLevel: async (levelId, statusId) => {
    logger.info(`assigning status ${statusId} to level ${levelId}`);
    await models.LevelStatus.create({
      levelId,
      statusId
    });
  }
};

export default StatusManager;
