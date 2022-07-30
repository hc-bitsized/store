module.exports.internal = function(res, error) {
  return res.status(500).json({
		error: {
			codigo: 500,
			msg: error
		}
	});
}

module.exports.notFound = function(res) {
  return res.status(404).json({
    error: {
      codigo: 404,
      msg: 'Recurso não encontrado'
    }
  });
}
  