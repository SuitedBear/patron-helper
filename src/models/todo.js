const todo = (sequelize, DataTypes) => {
  const Todo = sequelize.define('todo', {
    status: {
      type: DataTypes.ENUM,
      values: ['done', 'for shipment', 'in progress', 'new']
    },
    levelId: {
      type: DataTypes.INTEGER,
      allowNull: false
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
    Todo.belongsTo(models.Level, { foreignKey: 'levelId' });
    // Todo.belongsTo(models.PatronInService, { foreignKey: 'patronId' });
    Todo.belongsTo(models.Reward, { foreignKey: 'rewardId' });
    // need user "0" for multi rewards
    Todo.belongsTo(models.PatronInService, {
      foreignKey: 'patronId',
      constrains: false
    });
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
