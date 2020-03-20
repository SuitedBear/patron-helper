import models from '../models';
import logger from '../loaders/logger';

const PatronManager = {
  ListPatrons: async () => {
    const output = await models.Patron.findAll();
    return output;
  },

  FindPatron: async (name = null, email = null) => {
    // email has priority because it's unique in schema
    logger.info(
      `searching for patron by ${(email) ? 'email' : 'name'}: ${name || email}`
    );
    const params = (email) ? { email } : { name };
    const patron = await models.Patron.findAll({
      where: params
    });
    return patron;
  },

  FindPatronById: async (patronId) => {
    logger.info(`searching for patron id:${patronId}`);
    const patron = await models.Patron.findByPk(patronId);
    return patron;
  },

  AddPatron: async (name, email) => {
    logger.info(`Creating new patron: ${name}`);
    const newPatron = await models.Patron.create({
      name,
      email
    });
    logger.debug(newPatron);
    return { newPatron };
  },

  // kaskadowo patronów w serwisie
  RemovePatron: async (patronId) => {
    logger.info(`removing patron by id:${patronId}`);
    const output = await models.Patron.destroy({
      where: {
        id: patronId
      }
    });
    logger.debug(`remove result: ${output}`);
    return output;
  },

  EditPatron: async (patronId, name, email) => {
    const record = await models.Patron.findByPk(patronId);
    if (record) {
      logger.info('Updating...');
      const output = await record.update({
        name: name,
        email: email
      });
      return output;
    }
    return null;
  }
};

export default PatronManager;
