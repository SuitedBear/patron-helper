const patron = (sequelize, DataTypes) => {
  const Patron = sequelize.define('patron', {
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true
    }
  });

  // Patron.associate = models => {
  //   Patron.hasMany(models.PatronInService, { onDelete: 'CASCADE' });
  // };

  return Patron;
};

export default patron;
