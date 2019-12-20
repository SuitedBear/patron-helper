import models from '../../models';

const attachCurrentUser = async (req, res, next) => {
  const decodedTokenData = req.token.data;
  const userRecord = await models.User.findOne({
    where: {
      id: decodedTokenData._id
    }
  });

  req.context.me = userRecord;

  if (!userRecord) {
    return res.status(401).end('User not found');
  } else {
    return next();
  }
};

export default attachCurrentUser;
