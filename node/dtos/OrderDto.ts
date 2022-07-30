
export interface OrderItemDto {
  productId: string;
  productName: string;
  quantity: number;
}

export interface OrderDto {
  orderId: string;
  orderStatus: string;
  orderItems: OrderItemDto[];
}
