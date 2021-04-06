import Sequelize from 'sequelize';
import config from '../config';
import logger from '../loaders/logger';
import user from '../models/user';
import service from '../models/service';
import status from '../models/status';
import level from '../models/level';
import patron from '../models/patron';
import patronInService from '../models/patronInService';
import reward from '../models/reward';
import todo from '../models/todo';
import levelStatus from '../models/levelStatus';

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
  User: user(sequelize, Sequelize.DataTypes),
  Service: service(sequelize, Sequelize.DataTypes),
  Status: status(sequelize, Sequelize.DataTypes),
  Level: level(sequelize, Sequelize.DataTypes),
  Patron: patron(sequelize, Sequelize.DataTypes),
  PatronInService: patronInService(sequelize, Sequelize.DataTypes),
  Reward: reward(sequelize, Sequelize.DataTypes),
  Todo: todo(sequelize, Sequelize.DataTypes),
  LevelStatus: levelStatus(sequelize, Sequelize.DataTypes)
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
    // id: 1,
    name: 'multiuser',
    email: 'multi@user'
  });
  logger.info('Database populated');
};

export { sequelize, populateDatabase };
export default models;
