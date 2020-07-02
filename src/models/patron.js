const patron = (sequelize, DataTypes) => {
  const Patron = sequelize.define('patron', {
    name: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    }
  });

  Patron.associate = models => {
    Patron.hasMany(models.PatronInService, { onDelete: 'CASCADE' });
  };

  return Patron;
};

export default patron;
