import dayjs from 'dayjs'
import { hook } from '../_support/decorators'
import { GeoUtils } from '../utility/GeoUtils'

export const modifyRequestParams = hook(
  {
    id: 'reapi-modify-request-params',
    displayName: 'Modify Request Params',
    description: 'Modify the request params',
    type: 'BEFORE_REQUEST',
  },
  async function modifyRequestParams() {
    $request.headers['Authorization'] = 'Bearer 1234567890'
    $request.query.foo = GeoUtils.getRandomInt(1, 100)
    $request.headers['X-Timestamp'] = dayjs().unix()
    $context.foo = 'bar'
  }
)
