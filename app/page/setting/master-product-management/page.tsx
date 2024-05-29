"use client";
import { Breadcrumb, Button, Card, Col, Row, Table } from "antd";
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
              title: <span>Home</span>,
            },
            {
              href: "/page/setting",
              title: <span>Setting</span>,
            },
            {
              title: <span>Master Product Manangement</span>,
            },
          ]}
        />
      </Col>
      <Col span={24}>
        <div className="title-page-font">{`MASTER PRODUCT MANAGEMENT`}</div>
      </Col>
      <Col span={24}>
        <TableMasterProduct />
      </Col>
    </Row>
  );
}
