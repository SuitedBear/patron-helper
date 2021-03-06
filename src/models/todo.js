const todo = (sequelize, DataTypes) => {
  const Todo = sequelize.define('todo', {
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    statusId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    patronId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rewardId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Todo.associate = models => {
    // nie kaskadować przy kasowaniu
    Todo.belongsTo(models.PatronInService, { foreignKey: 'patronId' });
    Todo.belongsTo(models.Reward, { foreignKey: 'rewardId' });
    // find a way to make status pool level-dependant
    Todo.belongsTo(models.Status, { foreignKey: 'statusId' });
  };

  Todo.setTodo = async (id, status, rewardId) => {
    const todo = await Todo.findByPk(id);
    const newStatus = status || todo.status;
    const newRewardId = rewardId || todo.rewardId;
    const updatedTodo = await todo.update({
      status: newStatus,
      rewardId: newRewardId
    });
    return updatedTodo;
  };

  return Todo;
};

export default todo;
