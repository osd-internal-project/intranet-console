"use client";
import { Breadcrumb, Card, Col, Divider, Row } from "antd";
import React from "react";
import dynamic from "next/dynamic";

const Organizational = dynamic(() => import("./components/organizational"), {
  ssr: false,
});

export default function Pages() {
  return (
    <Row>
      <Breadcrumb
        items={[
          {
            href: "/page",
            title: <span>หน้าหลัก</span>,
          },

          {
            title: <span>Organization Chart</span>,
          },
        ]}
      />
      <Divider orientation="left" orientationMargin="0">
        <div className="title-page-font">{`Organization Chart`}</div>
      </Divider>
      <Organizational />
    </Row>
  );
}
