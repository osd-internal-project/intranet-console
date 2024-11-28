"use client";
import { Breadcrumb, Button, Card, Col, Divider, Row, Table } from "antd";
import TableMasterProduct from "./components/TableMasterProduct";
import { useState } from "react";
import Link from "next/link";
export default function MasterProductPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const propLoading = (load: boolean, searchText: string) => {
    setLoading(load);
    setSearchText(searchText);
  };
  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Breadcrumb
          items={[
            {
              href: "/page",
              title: <span>หน้าหลัก</span>,
            },
            {
              href: "/page/stock-management",
              title: <span>Stock Management</span>,
            },
            {
              title: <span>Master Product Manangement</span>,
            },
          ]}
        />
      </Col>

      <Divider orientation="left" orientationMargin="0">
        <div className="title-page-font">{`Master Product Manangement`}</div>
      </Divider>
      <Col span={24}>
        <TableMasterProduct />
      </Col>
    </Row>
  );
}
