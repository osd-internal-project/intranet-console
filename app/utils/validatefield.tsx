import { Flex, message, Tag } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, MinusCircleOutlined, SyncOutlined } from "@ant-design/icons";
import { MaCarBookType } from "../page/macar/common";
import { ITypeDataLeaveCreate, ITypetypeleave } from "../page/leave-control-management/common";
import { IFindAllDayDto } from "../page/setting/master-holidays/common";
import dayjs from "dayjs";

export const validatesUploadfileImage = (rule: any, value: string, callback: any) => {
  if (rule.length === 0) {
    callback("Please upload image");
  } else {
    callback();
  }
};

export const validateCheckData = (rule: any, value: string, callback: any) => {
  if (value !== null || value !== undefined || value !== "") {
    callback("Please Select Start Date");
  }
};

export const validateCheckStartDate = (endDate: any, startDate: any, TypeLeave: number) => {
  if (!TypeLeave) {
    return Promise.reject(new Error("โปรดเลือกประเภทการลาก่อนเสมอ"));
  }
  if (!startDate) {
    return Promise.reject(new Error("กรุณาเลือกวันที่เริ่มลา"));
  } else if (!startDate) {
    return Promise.resolve();
  }
  return Promise.reject(new Error("กรุณาเลือกวันที่เริ่มลา"));
};

export const validateCheckEndDate = (startDate: any, endDate: any, TypeLeave: number, holidays: IFindAllDayDto[]) => {
  const findHolidays = Object.values(holidays).some(
    (holiday) =>
      dayjs(holiday.holidaysDate).format("DD-MM-YYYY") === dayjs(startDate).format("DD-MM-YYYY") ||
      dayjs(holiday.holidaysDate).format("DD-MM-YYYY") === dayjs(endDate).format("DD-MM-YYYY"),
  );

  if (!TypeLeave) {
    return Promise.reject(new Error("โปรดเลือกประเภทการลาก่อนเสมอ"));
  }

  // Ensure start and end dates are provided
  if (!startDate) {
    return Promise.reject(new Error("กรุณาเลือกวันที่เริ่มลาก่อน"));
  }
  if (!endDate) {
    return Promise.reject(new Error("กรุณาเลือกวันที่สิ้นสุดการลา"));
  }

  const start = dayjs(startDate);
  const end = dayjs(endDate);

  // End must not be before start
  if (end.isBefore(start, "day")) {
    return Promise.reject(new Error("วันที่สิ้นสุดต้องเท่ากับหรือหลังจากวันที่เริ่ม"));
  }

  // Enforce both dates be within the same calendar year
  // if (start.year() !== end.year()) {
  //   return Promise.reject(new Error("ไม่สามารถเลือกวันที่ข้ามปีได้ กรุณาเลือกวันที่ภายในปีเดียวกัน"));
  // }

  // Check holidays
  if (findHolidays) {
    return Promise.reject(new Error("โปรตรวจสอบว่าวันลาของท่านตรงกับวันหยุดไหม"));
  }

  return Promise.resolve();
};

export const validateCheckLeaveDay = (leavedata: ITypeDataLeaveCreate[], dataMasterType: ITypetypeleave, startWork: string) => {
  let totalLeaveHours = 0;
  let defaultcanLeave = 0;
  leavedata.forEach((e: ITypeDataLeaveCreate) => {
    totalLeaveHours += e.leaveHour;
  });
  const dateNow = dayjs(new Date());
  const startwork = dayjs(startWork);
  const yearOfWork = dateNow.diff(startwork, "years", true);
  if (yearOfWork <= 1) {
    defaultcanLeave += Number(dataMasterType.limitLeaveFour) * 8;
  } else if (yearOfWork < 3) {
    defaultcanLeave += Number(dataMasterType.limitLeaveOne) * 8;
  } else if (yearOfWork < 5) {
    defaultcanLeave += Number(dataMasterType.limitLeaveTwo) * 8;
  } else {
    defaultcanLeave += Number(dataMasterType.limitLeaveThree) * 8;
  }
  return defaultcanLeave - totalLeaveHours;
};

