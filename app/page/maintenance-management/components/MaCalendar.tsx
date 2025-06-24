import React, { useEffect, useRef } from "react";
import { Calendar, momentLocalizer, Event, View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
// import "../style.css";
import { useRouter } from "next/navigation";
import { ITMaTask } from "../common";
import { title } from "process";
import { message } from "antd";
import { checkIcon } from "@/components/icon";
const localizer = momentLocalizer(moment);
export interface props {
  calendarEvents: ITMaTask[];
  handleCalendarChange: (range: any) => void;
}
const MaCalendarComponent: React.FC<props> = ({ calendarEvents, handleCalendarChange }): React.ReactElement => {
  const router = useRouter();

  const dayPropGetter = (date: any) => {
    const day = date.getDay();
    if (day === 0 || day === 6) {
      return {
        className: "weekend-day",
      };
    }
    return {};
  };

  const onSelectEventCalendar = (event: any) => {
    if (event.status === "holiday") {
      message.info(event.title);
      return false;
    }
    router.push(`/page/maintenance-management/${event.id}`);
  };

  const CustomEventComponent = ({ event }: { event: any }) => {
    return (
      <span>
        {event.status === "success" && <span style={{ color: "gold" }}>{checkIcon}</span>} {event.title}
      </span>
    );
  };

  return (
    <div>
      <Calendar
        messages={{
          next: ">",
          previous: "<",
        }}
        localizer={localizer}
        popup
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        views={["month"]}
        events={calendarEvents.map((ma) => ({
          id: ma.id,
          title: ma.maName,
          start: new Date(ma.maDate),
          end: new Date(ma.maDate),
          status: ma.maStatus,
        }))}
        components={{
          event: CustomEventComponent,
        }}
        style={{ height: 500 }}
        dayPropGetter={dayPropGetter}
        onSelectEvent={onSelectEventCalendar}
        // onSelectEvent={(event) => router.push(`/page/maintenance-management/${event.id}`)}
        eventPropGetter={(event) => {
          if (event.status === "success") {
            return {
              style: { backgroundColor: " #4CAF50", color: "#fff", fontSize: 10 },
            };
          } else if (event.status === "cancel") {
            return {
              style: { backgroundColor: "#D24545", color: "#fff", fontSize: 10 },
            };
          } else if (event.status === "holiday") {
            return {
              style: { backgroundColor: "#FFA500", color: "#fff", fontSize: 10 },
            };
          } else {
            return {
              style: { backgroundColor: "#2196F3", color: "#fff", fontSize: 10 },
            };
          }
        }}
        onRangeChange={handleCalendarChange}
      />
    </div>
  );
};

export default MaCalendarComponent;
