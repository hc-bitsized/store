module.exports = function (app) {
    app.get('/api/suggestion-results/:id', function (req, res) {
      app.controllers.reports.getSuggestionsById(app, req, res)
    });

    app.get('/api/suggestion-results', function(req, res){
      app.controllers.reports.getAllSuggestions(app, req, res)
    })
  }