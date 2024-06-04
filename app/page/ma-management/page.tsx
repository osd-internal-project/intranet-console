"use client";
import React, { useState } from "react";
import { Breadcrumb, Card, Col, Row } from "antd";
import MaTableComponent from "./components/MaTable";
import { ITMaDetail, ITPagination } from "./common";

export default function MaTaskPage() {
  const [loading, setloading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<ITPagination>({ current: 1, pageSize: 10 });
  const dataTable: ITMaDetail[] = [
    {
      id: 1,
      maName: "task 1",
      maStatus: "process",
      maTypeId: 1,
      maTypeName: "แจ้งซ้อม",
      maDate: new Date(),
      detail: "ทดสอบ",
      contact: "บริษัท",
      remake: "รอดำเนินการ",
      updatedDate: new Date(),
      createdDate: new Date(),
    },
    {
      id: 2,
      maName: "task 2",
      maStatus: "success",
      maTypeId: 2,
      maTypeName: "ตรวจสภาพ",
      maDate: new Date(),
      detail: "ทดสอบ",
      contact: "บริษัท",
      remake: "สำเร็จ",
      updatedDate: new Date(),
      createdDate: new Date(),
    },
    {
      id: 3,
      maName: "task 3",
      maStatus: "cancel",
      maTypeId: 2,
      maTypeName: "ตรวจสภาพ",
      maDate: new Date(),
      detail: "ทดสอบ",
      contact: "บริษัท",
      remake: "ยกเลิก",
      updatedDate: new Date(),
      createdDate: new Date(),
    },
  ];
  const changePagination = (page: ITPagination) => {
    console.log(page);
  };
  return (
    <div>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page",
                title: <span>Home</span>,
              },
              {
                href: "/page/ma-management",
                title: <span>MA Mangement</span>,
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <div className="title-page-font">{`MA MANAGEMENT`}</div>
        </Col>
        <Col span={24}>
          <div className="grid grid-cols-1 ">
            <Card>
              <MaTableComponent dataTable={dataTable} loading={loading} setLoading={(e: boolean) => setloading(e)} pagination={pagination} changePagination={changePagination} />
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}
