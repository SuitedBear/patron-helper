import Sequelize from 'sequelize';
import config from '../config';
import logger from '../loaders/logger';

const sequelize = new Sequelize(
  config.dbName,
  config.dbUser,
  config.dbPassword,
  {
    port: config.dbPort,
    dialect: 'postgres'
  }
);

const models = {
  User: sequelize.import('./user'),
  Service: sequelize.import('./service'),
  Level: sequelize.import('./level'),
  Patron: sequelize.import('./patron'),
  PatronInService: sequelize.import('./patronInService')
};

Object.keys(models).forEach(model => {
  if ('associate' in models[model]) {
    models[model].associate(models);
  }
});

const populateDatabase = async () => {
  logger.info('Database populated');
};

export { sequelize, populateDatabase };
export default models;
