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

export function dateToStringThWithTime(date: Date) {
  if (!date) return "-";
  const result = new Date(date).toLocaleString("en-GB", {
    timeZone: "Asia/Bangkok",
    hour: "2-digit",
    minute: "2-digit",
  });
  return result;
}

export function dateToStartofDay(data: Date) {
  const date = new Date(data);
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0).toISOString();
  return result;
}
export function dateToEndofDay(data: Date) {
  const date = new Date(data);
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 0).toISOString();
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

export function HourAmountToDateHourString(hourAmount: number) {
  if (!hourAmount || hourAmount <= 0) {
    return "-";
  }
  const days = Math.trunc(hourAmount / 8);
  const hours = hourAmount % 8;

  let result = "";

  result += (days && days > 0) ? `${days} วัน` : "";

  result += (hours && hours > 0) ? ` ${hours} ชม.` : "";

  // if (days > 0) {
  //   result += (days && days >= 0) ? `${ days } วัน`: "";
  // }
  // if (hours > 0) {
  //   result += (hours && hours >= 0) ? ` ${ hours } ชม.`: "";
  // }

  return result;
}

export function HourAmountToDateHourObj(hourAmount: number) {
  {
    if (!hourAmount || hourAmount <= 0) {
      return {
        days: 0,
        hours: 0,
        toString: () => "- วัน - ชม."
      };
    }
    const days = Math.trunc(hourAmount / 8);
    const hours = hourAmount % 8;

    return {
      days,
      hours,
      toString: () => `${days} วัน ${hours} ชม.`
    };
  }
}
