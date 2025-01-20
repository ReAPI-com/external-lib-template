import dayjs from "dayjs";

export class DateTimeUtils {
  static formatDateTime(date: Date) {
    return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
  }

  static dateTimeFromTimestamp(timestamp: number) {
    const date = dayjs(timestamp);
    return date.toISOString();
  }
}
