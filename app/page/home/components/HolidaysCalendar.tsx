import React, { useState, useEffect } from "react";
import { Alert, Calendar } from "antd";
import axios from "axios";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

export interface props {}

const HolidaysCalendarComponent: React.FC<props> = (): React.ReactElement => {
  const [value, setValue] = useState(() => dayjs());
  const [selectedValue, setSelectedValue] = useState(() => dayjs());
  const [holidays, setHolidays] = useState<{ date: Dayjs; name: string }[]>([]);
  const [isHolidaySelected, setIsHolidaySelected] = useState(false);
  const [holidayName, setHolidayName] = useState<string | null>(null);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await axios.get(
          `https://calendarific.com/api/v2/holidays?&api_key=LLiN3LnZeoqxhqoioo89X6u1e5Vbf2Bv&country=TH&year=2024`
        );
        const holidaysData = response.data.response.holidays.map(
          (holiday: any) => ({
            date: dayjs(holiday.date.iso),
            name: holiday.name,
          })
        );
        setHolidays(holidaysData);
      } catch (error) {
        console.error("Error fetching holidays", error);
      }
    };
    fetchHolidays();
  }, []);

  const getHolidayName = (date: Dayjs) => {
    const holiday = holidays.find((holiday) =>
      holiday.date.isSame(date, "day")
    );
    return holiday ? holiday.name : null;
  };

  const dateFullCellRender = (current: Dayjs) => {
    const holidayName = getHolidayName(current);
    return (
      <div
        className="ant-picker-cell-inner"
        style={{
          height: "25px",
          width: "25px",
          display: "flex",
          borderRadius: "50%",
          justifyContent: "center",
          alignItems: "center",
          margin: '15px',
        }}
      >
        {holidayName ? (
          <div
            style={{
              backgroundColor: "#ff4d4f",
              height: "25px",
              width: "25px",
              color: "#fff",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {current.date()}
          </div>
        ) : (
          current.date()
        )}
      </div>
    );
  };

  const onSelect = (newValue: Dayjs) => {
    setValue(newValue);
    setSelectedValue(newValue);
    const holidayName = getHolidayName(newValue);
    setIsHolidaySelected(!!holidayName);
    setHolidayName(holidayName);
  };

  const onPanelChange = (newValue: Dayjs) => {
    setValue(newValue);
  };

  return (
    <div>
      <Calendar
        value={value}
        onSelect={onSelect}
        onPanelChange={onPanelChange}
        fullCellRender={dateFullCellRender}
      />
      {isHolidaySelected && (
        <Alert
          style={{ backgroundColor: "#ff4d4f", color:"#fff", marginTop: "16px" }}
          message={`${selectedValue?.format("YYYY-MM-DD")} (${holidayName})`}
          type="error"
        />
      )}
    </div>
  );
};

export default HolidaysCalendarComponent;
