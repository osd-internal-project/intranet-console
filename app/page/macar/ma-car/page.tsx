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

import { MaCarIcon } from "../../../../components/icon";
import CalendarComponent from "./components/CarCalendar";
// import CarComponent from "./components/car";
import TableComponent from "./components/CarTable";
import CarStatusComponent from "./components/CarStatus";
import { MaCarServices } from "./services/ma-car.service";
import { useForm } from "antd/es/form/Form";
import { useSession } from "next-auth/react";
import Link from "next/link";

type MaCarType = {
  id: string; // รหัส
  carId: string; // รหัสรถ
  carName: string; // ชื่อรถ
  carPetrol: string; // ระดับน้ำมัน
  detail: string; // รายละเอียด
  status: string; // สถานะ
  createdAt: Date; // วันที่สร้าง
  createdById: string; // รหัสผู้สร้าง
  createdByName: string; // ชื่อผู้สร้าง
  updatedAt: Date; // วันที่แก้ไขล่าสุด
  updatedById: string; // รหัสผู้แก้ไข
  updatedByName: string; // ชื่อผู้แก้ไข
  carBookProvince: string; // จังหวัดที่จองรถ
  carBookPlace: string; // สถานที่จองรถ
  carBookUsers: number; // จำนวนผู้ใช้ที่จองรถ
  carBookStartDate: Date; // วันที่เริ่มการจองรถ
  carBookEndDate: Date; // วันที่สิ้นสุดการจองรถ
  // carBookStartDate: string; // วันที่เริ่มการจองรถ   71,91
  // carBookEndDate: string; // วันที่สิ้นสุดการจองรถ
  approveDate: string;
  carBookApprovedDate?: Date; // วันที่อนุมัติการจองรถ (อาจจะไม่มีในกรณีที่ยังไม่ได้อนุมัติ)
  carBookApprovedById?: string; // รหัสผู้อนุมัติการจองรถ (อาจจะไม่มีในกรณีที่ยังไม่ได้อนุมัติ)
  carBookApprovedByName?: string; // ชื่อผู้อนุมัติการจองรถ (อาจจะไม่มีในกรณีที่ยังไม่ได้อนุมัติ)
};

type MasterCarType = {
  carName: String;
  carBookApprovedStatus: boolean;
  carBookApprovedById: string;
};

const MaCar: React.FC = () => {
  const { data: session } = useSession();
  const intraAuth = useAxiosIntranet();
  const maCarServices = MaCarServices(intraAuth);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [masterCarData, setMasterCarQuery] = useState<MasterCarType[]>([]);
  const [maFetchData, setMaFetchData] = useState([]);
  const [maFetchCalendar, setMaFetchCalendar] = useState([]);
  const [department, setDepartment] = useState<MaCarType[]>([]);
  const [form] = useForm();
  const [loading, setloading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const changePagination = (page: TablePaginationConfig) => {
    setPagination({ ...page });
    setloading(true);
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
        <TableComponent
          maFetchData={maFetchData}
          pagination={pagination}
          changePagination={changePagination}
        />
      ),
    },
    {
      key: "3",
      label: "สถานะรถ",
      children: <CarStatusComponent />,
    },
  ];

  const fetchData = async () => {
    const skip: number =
      (Number(pagination.current) - 1) * Number(pagination.pageSize);
    const take: number = Number(pagination.pageSize);
    try {
      const maCar = await maCarServices.getMasterCarQuery();
      const masterCarActive = maCar.filter(
        (room: any) => room.roomsStatus === true
      );
      setMasterCarQuery(masterCarActive);
      const maCalender = await maCarServices.getMaCarQuery();
      console.log(maCalender);
      const ma = await maCarServices.findMaCar(skip, take);
      setMaFetchData(ma);
      setMaFetchCalendar(maCalender);
      setPagination({ ...pagination, total: ma.count });
      const organizeChart = await maCarServices.getOrganizeChartQuery();
      const department = organizeChart.filter(
        (organize: any) => organize.type === "department"
      );
      setDepartment(department);
      setloading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (loading === true) fetchData();
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
        <Divider
          orientation="left"
          orientationMargin="0"
          // style={{ backgroundColor: "#6CB4EE", color: "#EEEEEE" }}
        >
          {/* <div
            className="title-page-font"
            style={{ display: "flex", alignItems: "center" }}
          >
            {MaCarIcon}
            <span style={{ marginLeft: "8px" }}>จองรถออนไลน์</span>
          </div> */}
          <div
            className="title-page-font"
            style={{ display: "flex", alignItems: "left" }}
          >
            <span style={{ marginRight: "8px" }}>Ma Car Details</span>
            {/* {MaCarIcon} */}
          </div>
        </Divider>
        <Col span={24}>
          <div className="grid-span-1 space-y-2">
            <Card>
              <div className="flex justify-end">
                <Link href="/page/macar/ma-car-booking">
                  <Button type="primary"> ทำการจองรถ</Button>
                </Link>
                {/* <a href="/page/macar/ma-car-management">
                  <Button type="primary"> ทำการจองรถ</Button>
                </a> */}
              </div>
              {/* <Tabs defaultActiveKey1="1" items1={items1} /> */}

              <Tabs defaultActiveKey="1" items={items} />
            </Card>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default MaCar;
