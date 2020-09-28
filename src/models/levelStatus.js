const levelStatus = (sequelize, DataTypes) => {
  const LevelStatus = sequelize.define('levelStatus', {
    levelId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    statusId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  LevelStatus.associate = models => {
    LevelStatus.belongsTo(models.Level, { foreignKey: 'levelId' });
    LevelStatus.belongsTo(models.Status, { foreignKey: 'statusId' });
  };

  return LevelStatus;
};

export default levelStatus;
