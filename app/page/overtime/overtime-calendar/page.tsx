"use client";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import SlideImageService from "../../home/services/index.service";
import Calendar from "./components/calendar";
import OverTimeServices from "@/app/services/overtime.service";
import { Card, TablePaginationConfig, Tabs, TabsProps } from "antd";
import { TableOvertime } from "./components/table";
export interface THoliday {
  id: number;
  holidaysName: string;
  masterHolidaysYearId: number;
  holidaysDate: string;
  createdAt: string;
  updatedAt: string;
  type?: string;
}

export default function OverTimeCalendatPage() {
  const { id24Axios } = useId24();
  const baseUrlIntra = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_INTRANET);
  const [holiday, setHoliday] = useState<THoliday[]>([]);
  const [activekey, setActiveKey] = useState<string>("1");
  const [loading, setloading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  useEffect(() => {
    if (loading) fetchDataHoliday(dayjs(new Date()).format("YYYY"));
  }, [activekey, loading]);

  const changePagination = (page: TablePaginationConfig) => {
    setPagination({ ...page });
    setloading(true);
  };

  const fetchDataHoliday = async (year: string) => {
    const skip: number = (Number(pagination.current) - 1) * Number(pagination.pageSize);
    const take: number = Number(pagination.pageSize);
    const holiday = await SlideImageService(baseUrlIntra).getHoliday(year);
    const overtime = await OverTimeServices(baseUrlIntra).findById(skip, take);
    const mapdataOT = overtime.map((e: any) => {
      return {
        ...e,
        holidaysDate: e.dateStart,
        holidaysName: e.detailWork,
        type: "ot",
      };
    });
    const merged = [...holiday, ...mapdataOT];
    setHoliday(merged);
    setloading(false);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Calendar",
      children: <Calendar holiday={holiday} fetchDataHoliday={fetchDataHoliday} />,
    },
    {
      key: "2",
      label: "Table",
      children: <TableOvertime holiday={holiday} changePagination={changePagination} pagination={pagination} />,
    },
  ];

  const onChange = (key: string) => {
    setActiveKey(key);
    if (key === "1") {
      fetchDataHoliday(dayjs().format("YYYY"));
    }
  };

  return (
    <div>
      <Card styles={{ body: { padding: "10px" } }} className="w-full h-full">
        <Tabs activeKey={activekey} items={items} onChange={onChange} destroyInactiveTabPane={false} type="card" />
      </Card>
    </div>
  );
}
