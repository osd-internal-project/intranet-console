"use client";
import { Breadcrumb, Card, Col, Divider, Row, Tabs } from "antd";
import Link from "next/link";

import { useEffect, useState } from "react";
export default function VenderCetagory() {
  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Breadcrumb
          items={[
            {
              title: <Link href={"/page"}>Home</Link>,
            },
            {
              title: <span>Vender</span>,
            },
            {
              title: <span>Cetagory & Group</span>,
            },
          ]}
        />
      </Col>
      <Col span={24}>
        <div className="title-page-font">{`Cetagory & Group`}</div>
      </Col>

      <Col span={24}>
        <div className="grid grid-cols-1 ">
          <Card></Card>
        </div>
      </Col>
    </Row>
  );
}
