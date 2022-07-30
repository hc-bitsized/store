import { OrderDto, OrderItemDto } from "../dtos/OrderDto"

export async function OrderStatusUpdated(
  ctx: StatusChangeContext,
  next: () => Promise<any>
) {
  const { clients } = ctx

  const orderId = ctx.body.orderId
  const orderData: any = await clients.order.getOrder(orderId)

  const items: OrderItemDto[] = orderData.map((order: { items: any[] }) => {
    let items = order.items.map(item => {
      return {
        productId: item.productId,
        productName: '',
        quantity: item.quantity
      }
    })
    return items
  })

  const orderDto: OrderDto = {
    orderId,
    orderStatus: ctx.body.currentState,
    orderItems: items,
  }
 
  console.log(orderDto)

  //await clients.awsapi.createOrUpdateOrder(orderDto)
  
  await next()
}
