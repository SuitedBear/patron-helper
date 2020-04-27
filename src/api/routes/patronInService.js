import { Router } from 'express';
import PatronInServiceManager from '../../services/patronInServiceManager';
import logger from '../../loaders/logger';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const patronsInServiceList =
      await PatronInServiceManager.ListPatronsInService(
        Number.parseInt(req.context.serviceId)
      );
    return res.send(patronsInServiceList);
  } catch (e) {
    return next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const result =
      await PatronInServiceManager.GetPatronsInService(
        req.params.id,
        Number.parseInt(req.context.serviceId)
      );
    if (!result) return res.status(404).send('Patron not found in service.');
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

router.post('/add', async (req, res, next) => {
  try {
    const { patronId, supportAmount } = req.body;
    const active = (req.body.active === 'true');
    logger.info(`adding patron id:${patronId} to service`);
    const newPatronInService =
      await PatronInServiceManager.AddExistingPatron(
        req.context.serviceId,
        Number.parseInt(patronId),
        Number.parseInt(supportAmount),
        active
      );
    return res.send(newPatronInService);
  } catch (e) {
    return next(e);
  }
});

router.post('/new', async (req, res, next) => {
  try {
    const data = {
      email: req.body.email,
      name: req.body.name,
      active: (req.body.active === 'true'),
      supportAmount: Number.parseInt(req.body.supportAmount, 10)
    };
    const newPatron = await PatronInServiceManager.AddNewPatron(
      req.context.serviceId,
      data
    );
    return res.send(newPatron);
  } catch (e) {
    return next(e);
  }
});

// add notes edition !
router.post('/:patronInServiceId', async (req, res, next) => {
  try {
    const { supportAmount, active } = req.body;
    logger.info(`Editing patron id:${req.params.patronInServiceId} to service`);
    const result = await PatronInServiceManager.EditPatronInService(
      req.params.patronInServiceId,
      Number.parseInt(req.context.serviceId),
      Number.parseInt(supportAmount),
      active
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
      await PatronInServiceManager.RemovePatronInService(
        req.params.id,
        Number.parseInt(req.context.serviceId)
      );
    logger.debug(result);
    return res.send(`Patron id:${req.params.id} removed from service`);
  } catch (e) {
    return next(e);
  }
});

export default router;
