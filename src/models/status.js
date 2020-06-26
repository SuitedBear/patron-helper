const status = (sequelize, DataTypes) => {
  const Status = sequelize.define('status', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return Status;
};

export default status;
