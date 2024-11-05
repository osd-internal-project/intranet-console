import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
dayjs.extend(buddhistEra);
dayjs.locale("th");

export const isoDateTimeToLocalDateTime = (isoDateTime: string) => dayjs(isoDateTime).format("YYYY-MM-DD HH:mm:ss");

export const isoDateTimeToLocalDate = (isoDateTime: string) => dayjs(isoDateTime).format("YYYY-MM-DD");

/* 07 กุมภาพันธ์ 2566 */
export const DateLongTH = (date: Date) => {
  dayjs.locale("th");
  return dayjs(date).format("DD MMMM BBBB");
};

/* 07 ก.พ. 2566 */
export const DateShortTH = (date: Date) => {
  dayjs.locale("th");
  return dayjs(date).format("DD MMM BB");
};

export const DateTH = (date: Date, formate: string) => {
  dayjs.locale("th");
  return dayjs(date).format(formate);
};

/* 07 February 2023 */
export const DateLongEN = (date: Date) => {
  dayjs.locale("en");
  return dayjs(date).format("DD MMMM YYYY");
};

/* 07 Feb 23 */
export const DateShortEN = (date: Date) => {
  dayjs.locale("en");
  return dayjs(date).format("DD MMM YY");
};
