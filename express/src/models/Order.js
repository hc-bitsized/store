module.exports = (sequelize, DataType) => {
  const Model = sequelize.define("Order", {
    orderId: {
      type: DataType.STRING(50),
      allowNull: false,
      primaryKey: true,
    },
    orderStatus: {
      type: DataType.STRING(50),
      allowNull: false,
    }
  }, {
    sequelize,
    tableName: 'order',
    timestamps: true
  });

  Model.associate = (models) => {
    Model.hasMany(models.OrderItem, {
      as: 'orderItems',
      foreignKey: {
        allowNull: true,
        field: 'orderId',
        name: 'orderId'
      }
    });
  };

  return Model;
};
