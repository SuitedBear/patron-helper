const reward = (sequelize, DataTypes) => {
  const Reward = sequelize.define('reward', {

  });

  Reward.associate = models => {

  };

  return Reward;
};

export default reward;
