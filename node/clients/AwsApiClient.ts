import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'
import { OrderDto } from '../dtos/OrderDto';

export default class AwsApiClient extends ExternalClient {
  appKey = 'vtexappkey-bitsized-IKTLBO'
  appToken = 'GGBTSDSFKHHXYRRCLMKXIRZXZJJBCGWMOBJUFFLNWTIJGXXKOFPHIZDKAKFRNCRCJDCCAODWZLCPVLCMKHRCNTBKLAWUTNFCKPQAMAPNFJDJGSNUXININIFXIQIWURKM'

  constructor(context: IOContext, options?: InstanceOptions) {
    super('http://52.67.82.162/api', context, options)
  }

  public async createOrUpdateOrder(orderDto: OrderDto): Promise<void> {
    await this.http.post('/order', orderDto, {
      headers: {
        'X-VTEX-API-AppKey': this.appKey,
        'X-VTEX-API-AppToken': this.appToken
      }
    })
  }
}
