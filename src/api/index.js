import { Router } from 'express';
import user from './routes/user';
import auth from './routes/auth';
import service from './routes/service';
import { isAuth, attachCurrentUser } from './middlewares';

export default () => {
  const mainRouter = Router();

  // route handlers
  mainRouter.use('/', auth);
  mainRouter.use('/users', user);
  mainRouter.use(isAuth, attachCurrentUser);
  mainRouter.use('/services', service);

  return mainRouter;
};
