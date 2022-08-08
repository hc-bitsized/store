const moment = require('moment');

module.exports.getSuggestionsById = async (app, req, res) => {

    let response = undefined
    let request = _getRequestInfo(req);

    if (request.suggestionId) {
        response = await _getById(app, request.filters, request.suggestionId)
    }

    res.send({
        msg: 'success',
        data: response
    })
}

module.exports.getAllSuggestions = async (app, req, res) => {

    let response = undefined
    let request = _getRequestInfo(req);

    response = await _getAll(app, request.filters)

    res.send({
        msg: 'success',
        data: { content: response, filters: request.filters }
    })
}

async function _getById(app, filters, suggestionId, getAll = false) {

    const Op = app.models.Sequelize.Op;

    let response = {
        suggestionId: undefined,
        product: undefined,
        suggested: undefined,
        countOrdersWithThisSuggestion: undefined
    }

    const suggestion = await app.models.Suggestion.findOne({
        where : { suggestionId, deleted: 0 },
        include: [
            {model: app.models.Product, as: 'product'},
            {model: app.models.Product, as: 'suggested'}
        ]
    })

    if (suggestion) {
        const productId = suggestion.product.productId
        const suggestedId = suggestion.suggested.productId

        const orders = await app.models.Order
            .findAll({ where: {
                createdAt: {
                    [Op.gte]: filters.startDate,
                    [Op.lte]: filters.endDate
                }
            }})
            .map(order => order.orderId)
            .map(async orderId => {
                let data = await app.models.OrderItem.findAll({
                    where: {
                        productId: {
                            [Op.in]: [ productId, suggestedId ]
                        },
                        orderId
                    },
                    order: [
                        ['orderId', 'ASC'],
                        ['productId', 'ASC']
                    ],
                    group: [
                        'productId',
                        'orderId'
                    ],
                    attributes: [
                        'productId',
                        'orderId'
                    ]
                })
                return data;
            })

        const total = orders.flat()
            .reduce((acc, curr, i, arr) => {
                const actual = arr[i]
                const before = arr[i-1]
                if ((actual != undefined) && (before != undefined)) {
                    if (actual.orderId == before.orderId) return acc += 1
                }
                return acc
        }, 0)

        response.suggestionId = suggestionId
        response.product = { productId: suggestion.product.productId, productName: suggestion.product.productName }
        response.suggested = { productId: suggestion.suggested.productId, productName: suggestion.suggested.productName }
        response.countOrdersWithThisSuggestion = total

        if (!getAll) response.filters = filters

        return response
    }
}

async function _getAll(app, filters) {
    const suggestions = await app.models.Suggestion.findAll()
    let data = []

    for ( let suggestion of suggestions ) {
        const ordersData = await _getById(app, filters, suggestion.suggestionId, true)
        if (ordersData != null){
            data.push(ordersData)
        }
    }

    return data
}


function _getRequestInfo(req) {
    let request = {
        suggestionId: undefined,
        filters: {
            startDate: undefined,
            endDate: undefined
        }
    }

    if (req.params.id) request.suggestionId = req.params.id

    if (req.query.period) {
        request.filters.startDate = moment(req.query.period)
        request.filters.endDate = moment(req.query.period).endOf('month')
    } else {
        if (req.query.startDate) request.filters.startDate = moment(req.query.startDate)
        if (req.query.endDate) request.filters.endDate = moment(req.query.endDate)
    }

    return request
}