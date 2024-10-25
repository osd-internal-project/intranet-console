import dayjs from "dayjs";

export const timeOptions = [
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
];

export const calculateTime = (valueStartTime: any, valueEndTime: any) => {
  const startTime = dayjs(valueStartTime, "HH:mm");
  const endTime = dayjs(valueEndTime, "HH:mm");
  const breakStart = dayjs("12:00", "HH:mm");
  const breakEnd = dayjs("13:00", "HH:mm");
  let totalHours =
    startTime && endTime ? endTime.diff(startTime, "hour", true) : 0;
  if (startTime.isBefore(breakEnd) && endTime.isAfter(breakStart)) {
    const overlapStart = startTime.isBefore(breakStart)
      ? breakStart
      : startTime;
    const overlapEnd = endTime.isAfter(breakEnd) ? breakEnd : endTime;
    const breakDuration = overlapEnd.diff(overlapStart, "hour", true);
    totalHours -= breakDuration;
  }
  totalHours = totalHours > 0 ? parseFloat(totalHours.toFixed(1)) : 0;
  return totalHours;
};