export const getQuotaLeavePerYear = (dataMasterType: ITypetypeleave, startWork: string) => {
  let defaultcanLeave_Hour = 0;
  let defaultcanLeave_Day = 0;
  const dateNow = dayjs(new Date());
  const startwork = dayjs(startWork);
  const yearOfWork = dateNow.diff(startwork, "years", true);
  if (yearOfWork <= 1) {
    defaultcanLeave_Hour += Number(dataMasterType.limitLeaveFour) * 8;
    defaultcanLeave_Day += Number(dataMasterType.limitLeaveFour);
  } else if (yearOfWork < 3) {
    defaultcanLeave_Hour += Number(dataMasterType.limitLeaveOne) * 8;
    defaultcanLeave_Day += Number(dataMasterType.limitLeaveOne);
  } else if (yearOfWork < 5) {
    defaultcanLeave_Hour += Number(dataMasterType.limitLeaveTwo) * 8;
    defaultcanLeave_Day += Number(dataMasterType.limitLeaveTwo);
  } else {
    defaultcanLeave_Hour += Number(dataMasterType.limitLeaveThree) * 8;
    defaultcanLeave_Day += Number(dataMasterType.limitLeaveThree);
  }
  return { quotaLeaveHour: defaultcanLeave_Hour, quotaLeaveDay: Math.floor(defaultcanLeave_Day) };
};

// export const validateSumTotalLeave = (values: ITypeDataLeaveCreate, holidays: IFindAllDayDto[], typeId: number) => {
//   let SumTime: number = 1;
//   const dateStart = new Date(dayjs(values.startDate).format("YYYY-MM-DD")).getTime();
//   const dateEnd = new Date(dayjs(values.endDate).format("YYYY-MM-DD")).getTime();

//   if (dayjs(values.endDate).format("YYYY-MM-DD") === dayjs(values.startDate).format("YYYY-MM-DD")) {
//     if (values.time_start_check) {
//       SumTime = 8;
//     } else {
//       SumTime = calculateTime(values.startTime, values.endTime);
//     }
//   } else {
//     // หาวันหยุดกับวันเสาร์อาทิตย์
//     const holidayDates = new Set(holidays.map((e) => new Date(e.holidaysDate).toDateString()));
//     const dayOffSet = new Set<string>();
//     for (let currentDate = new Date(dateStart); currentDate <= new Date(dateEnd); currentDate.setDate(currentDate.getDate() + 1)) {
//       const dateStr = currentDate.toDateString();
//       const dayOfWeek = currentDate.getDay();
//       if (dayOfWeek === 0 || dayOfWeek === 6 || holidayDates.has(dateStr)) {
//         dayOffSet.add(dateStr);
//       }
//     }
//     // คำนวณจำนวนวันทั้งหมด และวันทำงาน
//     const dayOffCount = dayOffSet.size;
//     const totalDays = Math.floor((new Date(dateEnd).getTime() - new Date(dateStart).getTime()) / 86400000) + 1;
//     const workingDays = totalDays - dayOffCount;
//     SumTime = workingDays * 8;
//   }
//   return SumTime;
// };

export const validateSumTotalLeave = (values: ITypeDataLeaveCreate, holidays: IFindAllDayDto[], typeId: number) => {
  // let SumTime: number = 1;
  const start = dayjs(values.startDate).startOf("day");
  const end = dayjs(values.endDate).startOf("day");
  const dateStart = start.toDate().getTime();
  const dateEnd = end.toDate().getTime();
  const isSameDay = start.isSame(end, "day");

  if (isSameDay) {
    if (values.time_start_check) {
      return 8;
    } else {
      return calculateTime(values.startTime, values.endTime);
    }
  }

  if (typeId === 6) {
    const totalDays = Math.floor((dateEnd - dateStart) / 86400000) + 1;
    return totalDays * 8;
  }
  const holidayDates = new Set(holidays.map((e) => new Date(e.holidaysDate).toDateString()));
  const dayOffSet = new Set<string>();
  for (let currentDate = new Date(dateStart); currentDate <= new Date(dateEnd); currentDate.setDate(currentDate.getDate() + 1)) {
    const dateStr = currentDate.toDateString();
    const dayOfWeek = currentDate.getDay();

    if (dayOfWeek === 0 || dayOfWeek === 6 || holidayDates.has(dateStr)) {
      dayOffSet.add(dateStr);
    }
  }

  const dayOffCount = dayOffSet.size;

  const totalDays = Math.floor((dateEnd - dateStart) / 86400000) + 1;

  const workingDays = totalDays - dayOffCount;

  return workingDays * 8;
};

