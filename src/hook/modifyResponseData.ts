import { hook } from '../_support/decorators'

export const modifyResponseData = hook(
  {
    id: 'reapi-modify-response-data',
    displayName: 'Modify Response Data',
    description: 'Modify the response data',
    type: 'AFTER_RESPONSE',
  },
  async function modifyResponseData() {
    if ($response.data) {
      $response.data.foo = $context.foo
    }
    $context.bar = 'foo'
  }
)
