module.exports = (sequelize, DataType) => {
  const Model = sequelize.define("Product", {
    productId: {
      type: DataType.STRING(50),
      allowNull: false,
      primaryKey: true,
    },
    productName: {
      type: DataType.STRING(100),
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: 'product',
    timestamps: true
  });

  return Model;
};
