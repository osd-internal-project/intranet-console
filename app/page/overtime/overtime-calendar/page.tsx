"use client";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import SlideImageService from "../../home/services/index.service";
import Calendar from "./components/calendar";
interface THoliday {
  id: number;
  holidaysName: string;
  masterHolidaysYearId: number;
  holidaysDate: string;
  createdAt: string;
  updatedAt: string;
}

export default function OverTimeCalendatPage() {
  const { id24Axios } = useId24();
  const baseUrlUser = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_INTRANET);
  const [holiday, setHoliday] = useState<THoliday[]>([]);
  useEffect(() => {
    featchDataHoliday(dayjs(new Date()).format("YYYY"));
  }, []);

  const featchDataHoliday = async (year: string) => {
    const holiday = await SlideImageService(baseUrlUser).getHoliday(year);
    setHoliday(holiday);
  };

  return (
    <div>
      <Calendar holiday={holiday} featchDataHoliday={featchDataHoliday} />
    </div>
  );
}
