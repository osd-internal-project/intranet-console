"use client";
import { Breadcrumb, Card, Col, Divider, Row, Space } from "antd";
import React, { useState } from "react";
import { FiltersInventory } from "./components/FiltersInventory";
import { TableInventory } from "./components/TableInventory";
import { useSession } from "next-auth/react";

const page = () => {
  const { data: session } = useSession();
  const [search, setSearch] = useState({});
  return (
    <div>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page/dashboard",
                title: <span>หน้าหลัก</span>,
              },
              {
                title: <span>Inventory</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font">{`Inventory`}</div>
        </Divider>
        <Col span={24}>
          <div className="grid grid-cols-1 gap-y-2">
            <Card>
              <FiltersInventory prop={(e) => setSearch(e)} />
              <TableInventory groupID={session} search={search} />
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default page;
