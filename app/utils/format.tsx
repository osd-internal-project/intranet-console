export function dateToStringTh(date: Date) {
  if (!date) return "-";
  const result = new Date(date).toLocaleString("en-GB", {
    timeZone: "Asia/Bangkok",
  });
  return result;
}
export function dateToStringThNoTime(date: Date) {
  if (!date) return "-";
  const result = new Date(date).toLocaleDateString("en-GB", {
    timeZone: "Asia/Bangkok",
  });
  return result;
}

export function dateToStartofDay(data: Date) {
  const date = new Date(data);
  const result = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0,
    0
  ).toISOString();
  return result;
}
export function dateToEndofDay(data: Date) {
  const date = new Date(data);
  const result = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    0
  ).toISOString();
  return result;
}

export const numberWithCommas = (x: any) => {
  if (x === undefined || x === "-" || x === null || x === "") {
    return "0.00";
  } else {
    const fixedNumber = Number.parseFloat(x).toFixed(2);
    return String(fixedNumber).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
};
export const countWithCommas = (x: any) => {
  if (x === undefined || x === "-" || x === null || x === "") {
    return "0.00";
  } else {
    const fixedNumber = Number.parseFloat(x).toFixed(0);
    return String(fixedNumber).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
};
