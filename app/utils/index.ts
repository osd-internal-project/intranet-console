import dayjs from "dayjs";
export const defaultDateFormat = "DD-MM-BBBB";
export const defaultDatePickerFormat = "DD-MM-YYYY";
export const dateTimeFormatBB = "DD-MM-YYYY , hh:mm";
export const dateTimeFormat = "DD-MM-YYYY , hh:mm";
export const dateTimeFormatNoTime = "DD-MM-YYYY";

// import { dateTimeFormatBB, dateTimeFormat, defaultDatePickerFormat, defaultDateFormat } from "../configs";
// import { differenceInYears } from "date-fns";

// export const age = (text: any) => {
//   const [day, month, year] = text.split("/");
//   const birthDate = new Date(`${year}-${month}-${day}`);
//   const dateNow = new Date();
//   const age = differenceInYears(dateNow, birthDate);
//   return age;
// };
export const convertDate = (text: any) => {
  const [day, month, year] = text?.split("/");
  const birthDate = new Date(`${year}-${month}-${day}`);
  return dayjs(birthDate).add(543, "year");
};
export const dateFormatdate = (date: any) => {
  const [day, month, year] = date.split("/");
  const birthDate = new Date(`${year}-${month}-${day}`);
  return birthDate ? dayjs(birthDate).format(defaultDateFormat) : "-";
};
export const dateFormat = (date: string) =>
  date ? dayjs(date).add(543, "year").format(dateTimeFormatBB) : "-";

export const dateFormatTime = (date: string) =>
  date ? `${dayjs(date).format(dateTimeFormat)} น.` : "-";
export const dateFormatTimeNoTIme = (date: string) => {
  return date ? `${dayjs(date).format(dateTimeFormatNoTime)} น.` : "-";
};

export const numberFormat = (n: number): string =>
  n && !isNaN(n)
    ? (Math.round(n * 100) / 100).toLocaleString("th-TH", {
        // minimumFractionDigits: 2,
      })
    : "-";

export const phoneFormat = (input: any) => {
  if (!input || isNaN(input)) return `input must be a number was sent ${input}`;
  if (typeof input !== "string") input = input.toString();
  if (input.length === 10) {
    return input.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  } else if (input.length < 10) {
    return "was not supplied enough numbers please pass a 10 digit number";
  } else if (input.length > 10) {
    return "was supplied too many numbers please pass a 10 digit number";
  } else {
    return "something went wrong";
  }
};

export const diffDayDate = (startDate: Date, endDate: Date) => {
  const sday = new Date(startDate);
  const eday = new Date(endDate);
  return Math.floor(
    (Date.UTC(eday.getFullYear(), eday.getMonth(), eday.getDate()) -
      Date.UTC(sday.getFullYear(), sday.getMonth(), sday.getDate())) /
      (1000 * 60 * 60 * 24)
  );
};

const Formatter = (value: any) => {
  if (!value) {
    return "";
  }
  const inputValue = value.replace(/\D/g, "");
  let formattedValue = "";
  for (let i = 0; i < inputValue.length; i++) {
    if (i === 1 || i === 6 || i === 12) {
      formattedValue += "-";
    }
    formattedValue += inputValue.charAt(i);
  }
  return formattedValue;
};
