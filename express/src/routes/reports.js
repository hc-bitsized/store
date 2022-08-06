module.exports = function (app) {
    app.get('/api/suggestion-results/:id', function (req, res) {
      app.controllers.reports.getSuggestionsById(app, req, res)
    });
  }