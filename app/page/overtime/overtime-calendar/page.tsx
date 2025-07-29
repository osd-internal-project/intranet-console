"use client";
import React, { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import SlideImageService from "../../home/services/index.service";
import Calendar from "./components/calendar";
import OverTimeServices from "@/app/services/overtime.service";
import { Breadcrumb, Card, Divider, Form, TablePaginationConfig, Tabs, TabsProps } from "antd";
import { TableOvertime } from "./components/table";
import { IOverTimeForm } from "@/app/common/overtime";
import { ModalOvertimeHistory } from "./components/modal";
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
  const [formDetail] = Form.useForm();
  const [calendar, setCalendar] = useState<IOverTimeForm[]>([]);
  const [month, setMonth] = useState<Dayjs | string>(dayjs());
  const [dataTable, setDataTable] = useState<{ data: IOverTimeForm[]; count: number }>({ data: [], count: 0 });
  const [activekey, setActiveKey] = useState<string>("1");
  const [loading, setloading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [openModal, setOpenModal] = useState<boolean>(false);
  useEffect(() => {
    if (loading) {
      fetchDataHoliday();
    }
  }, [activekey, loading]);

  const changePagination = (page: TablePaginationConfig) => {
    setPagination({ ...page });
    setloading(true);
  };

  const handleChangeMonth = (month: Dayjs | string) => {
    setMonth(month);
    setloading(true);
  };

  const fetchDataHoliday = async () => {
    const yearNow = dayjs().format("YYYY");
    const skip: number = (Number(pagination.current) - 1) * Number(pagination.pageSize);
    const take: number = Number(pagination.pageSize);
    const holiday = await SlideImageService(baseUrlIntra).getHoliday(yearNow);
    const calendar = await OverTimeServices(baseUrlIntra).findCalendar(month);
    const { data, count } = await OverTimeServices(baseUrlIntra).findById(skip, take);
    const mapdataOT = calendar.map((e: IOverTimeForm) => {
      return {
        ...e,
        startTime: e.startTime,
        endTime: e.endTime,
        type: "ot",
      };
    });
    const mapHoliday = holiday.map((e: any) => {
      const mapData = {
        ...e,
        dateStart: e.holidaysDate,
        detailWork: e.holidaysName,
        type: "holiday",
        startTime: "",
        endTime: "",
      };
      return mapData;
    });
    const merged = [...mapdataOT, ...mapHoliday];
    setDataTable({ data, count });
    setCalendar(merged);
    setloading(false);
  };

  const handleOpenModal = (status: boolean, data: IOverTimeForm | null) => {
    if (status === false) {
      formDetail.resetFields();
    }
    formDetail.setFieldsValue({
      ...data,
      dateStart: data?.dateStart ? dayjs(data?.dateStart) : null,
      startTime: data?.startTime,
      endTime: data?.endTime,
      approvedDate: data?.approvedDate ? dayjs(data?.approvedDate) : null,
      createdAt: data?.createdAt ? dayjs(data?.createdAt) : null,
      updatedAt: data?.updatedAt ? dayjs(data?.updatedAt) : null,
    });
    setOpenModal(status);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "ปฏิทินทำงานล่วงเวลา",
      children: <Calendar calendar={calendar} fetchDataHoliday={fetchDataHoliday} handleChangeMonth={handleChangeMonth} />,
    },
    {
      key: "2",
      label: "ตารางรายละเอียดการทำงานล่วงเวลา",
      children: <TableOvertime dataTable={dataTable} changePagination={changePagination} pagination={pagination} handleOpenModal={handleOpenModal} />,
    },
  ];

  const onChange = (key: string) => {
    setActiveKey(key);
    if (key === "1") {
      fetchDataHoliday();
    }
  };

  return (
    <div>
      <div className="mb-4">
        <Breadcrumb
          items={[
            {
              href: "/page",
              title: <span>หน้าหลัก</span>,
            },
            {
              title: <span>Over Time</span>,
            },
            {
              title: <span>รายละเอียดการทำงานล่วงเวลา</span>,
            },
          ]}
        />
        <Divider orientation="left" orientationMargin="0" style={{ padding: "0px 0px 0px 0px", marginBottom: "0px", marginTop: "0px" }}>
          <div className="title-page-font">{`Overtime`}</div>
        </Divider>
      </div>
      <Card styles={{ body: { padding: "10px" } }} className="w-full h-full">
        <Tabs activeKey={activekey} items={items} onChange={onChange} destroyInactiveTabPane={false} type="card" />
      </Card>
      {openModal ? <ModalOvertimeHistory formDetail={formDetail} openModal={openModal} handleOpenModal={handleOpenModal} /> : null}
    </div>
  );
}
