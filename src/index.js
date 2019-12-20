import config from './config';
import express from 'express';
import logger from './loaders/logger';

const StartServer = async function () {
  const app = express();

  await require('./loaders').default({ expressApp: app });

  app.listen(config.port, (err) => {
    if (err) {
      process.exit(1);
    }
    logger.info(`App is listening on port ${config.port}`);
  });
};

StartServer();
