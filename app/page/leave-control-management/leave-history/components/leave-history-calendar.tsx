import "../../styles/style.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
// import "moment/locale/TH";
import React, { useState } from "react";
import { Form } from "antd";
import { Calendar, momentLocalizer, Event as RbcEvent } from "react-big-calendar";
import { ITypeDataLeave } from "../../common";
import { dateToStringThNoTime } from "@/app/utils/format";
import { LeaveHistoryCalendarDetail } from "./leave-history-calendar-detail";
// moment.locale("TH");

interface CustomEvent extends RbcEvent {
  id: number | undefined;
  title: string;
  status: string;
  start: Date;
  end: Date;
  description: string;
  userName: string | undefined;
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
          title: dataLeaveCalendar.firstName,
          start: dataLeaveCalendar.startDate ? new Date(dataLeaveCalendar.startDate) : null,
          end: dataLeaveCalendar.endDate ? new Date(dataLeaveCalendar.endDate) : null,
          status: dataLeaveCalendar.status,
          description: dataLeaveCalendar?.description || "",
          userName: dataLeaveCalendar.typeName,
        }))}
        messages={{
          next: "เดือนถัดไป",
          previous: "เดือนที่แล้ว",
          today: "วันนี้",
          month: "เดือน",
          week: "สัปดาห์",
          day: "วัน",
          agenda: "กำหนดการ",
        }}
        style={{ height: 500 }}
        onSelectEvent={onSelectEventCalendar}
        eventPropGetter={(event: CustomEvent) => {
          const backgroundColor = event.status === "approved" ? "DodgerBlue" : event.status === "cancel" ? "silver" : "DodgerBlue";
          return {
            style: { backgroundColor, color: "#fff", fontSize: 10 },
          };
        }}
      />
    </div>
  );
};
