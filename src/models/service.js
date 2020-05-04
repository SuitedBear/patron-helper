const service = (sequelize, DataTypes) => {
  const Service = sequelize.define('service', {
    name: {
      type: DataTypes.STRING,
      unique: true
    },
    link: {
      type: DataTypes.TEXT
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Service.associate = models => {
    Service.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Service;
};

export default service;
