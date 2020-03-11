const reward = (sequelize, DataTypes) => {
  const Reward = sequelize.define('reward', {
    name: {
      type: DataTypes.STRING
    },
    // could use createdAt to indentify uniqueness
    // month: {
    //   // need to find correct date format
    //   type: DataTypes.INTEGER
    // },
    levelId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Reward.associate = models => {
    Reward.belongsTo(models.Level, { foreignKey: 'levelId' });
  };

  return Reward;
};

export default reward;
