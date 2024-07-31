"use client";

import React, { useState, useEffect } from "react";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import {
  Breadcrumb,
  Card,
  Col,
  Row,
  TabsProps,
  Tabs,
  Button,
  Divider,
  TablePaginationConfig,
} from "antd";
import CalendarComponent from "./components/CarCalendar";
import MaCarTable from "./components/CarTable";
import CarStatus from "./components/CarStatus";
import { MaCarServices } from "./services/ma-car.service";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { MaCarType, MaCarBookType } from "../common/index";

const MaCar: React.FC = () => {
  const { data: session } = useSession();
  const intraAuth = useAxiosIntranet();
  const maCarServices = MaCarServices(intraAuth);
  const [maCarBookData, setMaCarBookData] = useState<MaCarBookType[]>([]);
  const [maFetchCalendar, setMaFetchCalendar] = useState([]);
  const [maCarData, setMaCarData] = useState<MaCarType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const changePagination = (page: TablePaginationConfig) => {
    setPagination({ ...page });
    setLoading(true);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "แสดงข้อมูลแบบปฎิทิน",
      children: <CalendarComponent maFetchCalendar={maFetchCalendar} />,
    },
    {
      key: "2",
      label: "แสดงข้อมูลแบบตาราง",
      children: (
        <MaCarTable
          maCarBookData={maCarBookData}
          pagination={pagination}
          changePagination={changePagination}
          loading={loading}
          setLoading={setLoading}
          maCarData={maCarData}
        />
      ),
    },
    {
      key: "3",
      label: "สถานะรถ",
      children: <CarStatus maCarData={maCarData} setLoading={setLoading} />,
    },
  ];

  const fetchData = async () => {
    const skip: number =
      (Number(pagination.current) - 1) * Number(pagination.pageSize);
    const take: number = Number(pagination.pageSize);
    try {
      const maCar = await maCarServices.getMaCarQuery();
      setMaCarData(maCar);

      const createdById = session?.user.userId;

      const maCarBook = await maCarServices.findMaCarBook(createdById);

      const maCalender = await maCarServices.getMaCarBookQuery(createdById);

      setMaCarBookData(maCarBook);
      setMaFetchCalendar(maCalender);
      setPagination({ ...pagination, total: maCarBook.count });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (loading) fetchData();
  }, [loading]);

  return (
    <>
      <Row>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page",
                title: <span>Home</span>,
              },
              {
                title: <span>Ma Car Details</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div
            className="title-page-font"
            style={{ display: "flex", alignItems: "left" }}
          >
            <span style={{ marginRight: "8px" }}>Ma Car Details</span>
          </div>
        </Divider>
        <Col span={24}>
          <div className="grid-span-1 space-y-2">
            <Card>
              <div className="flex justify-end space-x-4">
                {" "}
                <Link href="/page/macar/ma-car-booking?action=1">
                  <Button type="primary">ทำการจองรถ</Button>
                </Link>
                <Link href="/page/macar/ma-car-booking?action=2">
                  <Button type="primary">คืนรถ</Button>
                </Link>
              </div>

              <Tabs defaultActiveKey="1" items={items} />
            </Card>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default MaCar;