export const calculateTime = (valueStartTime: string, valueEndTime: string) => {
  const startTime = dayjs(valueStartTime, "HH:mm");
  const endTime = dayjs(valueEndTime, "HH:mm");
  const breakStart = dayjs("12:00", "HH:mm");
  const breakEnd = dayjs("13:00", "HH:mm");
  let totalHours = startTime && endTime ? endTime.diff(startTime, "hour", true) : 0;
  if (startTime.isBefore(breakEnd) && endTime.isAfter(breakStart)) {
    totalHours -= 1;
  }
  totalHours = totalHours > 0 ? parseFloat(totalHours.toFixed(1)) : 0;
  return totalHours;
};

export const checkStatusTypeLeave = async (values: ITypeDataLeaveCreate) => {
  const { type_id, startDate } = values;
  let meassage;
  const dateStart = new Date(dayjs(startDate).format("YYYY-MM-DD"));
  const dateNow = new Date(dayjs().format("YYYY-MM-DD"));
  const totalDays = countBusinessDays(dateNow, dateStart);
  if (type_id === 3 || type_id === 6 || type_id === 10) {
    //ลาล่วงหน้า 5
    meassage = totalDays < 5 ? message.warning(`อย่างน้อยต้องลาล่วงหน้า 5 วัน`) : false;
  } else if (type_id === 5 || type_id === 9 || type_id === 11 || type_id === 12) {
    //ลาล่วงหน้า 30
    meassage = totalDays < 30 ? message.warning(`อย่างน้อยต้องลาล่วงหน้า 30 วัน`) : false;
  } else if (type_id === 7) {
    //ลาล่วงหน้า 15
    meassage = totalDays < 15 ? message.warning(`อย่างน้อยต้องลาล่วงหน้า 15 วัน`) : false;
  } else if (type_id === 2) {
    //ลาล่วงหน้า 2
    meassage = totalDays < 2 ? message.warning(`อย่างน้อยต้องลาล่วงหน้า 2 วัน`) : false;
  }
  return { status: !meassage ? 201 : 500 };
};

function countBusinessDays(start: Date, end: Date) {
  let count = 0;
  const current = new Date(start);
  while (current <= end) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
}

export const CheckStatusMaCarBookType = (status: string) => {
  let color = "";
  let text = "";
  let icon = null;
  switch (status) {
    case "Process":
      color = "DodgerBlue";
      text = "กำลังรออนุมัติ";
      icon = <SyncOutlined spin />;
      break;
    case "Cancel":
      color = "silver";
      text = "ยกเลิก";
      icon = <CloseCircleOutlined />;
      break;
    case "Approve":
      color = "LimeGreen";
      text = "อนุมัติแล้ว";
      icon = <CheckCircleOutlined />;
      break;
    case "DisapProved":
      color = "OrangeRed";
      text = "ไม่อนุมัติ";
      icon = <CloseCircleOutlined />;
      break;
    case "Return":
      color = "Gold";
      text = "แจ้งคืนรถแล้ว";
      icon = <ExclamationCircleOutlined />;
      break;
    case "Completed":
      color = "MediumPurple";
      text = "คืนรถสำเร็จ";
      icon = <CheckCircleOutlined />;
      break;
    default:
      color = "default";
      text = "Unknown Status";
      break;
  }
  return (
    <Tag color={color} icon={icon}>
      {text}
    </Tag>
  );
};

export const isSelectDisabled = (status: string) => {
  return status === "Approve" || status === "Return" || status === "Completed" || status === "DisapProved" || status === "Cancel";
};

export const checkStatus = (record: MaCarBookType) => {
  if (record.carBookApprovedStatus === "Approve") {
    message.warning("ไม่สามารถยกเลิกการจองที่อนุมัติได้");
    return true;
  }
  if (record.carBookApprovedStatus === "Return") {
    message.warning("ไม่สามารถยกเลิกการจองที่แจ้งคืนรถได้");
    return true;
  }
  if (record.carBookApprovedStatus === "Completed") {
    message.warning("ไม่สามารถยกเลิกการจองที่คืนรถได้");
    return true;
  }
  if (record.carBookApprovedStatus === "DisapProved") {
    message.warning("ไม่สามารถยกเลิกการจองที่ไม่อนุมัติได้");
    return true;
  }
  if (record.carBookApprovedStatus === "Cancel") {
    message.warning("ยกเลิกการจองนี้ไปแล้ว");
    return true;
  }
};

