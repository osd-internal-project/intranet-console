"use client";
import React, { useState } from "react";
import { Breadcrumb, Card, Col, Row } from "antd";
import MaDescriptionComponent from "./components/ma-description";
import { ITMaDetail, ITPagination } from "../common";

export default function MaTaskPage() {
  const [loading, setloading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<ITPagination>({ current: 1, pageSize: 10 });
  const data: ITMaDetail = {
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
  };
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
          <div className="title-page-font">{`MA DESCRIPTION`}</div>
        </Col>
        <Col span={24}>
          <div className="grid grid-cols-1 ">
            <MaDescriptionComponent data={data} loading={loading} setLoading={(e: boolean) => setloading(e)} />
          </div>
        </Col>
      </Row>
    </div>
  );
}
