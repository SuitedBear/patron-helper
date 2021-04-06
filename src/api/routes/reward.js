import { Router } from 'express';
import Reward from '../../services/rewardHandler';
import logger from '../../loaders/logger';

const router = Router();
router.get('/', async (req, res, next) => {
  try {
    logger.debug('get reward list for service');
    const rewardList = await Reward.ListRewards(
      req.context.serviceId
    );
    return res.send(rewardList);
  } catch (e) {
    return next(e);
  }
});

router.post('/add', async (req, res, next) => {
  try {
    logger.debug('add new reward');
    const newReward = await Reward.AddReward(
      req.body.data
    )
    if (newReward) {
      const newList = await Reward.ListRewards(
        req.context.serviceId
      );
      return res.send(newList);
    } else {
      throw new Error('error while creating a reward');
    }
  } catch (e) {
    return next(e);
  }
})

router.post('/edit', async (req, res, next) => {
  try {
    const { id, name } = req.body;
    logger.debug(`edit reward ${id}: ${name}`);
    const reward = await Reward.EditReward(id, name);
    if (reward) {
      return res.send(reward);      
    }
    return res.status(404).send('No such reward!');
  } catch (e) {
    return next(e);
  }
});

router.post('/bulkedit', async (req, res, next) => {
  try {
    const { data } = req.body;
    logger.debug(`save rewards: \n${data}`);
    const result = await Reward.BulkEdit(data);
    if (result) {
      const newList = await Reward.ListRewards(
        req.context.serviceId
      );
      return res.send(newList);
    } 
  } catch (e) {
    return next(e);
  }
});

export default router;
