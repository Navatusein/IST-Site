import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/uk";

dayjs.extend(utc);
dayjs.extend(timezone);

export const SITE_TIME_ZONE = "Europe/Kyiv";

export default function formatDate(date: string | number | Date, format = "D MMMM YYYY, dddd"): string {
  return dayjs(date).tz(SITE_TIME_ZONE).locale("uk").format(format);
}
