module.exports = function (app) {
  app.get('/api/pre-suggestion', function (req, res) {
    app.controllers.preSuggestion.listPreSuggestions(app, req, res)
  });
}