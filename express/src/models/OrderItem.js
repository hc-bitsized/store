module.exports = (sequelize, DataType) => {
  const Model = sequelize.define("OrderItem", {
    orderItemId: {
      type: DataType.STRING(50),
      allowNull: false,
      primaryKey: true,
    },
    orderId: {
      type: DataType.STRING(50),
      allowNull: false,
    },
    productId: {
      type: DataType.STRING(50),
      allowNull: false,
    },
    quantity: {
      type: DataType.INTEGER(2),
      allowNull: false,
    }
  }, {
    sequelize,
    tableName: 'order_item',
    timestamps: true
  });

  return Model;
};