export const showStatusLeave = () => {
  return (
    <div>
      <Flex gap="4px 4px" wrap>
        <Tag icon={<SyncOutlined spin />} color="DodgerBlue">
          กำลังรออนุมัติ
        </Tag>
        <Tag icon={<CheckCircleOutlined />} color="LimeGreen">
          อนุมัติแล้ว
        </Tag>
        <Tag icon={<CloseCircleOutlined />} color="OrangeRed">
          ไม่อนุมัติ
        </Tag>
        <Tag icon={<MinusCircleOutlined />} color="silver">
          ยกเลิก
        </Tag>
      </Flex>
    </div>
  );
};

export const showStatus = () => {
  return (
    <div>
      <Flex gap="4px 4px" wrap>
        <Tag icon={<SyncOutlined spin />} color="DodgerBlue">
          กำลังรออนุมัติ
        </Tag>
        <Tag icon={<CheckCircleOutlined />} color="LimeGreen">
          อนุมัติแล้ว
        </Tag>
        <Tag icon={<CloseCircleOutlined />} color="OrangeRed">
          ไม่อนุมัติ
        </Tag>
        <Tag icon={<ExclamationCircleOutlined />} color="Gold">
          แจ้งคืนรถแล้ว
        </Tag>
        <Tag icon={<CheckCircleOutlined />} color="MediumPurple">
          คืนรถสำเร็จ
        </Tag>
        <Tag icon={<MinusCircleOutlined />} color="silver">
          ยกเลิก
        </Tag>
      </Flex>
    </div>
  );
};

export const showStatusCarPetrol = (carPetrol: string) => {
  if (carPetrol === "high") {
    return <Tag color="green">มาก</Tag>;
  } else if (carPetrol === "medium") {
    return <Tag color="orange">ปานกลาง</Tag>;
  } else if (carPetrol === "low") {
    return <Tag color="red">น้อย</Tag>;
  } else {
    return <Tag color="gray">ไม่ระบุ</Tag>;
  }
};

export const checkApprovedStatus = (record: MaCarBookType) => {
  let ApprovedStatus = "";
  switch (record.carBookApprovedStatus) {
    case "statusApprove":
      ApprovedStatus = "แจ้งคืนรถ";
      break;
    case "Return":
      ApprovedStatus = "แจ้งคืนรถแล้ว";
      break;
    case "Completed":
      ApprovedStatus = "คืนรถสำเร็จ";
      break;
    case "Cancel":
      ApprovedStatus = "ยกเลิกการจองนี้ไปแล้ว";
      break;
    case "DisapProved":
      ApprovedStatus = "ไม่อนุมัติการจองรถ";
      break;
    case "Process":
      ApprovedStatus = "ไม่สามารถแจ้งคืนรถได้";
      break;
    case "Approve":
      ApprovedStatus = "อนุมัติแล้ว";
      break;
    default:
      ApprovedStatus = "ไม่สามารถแจ้งคืนรถได้";
      break;
  }
};

export const checkStatusReturn = (record: MaCarBookType) => {
  if (record.carBookApprovedStatus === "Process") {
    message.warning("ไม่สามาแจ้งรถคืนรถได้");
    return true;
  }
  if (record.carBookApprovedStatus === "Return") {
    message.warning("ไม่สามารถแจ้งรถคืนรถการจองที่แจ้งคืนรถได้");
    return true;
  }
  if (record.carBookApprovedStatus === "Completed") {
    message.warning("ไม่สามารถแจ้งรถคืนรถการจองที่คืนรถได้");
    return true;
  }
  if (record.carBookApprovedStatus === "DisapProved") {
    message.warning("ไม่สามารถแจ้งรถคืนรถการจองที่ไม่อนุมัติได้");
    return true;
  }
  if (record.carBookApprovedStatus === "Cancel") {
    message.warning("ยกเลิกการจองนี้ไปแล้ว");
    return true;
  }
};

export const checkStatusMaCarCancel = (record: MaCarBookType) => {
  const warningMessage =
    record.carBookApprovedStatus === "DisapProved"
      ? "ไม่สามารถยกเลิกการจองที่ไม่อนุมัติได้"
      : record.carBookApprovedStatus === "Return"
        ? "ไม่สามารถยกเลิกการจองที่แจ้งคืนรถได้"
        : record.carBookApprovedStatus === "Completed"
          ? "ไม่สามารถยกเลิกการจองที่คืนรถได้"
          : record.carBookApprovedStatus === "Cancel"
            ? "ยกเลิกการจองนี้ไปแล้ว"
            : null;

  if (warningMessage) {
    message.warning(warningMessage);
    return;
  }
};

