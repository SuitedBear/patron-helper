import { Router } from 'express';
import user from './routes/user';
import auth from './routes/auth';
import patron from './routes/patron';
import service from './routes/service';
import todo from './routes/todo';
import { isAuth, attachCurrentUser } from './middlewares';

export default () => {
  const mainRouter = Router();

  // route handlers
  mainRouter.use('/', auth);
  // @TODO: should be restricted/removed
  // mainRouter.use('/users', user);
  mainRouter.use(isAuth, attachCurrentUser);
  // patrons endpoint propably isn't needed
  // patronsInService should provide patron data
  mainRouter.use('/patrons', patron);
  mainRouter.use('/services', service);

  return mainRouter;
};
