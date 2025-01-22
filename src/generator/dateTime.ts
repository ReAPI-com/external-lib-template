import dayjs from "dayjs";

export function now() {
  return dayjs().toISOString();
}

export function nowTimestamp() {
  return new Date().getTime();
}

export const dateTimeGeneratorFunctions: ValueFunction[] = [
  {
    id: "reapi-now",
    displayName: "Now",
    description: "Get the current date and time",
    function: now,
    enabled: true,
    tested: true,
  },
  {
    id: "reapi-now-timestamp",
    displayName: "Now Timestamp",
    description: "Get the current date and time as a timestamp",
    function: nowTimestamp,
    enabled: true,
    tested: true,
  },
];