export const checkStatusMaCarApprove = (carBookApprovedStatus: string) => {
  const warningMessage =
    carBookApprovedStatus === "Approve"
      ? "อนุมัติการจองนี้ไปแล้ว"
      : carBookApprovedStatus === "Return"
        ? "ไม่สามารถอนุมัติการจองที่แจ้งคืนรถได้"
        : carBookApprovedStatus === "Completed"
          ? "ไม่สามารถอนุมัติการจองที่คืนรถได้"
          : carBookApprovedStatus === "Cancel"
            ? "ไม่สามารถอนุมัติการจองที่ยกเลิกได้ได้"
            : null;

  if (warningMessage) {
    message.warning(warningMessage);
    return;
  }
};

export const CheckStatusLeaveType = (status: string) => {
  let color = "";
  let text = "";
  let icon = null;
  switch (status) {
    case "waiting":
      color = "DodgerBlue";
      text = "รอการอนุมัติ";
      icon = <SyncOutlined spin />;
      break;
    case "cancel":
      color = "silver";
      text = "ยกเลิก";
      icon = <CloseCircleOutlined />;
      break;
    case "approved":
      color = "LimeGreen";
      text = "อนุมัติ";
      icon = <CheckCircleOutlined />;
      break;
    default:
      color = "gray";
      text = "UNKNOWN";
      icon = <MinusCircleOutlined />;
      break;
  }
  return (
    <Tag color={color} icon={icon}>
      {text}
    </Tag>
  );
};

export const checkMaCarBookConfig = async (record: any, carBookStartDate: Date, carBookEndDate: Date) => {
  return (
    (new Date(carBookStartDate) >= new Date(record.carBookStartDate) && new Date(carBookStartDate) < new Date(record.carBookEndDate)) ||
    (new Date(carBookEndDate) > new Date(record.carBookStartDate) && new Date(carBookEndDate) <= new Date(record.carBookEndDate)) ||
    (new Date(carBookStartDate) <= new Date(record.carBookStartDate) && new Date(carBookEndDate) >= new Date(record.carBookEndDate))
  );
};

export const showDataLeave = (values: ITypetypeleave) => {
  return (
    <div className="flex justify-center">
      <Tag className="w-full flex justify-center">{`${values.haveLeaveDays ? values.haveLeaveDays : 0} วัน (${
        values.haveLeaveHours ? values.haveLeaveHours : 0
      } ชม.)`}</Tag>
    </div>
  );
};

export const showDataHaveLeave = (values: ITypetypeleave) => {
  const fullDays = Math.floor(values.limitLeaveLastResult / 8);
  const remaining = values.limitLeaveLastResult % 8;
  const hourRemain = Math.floor(remaining);
  const minuteRemain = Math.round((remaining % 1) * 60) === 30 ? 0.5 : 0;
  const count = hourRemain + minuteRemain;
  return (
    <div className="flex justify-center">
      <Tag className="w-full flex justify-center">{`${fullDays ? fullDays : 0} วัน (${count ? count : 0} ชม.)`}</Tag>
    </div>
  );
};

// export const validateCheckNumberLeave = (row: ITypetypeleave, createdataleaveForm: any, dataHolidayDay: any) => {
//   const isSelected = row.typeId === createdataleaveForm.type_id;
//   const startDate = dayjs(createdataleaveForm.startDate).startOf("day");
//   const endDate = dayjs(createdataleaveForm.endDate).startOf("day");
//   const timeCheck = createdataleaveForm.time_start_check;
//   const startTimeValue = createdataleaveForm.startTime ?? "00:00";
//   const endTimeValue = createdataleaveForm.endTime ?? "00:00";
//   const startTime = dayjs(startTimeValue, "HH:mm");
//   const endTime = dayjs(endTimeValue, "HH:mm");
//   const breakStart = dayjs("12:00", "HH:mm");
//   const breakEnd = dayjs("13:00", "HH:mm");
//   const isSameDay = startDate.isSame(endDate, "day");
//   const diffDays = endDate.diff(startDate, "day") + 1;

