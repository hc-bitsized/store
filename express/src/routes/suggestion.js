module.exports = function (app) {
  app.get('/api/suggestion', function (req, res) {
    app.controllers.suggestion.listSuggestions(app, req, res)
  });

  app.post('/api/suggestion', function (req, res) {
    app.controllers.suggestion.addSuggestion(app, req, res)
  });

  app.delete('/api/suggestion/:id', function (req, res) {
    app.controllers.suggestion.removeSuggestion(app, req, res)
  });
}
