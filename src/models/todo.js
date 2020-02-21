const todo = (sequelize, DataTypes) => {
  const Todo = sequelize.define('todo', {
    status: {
      type: DataTypes.INTEGER
    },
    // date - month maybe?
    reward: {
      type: DataTypes.INTEGER
    }
  });

  Todo.associate = models => {
    // nie kaskadować przy kasowaniu
    Todo.belongsTo(models.PatronInService);
    Todo.belongsTo(models.Level);
  };

  return Todo;
};

export default todo;
