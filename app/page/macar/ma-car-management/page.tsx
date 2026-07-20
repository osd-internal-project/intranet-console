"use client";
import { Breadcrumb, Card, Col, Divider, Row, Tabs, TabsProps, TablePaginationConfig, Form } from "antd";
import React, { useEffect, useState } from "react";
import ManageCar from "./components/management-car-booking/management-car-booking";
import { ManageCarServices } from "./services/manage-car.service";
import { MaCarBookType, MaCarType, dataMaCarbook } from "../common/index";
import ManagementCarAvailable from "./components/management-car-available/management-car-available.tsx";
import ReportFeulCard from "./components/report-fuelcard/report-fuelcard";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";

const ManageMaCar = () => {
  const { id24Axios } = useId24();
  const baseUrIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const [filterForm] = Form.useForm();
  const [openFilter, setOpenFilter] = useState<boolean>(false);
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
  const [filters, setFilters] = useState<{ carBookApprovedStatus?: string; carBookStartDate?: Date | string; createdByName?: string }>({
    carBookApprovedStatus: "",
    carBookStartDate: "",
    createdByName: "",
  });
  const changePagination = (page: TablePaginationConfig) => {
    setPagination({ ...page });
    setLoading(true);
  };

  useEffect(() => {
    if (loading) fetchData();
  }, [loading, maCarBookAll]);

  const fetchData = async () => {
    const skip: number = (Number(pagination.current) - 1) * Number(pagination.pageSize);
    const take: number = Number(pagination.pageSize);
    try {
      const MaCarBook = await ManageCarServices(baseUrIntranet).findMaCarBookForApprove(filters, skip, take);
      const MaCar = await ManageCarServices(baseUrIntranet).getMaCarQuery();
      setMaCarBookData(MaCarBook);
      setMaCarBookAll(MaCarBook.docs);
      setmaCarData(MaCar);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  const handleOpenFilter = (value: boolean) => {
    setOpenFilter(value);
  };

  const onSearch = (value: { carBookApprovedStatus?: string; carBookStartDate?: Date | string; createdByName?: string }) => {
    const { carBookApprovedStatus, carBookStartDate, createdByName } = value || {};
    let filter = {};
    if (carBookApprovedStatus) {
      filter = { ...filter, carBookApprovedStatus };
    }
    if (carBookStartDate) {
      filter = { ...filter, carBookStartDate };
    }
    if (createdByName) {
      filter = { ...filter, createdByName };
    }
    setFilters(filter);
    setPagination({ current: 1, pageSize: 10, total: 0 });
    setLoading(true);
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
          handleOpenFilter={handleOpenFilter}
          openFilter={openFilter}
          filterForm={filterForm}
          onSearch={onSearch}
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
      key: "4",
      label: "การเติมน้ำมัน",
      children: <ReportFeulCard />,
    },
    // {
    //   key: "4",
    //   label: "เช็คสภาพรถ",
    //   children: <ManagementCarWrapup />,
    // },
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
                title: <span>การจัดการรถยนต์</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font" style={{ display: "flex", alignItems: "left" }}>
            <span style={{ marginRight: "8px" }}>การจัดการรถยนต์</span>
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
