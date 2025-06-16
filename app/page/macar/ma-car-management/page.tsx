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
import ManageCar from "./components/management-car-booking/management-car-booking";
import { ManageCarServices } from "./services/manage-car.service";
import { MaCarBookType, MaCarType, dataMaCarbook } from "../common/index";
import ManagementCarAvailable from "./components/management-car-available/management-car-available.tsx";
import ManagementCarMasterdataType from "./components/management-car-masterdata-type/management-car-masterdata-type";
import ManagementCarWrapup from "./components/management-car-wrapup/management-car-wrapup";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";

const ManageMaCar = () => {
  const { id24Axios } = useId24();
  const baseUrIntranet = id24Axios(
    loadAppConfig().REACT_APP_API_BASE_URL_INTRANET
  );
  const [maCarBookData, setMaCarBookData] = useState<dataMaCarbook>({
    total: 0,
    docs: [],
  });
  const [maCarBookAll, setMaCarBookAll] = useState<MaCarBookType[]>([]);
  const [maCarData, setmaCarData] = useState<MaCarType[]>([]);
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

  useEffect(() => {
    if (loading) fetchData();
  }, [loading, maCarBookAll]);

  const fetchData = async () => {
    const skip: number =
      (Number(pagination.current) - 1) * Number(pagination.pageSize);
    const take: number = Number(pagination.pageSize);
    try {
      const MaCarBook = await ManageCarServices(
        baseUrIntranet
      ).findMaCarBookForApprove(skip, take);
      const MaCar = await ManageCarServices(baseUrIntranet).getMaCarQuery();
      setMaCarBookData(MaCarBook);
      setMaCarBookAll(MaCarBook.docs);
      setmaCarData(MaCar);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

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
          changePagination={changePagination}
        />
      ),
    },
    {
      key: "2",
      label: "จัดการรถ",
      children: (
        <ManagementCarAvailable
          maCarData={maCarData}
          loading={loading}
          setLoading={setLoading}
          pagination={pagination}
          changePagination={changePagination}
        />
      ),
    },
    {
      key: "3",
      label: "ประเภทการตรวจสภาพ",
      children: <ManagementCarMasterdataType />,
    },
    {
      key: "4",
      label: "เช็คสภาพรถ",
      children: <ManagementCarWrapup />,
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
                title: <span>ข้อมูลการจองรถยนต์ (แอดมิน)</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div
            className="title-page-font"
            style={{ display: "flex", alignItems: "left" }}
          >
            <span style={{ marginRight: "8px" }}>
              ข้อมูลการจองรถยนต์ (แอดมิน)
            </span>
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
