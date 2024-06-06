"use client";
import React, { useState } from "react";
import { Breadcrumb, Col, Row } from "antd";

import { TableBrand } from "./components/TableBrand";
import { FilterBrand } from "./components/FilterBrand";

export default function Brand() {
  const [loading, setloading] = useState<boolean>(true);
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
                href: "/page/setting",
                title: <span>Setting</span>,
              },
              {
                title: <span>Set Brand </span>,
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <div className="title-page-font">{`SET BRAND`}</div>
        </Col>
        <Col span={24}>
          <div className="grid grid-cols-1 ">
            <div>
              <FilterBrand onCloseDialog={(e: boolean) => setloading(e)} />
            </div>
            <div>
              <TableBrand onCloseDialog={(e: boolean) => setloading(e)} loading={loading} />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