//   let days = 0;
//   let hours = 0;
//   if (isSelected) {
//     if (isSameDay) {
//       if (timeCheck) {
//         days = 1;
//       } else if (startTime.isValid() && endTime.isValid() && endTime.isAfter(startTime)) {
//         const leaveDuration = endTime.diff(startTime, "minute") / 60;
//         const isCrossLunchBreak =
//           (startTime.isBefore(breakStart) || startTime.isSame(breakStart)) && (endTime.isAfter(breakEnd) || endTime.isSame(breakEnd));
//         const totalHours = isCrossLunchBreak ? leaveDuration - 1 : leaveDuration;
//         hours = totalHours > 0 ? parseFloat(totalHours.toFixed(2)) : 0;
//       }
//     } else {
//       // หาวันหยุดกับวันเสาร์อาทิตย์
//       const dateStart = new Date(dayjs(createdataleaveForm.startDate).format("YYYY-MM-DD")).getTime();
//       const dateEnd = new Date(dayjs(createdataleaveForm.endDate).format("YYYY-MM-DD")).getTime();
//       const holidayDates = new Set(dataHolidayDay.map((e: any) => new Date(e.holidaysDate).toDateString()));
//       const dayOffSet = new Set<string>();
//       for (let currentDate = new Date(dateStart); currentDate <= new Date(dateEnd); currentDate.setDate(currentDate.getDate() + 1)) {
//         const dateStr = currentDate.toDateString();
//         const dayOfWeek = currentDate.getDay();
//         if (dayOfWeek === 0 || dayOfWeek === 6 || holidayDates.has(dateStr)) {
//           dayOffSet.add(dateStr);
//         }
//       }
//       const dayOffCount = dayOffSet.size;
//       days = diffDays - dayOffCount;
//     }
//   }
//   if (hours >= 8) {
//     days += 1;
//     hours = 0;
//   }
//   const timeText = `${days} วัน (${hours} ชม.)`;
//   return (
//     <div className="flex justify-center ">
//       <Tag className={`w-full flex justify-center `} color={isSelected ? "success" : "default"}>
//         {timeText}
//       </Tag>
//     </div>
//   );
// };

export const validateCheckNumberLeave = (row: ITypetypeleave, createdataleaveForm: any, dataHolidayDay: any) => {
  const isSelected = row.typeId === createdataleaveForm.type_id;

  const startDate = dayjs(createdataleaveForm.startDate).startOf("day");
  const endDate = dayjs(createdataleaveForm.endDate).startOf("day");

  const timeCheck = createdataleaveForm.time_start_check;
  const startTimeValue = createdataleaveForm.startTime ?? "00:00";
  const endTimeValue = createdataleaveForm.endTime ?? "00:00";

  const startTime = dayjs(startTimeValue, "HH:mm");
  const endTime = dayjs(endTimeValue, "HH:mm");

  const breakStart = dayjs("12:00", "HH:mm");
  const breakEnd = dayjs("13:00", "HH:mm");

  const isSameDay = startDate.isSame(endDate, "day");
  const diffDays = endDate.diff(startDate, "day") + 1;

  let days = 0;
  let hours = 0;

  if (isSelected) {
    if (isSameDay) {
      if (timeCheck) {
        days = 1;
      } else if (startTime.isValid() && endTime.isValid() && endTime.isAfter(startTime)) {
        const leaveDuration = endTime.diff(startTime, "minute") / 60;

        const isCrossLunchBreak =
          (startTime.isBefore(breakStart) || startTime.isSame(breakStart)) && (endTime.isAfter(breakEnd) || endTime.isSame(breakEnd));

        const totalHours = isCrossLunchBreak ? leaveDuration - 1 : leaveDuration;

        hours = totalHours > 0 ? parseFloat(totalHours.toFixed(2)) : 0;
      }
    } else {
      // 🟣 ลาคลอด → นับทุกวัน
      if (createdataleaveForm.type_id === 6) {
        days = diffDays;
      } else {
        // 🔵 leave ปกติ
        const dateStart = startDate.toDate().getTime();
        const dateEnd = endDate.toDate().getTime();

        const holidayDates = new Set(dataHolidayDay.map((e: any) => new Date(e.holidaysDate).toDateString()));

        const dayOffSet = new Set<string>();

        for (let currentDate = new Date(dateStart); currentDate <= new Date(dateEnd); currentDate.setDate(currentDate.getDate() + 1)) {
          const dateStr = currentDate.toDateString();
          const dayOfWeek = currentDate.getDay();

          if (
            dayOfWeek === 0 || // Sunday
            dayOfWeek === 6 || // Saturday
            holidayDates.has(dateStr)
          ) {
            dayOffSet.add(dateStr);
          }
        }

        const dayOffCount = dayOffSet.size;
        days = diffDays - dayOffCount;
      }
    }
  }

  // -----------------------------
  // ⏱️ ชั่วโมงเกิน 8 → แปลงเป็นวัน
  // -----------------------------
  if (hours >= 8) {
    days += 1;
    hours = 0;
  }

  const timeText = `${days} วัน (${hours} ชม.)`;

  return (
    <div className="flex justify-center ">
      <Tag className="w-full flex justify-center" color={isSelected ? "success" : "default"}>
        {timeText}
      </Tag>
    </div>
  );
};

