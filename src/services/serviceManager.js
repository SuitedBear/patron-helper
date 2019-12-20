import models from '../models';
import logger from '../loaders/logger';

const ServiceManager = {
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
  }
};

export default ServiceManager;
