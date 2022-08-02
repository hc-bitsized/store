import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'
import { OrderDto } from '../dtos/OrderDto';

export default class AwsApiClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super('https://bitsized.socialfitness.com.br/api', context, options)
  }

  public async createOrUpdateOrder(orderDto: OrderDto): Promise<void> {
    await this.http.post('/order', orderDto)
  }
}
