const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    pass: {
      type: DataTypes.STRING,
      allowNull: false
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
    // role: {
    //   type: DataTypes.STRING,
    //   validate: {
    //     isIn: [['admin', 'creator', 'helper']]
    //   }
    // }
  });

  User.associate = models => {
    User.hasMany(models.Service, { onDelete: 'CASCADE' });
  };

  return User;
};

export default user;
