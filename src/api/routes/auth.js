import { Router } from 'express';
import AuthService, { ValidationError } from '../../services/auth';
import logger from '../../loaders/logger';

const router = Router();

router.post('/signup', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    logger.debug('trying to sign up with data:');
    logger.debug(`${name}, ${email}, pass ${(password) ? 'present' : 'absent'}`);
    const user = await AuthService.SignUp(name, email, password);
    logger.info(`Signing up successful: ${user.user.name}`);
    return res.send(user);
  } catch (e) {
    logger.error('Sign up failed: ', e);
    return next(e);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await AuthService.Login(email, password);
    logger.info(`User ${user.user.name} logged in`);
    return res.send(user);
  } catch (e) {
    if (e instanceof ValidationError) {
      return res.status(401).send('Incorrect credentials!');
    }
    logger.error('Logging in failed: ', e);
    return next(e);
  }
});

export default router;
