import { OrderDto, OrderItemDto } from "../dtos/OrderDto"

export async function OrderStatusUpdated(
  ctx: StatusChangeContext,
  next: () => Promise<any>
) {
  const { clients } = ctx

  const orderId = ctx.body.orderId
  const orderData: any = await clients.order.getOrder(orderId)

  const items: OrderItemDto[] = orderData.items.map((item: { uniqueId: string, productId: string; name: string, quantity: string }) => {
    return {
      orderItemId: item.uniqueId,
      productId: item.productId,
      productName: item.name,
      quantity: item.quantity
    }
  })

  const orderDto: OrderDto = {
    orderId,
    orderStatus: ctx.body.currentState,
    orderItems: items,
  }
 
  await clients.awsapi.createOrUpdateOrder(orderDto)
  
  await next()
}
