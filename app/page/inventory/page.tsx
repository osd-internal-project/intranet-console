"use client";
import { Breadcrumb, Card, Col, Row, Space } from "antd";
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
                title: <span>Home</span>,
              },
              {
                title: <span>Inventory</span>,
              },
            ]}
          />
        </Col>
        <Col span={24} className=" md:flex md:space-x-4 ">
          <div className="title-page-font  ">{`INVENTORY`}</div>
        </Col>
        <Col span={24}>
          <div className="grid grid-cols-1 gap-y-2">
            <div>
              <FiltersInventory prop={(e) => setSearch(e)} />
            </div>
            <Card>
              <TableInventory groupID={session} search={search} />
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default page;
