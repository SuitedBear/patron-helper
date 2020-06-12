import models from '../models';
import logger from '../loaders/logger';

const PatronInServiceManager = {
  AddExistingPatron: async (
    serviceId, patronId, supportAmount, active = true
  ) => {
    // doublechceck id's
    logger.info(`adding patron:${patronId} to service:${serviceId}`);
    const addedPatron = await models.PatronInService.create({
      active,
      serviceId,
      patronId,
      supportAmount
    });
    return { addedPatron };
  },

  EditPatronInService: async (
    id, serviceId, supportAmount, active
  ) => {
    // check levelId in levels
    logger.info(`Modifying patron:${id}`);
    const record = await models.PatronInService.findOne({
      where: {
        id,
        serviceId
      }
    });
    if (record) {
      logger.info('Updating...');
      const output = await record.update({
        supportAmount,
        active
      });
      return output;
    }
    return `Patron ${id} not found`;
  },

  // apparently doesn't affect updatedAt
  BulkEdit: async (objList, fieldList) => {
    const result = await models.PatronInService
      .bulkCreate(
        objList,
        {
          updateOnDuplicate: fieldList
        }
      );
    logger.debug(result);
    return 'bulkedit';
  },

  RemovePatronInService: async (id, serviceId) => {
    logger.info(`removing patron id:${id} from service`);
    const output = await models.PatronInService.destroy({
      where: {
        id,
        serviceId
      }
    });
    logger.debug(`remove result: ${output}`);
    return output;
  },

  ListPatronsInService: async (serviceId) => {
    const output = await models.PatronInService.findAll({
      where: {
        serviceId: serviceId
      }
    });
    return output;
  },

  ComplexListPatrons: async (serviceId) => {
    const patronList = models.PatronInService.findAll({
      where: {
        serviceId
      },
      include: [
        {
          model: models.Patron,
          attributes: ['name', 'email']
        }
      ],
      raw: true
    });
    return patronList;
  },

  GetPatronsInService: async (id, serviceId) => {
    const output = await models.PatronInService.findOne({
      where: {
        id,
        serviceId
      }
    });
    return output;
  },

  AddNewPatron: async (serviceId, data) => {
    const patron = await models.Patron.findOrCreate({
      where: {
        email: data.email,
        name: data.name
      }
    });
    const newPatronInService = await models.PatronInService.findOrCreate({
      where: {
        patronId: patron[0].id
      },
      defaults: {
        active: data.active,
        supportAmount: data.supportAmount,
        serviceId
      }
    });
    if (!newPatronInService[1]) {
      if (newPatronInService[0].supportAmount !== data.supportAmount ||
        newPatronInService[0].active !== data.active) {
        const updatedPatron = newPatronInService[0].update({
          supportAmount: data.supportAmount,
          active: data.active
        });
        return updatedPatron;
      }
    }
    return newPatronInService[0];
  }
};

export default PatronInServiceManager;
