import React, { useEffect, useRef } from "react";
import { Calendar, momentLocalizer, Event, View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../style.css";
import { useRouter } from "next/navigation";
import { ITMaTask } from "../common";
import { title } from "process";
const localizer = momentLocalizer(moment);
export interface props {
  calendarEvents: ITMaTask[];
  handleCalendarChange: (range: any) => void;
}
const MaCalendarComponent: React.FC<props> = ({ calendarEvents, handleCalendarChange }): React.ReactElement => {
  const router = useRouter();

  // const handleViewChange = (view: View) => {
  //   console.log("Current view:", view);
  // };

  // const handleCalendarChange = (range: any) => {
  //   console.log("Current range:", range);
  //   // setCurrentRange(range);
  // };
  return (
    <div>
      <Calendar
        localizer={localizer}
        events={calendarEvents.map((ma) => ({ id: ma.id, title: ma.maName, start: new Date(ma.maDate), end: new Date(ma.maDate), status: ma.maStatus }))}
        style={{ height: 500 }}
        onSelectEvent={(event) => router.push(`/page/maintenance-management/${event.id}`)}
        eventPropGetter={(event) => {
          if (event.status === "success") {
            return {
              style: { backgroundColor: " #4CAF50", color: "#fff", fontSize: 10 },
            };
          } else if (event.status === "cancel") {
            return {
              style: { backgroundColor: "#D24545", color: "#fff", fontSize: 10 },
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
