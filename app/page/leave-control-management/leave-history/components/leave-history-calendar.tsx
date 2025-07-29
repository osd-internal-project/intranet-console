import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import React, { useState } from "react";
import { Form, message } from "antd";
import { Calendar, momentLocalizer, Event as RbcEvent } from "react-big-calendar";
import { ITypeDataLeave } from "../../common";
import { dateToStringThNoTime } from "@/app/utils/format";
import { LeaveHistoryCalendarDetail } from "./leave-history-calendar-detail";
import { checkIcon, loadingIcon } from "@/components/icon";
import dayjs, { Dayjs } from "dayjs";

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

const colorOfType = [
  { bgcolor: "#A8D5BA", id: 1, text: "#000000" },
  { bgcolor: "#B0AFAF", id: 2, text: "#000000" },
  { bgcolor: "#AEDFF7", id: 3, text: "#000000" },
  { bgcolor: "#FF5E5E", id: 4, text: "#FFFFFF" },
  { bgcolor: "#4A90E2", id: 5, text: "#FFFFFF" },
  { bgcolor: "#F7C8E0", id: 6, text: "#000000" },
  { bgcolor: "#FAD6A5", id: 7, text: "#000000" },
  { bgcolor: "#5A5A5A", id: 8, text: "#FFFFFF" },
  { bgcolor: "#F4A261", id: 9, text: "#000000" },
  { bgcolor: "#DDB892", id: 10, text: "#000000" },
  { bgcolor: "#007A3D", id: 11, text: "#FFFFFF" },
  { bgcolor: "#4B5320", id: 12, text: "#FFFFFF" },
  { bgcolor: "#9D7CBF", id: 13, text: "#FFFFFF" },
];

export interface Props {
  handleChangemonth: (value: Dayjs) => void;
  dataSource: ITypeDataLeave[];
  downloadFile: (id: number, filename: string) => void;
}

export const DepartmentCalendarDetail: React.FC<Props> = ({ handleChangemonth, dataSource, downloadFile }: any) => {
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
    const icon = event.status === "approved" ? checkIcon : event.status === "holiday" ? null : loadingIcon;
    return (
      <span className="flex justify-start items-center gap-1 text-[10px] text-white overflow-hidden">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span className="truncate">{event.title}</span>
      </span>
    );
  };

  const getBgColorByTypeId = (TypeId: any) => {
    const matchedColor = colorOfType.find((item) => item.id === Number(TypeId));
    return matchedColor ? matchedColor.bgcolor : "#FFA500";
  };
  const getColorByTypeId = (TypeId: any) => {
    const matchedColor = colorOfType.find((item) => item.id === Number(TypeId));
    return matchedColor ? matchedColor.text : "#ffff";
  };

  const dayPropGetter = (date: any) => {
    const day = date.getDay();
    if (day === 0 || day === 6) {
      return {
        className: "weekend-day",
      };
    }
    return {};
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
        style={{ height: 500 }}
        localizer={localizer}
        popup
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        views={["month"]}
        events={dataSource.map((dataLeaveCalendar: ITypeDataLeave) => {
          return {
            id: dataLeaveCalendar.id,
            title: `${dataLeaveCalendar.firstName} ${dataLeaveCalendar.lastName} (${dataLeaveCalendar.typeName}) `,
            start: dataLeaveCalendar.startDate ? new Date(dataLeaveCalendar.startDate as any) : null,
            end: dataLeaveCalendar.endDate ? new Date(dataLeaveCalendar.endDate as any) : null,
            status: dataLeaveCalendar.status,
            description: dataLeaveCalendar?.description || "",
            userName: dataLeaveCalendar.typeName,
            typeId: dataLeaveCalendar.typeId,
          };
        })}
        messages={{
          next: ">",
          previous: "<",
        }}
        onSelectEvent={onSelectEventCalendar}
        components={{
          event: CustomEventComponent,
        }}
        dayPropGetter={dayPropGetter}
        eventPropGetter={(event: CustomEvent) => {
          let backgroundColor = "#FFA500";
          let color = "#ffff";
          if (event.status === "approved") {
            backgroundColor = getBgColorByTypeId(event.typeId?.toString());
            color = getColorByTypeId(event.typeId?.toString());
          } else {
            backgroundColor = getBgColorByTypeId(event.typeId?.toString());
            color = getColorByTypeId(event.typeId?.toString());
          }
          return {
            style: {
              backgroundColor,
              color,
              fontSize: 10,
            },
          };
        }}
        onNavigate={(newDate, view, action) => {
          handleChangemonth(dayjs(newDate));
        }}
      />
    </div>
  );
};
