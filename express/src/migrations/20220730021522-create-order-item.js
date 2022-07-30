"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("OrderItems", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id: {
        type: Sequelize.STRING,
      },
      productId: {
        type: Sequelize.STRING,
      },
      orderId: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("OrderItems");
  },
};
