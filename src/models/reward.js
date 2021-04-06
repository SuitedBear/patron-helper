const reward = (sequelize, DataTypes) => {
  const Reward = sequelize.define('reward', {
    name: {
      type: DataTypes.STRING
    },
    levelId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    dateFor: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW
    }
  });

  Reward.associate = models => {
    Reward.belongsTo(models.Level, { foreignKey: 'levelId' });
    Reward.hasMany(models.Todo);
  };

  return Reward;
};

export default reward;
