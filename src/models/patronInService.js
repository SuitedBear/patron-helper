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
      allowNull: false,
      unique: true
    },
    supportAmount: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  PatronInService.associate = models => {
    PatronInService.belongsTo(models.Service, { foreignKey: 'serviceId' });
    PatronInService.belongsTo(models.Patron, { foreignKey: 'patronId' });
  };

  PatronInService.getActive = async () => {
    const activePatrons = await PatronInService.findAll({
      where: {
        active: true
      }
    });
    return activePatrons;
  };

  return PatronInService;
};

export default patronInService;
