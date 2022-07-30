import { IOClients } from '@vtex/api'

import OrderClient from './OrderClient'
import AwsApiClient from './AwsApiClient'
export class Clients extends IOClients {
  public get order() {
    return this.getOrSet('order-client', OrderClient)
  }

  public get awsapi() {
    return this.getOrSet('awsapi-client', AwsApiClient)
  }
}
