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
    cyclic: {
      type: DataTypes.INTEGER
    },
    multi: DataTypes.BOOLEAN,
    limit: DataTypes.INTEGER
  });

  Level.associate = models => {
    Level.belongsTo(models.Service, { foreignKey: 'serviceId' });
    Level.hasMany(models.PatronInService);
  };

  return Level;
};

export default level;
