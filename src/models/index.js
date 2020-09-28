import Sequelize from 'sequelize';
import config from '../config';
import logger from '../loaders/logger';

const sequelize = new Sequelize(
  config.dbName,
  config.dbUser,
  config.dbPassword,
  {
    host: (config.env === 'development')
      ? 'localhost'
      : config.dbHost,
    port: config.dbPort,
    dialect: 'postgres'
  }
);

const models = {
  User: sequelize.import('./user'),
  Service: sequelize.import('./service'),
  Status: sequelize.import('./status'),
  Level: sequelize.import('./level'),
  Patron: sequelize.import('./patron'),
  PatronInService: sequelize.import('./patronInService'),
  Reward: sequelize.import('./reward'),
  Todo: sequelize.import('./todo'),
  LevelStatus: sequelize.import('./levelStatus')
};

Object.keys(models).forEach(model => {
  if ('associate' in models[model]) {
    models[model].associate(models);
  }
});

const populateDatabase = async () => {
  await models.Status.create({ id: 1, name: 'new' });
  await models.Status.create({ id: 2, name: 'done' });
  await models.Patron.create({
    id: 1,
    name: 'multiuser',
    email: 'multi@user'
  });
  logger.info('Database populated');
};

export { sequelize, populateDatabase };
export default models;
