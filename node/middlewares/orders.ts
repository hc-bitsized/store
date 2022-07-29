export async function orders(ctx: Context, next: () => Promise<any>) {
    const {
        clients: { oms },
    } = ctx

    console.log('ORDER STATE CHANGED')
    let body: any[] = []
    let orderState = null

    /*
    * estou utilizando o workspace testbackend para efetuar os testes
    * POST: https://testbackend--bitsized.myvtex.com/api/orders/hook/config
    * BODY: {
                "filter": {
                    "type": "FromOrders",
                            "expression": "(status = 'cancel' or status = 'canceled' or status = 'cancellation-requested' or status = 'waiting-ffmt-authorization' )",
                            "disabledSingleFire": false
                        },
                        "hook": {
                            "url": "https://testbackend--bitsized.myvtex.com/_v/app/orders",
                            "headers": {
                                "key": "value"
                            }
                        }
            }
    * Precisa cadastrar uma api token la no vtex admin        
    */

    // tem q fazer isso pq a info que vem do hook vem como binario
    ctx.req
      .on('data', chunk => body.push(chunk))
      .on('end', async () => {
        orderState = JSON.parse(Buffer.concat(body).toString())

        // pagamento aprovado 
        if (orderState.State == 'waiting-ffmt-authorization') {
          //payment-approved
          const orderData = await oms.order(orderState.OrderId),
            orderItems = orderData.items

          console.log(orderItems)

          //TODO: nessa parte faremos a chamada para a lambda armazenar os dados no banco de dados
        }
    })

    ctx.status = 200
    console.log(body)

    // ctx.status = responseStatus
    // ctx.body = data
    // ctx.set('Cache-Control', headers['cache-control'])

    await next()
}
