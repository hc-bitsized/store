import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

export default class OrderClient extends ExternalClient {
  appKey = 'vtexappkey-bitsized-LMUNHB'
  appToken = 'BXLCNBPKUPGRKKEAPKRTIVUSUCBQGXZIFIQSJACTCNOKOXEVLYAVBAGBDHJKKXYBPDWGFOGFJQUFEDGRKZPWIKUFTMKOWFAKXMUGJQSOTIPAQTKQUWPYBGUITPTZRSET'

  constructor(context: IOContext, options?: InstanceOptions) {
    super('https://bitsized.vtexcommercestable.com.br', context, options)
  }

  public async getOrder(orderId: string): Promise<string> {
    return this.http.get(`/api/oms/pvt/orders/${orderId}`, {
      headers: {
        'X-VTEX-API-AppKey': this.appKey,
        'X-VTEX-API-AppToken': this.appToken
      }
    });
  }
}
