import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, MinusCircleOutlined, SyncOutlined } from "@ant-design/icons";
import { Flex, message, Tag } from "antd";
import { MaCarBookType } from "../page/macar/common";
import dayjs from "dayjs";
import { ITypeDataLeaveCreate, ITypetypeleave } from "../page/leave-control-management/common";
import { IFindAllDayDto } from "../page/setting/master-holidays/common";

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

export const validateCheckEndDate = (startDate: any, endDate: any, TypeLeave: number) => {
  if (!TypeLeave) {
    return Promise.reject(new Error("โปรดเลือกประเภทการลาก่อนเสมอ"));
  }
  if (!endDate) {
    return Promise.reject(new Error("กรุณาเลือกวันที่สิ้นสุดการลา"));
  } else if (!startDate) {
    return Promise.reject(new Error("กรุณาเลือกวันที่เริ่มลาก่อน"));
  } else if (!endDate || !startDate || endDate.isAfter(startDate) || endDate.isSame(startDate, "day")) {
    return Promise.resolve();
  }
  return Promise.reject(new Error("วันที่สิ้นสุดต้องเท่ากับหรือหลังจากวันที่เริ่ม"));
};

export const validateCheckLeaveDay = (leavedata: ITypeDataLeaveCreate[], dataMasterType: ITypetypeleave, startWork: string) => {
  let totalLeaveHours = 0;
  let defaultcanLeave = 0;
  leavedata.forEach((e: ITypeDataLeaveCreate) => {
    totalLeaveHours += e.leaveHour;
  });
  const startwork = dayjs(startWork);
  const dateNow = dayjs(new Date());
  const yearOfWork = dateNow.diff(startwork, "years");
  if (yearOfWork <= 1) {
    defaultcanLeave += Number(dataMasterType.limitLeaveFour) * 8;
  } else if (yearOfWork < 3) {
    defaultcanLeave += Number(dataMasterType.limitLeaveOne) * 8;
  } else if (yearOfWork < 5) {
    defaultcanLeave += Number(dataMasterType.limitLeaveThree) * 8;
  } else {
    defaultcanLeave += Number(dataMasterType.limitLeaveTwo) * 8;
  }

  return defaultcanLeave - totalLeaveHours;
};

export const validateSumTotalLeave = (values: ITypeDataLeaveCreate, holidays: IFindAllDayDto[]) => {
  let SumTime: number = 1;
  const dayOffs = [];
  const SumDate = 24 * 60 * 60 * 1000;
  const dateStart = new Date(dayjs(values.startDate).format("YYYY-MM-DD")).getTime();
  const dateEnd = new Date(dayjs(values.endDate).format("YYYY-MM-DD")).getTime();
  if (dayjs(values.endDate).format("YYYY-MM-DD") === dayjs(values.startDate).format("YYYY-MM-DD")) {
    if (values.time_start_check) {
      SumTime = 8;
    } else {
      SumTime = calculateTime(values.startTime, values.endTime);
    }
  } else {
    for (let currentDate = new Date(dateStart); currentDate <= new Date(dateEnd); currentDate.setDate(currentDate.getDate() + 1)) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        dayOffs.push(new Date(currentDate));
      }
      const holidayDates = new Set(holidays.map((e) => new Date(e.holidaysDate).toDateString()));
      if (holidayDates.has(currentDate.toDateString())) {
        dayOffs.push(new Date(currentDate));
      }
    }
    const dayOffCount: number = dayOffs.length;
    const totalDays = Math.floor((dateEnd - dateStart) / SumDate + 1);
    SumTime = (totalDays - dayOffCount) * 8;
  }
  return SumTime;
};

export const calculateTime = (valueStartTime: string, valueEndTime: string) => {
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

export const checkStatusTypeLeave = async (values: ITypeDataLeaveCreate, masterdataTypeLeave: ITypetypeleave[]) => {
  const { type_id, startDate } = values;
  let meassage;
  const SumDate = 24 * 60 * 60 * 1000;
  const dateStart = new Date(dayjs(startDate).format("YYYY-MM-DD")).getTime();
  const DateNow = new Date(dayjs().format("YYYY-MM-DD")).getTime();
  const totalDays = Math.floor((dateStart - DateNow) / SumDate + 1);
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
    case "waitting":
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
