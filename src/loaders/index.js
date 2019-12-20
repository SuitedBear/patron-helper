import logger from './logger';
import databaseLoader from './database';
import expressLoader from './express';

export default async ({ expressApp }) => {
  await databaseLoader();
  logger.info('Database synchronized');

  await expressLoader({ app: expressApp });
  logger.info('Express routing loaded');
};
