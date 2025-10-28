import React, { useState, useEffect } from "react";
import { createStyles } from "antd-style";
import { Alert, Button, Calendar, CalendarProps, Select, Space } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import classNames from "classnames";
import SlideImageService from "../services/index.service";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";

export interface props {}

const useStyle = createStyles(({ token, css, cx }) => {
  const lunar = css`
    color: #fff;
    font-size: ${token.fontSizeSM}px;
  `;
  const weekend = css`
    color: #ddd;
    &.gray {
      opacity: 0.4;
    }
  `;
  const holiday = css`
    border-radius: 5px;
    max-width: 40px;
    max-height: 40px;
    background: red;
    margin: auto;
    color: #fff;
    opacity: 0.7;
  `;
  return {
    wrapper: css`
      width: 450px;
      border: 1px solid ${token.colorBorderSecondary};
      border-radius: ${token.borderRadiusOuter};
      padding: 5px;
    `,
    dateCell: css`
      position: relative;
      &:before {
        content: "";
        position: absolute;
        inset-inline-start: 0;
        inset-inline-end: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        max-width: 40px;
        max-height: 40px;
        background: transparent;
        transition: background-color 300ms;
        border-radius: ${token.borderRadiusOuter}px;
        border: 1px solid transparent;
        box-sizing: border-box;
      }
      &:hover:before {
        background: rgba(0, 0, 0, 0.04);
      }
    `,
    today: css`
      &:before {
        border: 1px solid ${token.colorPrimary};
      }
    `,
    text: css`
      position: relative;
      z-index: 1;
    `,
    lunar,
    current: css`
      color: ${token.colorTextLightSolid};
      &:before {
        background: ${token.colorPrimary};
      }
      &:hover:before {
        background: ${token.colorPrimary};
        opacity: 0.8;
      }
      .${cx(lunar)} {
        color: ${token.colorTextLightSolid};
        opacity: 0.9;
      }
      .${cx(weekend)} {
        color: ${token.colorTextLightSolid};
      }
      .${cx(holiday)} {
        color: ${token.colorTextLightSolid};
      }
    `,
    monthCell: css`
      width: 120px;
      color: ${token.colorTextBase};
      border-radius: ${token.borderRadiusOuter}px;
      padding: 5px 0;
      &:hover {
        background: rgba(0, 0, 0, 0.04);
      }
    `,
    monthCellCurrent: css`
      color: ${token.colorTextLightSolid};
      background: ${token.colorPrimary};
      &:hover {
        background: ${token.colorPrimary};
        opacity: 0.8;
      }
    `,
    weekend,
    holiday,
  };
});

interface THoliday {
  id: number;
  holidaysName: string;
  masterHolidaysYearId: number;
  holidaysDate: string;
  createdAt: string;
  updatedAt: string;
}

