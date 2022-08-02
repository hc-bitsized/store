
module.exports.listPreSuggestions = async (app, req, res) => {
  const Op = app.models.Sequelize.Op;

  const productId = req.query.productId;
  let productName;

  if (!productId) {
    return app.utils.error.badRequest(res, 'productId dever ser informado.');
  }

  const orders = await app.models.Order.findAll({
    include: [
      {
        model: app.models.OrderItem,
        as: 'orderItems',
        include: [{model: app.models.Product, as: 'product'}]
      }]
  });

  const preSuggestions = {};

  orders.forEach(o => {
    let includeInThisOrder = o.orderItems.find(oi => oi.productId == productId);
    if (includeInThisOrder) {
      o.orderItems.forEach(i => {
        if (i.productId  != productId) {
          if (preSuggestions[i.productId] == undefined) {
            preSuggestions[i.productId] = {
              productId: i.productId,
              productName: i.product.productName,
              orders: []
            }
          }
          if (!preSuggestions[i.productId].orders.includes(o.orderId)) {
            preSuggestions[i.productId].orders.push(o.orderId)
          }
        } else {
          if (!productName) {
            productName = i.product.productName;
          }
        }
      });
    }
  });

  const pre = [];

  Object.keys(preSuggestions).forEach(key => {
    const p = Object.assign({}, preSuggestions[key]);
    p.countOrders = p.orders.length;
    delete p.orders;
    pre.push(p);
  })

  res.send({
    msg: 'success',
    data: {
      productId,
      productName,
      preSuggestions: pre,
    }
  });
}