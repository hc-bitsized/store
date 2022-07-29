export async function orders(ctx: Context, next: () => Promise<any>) {
    const {
        clients: { oms },
    } = ctx

    console.log('ORDER STATE CHANGED')
    let body: any[] = []
    let orderState = null

    ctx.req
      .on('data', chunk => body.push(chunk))
      .on('end', async () => {
        orderState = JSON.parse(Buffer.concat(body).toString())
        const orderData = await oms.order(orderState.OrderId),
            orderItems = orderData.items
        console.log(orderItems);

        if (orderState.State == 'waiting-ffmt-authorization') {
          //payment-approved
          const orderData = await oms.order(orderState.OrderId),
            orderItems = orderData.items

          console.log(orderItems)
        }
    })

    ctx.status = 200
    console.log(body)

    // ctx.status = responseStatus
    // ctx.body = data
    // ctx.set('Cache-Control', headers['cache-control'])

    await next()
}
