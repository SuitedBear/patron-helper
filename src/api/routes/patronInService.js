import { Router } from 'express';
import ServiceManager from '../../services/serviceManager';
import logger from '../../loaders/logger';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const patronsInServiceList =
      await req.context.models.PatronInService.findAll();
    return res.send(patronsInServiceList);
  } catch (e) {
    return next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const result =
      await req.context.models.PatronInService.findByPk(req.params.id);
    if (!result) return res.status(404).send('PAtron not found in service.');
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

router.post('/add', async (req, res, next) => {
  try {
    const { patronId, levelId } = req.body;
    const active = (req.body.active === 'true');
    logger.info(`adding patron id:${patronId} to service`);
    const newPatronInService =
      await ServiceManager.AddExistingPatron(
        req.context.serviceId,
        Number.parseInt(patronId),
        Number.parseInt(levelId),
        active
      );
    return res.send(newPatronInService);
  } catch (e) {
    return next(e);
  }
});

router.post('/:patronInServiceId', async (req, res, next) => {
  try {
    const { levelId, active } = req.body;
    logger.info(`Editing patron id:${req.params.patronInServiceId} to service`);
    const result = await ServiceManager.EditPatronInService(
      req.params.patronInServiceId, levelId, active
    );
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    logger.info(`deleting patron id:${req.params.id} from service`);
    const result =
      await ServiceManager.RemovePatronInService(req.params.id);
    logger.debug(result);
    return res.send(`Patron id:${req.params.id} removed from service`);
  } catch (e) {
    return next(e);
  }
});

export default router;
