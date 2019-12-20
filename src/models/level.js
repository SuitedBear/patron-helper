const level = (sequelize, DataTypes) => {
  const Level = sequelize.define('level', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
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
    Level.belongsTo(models.Service);
    Level.hasMany(models.PatronInService);
  };

  return Level;
};

export default level;
