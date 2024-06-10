import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

//Original Thai Events
const holidays = [
  { date: "01-01", name: "New Year's Day" },
  { date: "02-19", name: "Makha Bucha Day" },
  { date: "04-06", name: "Chakri Memorial Day" },
  { date: "04-13", name: "Songkran Festival" },
  { date: "04-14", name: "Songkran Festival" },
  { date: "04-15", name: "Songkran Festival" },
  { date: "05-01", name: "Labour Day" },
  { date: "05-05", name: "Coronation Day" },
  { date: "05-15", name: "Royal Ploughing Ceremony Day" },
  { date: "06-03", name: "Queen Suthida's Birthday" },
  { date: "07-28", name: "King Maha Vajiralongkorn's Birthday" },
  { date: "08-12", name: "Queen Sirikit's Birthday" },
  { date: "10-13", name: "King Bhumibol Memorial Day" },
  { date: "10-23", name: "Chulalongkorn Day" },
  { date: "12-05", name: "King Bhumibol's Birthday" },
  { date: "12-10", name: "Constitution Day" },
  { date: "12-31", name: "New Year's Eve" },
];

function getHolidaysForYear(year: number): { date: Date; name: string }[] {
  return holidays.map((holiday) => ({
    date: moment(`${year}-${holiday.date}`, "YYYY-MM-DD").toDate(),
    name: holiday.name,
  }));
}

const year = 2024;
const holidayEvents = getHolidaysForYear(year).map((holiday) => ({
  title: holiday.name,
  start: holiday.date,
  end: holiday.date,
  allDay: true,
}));

//New Events
const events = [
  {
    title: "End of Internship",
    start: new Date(2024, 5, 14, 0, 0),
    end: new Date(2024, 5, 14, 23, 59),
  },
];

const allEvents = [...events, ...holidayEvents];

const HolidaysCalendarComponent: React.FC = () => {
  const localizer = momentLocalizer(moment);

  return (
    <div style={{ height: 500 }}>
      <Calendar
        localizer={localizer}
        events={allEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
};

export default HolidaysCalendarComponent;