// export const validateSgowAllHourLeave = (row: ITypetypeleave, createdataleaveForm: any, rowClassName: any, dataHolidayDay: any) => {
//   const breakStart = dayjs("12:00", "HH:mm");
//   const breakEnd = dayjs("13:00", "HH:mm");
//   const {
//     type_id,
//     startDate: rawStartDate,
//     endDate: rawEndDate,
//     startTime: startTimeValue = "00:00",
//     endTime: endTimeValue = "00:00",
//     time_start_check: timeCheck,
//   } = createdataleaveForm;
//   const isSelected = row.typeId === type_id;
//   const hasDateRange = !!rawStartDate && !!rawEndDate;
//   const startDate = dayjs(rawStartDate).startOf("day");
//   const endDate = dayjs(rawEndDate).startOf("day");
//   const isSameDay = startDate.isSame(endDate, "day");
//   const startTime = dayjs(startTimeValue, "HH:mm");
//   const endTime = dayjs(endTimeValue, "HH:mm");
//   const diffDays = endDate.diff(startDate, "day") + 1;
//   let days = 0;
//   let hours = 0;
//   if (isSelected) {
//     if (isSameDay) {
//       if (timeCheck) {
//         days = 1;
//       } else if (startTime.isValid() && endTime.isValid() && endTime.isAfter(startTime)) {
//         const leaveDuration = endTime.diff(startTime, "minute") / 60;
//         const isCrossLunchBreak = startTime.isBefore(breakEnd) && endTime.isAfter(breakStart);
//         const totalHours = isCrossLunchBreak ? leaveDuration - 1 : leaveDuration;
//         hours = totalHours > 0 ? parseFloat(totalHours.toFixed(2)) : 0;
//       }
//     } else {
//       // หาวันหยุดกับวันเสาร์อาทิตย์
//       const dateStart = new Date(dayjs(createdataleaveForm.startDate).format("YYYY-MM-DD")).getTime();
//       const dateEnd = new Date(dayjs(createdataleaveForm.endDate).format("YYYY-MM-DD")).getTime();
//       const holidayDates = new Set(dataHolidayDay.map((e: any) => new Date(e.holidaysDate).toDateString()));
//       const dayOffSet = new Set<string>();
//       for (let currentDate = new Date(dateStart); currentDate <= new Date(dateEnd); currentDate.setDate(currentDate.getDate() + 1)) {
//         const dateStr = currentDate.toDateString();
//         const dayOfWeek = currentDate.getDay();
//         if (dayOfWeek === 0 || dayOfWeek === 6 || holidayDates.has(dateStr)) {
//           dayOffSet.add(dateStr);
//         }
//       }
//       // คำนวณจำนวนวันทั้งหมด และวันทำงาน
//       const dayOffCount = dayOffSet.size;
//       days = timeCheck ? diffDays - dayOffCount : diffDays - dayOffCount;
//     }
//   }
//   const safeValue = Number(row.haveLeaveDays) || 0;
//   const TotalHours = Number(row.haveLeaveHours) || 0;
//   const baseDays = Math.floor(safeValue);
//   let totalHours = TotalHours + hours;
//   const extraDays = Math.floor(totalHours / 8);
//   totalHours = totalHours % 8;
//   const totalDays = baseDays + days + extraDays;
//   const isOverLimit = totalDays > row.limitLeaveLastResult;
//   const rowClass = rowClassName(row);
//   const color = rowClass === "disabled-row" ? "default" : isSelected && hasDateRange ? (isOverLimit ? "orange-inverse" : "success") : undefined;
//   const displayTime = totalHours > 0 ? `${totalHours} ชม.` : "0 ชม.";
//   return (
//     <div className="flex justify-center">
//       <Tag className="w-full flex justify-center" color={color}>
//         {`${totalDays} วัน (${displayTime})`}
//       </Tag>
//     </div>
//   );
// };

