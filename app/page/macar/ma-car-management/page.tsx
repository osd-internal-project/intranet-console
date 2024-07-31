"use client";
import {
  Breadcrumb,
  Card,
  Col,
  Divider,
  Row,
  Tabs,
  TabsProps,
  TablePaginationConfig,
} from "antd";
import React, { useEffect, useState } from "react";
import ManageCar from "./components/manageCar";
import ManageCarStatus from "./components/manageCarStatus";
import MasterType from "./components/status-car/masterType";
import WarpupmaCar from "./components/status-car/WarpupmaCar";
import { ManageCarServices } from "./services/manage-car.service";
import { MaCarBookType, MaCarType } from "../common/index";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";

const ManageMaCar = () => {
  const intraAuth = useAxiosIntranet();
  const manageCarServices = ManageCarServices(intraAuth);
  const [maCarBookData, setMaCarBookData] = useState<MaCarBookType[]>([]);
  const [maCarData, setmaCarData] = useState<MaCarType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "จัดการการจองรถ",
      children: (
        <ManageCar
          maCarBookData={maCarBookData}
          loading={loading}
          setLoading={setLoading}
          pagination={pagination}
        />
      ),
    },
    {
      key: "2",
      label: "จัดการรถ",
      children: (
        <ManageCarStatus
          maCarData={maCarData}
          loading={loading}
          setLoading={setLoading}
          pagination={pagination}
        />
      ),
    },
    {
      key: "3",
      label: "การตรวจเช็ค",
      children: <MasterType />,
    },
    {
      key: "4",
      label: "เช็คสภาพรถ",
      children: <WarpupmaCar />,
    },
  ];

  const fetchData = async () => {
    const skip: number =
      (Number(pagination.current) - 1) * Number(pagination.pageSize);
    const take: number = Number(pagination.pageSize);
    try {
      const MaCarBook = await manageCarServices.findMaCarBook(skip, take);
      setMaCarBookData(MaCarBook);

      const MaCar = await manageCarServices.getMaCarQuery();
      setmaCarData(MaCar);

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch data", error);
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
                title: <span>Ma Car Management</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div
            className="title-page-font"
            style={{ display: "flex", alignItems: "left" }}
          >
            <span style={{ marginRight: "8px" }}>Ma Car Management</span>
          </div>
        </Divider>
        <Col span={24}>
          <div className="grid-span-1 space-y-2">
            <Card>
              <Tabs defaultActiveKey="1" items={items} />
            </Card>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ManageMaCar;
