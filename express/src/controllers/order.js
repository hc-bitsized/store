module.exports.addOrder = async (app, req, res) => {
  const transaction = await app.models.sequelize.transaction();
 
  req.body.orderItems.map(i => {
    i.orderId = req.body.orderId
  });

  try {
    await app.models.Product.bulkCreate(req.body.orderItems, { transaction, updateOnDuplicate: ["productName"] });

    await app.models.Order.upsert({orderId: req.body.orderId, orderStatus: req.body.orderStatus}, { transaction });

    await app.models.OrderItem.bulkCreate(req.body.orderItems, { transaction, updateOnDuplicate: ["quantity"] });

    await transaction.commit();

    res.send({msg: 'success'});
  } catch (error) {
    await transaction.rollback();

    return app.utils.error.internal(res, error);
  }
}