const HolidaysCalendarComponent: React.FC<props> = (): React.ReactElement => {
  const { id24Axios } = useId24();
  const baseUrIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const intraAuthService = SlideImageService(baseUrIntranet);
  const { styles } = useStyle({ test: true });
  const [selectDate, setSelectDate] = useState<Dayjs>(dayjs());
  const [panelDateDate, setPanelDate] = useState<Dayjs>(dayjs());
  const [holiday, setHoliday] = useState<THoliday[]>([]);
  const [resultHoliday, setResultHoliday] = useState<string[]>([]);

  useEffect(() => {
    featchDataHoliday(dayjs(new Date()).format("YYYY"));
  }, []);

  const featchDataHoliday = async (year: string) => {
    const holiday = await intraAuthService.getHoliday(year);
    setHoliday(holiday);
  };

  const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>["mode"]) => {
    setPanelDate(value);
  };

  const onDateChange: CalendarProps<Dayjs>["onSelect"] = (value, selectInfo) => {
    if (selectInfo.source === "date") {
      const holidaySelect = holiday
        .filter((item: THoliday) => dayjs(new Date(item.holidaysDate)).format("YYYY-MM-DD") === dayjs(value).format("YYYY-MM-DD"))
        .map((item: THoliday) => item.holidaysName);
      setResultHoliday(holidaySelect && holidaySelect);
      setSelectDate(value);
    } else {
      const year = dayjs(value).format("YYYY");
      featchDataHoliday(year);
    }
  };

  const cellRender: CalendarProps<Dayjs>["fullCellRender"] = (date, info) => {
    const isWeekend = date.day() === 6 || date.day() === 0;
    const isHoliday =
      holiday && holiday.find((event) => dayjs(new Date(event.holidaysDate)).format("YYYY-MM-DD") === dayjs(date).format("YYYY-MM-DD"))
        ? true
        : false;

    if (info.type === "date") {
      return React.cloneElement(info.originNode, {
        ...info.originNode.props,
        className: classNames(styles.dateCell, {
          [styles.current]: selectDate.isSame(date, "date"),
          [styles.today]: date.isSame(dayjs(), "date"),
        }),
        children: (
          <div
            className={classNames({
              [styles.text]: true,
              [styles.holiday]: isHoliday,
            })}>
            <span
              className={classNames({
                [styles.weekend]: isWeekend,
                // [styles.holiday]: isHoliday,
                gray: !panelDateDate.isSame(date, "month"),
              })}>
              {date.get("date")}
            </span>
            {info.type === "date" && <div className={styles.lunar}>-</div>}
          </div>
        ),
      });
    }
    if (info.type === "month") {
      return (
        <div
          className={classNames(styles.monthCell, {
            [styles.monthCellCurrent]: selectDate.isSame(date, "month"),
          })}>
          {dayjs(date).format("MMM")}
        </div>
      );
    }
  };
  return (
    <>
      <div className={` max-w-full ${styles.wrapper}`}>
        <Calendar
          value={panelDateDate}
          fullCellRender={cellRender}
          fullscreen={false}
          onPanelChange={onPanelChange}
          onSelect={onDateChange}
          headerRender={({ value, type, onChange }) => {
            const prevMonth = () => {
              const newDate = value.subtract(1, "month");
              setPanelDate(newDate);
              onChange?.(newDate);
            };
            const nextMonth = () => {
              const newDate = value.add(1, "month");
              setPanelDate(newDate);
              onChange?.(newDate);
            };

            // Generate year and month options
            const years = Array.from({ length: 10 }, (_, i) => dayjs().year() - 5 + i);
            const months = Array.from({ length: 12 }, (_, i) => ({
              value: i,
              label: dayjs().month(i).format("MMM"),
            }));

            return (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 8px", marginBottom: 8 }}>
                <div style={{ display: "flex", gap: 4 }}>
                  <Space>
                    <Button onClick={prevMonth}>←</Button>
                    <Button onClick={nextMonth}>→</Button>
                  </Space>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <Select
                    value={value.year()}
                    onChange={(year) => {
                      const newDate = value.year(year);
                      setPanelDate(newDate);
                      onChange?.(newDate);
                    }}
                    style={{ width: 100 }}>
                    {years.map((year) => (
                      <Select.Option key={year} value={year}>
                        {year}
                      </Select.Option>
                    ))}
                  </Select>
                  <Select
                    value={value.month()}
                    onChange={(month) => {
                      const newDate = value.month(month);
                      setPanelDate(newDate);
                      onChange?.(newDate);
                    }}
                    style={{ width: 100 }}>
                    {months.map((month) => (
                      <Select.Option key={month.value} value={month.value}>
                        {month.label}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              </div>
            );
          }}
        />
        {resultHoliday[0] ? <Alert type="warning" message={`${resultHoliday.map((item: string) => `${item}`)}`} /> : <></>}
      </div>
    </>
  );
};

export default HolidaysCalendarComponent;
