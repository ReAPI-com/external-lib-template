import dayjs from "dayjs";
import { Utility } from "../_support/decorators";

@Utility({
  id: "DateTimeUtils",
  displayName: "Date Time Utilities",
  description: "Date and time manipulation utilities",
})
export class DateTimeUtils {
  static formatDateTime(date: Date) {
    return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
  }

  static dateTimeFromTimestamp(timestamp: number) {
    const date = dayjs(timestamp);
    return date.toISOString();
  }
}
