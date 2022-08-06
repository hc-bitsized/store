module.exports.getSuggestionsById = async (app, req, res) => {
    const Op = app.models.Sequelize.Op;

    let request = {
        suggestionId: undefined,
        filters: {
            startDate: undefined,
            endDate: undefined
        }
    }

    let response = {
        data: {
            suggestionId: undefined,
            product: undefined,
            suggested: undefined,
            countOrdersWithThisSuggestion: undefined
        }
    }

    if (req.params.id) request.suggestionId = req.params.id

    if (req.query.startDate) request.filters.startDate = req.query.startDate

    if (req.query.endDate) request.filters.endDate = req.query.endDate

    if (request.suggestionId){
        const suggestion = await app.models.Suggestion.findOne({
            where : { suggestionId: request.suggestionId },
            include: [
                {model: app.models.Product, as: 'product'},
                {model: app.models.Product, as: 'suggested'}
            ]
        })

        if (suggestion) {
            const productId = suggestion.product.productId
            const suggestedId = suggestion.suggested.productId

            const orders = await app.models.Order
                .findAll()
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

            response.data.suggestionId = suggestion.suggestionId
            response.data.product = suggestion.product
            response.data.suggested = suggestion.suggested
            response.data.countOrdersWithThisSuggestion = total
        }
    }


    res.send({
        msg: 'success',
        data: response.data
    })
}