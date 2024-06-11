"use client";
import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Card, Col, message, Row, Spin, TablePaginationConfig, Tabs } from "antd";
import MaCalendarComponent from "./components/MaCalendar";
import MaFilterComponent from "./components/MaFilter";
import MaTableComponent from "./components/MaTable";
import { ITMaTask, ITMaType } from "./common";
import Link from "next/link";
import { useAxiosIntranet, useAxiosReport } from "@/app/lib/axios/hooks/userAxiosAuth";
import MaServices from "./services/ma.service";
import dayjs from "dayjs";
export default function MaTaskPage() {
  const intranetAuth = useAxiosIntranet();
  const reportAuth = useAxiosReport();
  const maServices = MaServices(intranetAuth);
  const reportServices = MaServices(reportAuth);
  const [search, setSearch] = useState<object>({});
  const [loading, setloading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<TablePaginationConfig>({ current: 1, pageSize: 10, total: 20 });
  const [dataTable, setDataTable] = useState<ITMaTask[]>([]);
  const [maTabs, setMamaTabs] = useState<ITMaType[]>([]);
  const startDayOfMonth = dayjs().startOf("month").toDate();
  const lastDayOfMonth = dayjs().endOf("month").toDate();
  const [rangeCalendar, setRangeCalendar] = useState<{ start: Date; end: Date }>({ start: startDayOfMonth, end: lastDayOfMonth });
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
      setCalendarEvents(event);
    }
  };
  const fetchData = async () => {
    const skip: number = (Number(pagination.current) - 1) * Number(pagination.pageSize);
    const take: number = Number(pagination.pageSize);
    const res = await maServices.findMaDataTable({ take: take, skip: skip, search: search });
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
    const response = await reportServices.exportMaReport({ search: searchExport });
    const blob = new Blob([response], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `รายงานการดำเนินการMA-${dayjs(new Date()).format("YYYYMMDDHHmmss")}.xlsx`;
    link.click();
    message.success("สำเร็จ");
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
                title: <span>Home</span>,
              },
              {
                title: <span>Maintenance Mangement</span>,
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <div className="title-page-font">{`MAINTENANCE MANAGEMENT`}</div>
        </Col>

        <Col span={24}>
          <Card>
            <Tabs
              tabBarExtraContent={
                <Link href={"/page/maintenance-management/create"}>
                  <Button type="primary">เพิ่ม MA</Button>
                </Link>
              }
              defaultActiveKey="1"
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
