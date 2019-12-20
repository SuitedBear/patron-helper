const service = (sequelize, DataTypes) => {
  const Service = sequelize.define('service', {
    name: {
      type: DataTypes.STRING
    },
    link: {
      type: DataTypes.STRING
    }
  });

  Service.associate = models => {
    Service.belongsTo(models.User);
    Service.hasMany(models.Level, { onDelete: 'CASCADE' });
    Service.hasMany(models.PatronInService, { onDelete: 'CASCADE' });
  };

  return Service;
};

export default service;
