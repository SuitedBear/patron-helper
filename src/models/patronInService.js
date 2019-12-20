const patronInService = (sequelize, DataTypes) => {
  const PatronInService = sequelize.define('patronInService', {
    active: DataTypes.BOOLEAN
  });

  PatronInService.associate = models => {
    PatronInService.belongsTo(models.Service);
    PatronInService.belongsTo(models.Patron);
    PatronInService.belongsTo(models.Level);
  };

  return PatronInService;
};

export default patronInService;
