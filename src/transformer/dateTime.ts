import dayjs from 'dayjs'
import { valueGenerator } from '../_support/decorators'

export const dateTimeFromTimestamp = valueGenerator(
  {
    id: 'reapi-date-time-from-timestamp',
    displayName: 'Date Time From Timestamp',
    description: 'Get the date and time from a timestamp',
    noOfParams: 1,
  },
  function dateTimeFromTimestamp(timestamp: number) {
    const date = dayjs(timestamp)
    return date.toISOString()
  }
)

export const formatTimestamp = valueGenerator(
  {
    id: 'reapi-format-timestamp',
    displayName: 'Format Timestamp',
    description: 'Format a timestamp to a date and time string',
    noOfParams: 1,
    enabled: false,
    tested: false,
  },
  function formatTimestamp(timestamp: number) {
    const formattedDate = dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
    return formattedDate
  }
)
