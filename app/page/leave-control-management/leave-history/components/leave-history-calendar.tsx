import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import React, { useState } from "react";
import { Form, message } from "antd";
import { Calendar, momentLocalizer, Event as RbcEvent } from "react-big-calendar";
import { ITypeDataLeave } from "../../common";
import { dateToStringThNoTime } from "@/app/utils/format";
import { LeaveHistoryCalendarDetail } from "./leave-history-calendar-detail";
import { checkIcon } from "@/components/icon";

interface CustomEvent extends RbcEvent {
  id: number | undefined;
  title: string;
  status: string;
  start: Date;
  end: Date;
  description: string;
  userName: string | undefined;
  typeId: string | undefined;
}

export interface Props {
  dataSource: ITypeDataLeave[];
  downloadFile: (id: number, filename: string) => void;
}

export const DepartmentCalendarDetail: React.FC<Props> = ({ dataSource, downloadFile }: any) => {
  const [formDetail] = Form.useForm();
  const localizer = momentLocalizer(moment);
  const [modalDataLeaveDetail, setModalDataLeaveDetail] = useState(false);

  const onCancelModalDetail = () => {
    setModalDataLeaveDetail(false);
  };

  const onSelectEventCalendar = (event: CustomEvent) => {
    if (event.status === "holiday") {
      message.info(event.title);
      return false;
    }
    const dataLeaveCalendar = dataSource.find((b: any) => b.id === event.id);
    if (dataLeaveCalendar) {
      formDetail.setFieldsValue({
        ...dataLeaveCalendar,
        name: `${dataLeaveCalendar.firstName} ${dataLeaveCalendar.lastName}`,
        detail: dataLeaveCalendar.detail,
        typeLeave: dataLeaveCalendar.typeName,
        leaveHour: dataLeaveCalendar.leaveHour
          ? dataLeaveCalendar.leaveHour % 8 === 0
            ? `${dataLeaveCalendar.leaveHour / 8} วัน`
            : `${dataLeaveCalendar.leaveHour} ชม.`
          : "ไม่มีข้อมูล",
        startDate: dataLeaveCalendar.startDate ? dateToStringThNoTime(dataLeaveCalendar.startDate) : "-",
        endDate: dataLeaveCalendar.endDate ? dateToStringThNoTime(dataLeaveCalendar.endDate) : "-",
        createAt: dataLeaveCalendar.createdAt ? dateToStringThNoTime(dataLeaveCalendar.createdAt) : "-",
        approvedDate: dataLeaveCalendar.approvedDate ? dateToStringThNoTime(dataLeaveCalendar.approvedDate) : "-",
        phoneNumber: dataLeaveCalendar.phoneNumber,
        userApproved: dataLeaveCalendar.userApproved,
        dataLeaveFiles: dataLeaveCalendar.dataLeaveFiles,
        ownerId: dataLeaveCalendar.ownerId,
        ownerName: dataLeaveCalendar.ownerName,
      });
      setModalDataLeaveDetail(true);
    }
  };

  const CustomEventComponent = ({ event }: { event: CustomEvent }) => {
    return (
      <span>
        {event.status === "approved" && <span style={{ color: "gold" }}>{checkIcon}</span>} {event.title}
      </span>
    );
  };

  const getColorByUserId = (userObj: any) => {
    // แปลง object เป็น string เพื่อใช้สร้าง hash
    const idString = JSON.stringify(userObj);

    let hash = 0;
    for (let i = 0; i < idString.length; i++) {
      hash = idString.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = Math.abs(hash) % 360; // ค่าสี H (0-360)
    const saturation = 65; // ความเข้มสี (%)
    const lightness = 50; // ความสว่าง (%)

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  return (
    <div>
      {modalDataLeaveDetail ? (
        <LeaveHistoryCalendarDetail
          modalDataLeaveDetail={modalDataLeaveDetail}
          onCancelModalDetail={onCancelModalDetail}
          formDetail={formDetail}
          downloadFile={downloadFile}
        />
      ) : null}
      <Calendar<CustomEvent>
        localizer={localizer}
        events={dataSource.map((dataLeaveCalendar: ITypeDataLeave) => ({
          id: dataLeaveCalendar.id,
          title: `${dataLeaveCalendar.firstName} ${dataLeaveCalendar.lastName} (${dataLeaveCalendar.typeName}) `,
          start: dataLeaveCalendar.startDate ? new Date(dataLeaveCalendar.startDate) : null,
          end: dataLeaveCalendar.endDate ? new Date(dataLeaveCalendar.endDate) : null,
          status: dataLeaveCalendar.status,
          description: dataLeaveCalendar?.description || "",
          userName: dataLeaveCalendar.typeName,
          typeId: dataLeaveCalendar.typeId,
        }))}
        messages={{
          next: ">",
          previous: "<",
        }}
        style={{ height: 500 }}
        onSelectEvent={onSelectEventCalendar}
        components={{
          event: CustomEventComponent,
        }}
        eventPropGetter={(event: CustomEvent) => {
          let backgroundColor = "orange";

          if (event.status === "approved") {
            backgroundColor = getColorByUserId(event.typeId?.toString());
          } else if (event.status === "cancel") {
            backgroundColor = "silver";
          }
          return {
            style: {
              backgroundColor,
              color: "#fff",
              fontSize: 10,
            },
          };
        }}
      />
    </div>
  );
};
