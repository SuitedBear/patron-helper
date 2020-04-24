const reward = (sequelize, DataTypes) => {
  const Reward = sequelize.define('reward', {
    name: {
      type: DataTypes.STRING
    },
    levelId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    // id from patronInService, not associated
    // 0 for multiuser reward
    // TODO: add default 0 value (needs base rebuild)
    patronId: {
      type: DataTypes.INTEGER
    }
  });

  Reward.associate = models => {
    Reward.belongsTo(models.Level, { foreignKey: 'levelId' });
  };

  return Reward;
};

export default reward;
