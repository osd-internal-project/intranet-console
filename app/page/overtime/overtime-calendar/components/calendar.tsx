import React, { useState } from "react";
import { Badge, BadgeProps, Calendar, CalendarProps, Tag } from "antd";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

export interface props {
  holiday: any;
  featchDataHoliday: (value: string) => void;
}

interface THoliday {
  id: number;
  holidaysName: string;
  masterHolidaysYearId: number;
  holidaysDate: string;
  createdAt: string;
  updatedAt: string;
}

const CalendarPage: React.FC<props> = ({ holiday, featchDataHoliday }): React.ReactElement => {
  const [selectDate, setSelectDate] = useState<string>("");
  const [panelDateDate, setPanelDate] = useState<Dayjs>(dayjs());
  const [resultHoliday, setResultHoliday] = useState<string[]>([]);

  const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>["mode"]) => {
    setPanelDate(value);
  };
  const dateCellRender = (value: Dayjs) => {
    const currentDayHolidays = holiday.filter((item: any) => {
      return dayjs(item.holidaysDate).isSame(value, "day");
    });
    return (
      <>
        {currentDayHolidays.map((item: any) => {
          return (
            <div
              key={item.holidaysName}
              style={{
                textAlign: "center",
                height: "100%",
              }}>
              <Tag color="error" className="font-bold">
                {item.holidaysName}
              </Tag>
            </div>
          );
        })}
      </>
    );
  };

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    // if (info.type === "month") return monthCellRender(current);
    return info.originNode;
  };

  const onDateChange: CalendarProps<Dayjs>["onSelect"] = (value, selectInfo) => {
    setResultHoliday([]);
    if (selectInfo.source === "date") {
      const holidaySelect = holiday
        .filter((item: THoliday) => dayjs(new Date(item.holidaysDate)).format("YYYY-MM-DD") === dayjs(value).format("YYYY-MM-DD"))
        .map((item: THoliday) => item.holidaysName);
      setResultHoliday(holidaySelect && holidaySelect);
    } else {
      const year = dayjs(value).format("YYYY");
      featchDataHoliday(year as any);
    }
    setSelectDate(dayjs(value).format("YYYY-MM-DD"));
    window.location.href = `${window.location.origin}/page/overtime/overtime-form?date=${dayjs(value).format("YYYY-MM-DD")}`;
  };
  return (
    <div>
      <Calendar cellRender={cellRender} onPanelChange={onPanelChange} onSelect={onDateChange} />
    </div>
  );
};

export default CalendarPage;
