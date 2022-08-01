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

  Model.associate = (models) => {
    Model.hasMany(models.OrderItem, {
      as: 'orderItems',
      foreignKey: {
        allowNull: true,
        field: 'productId',
        name: 'productId'
      }
    });
  };

  return Model;
};
