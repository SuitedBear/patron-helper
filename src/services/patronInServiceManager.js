import models, { sequelize } from '../models';
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

  PatronQueryArray: (patronInServiceList, t) => {
    const patronList = patronInServiceList.map(obj => obj.patron);
    const newQueryArray = [];
    for (const pos of patronInServiceList) {
      newQueryArray.push(
        models.PatronInService.findByPk(pos.id, { transaction: t })
          .then(record => record.update({
            notes: pos.notes
          }, { transaction: t }))
      );
    }
    for (const pos of patronList) {
      newQueryArray.push(
        models.Patron.findByPk(pos.id, { transaction: t })
          .then(record => record.update({
            name: pos.name
          }, { transaction: t }))
      );
    }
    return newQueryArray;
  },

  BulkEdit: async (patronInServiceList) => {
    const result = await sequelize.transaction(t => {
      const queryTable =
        PatronInServiceManager.PatronQueryArray(patronInServiceList, t);
      return Promise.all(queryTable);
    })
      .catch(e => {
        logger.error(e);
        throw new Error(e);
      });
    return result;
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
          attributes: ['id', 'name', 'email']
        }
      ],
      raw: false
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
        lastPayment: data.lastPayment,
        surcharge: data.surcharge,
        totalMonths: data.totalMonths,
        totalAmount: data.totalAmount,
        endDate: data.endDate,
        serviceId
      }
    });
    if (!newPatronInService[1]) {
      if (newPatronInService[0].supportAmount !== data.supportAmount ||
        newPatronInService[0].active !== data.active) {
        const updatedPatron = newPatronInService[0].update({
          supportAmount: data.supportAmount,
          active: data.active,
          lastPayment: data.lastPayment,
          surcharge: data.surcharge,
          totalMonths: data.totalMonths,
          totalAmount: data.totalAmount,
          endDate: data.endDate
        });
        return updatedPatron;
      }
    }
    return newPatronInService[0];
  }
};

export default PatronInServiceManager;
