"use client";
import axios from "axios";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Breadcrumb, Card, Col, Row, TabsProps, Tabs, Button, Divider, TablePaginationConfig } from "antd";
import { useSession } from "next-auth/react";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { MaCarServices } from "../../../services/ma-car.service";
import { MaCarType, MaCarBookType, dataMaCarbook, ProvincesType } from "../common/index";
import CalendarComponent from "./components/car-calendar";
import MaCarTable from "./components/car-table";
import CarStatus from "./components/car-status";

const MaCar: React.FC = () => {
  const { data: session } = useSession();
  const intraAuth = useAxiosIntranet();
  const intraAuthService = MaCarServices(intraAuth);
  const [maCarBookData, setMaCarBookData] = useState<dataMaCarbook[]>([]);
  const [maFetchCalendar, setMaFetchCalendar] = useState([]);
  const [maCarData, setMaCarData] = useState<MaCarType[]>([]);
  const [maCarBookById, setMaCarBookById] = useState<MaCarBookType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataProvinces, setDataProvinces] = useState<ProvincesType[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    if (loading) fetchData();
  }, [loading]);

  const fetchData = async () => {
    const skip: number = (Number(pagination.current) - 1) * Number(pagination.pageSize);
    const take: number = Number(pagination.pageSize);
    try {
      const maCar = await intraAuthService.getMaCarQuery();
      const userId = session?.user.userId;
      const maCarBook = await intraAuthService.findMaCarBook(userId, skip, take);
      const maCalender = await intraAuthService.getMaCarBookQuery(userId);
      const maCarBookById = await intraAuthService.findMaCarBookById(userId);
      const response = await axios.get("https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province.json");
      const provincesData = response.data;
      const optionsProvinces = provincesData.map((event: ProvincesType) => ({
        value: event.id,
        label: event.name_th,
      }));
      setDataProvinces(optionsProvinces);
      setMaCarBookById(maCarBookById);
      setMaCarData(maCar);
      setMaCarBookData(maCarBook);
      setMaFetchCalendar(maCalender);
      setPagination({ ...pagination, total: maCarBook.count });
      setLoading(false);
    } catch (error) {}
  };

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
          maCarBookById={maCarBookById}
          dataProvinces={dataProvinces}
        />
      ),
    },
    {
      key: "3",
      label: "สถานะรถ",
      children: <CarStatus maCarData={maCarData} />,
    },
  ];

  return (
    <>
      <Row>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page/home",
                title: <span>หน้าหลัก</span>,
              },
              {
                title: <span>ข้อมูลการจองรถยนต์</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font" style={{ display: "flex", alignItems: "left" }}>
            <span style={{ marginRight: "8px" }}>ข้อมูลการจองรถยนต์</span>
          </div>
        </Divider>
        <Col span={24}>
          <div className="grid-span-1 space-y-2">
            <Card styles={{ body: { padding: "0px 10px 10px 10px" } }}>
              <div className="flex justify-end space-x-1" style={{ position: "relative", top: "35px", zIndex: 10 }}>
                <Link href="/page/macar/ma-car-booking?action=1">
                  <Button type="primary" size="middle">
                    {`ทำการจองรถ`}
                  </Button>
                </Link>
                <Link href="/page/macar/ma-car-booking?action=2">
                  <Button type="primary" size="middle" danger>
                    {`คืนรถ`}
                  </Button>
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
