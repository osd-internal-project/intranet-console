"use client";
import { Breadcrumb, Col, Row } from "antd";
import React from "react";
import dynamic from "next/dynamic";

const Organizational = dynamic(() => import("./components/organizational"), {
  ssr: false,
});

export default function Pages() {
  return (
    <Row>
      <Col span={24}>
        <Breadcrumb
          items={[
            {
              href: "/page",
              title: <span>Home</span>,
            },

            {
              title: <span>organize-chart</span>,
            },
          ]}
        />
      </Col>
      <Col span={24}>
        <div className="title-page-font">{`Organize Chart`}</div>
      </Col>
      <Organizational />
    </Row>
  );
}
