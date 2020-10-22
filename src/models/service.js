const service = (sequelize, DataTypes) => {
  const Service = sequelize.define('service', {
    name: {
      type: DataTypes.STRING,
      unique: true
    },
    apiLink: {
      type: DataTypes.TEXT
    },
    apiKey: {
      type: DataTypes.TEXT
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Service.associate = models => {
    Service.belongsTo(models.User, { foreignKey: 'userId' });
    Service.hasMany(models.Level, { onDelete: 'CASCADE' });
    Service.hasMany(models.PatronInService);
  };

  return Service;
};

export default service;
