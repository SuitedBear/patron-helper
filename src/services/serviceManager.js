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
  },

  // subbed patrons
  AddExistingPatron: async (
    serviceId, patronId, levelId, active = true
  ) => {
    // doublechceck id's
    logger.info(`adding patron:${patronId} to service:${serviceId}`);
    const addedPatron = await models.PatronInService.create({
      active,
      serviceId,
      patronId,
      levelId
    });
    return { addedPatron };
  },

  RemovePatronInService: async (id) => {
    logger.info(`removing patron id:${id} from service`);
    const output = await models.PatronInService.destroy({
      where: {
        id
      }
    });
    logger.debug(`remove result: ${output}`);
    return output;
  },

  EditPatronInService: async (
    id, levelId, active
  ) => {
    // check levelId in levels
    logger.info(`Modifying patron:${id}`);
    const record = await models.PatronInService.findByPk(id);
    if (record) {
      logger.info('Updating...');
      const output = await record.update({
        levelId: levelId,
        active: active
      });
      return output;
    }
    return null;
  }
};

export default ServiceManager;
