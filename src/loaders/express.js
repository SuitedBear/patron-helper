import express from 'express';
import cors from 'cors';

import models from '../models';
import routes from '../api';

export default ({ app }) => {
  // for Heroku etc to show real origin IP in logs
  app.enable('trust proxy');
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/', (req, res) => {
    res.status(200).send('It\'s Alive.');
  });

  // adding context to requests
  app.use(async (req, res, next) => {
    req.context = {
      models,
      me: null
    };
    next();
  });

  // routing imports
  app.use('/', routes());

  // error handlers
  app.use((err, req, res, next) => {
    // JWT authorisation error
    if (err.name === 'UnauthorizedError') {
      return res
        .status(err.status)
        .send({ message: err.message })
        .end();
    }
    return next(err);
  });
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message
      }
    });
  });
};
