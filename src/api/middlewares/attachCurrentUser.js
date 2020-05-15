import models from '../../models';

const attachCurrentUser = async (req, res, next) => {
  const decodedTokenData = req.token.data;
  const userRecord = await models.User.findByPk(
    decodedTokenData._id
  );

  if (!userRecord) {
    return res.status(401).end('User not found');
  } else {
    const { id, name, email } = userRecord.toJSON();
    req.context.me = { id, name, email };
    return next();
  }
};

export default attachCurrentUser;
