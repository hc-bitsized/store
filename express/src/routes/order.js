module.exports = function (app) {
  app.post('/api/order', function (req, res) {
    app.controllers.order.addOrder(app, req, res)
  });
}
