import models from '../models';
import logger from '../loaders/logger';

const ServiceManager = {
  // services management
  AddService: async (name, link, ownerId) => {
    logger.info(`creating new service: ${name} for ${ownerId}`);
    try {
      const newService = await models.Service.create({
        name,
        link,
        userId: ownerId
      });
      // logger.info('created new service', newService);
      return { newService };
    } catch (e) {
      logger.error(e);
    }
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
  }
};

export default ServiceManager;
