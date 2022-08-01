module.exports.internal = function(res, msg = 'Erro Interno') {
  return res.status(500).json({
		error: {
			codigo: 500,
			msg
		}
	});
}

module.exports.notFound = function(res, msg = 'Recurso não encontrado') {
  return res.status(404).json({
    error: {
      codigo: 404,
      msg
    }
  });
}

module.exports.badRequest = function(res, msg) {
  return res.status(400).json({
    error: {
      codigo: 400,
      msg
    }
  });
}
  