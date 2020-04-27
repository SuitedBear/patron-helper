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

  FindServiceById: async (serviceId) => {
    const output = await models.Service.findByPk(serviceId);
    return output;
  },

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
    logger.info(`created new subscribtion level: ${params.name}`);
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

export default ServiceManager;
