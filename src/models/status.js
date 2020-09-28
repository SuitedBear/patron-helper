const status = (sequelize, DataTypes) => {
  const Status = sequelize.define('status', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  Status.associate = models => {
    Status.hasMany(models.LevelStatus);
    Status.hasMany(models.Todo);
  };

  return Status;
};

export default status;
