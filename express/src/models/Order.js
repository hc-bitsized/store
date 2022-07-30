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

  return Model;
};
