import { sequelize, populateDatabase } from '../models';
import config from '../config';

export default async () => {
  await sequelize.sync({ force: config.dbEraseOnSync });
  if (config.dbEraseOnSync) await populateDatabase();
};
