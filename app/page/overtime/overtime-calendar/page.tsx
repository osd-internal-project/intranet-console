"use client";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import SlideImageService from "../../home/services/index.service";
import Calendar from "./components/calendar";
import OverTimeServices from "@/app/services/overtime.service";
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
  const baseUrlIntra = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_INTRANET);
  const [holiday, setHoliday] = useState<THoliday[]>([]);
  useEffect(() => {
    featchDataHoliday(dayjs(new Date()).format("YYYY"));
  }, []);

  const featchDataHoliday = async (year: string) => {
    const holiday = await SlideImageService(baseUrlIntra).getHoliday(year);
    const overtime = await OverTimeServices(baseUrlIntra).findAll();
    const mapdataOT = overtime.map((e: any) => {
      return {
        ...e,
        holidaysDate: e.dateStart,
        holidaysName: e.detailWork,
      };
    });
    const merged = [...holiday, ...mapdataOT];

    setHoliday(merged);
  };

  return (
    <div>
      <Calendar holiday={holiday} featchDataHoliday={featchDataHoliday} />
    </div>
  );
}
