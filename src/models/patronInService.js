const patronInService = (sequelize, DataTypes) => {
  const PatronInService = sequelize.define('patronInService', {
    active: DataTypes.BOOLEAN,
    notes: DataTypes.TEXT,
    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    // consider association table
    patronId: {
      type: DataTypes.INTEGER,
      allowNull: false
      // unique: true
    },
    supportAmount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    lastPayment: {
      type: DataTypes.DATE
    },
    surcharge: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    totalMonths: {
      type: DataTypes.INTEGER
    },
    totalAmount: {
      type: DataTypes.INTEGER
    },
    endDate: {
      type: DataTypes.DATEONLY
    }
  }, {
    tableName: 'patronsInService'
  });

  PatronInService.associate = models => {
    PatronInService.belongsTo(models.Service, { foreignKey: 'serviceId' });
    PatronInService.belongsTo(models.Patron, { foreignKey: 'patronId' });
    PatronInService.hasMany(models.Todo);
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
