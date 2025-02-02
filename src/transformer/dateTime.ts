import dayjs from "dayjs";

export function dateTimeFromTimestamp(timestamp: number) {
  const date = dayjs(timestamp);
  return date.toISOString();
}

export function formatTimestamp(timestamp: number) {
  const formattedDate = dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss");
  return formattedDate;
}

export const dateTimeTransformerFunctions: ValueFunction[] = [
  {
    id: "reapi-date-time-from-timestamp",
    displayName: "Date Time From Timestamp",
    description: "Get the date and time from a timestamp",
    function: dateTimeFromTimestamp,
    enabled: true,
    tested: false,
    noOfParams: 1,
  },
  {
    id: "reapi-format-timestamp",
    displayName: "Format Timestamp",
    description: "Format a timestamp to a date and time string",
    function: formatTimestamp,
    enabled: false,
    tested: false,
    noOfParams: 1,
  },
];
