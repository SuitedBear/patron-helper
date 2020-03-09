const patronInService = (sequelize, DataTypes) => {
  const PatronInService = sequelize.define('patronInService', {
    active: DataTypes.BOOLEAN,
    notes: DataTypes.TEXT,
    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    patronId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    levelId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  PatronInService.associate = models => {
    PatronInService.belongsTo(models.Service, { foreignKey: 'serviceId' });
    PatronInService.belongsTo(models.Patron, { foreignKey: 'patronId' });
    PatronInService.belongsTo(models.Level, { foreignKey: 'levelId' });
  };

  return PatronInService;
};

export default patronInService;
