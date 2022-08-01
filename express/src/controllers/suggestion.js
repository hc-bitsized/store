module.exports.listSuggestions = async (app, req, res) => {
  const productId = req.query.productId;

  if (!productId) {
    return app.utils.error.badRequest(res, 'productId dever ser informado.');
  }

  const suggestions = await app.models.Suggestion.findAll({
    where: { productId, deleted: false},
    include: [
			{model: app.models.Product, as: 'product'},
      {model: app.models.Product, as: 'suggested'}
		]
  })
  res.send({
    msg: 'success',
    data: suggestions
  });
}

module.exports.addSuggestion = async (app, req, res) => {
  const productId = req.body.productId;
  const suggestedId = req.body.suggestedId;

  if (productId == suggestedId) {
    return app.utils.error.badRequest(res, 'O produto e sugestão sugestão não podem ser iguais.');
  }

  try {
    const product = await app.services.productapi.getById(productId);
    await app.models.Product.upsert({productId, productName: product.Name});
  } catch (error) {
    return app.utils.error.notFound(res, `Produto de id ${productId} não encontrado na api de produtos`);
  }

  try {
    const suggested = await app.services.productapi.getById(suggestedId);
    await app.models.Product.upsert({productId: suggestedId, productName: suggested.Name});
  } catch (error) {
    return app.utils.error.notFound(res, `Produto de id ${suggestedId} não encontrado na api de produtos`);
  }

  const suggestionsDb = await app.models.Suggestion.findAll({where: {productId, deleted: false}});
  if (suggestionsDb.length > 2) {
    return app.utils.error.badRequest(res, 'As sugestões são limitadas a 3. Remova alguma para continuar.');
  }

  const exists = suggestionsDb.find(sugg => sugg.productId == productId && sugg.suggestedId == suggestedId);

  if (exists) {
    return app.utils.error.badRequest(res, 'Este par de produtos já está cadastrado como uma sugestão.');
  }

  try {
    const suggestion = await app.models.Suggestion.create({productId, suggestedId});

    res.status(201).send({msg: 'success', data: suggestion});
  } catch (error) {
    return app.utils.error.internal(res, error);
  }
}

module.exports.removeSuggestion = async (app, req, res) => {
  const id = req.params.id;

  const suggestion = await app.models.Suggestion.findByPk(id);

  if (!suggestion) {
    return app.utils.error.notFound(res);
  }

  try {
    suggestion.deleted = true;
    await suggestion.save();
    res.status(204).send({req: suggestion})
  } catch (error) {
    return app.utils.error.internal(res, error.msg);
  }
}