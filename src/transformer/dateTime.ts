import dayjs from "dayjs";

export function dateTimeFromTimestamp(timestamp: number) {
  const date = dayjs(timestamp);
  return date.toISOString();
}

export function formatDateTime(date: Date) {
  const formattedDate = dayjs(date).format("YYYY-MM-DD HH:mm:ss");
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
  },
  {
    id: "reapi-format-date-time",
    displayName: "Format Date Time",
    description: "Format a date and time",
    function: formatDateTime,
    enabled: false,
    tested: false,
  },
];
