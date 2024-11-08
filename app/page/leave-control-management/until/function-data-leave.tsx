"use client";
import dayjs from "dayjs";
import { ITypeDataLeave } from "../common";
import { message } from "antd";

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
  let totalHours = startTime && endTime ? endTime.diff(startTime, "hour", true) : 0;
  if (startTime.isBefore(breakEnd) && endTime.isAfter(breakStart)) {
    const overlapStart = startTime.isBefore(breakStart) ? breakStart : startTime;
    const overlapEnd = endTime.isAfter(breakEnd) ? breakEnd : endTime;
    const breakDuration = overlapEnd.diff(overlapStart, "hour", true);
    totalHours -= breakDuration;
  }
  totalHours = totalHours > 0 ? parseFloat(totalHours.toFixed(1)) : 0;
  return totalHours;
};

export const calculateCreateLeaveCaseOne = async (
  id: any,
  record: any,
  selectedOption: any,
  session: any,
  attendFiles: any,
  totalHours: any,
  totalDays: any,
) => {
  const base: ITypeDataLeave = {
    id: id,
    userId: record.userId,
    firstName: record.firstNameTh,
    lastName: record.lastNameTh,
    positionId: record.posId,
    position: record.position,
    typeId: record.type_id,
    typeName: selectedOption ? selectedOption.label : undefined,
    startDate: record.startDate,
    endDate: record.endDate,
    detail: record.detail,
    phoneNumber: record.phoneNumber,
    status: "waitting",
    ownerId: record.ownerId,
    ownerName: record.ownerName,
    groupId: session?.user.ownerGroup,
    attrachFile: attendFiles[0]?.name,
  };
  try {
    const condition: ITypeDataLeave = {
      ...base,
      ...(record.time_start_check
        ? { leaveHour: 8 }
        : {
            leaveHour: record.startTime && record.endTime ? Number(totalHours) : Number(totalDays) * 8,
          }),
    };
    return await condition;
  } catch (err) {
    return message.error(`${err}`);
  }
};
export const calculateCreateLeaveCaseTwo = async (
  id: any,
  record: any,
  selectedOption: any,
  session: any,
  attendFiles: any,
  totalHours: any,
  totalDays: any,
  leaveStartDate: any,
  twoDayAdvance: any,
) => {
  if (new Date(leaveStartDate) < twoDayAdvance) {
    message.warning("ต้องลาล่วงหน้า 2 วัน");
    return false;
  }
  const base: ITypeDataLeave = {
    id: id,
    userId: record.userId,
    firstName: record.firstNameTh,
    lastName: record.lastNameTh,
    positionId: record.posId,
    position: record.position,
    typeId: record.type_id,
    typeName: selectedOption ? selectedOption.label : undefined,
    startDate: record.startDate,
    endDate: record.endDate,
    detail: record.detail,
    phoneNumber: record.phoneNumber,
    status: "waitting",
    ownerId: record.ownerId,
    ownerName: record.ownerName,
    groupId: session?.user.ownerGroup,
    attrachFile: attendFiles[0]?.name,
  };

  const condition: ITypeDataLeave = {
    ...base,
    ...(record.time_start_check
      ? { leaveHour: 8 }
      : {
          leaveHour: record.startTime && record.endTime ? Number(totalHours) : Number(totalDays) * 8,
        }),
  };
  return await condition;
};
export const calculateCreateLeaveCaseThree = async (
  id: any,
  record: any,
  selectedOption: any,
  session: any,
  attendFiles: any,
  totalHours: any,
  totalDays: any,
  leaveStartDate: any,
  fiveDayAdvance: any,
) => {
  if (new Date(leaveStartDate) < fiveDayAdvance) {
    message.warning("ต้องลาล่วงหน้า 5 วัน");
    return false;
  }
  const base: ITypeDataLeave = {
    id: id,
    userId: record.userId,
    firstName: record.firstNameTh,
    lastName: record.lastNameTh,
    positionId: record.posId,
    position: record.position,
    typeId: record.type_id,
    typeName: selectedOption ? selectedOption.label : undefined,
    startDate: record.startDate,
    endDate: record.endDate,
    detail: record.detail,
    phoneNumber: record.phoneNumber,
    status: "waitting",
    ownerId: record.ownerId,
    ownerName: record.ownerName,
    groupId: session?.user.ownerGroup,
    attrachFile: attendFiles[0]?.name,
  };

  const condition: ITypeDataLeave = {
    ...base,
    ...(record.time_start_check
      ? { leaveHour: 8 }
      : {
          leaveHour: record.startTime && record.endTime ? Number(totalHours) : Number(totalDays) * 8,
        }),
  };
  return await condition;
};
export const calculateCreateLeaveCaseFour = async (
  id: any,
  record: any,
  selectedOption: any,
  session: any,
  attendFiles: any,
  totalHours: any,
  totalDays: any,
  leaveStartDate: any,
  fifteenDayAdvance: any,
) => {
  if (new Date(leaveStartDate) < fifteenDayAdvance) {
    message.warning("ต้องลาล่วงหน้า 15 วัน");
    return false;
  }
  const base: ITypeDataLeave = {
    id: id,
    userId: record.userId,
    firstName: record.firstNameTh,
    lastName: record.lastNameTh,
    positionId: record.posId,
    position: record.position,
    typeId: record.type_id,
    typeName: selectedOption ? selectedOption.label : undefined,
    startDate: record.startDate,
    endDate: record.endDate,
    detail: record.detail,
    phoneNumber: record.phoneNumber,
    status: "waitting",
    ownerId: record.ownerId,
    ownerName: record.ownerName,
    groupId: session?.user.ownerGroup,
    attrachFile: attendFiles[0]?.name,
  };

  const condition: ITypeDataLeave = {
    ...base,
    ...(record.time_start_check
      ? { leaveHour: 8 }
      : {
          leaveHour: record.startTime && record.endTime ? Number(totalHours) : Number(totalDays) * 8,
        }),
  };
  return await condition;
};
export const calculateCreateLeaveCaseFive = async (
  id: any,
  record: any,
  selectedOption: any,
  session: any,
  attendFiles: any,
  totalHours: any,
  totalDays: any,
  leaveStartDate: any,
  thirtyDayAdvance: any,
) => {
  if (new Date(leaveStartDate) < thirtyDayAdvance) {
    message.warning("ต้องลาล่วงหน้า 30 วัน");
    return false;
  }
  const base: ITypeDataLeave = {
    id: id,
    userId: record.userId,
    firstName: record.firstNameTh,
    lastName: record.lastNameTh,
    positionId: record.posId,
    position: record.position,
    typeId: record.type_id,
    typeName: selectedOption ? selectedOption.label : undefined,
    startDate: record.startDate,
    endDate: record.endDate,
    detail: record.detail,
    phoneNumber: record.phoneNumber,
    status: "waitting",
    ownerId: record.ownerId,
    ownerName: record.ownerName,
    groupId: session?.user.ownerGroup,
    attrachFile: attendFiles[0]?.name,
  };

  const condition: ITypeDataLeave = {
    ...base,
    ...(record.time_start_check
      ? { leaveHour: 8 }
      : {
          leaveHour: record.startTime && record.endTime ? Number(totalHours) : Number(totalDays) * 8,
        }),
  };
  return await condition;
};
