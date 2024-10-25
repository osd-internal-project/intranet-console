import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Flex, message, Tag } from "antd";
import { MaCarBookType } from "../page/macar/common";
import dayjs from "dayjs";

export const validatesUploadfileImage = (
  rule: any,
  value: string,
  callback: any
) => {
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
  return (
    status === "Approve" ||
    status === "Return" ||
    status === "Completed" ||
    status === "DisapProved" ||
    status === "Cancel"
  );
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
      text = "WAITING";
      icon = <SyncOutlined spin />;
      break;
    case "cancel":
      color = "silver";
      text = "CANCEL";
      icon = <CloseCircleOutlined />;
      break;
    case "approved":
      color = "LimeGreen";
      text = "APPROVED";
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


