import config from './config';
import express from 'express';
import logger from './loaders/logger';

const StartServer = async function () {
  const app = express();

  logger.info('getting loaders');

  await require('./loaders').default({ expressApp: app });

  logger.info('starting app');

  app.listen(config.port, (err) => {
    if (err) {
      logger.error(err);
      process.exit(1);
    }
    logger.info(`App is listening on port ${config.port}`);
  });
};

StartServer();
