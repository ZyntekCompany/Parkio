import { DateTime } from "luxon";

export function formatDate(date: Date, includeTime: boolean = false): string {
  if (includeTime) {
    return DateTime.fromJSDate(date).toFormat("dd/MM/yyyy, hh:mm a");
  } else {
    return DateTime.fromJSDate(date).toFormat("dd/MM/yyyy");
  }
}
