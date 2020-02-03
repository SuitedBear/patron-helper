import models from '../models';
import logger from '../loaders/logger';

const ServiceManager = {
  // services management
  AddService: async (name, link, ownerId) => {
    logger.info(`creating new service: ${name} for ${ownerId}`);
    const newService = await models.Service.create({
      name,
      link,
      userId: ownerId
    });
    logger.info('created new service', newService);
    return { newService };
  },

  RemoveService: async (serviceId) => {
    logger.info(`deleting service id:${serviceId}`);
    const output = await models.Service.destroy({
      where: {
        id: serviceId
      }
    });
    return output;
  },

  // subscription levels
  AddSubLevel: async (
    name,
    value,
    serviceId,
    limit = 0,
    cyclic = 0,
    multi = false
  ) => {
    logger.info(`creating new level in service ${serviceId}: ${name}`);
    const newSubLevel = await models.Level.create({
      name,
      value,
      cyclic,
      multi,
      limit,
      serviceId
    });
    logger.info(`created new subscribtion level: ${name}`);
    return { newSubLevel };
  },

  RemoveSubLevel: async (subLevelId) => {
    logger.info(`removing subscription level: ${subLevelId}`);
    const output = await models.Level.destroy({
      where: {
        id: subLevelId
      }
    });
    return output;
  },

  ListSubLevels: async (serviceId) => {
    const output = await models.Level.findAll({
      where: {
        serviceId: serviceId
      }
    });
    return output;
  },

  GetSubLevel: async (subLevelId) => {
    const output = await models.Level.findByPk(subLevelId);
    return output;
  },

  EditSubLevel: async (
    subLevelId,
    name,
    value,
    limit,
    cyclic,
    multi
  ) => {
    const record = await models.Level.findByPk(subLevelId);
    if (record) {
      logger.info('updating...');
      const output = await record.update({
        name: name,
        value: value,
        limit: limit,
        cyclic: cyclic,
        multi: multi
      });
      return output;
    }
    return null;
  }
};

export default ServiceManager;
