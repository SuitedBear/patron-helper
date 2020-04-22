const todo = (sequelize, DataTypes) => {
  const Todo = sequelize.define('todo', {
    status: {
      type: DataTypes.ENUM,
      values: ['done', 'for shipment', 'in progress', 'new']
    },
    rewardId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    patronId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Todo.associate = models => {
    // nie kaskadować przy kasowaniu
    Todo.belongsTo(models.PatronInService, { foreignKey: 'patronId' });
    Todo.belongsTo(models.Reward, { foreignKey: 'rewardId' });
  };

  Todo.createTodo = async (rewardId, patronId = 0) => {
    const newTodo = await Todo.create({
      status: 'new',
      rewardId,
      patronId
    });
    return newTodo;
  };

  Todo.setTodo = async (id, status, rewardId) => {
    const todo = await Todo.findByPk(id);
    return todo;
  };

  return Todo;
};

export default todo;
