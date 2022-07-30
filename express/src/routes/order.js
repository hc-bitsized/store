module.exports = function (app) {
  app.post('/order', function (req, res) {
    app.controllers.order.addOrder(app, req, res)
  });
}
