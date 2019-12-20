const patron = (sequelize, DataTypes) => {
  const Patron = sequelize.define('patron', {
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    data: DataTypes.BLOB
  });

  Patron.associate = models => {
    Patron.hasMany(models.PatronInService, { onDelete: 'CASCADE' });
  };

  return Patron;
};

export default patron;