export const validateSgowAllHourLeave = (row: ITypetypeleave, createdataleaveForm: any, rowClassName: any, dataHolidayDay: any) => {
  const breakStart = dayjs("12:00", "HH:mm");
  const breakEnd = dayjs("13:00", "HH:mm");

  const {
    type_id,
    startDate: rawStartDate,
    endDate: rawEndDate,
    startTime: startTimeValue = "00:00",
    endTime: endTimeValue = "00:00",
    time_start_check: timeCheck,
  } = createdataleaveForm;

  const isSelected = row.typeId === type_id;
  const hasDateRange = !!rawStartDate && !!rawEndDate;

  const startDate = dayjs(rawStartDate).startOf("day");
  const endDate = dayjs(rawEndDate).startOf("day");

  const isSameDay = startDate.isSame(endDate, "day");

  const startTime = dayjs(startTimeValue, "HH:mm");
  const endTime = dayjs(endTimeValue, "HH:mm");

  const diffDays = endDate.diff(startDate, "day") + 1;

  let days = 0;
  let hours = 0;

  if (isSelected) {
    if (isSameDay) {
      if (timeCheck) {
        days = 1;
      } else if (startTime.isValid() && endTime.isValid() && endTime.isAfter(startTime)) {
        const leaveDuration = endTime.diff(startTime, "minute") / 60;

        const isCrossLunchBreak = startTime.isBefore(breakEnd) && endTime.isAfter(breakStart);

        const totalHours = isCrossLunchBreak ? leaveDuration - 1 : leaveDuration;

        hours = totalHours > 0 ? parseFloat(totalHours.toFixed(2)) : 0;
      }
    } else {
      if (type_id === 6) {
        days = diffDays;
      } else {
        const dateStart = startDate.toDate().getTime();
        const dateEnd = endDate.toDate().getTime();
        const holidayDates = new Set(dataHolidayDay.map((e: any) => new Date(e.holidaysDate).toDateString()));

        const dayOffSet = new Set<string>();

        for (let currentDate = new Date(dateStart); currentDate <= new Date(dateEnd); currentDate.setDate(currentDate.getDate() + 1)) {
          const dateStr = currentDate.toDateString();
          const dayOfWeek = currentDate.getDay();

          if (
            dayOfWeek === 0 || // Sunday
            dayOfWeek === 6 || // Saturday
            holidayDates.has(dateStr)
          ) {
            dayOffSet.add(dateStr);
          }
        }

        const dayOffCount = dayOffSet.size;
        days = diffDays - dayOffCount;
      }
    }
  }

  // -----------------------------
  // 🧮 รวมชั่วโมงเดิม + ใหม่
  // -----------------------------
  const safeValue = Number(row.haveLeaveDays) || 0;
  const TotalHours = Number(row.haveLeaveHours) || 0;

  const baseDays = Math.floor(safeValue);

  let totalHours = TotalHours + hours;

  const extraDays = Math.floor(totalHours / 8);
  totalHours = totalHours % 8;

  const totalDays = baseDays + days + extraDays;

  const isOverLimit = totalDays > row.limitLeaveLastResult;

  const rowClass = rowClassName(row);

  const color = rowClass === "disabled-row" ? "default" : isSelected && hasDateRange ? (isOverLimit ? "orange-inverse" : "success") : undefined;

  const displayTime = totalHours > 0 ? `${totalHours} ชม.` : "0 ชม.";

  return (
    <div className="flex justify-center">
      <Tag className="w-full flex justify-center" color={color}>
        {`${totalDays} วัน (${displayTime})`}
      </Tag>
    </div>
  );
};

export const validateOnlyNumbers = (rule: any, value: any, callback: any) => {
  if (value === undefined) {
    callback();
  } else {
    if (/\s/.test(value)) {
      callback("ห้ามใช้เว้นวรรค");
    } else if (isNaN(value)) {
      callback("กรุณากรอกเฉพาะตัวเลข");
    } else {
      callback();
    }
  }
};
