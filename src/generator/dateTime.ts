import dayjs from 'dayjs'
import { valueGenerator } from '../_support/decorators'

export const now = valueGenerator(
  {
    id: 'reapi-now',
    displayName: 'Now',
    description: 'Get the current date and time in ISO format',
    noOfParams: 0,
  },
  function now() {
    return dayjs().toISOString()
  }
)

export const nowTimestamp = valueGenerator(
  {
    id: 'reapi-now-timestamp',
    displayName: 'Now Timestamp',
    description: 'Get the current date and time as a timestamp',
    noOfParams: 0,
  },
  function nowTimestamp() {
    return new Date().getTime()
  }
)
