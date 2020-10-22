import models from '../models';
import logger from '../loaders/logger';

const ServiceManager = {
  // services management
  AddService: async (name, apiLink, apiKey, ownerId) => {
    logger.info(`creating new service: ${name} for ${ownerId}`);
    try {
      const newService = await models.Service.create({
        name,
        apiLink,
        apiKey,
        userId: ownerId
      });
      await models.PatronInService.create({
        patronId: 1,
        serviceId: newService.id,
        supportAmount: 0
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
