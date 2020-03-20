const level = (sequelize, DataTypes) => {
  const Level = sequelize.define('level', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    value: {
      type: DataTypes.INTEGER
    },
    // length of generation interval in months
    // 0 - not applicable
    cyclic: {
      type: DataTypes.INTEGER
    },
    // one reward for multiple users/tasks
    multi: DataTypes.BOOLEAN,
    // individual task for each user
    individual: DataTypes.BOOLEAN,
    // applicable only once per user
    once: DataTypes.BOOLEAN,
    // how many patrons could qualify
    // 0 - no limit
    limit: DataTypes.INTEGER
  });

  Level.associate = models => {
    Level.belongsTo(models.Service, { foreignKey: 'serviceId' });
  };

  return Level;
};

export default level;
