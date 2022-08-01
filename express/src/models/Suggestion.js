module.exports = (sequelize, DataType) => {
  const Model = sequelize.define("Suggestion", {
    suggestionId: {
      type: DataType.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    productId: {
      type: DataType.STRING(50),
      allowNull: false,
    },
    suggestedId: {
      type: DataType.STRING(50),
      allowNull: false,
    },
    deleted: {
      type: DataType.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'suggestion',
    timestamps: true
  });

  Model.associate = (models) => {
    Model.belongsTo(models.Product, {
      as: 'product',
      foreignKey: {
        allowNull: true,
        field: 'productId',
        name: 'productId'
      }
    });
    Model.belongsTo(models.Product, {
      as: 'suggested',
      foreignKey: {
        allowNull: true,
        field: 'suggestedId',
        name: 'suggestedId'
      }
    });
  };

  return Model;
};
