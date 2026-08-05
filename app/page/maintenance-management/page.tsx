"use client";
import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Card, Col, Divider, Row, Spin, TablePaginationConfig, Tabs } from "antd";
import MaCalendarComponent from "./components/MaCalendar";
import MaFilterComponent from "./components/MaFilter";
import MaTableComponent from "./components/MaTable";
import { ITMaTask, ITMaType } from "./common";
import Link from "next/link";
import { saveAs } from "file-saver";
import MaServices from "./services/ma.service";
import dayjs from "dayjs";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import MasterHolidaysService from "../setting/master-holidays/services/index.service";
import { notifySuccess } from "@/app/utils/message";
export default function MaTaskPage() {
  const { id24Axios } = useId24();
  const baseUrIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const baseUrlReport = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_REPORT);
  const maServices = MaServices(baseUrIntranet);
  const reportServices = MaServices(baseUrlReport);
  const [search, setSearch] = useState<object>({});
  const [loading, setloading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [dataTable, setDataTable] = useState<ITMaTask[]>([]);
  const [maTabs, setMamaTabs] = useState<ITMaType[]>([]);
  const startDayOfMonth = dayjs().startOf("month").toDate();
  const lastDayOfMonth = dayjs().endOf("month").toDate();
  const [rangeCalendar, setRangeCalendar] = useState<{
    start: Date;
    end: Date;
  }>({ start: startDayOfMonth, end: lastDayOfMonth });
  const [calendarEvents, setCalendarEvents] = useState<ITMaTask[]>([]);
  useEffect(() => {
    defaultData();
  }, []);
  useEffect(() => {
    if (loading === true) fetchData();
  }, [loading]);

  useEffect(() => {
    getEventData();
  }, [rangeCalendar]);
  const defaultData = async () => {
    const type = await maServices.findActiveType();
    setMamaTabs([{ id: 0, name: "ทั้งหมด" }, ...type]);
  };
  const getEventData = async () => {
    if (rangeCalendar?.start && rangeCalendar?.end) {
      const event = await maServices.findMaTaskByRange(rangeCalendar.start, rangeCalendar.end);
      const yearNow = dayjs().format("YYYY");
      const holidayService = MasterHolidaysService(baseUrIntranet);
      const holidayData = await holidayService.getHolidayByYear(yearNow);
      const holidayMappedData: any = holidayData.map((item: any) => ({
        id: item.id,
        maName: item.holidaysName,
        maDate: item.holidaysDate,
        detail: "",
        maStatus: "holiday",
      }));
      const allEvents = [...event, ...holidayMappedData];
      setCalendarEvents(allEvents);
    }
  };
  const fetchData = async () => {
    const skip: number = (Number(pagination.current) - 1) * Number(pagination.pageSize);
    const take: number = Number(pagination.pageSize);
    const res = await maServices.findMaDataTable({
      take: take,
      skip: skip,
      search: search,
    });

    setDataTable(res.data);
    setPagination({ ...pagination, total: res.count });
    setloading(false);
  };

  const changePagination = (page: TablePaginationConfig) => {
    setPagination({ ...page });
    setloading(true);
  };
  function handdleChangeTab(typeId: string): void {
    if (typeId === "0") {
      setSearch({ typeid: {} });
    } else {
      setSearch({ typeid: typeId });
    }
    setloading(true);
  }
  async function exportMa(filter: any): Promise<void> {
    const searchExport = { ...search, ...filter };
    const response = await reportServices.exportMaReport({
      search: searchExport,
    });
    const blob = new Blob([response], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `รายงานการดำเนินการMA-${dayjs(new Date()).format("YYYYMMDDHHmmss")}.xlsx`);
    notifySuccess("report.export");
  }
  function searchMa(filter: any): void {
    setSearch({ ...search, ...filter });
    setloading(true);
  }
  function handleCalendarChange(range: any): void {
    setRangeCalendar(range);
  }

  return (
    <Spin spinning={loading}>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page",
                title: <span>หน้าหลัก</span>,
              },
              {
                title: <span>Maintenance Mangement</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0" style={{ padding: "0px 0px 0px 0px", marginBottom: "0px", marginTop: "0px" }}>
          <div className="title-page-font">{`Maintenance Mangement`}</div>
        </Divider>
        <Col span={24}>
          <Card styles={{ body: { padding: "10px" } }}>
            <Tabs
              tabBarExtraContent={
                <Link href={"/page/maintenance-management/create"}>
                  <Button type="primary">เพิ่ม MA</Button>
                </Link>
              }
              defaultActiveKey="1"
              destroyInactiveTabPane
              // type="card"
              size={"small"}
              items={[
                {
                  label: `ข้อมูล Maintenance รายเดือน`,
                  key: "1",
                  children: (
                    <div>
                      <MaCalendarComponent calendarEvents={calendarEvents} handleCalendarChange={handleCalendarChange} />
                    </div>
                  ),
                },
                {
                  label: `การจัดการ Maintenance`,
                  key: "2",
                  children: (
                    <Tabs
                      tabPosition={"left"}
                      onChange={handdleChangeTab}
                      destroyInactiveTabPane={true}
                      items={maTabs.map((type, i) => {
                        return {
                          label: `${type.name}`,
                          key: String(type.id),
                          children: (
                            <div className=" space-y-3">
                              <MaFilterComponent exportMa={exportMa} searchMa={searchMa} />
                              <MaTableComponent
                                dataTable={dataTable}
                                loading={loading}
                                setLoading={(e: boolean) => setloading(e)}
                                pagination={pagination}
                                changePagination={changePagination}
                              />
                            </div>
                          ),
                        };
                      })}
                    />
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </Spin>
  );
}
