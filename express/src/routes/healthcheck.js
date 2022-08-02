module.exports = function (app) {
  app.get('/', function (_req, res) {
    res.send({'api_status': 'ok'})
  });

  app.get('/api', function (_req, res) {
    res.send({'api_status': 'ok'})
  });
}
