export const manageDays = (value: string) => {
  switch (value) {
    case "Sunday":
      return "วันอาทิตย์";
    case "Monday":
      return "วันจันทร์";
    case "Tuesday":
      return "วันอังคาร";
    case "Wednesday":
      return "วันพุธ";
    case "Thursday":
      return "วันพฤหัสบดี";
    case "Friday":
      return "วันศุกร์";
    case "Saturday":
      return "วันเสาร์";
    case "Holiday":
      return "วันหยุดนักขัตฤกษ์";
  }
};

export const typeDate = (value: string) => {
  switch (value) {
    case "dayoff":
      return "วันหยุด";
    case "normall":
      return "วันทำงาน";
  }
};
