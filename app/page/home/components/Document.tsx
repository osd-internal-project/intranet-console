import { MinusOutlined, RightOutlined } from "@ant-design/icons";
import { Card } from "antd";
import React from "react";

export interface props {}

const DocumentComponent: React.FC<props> = (): React.ReactElement => {
  return (
    <div style={{ textAlign: "left" }}>
      <Card
        style={{ marginBottom: 16, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
        type="inner"
        title="ประกาศที่ 1"
      >
        <div style={{ display: "flex" }}>
          <a href="#" style={{ marginRight: 10 }}>
            <MinusOutlined /> ดาวน์โหลด
          </a>
          <p style={{ fontStyle: "italic" }}>01-April-2020</p>
        </div>
      </Card>
      <Card
        style={{ marginBottom: 16, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
        type="inner"
        title="ประกาศที่ 2"
      >
        <div style={{ display: "flex" }}>
          <a href="#" style={{ marginRight: 10 }}>
            <MinusOutlined /> ดาวน์โหลด
          </a>
          <p style={{ fontStyle: "italic" }}>01-April-2020</p>
        </div>
      </Card>
      <Card
        style={{ marginBottom: 16, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
        type="inner"
        title="ประกาศที่ 3"
      >
        <div style={{ display: "flex" }}>
          <a href="#" style={{ marginRight: 10 }}>
            <MinusOutlined /> ดาวน์โหลด
          </a>
          <p style={{ fontStyle: "italic" }}>01-April-2020</p>
        </div>
      </Card>
      <Card
        style={{ marginBottom: 16, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
        type="inner"
        title="ประกาศที่ 4"
      >
        <div style={{ display: "flex" }}>
          <a href="#" style={{ marginRight: 10 }}>
            <MinusOutlined /> ดาวน์โหลด
          </a>
          <p style={{ fontStyle: "italic" }}>01-April-2020</p>
        </div>
      </Card>
      <Card
        style={{ marginBottom: 16, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
        type="inner"
        title="ประกาศที่ 5"
      >
        <div style={{ display: "flex" }}>
          <a href="#" style={{ marginRight: 10 }}>
            <MinusOutlined /> ดาวน์โหลด
          </a>
          <p style={{ fontStyle: "italic" }}>01-April-2020</p>
        </div>
      </Card>
      <div style={{ textAlign: "right" }}>
        <a href="#">
          ทั้งหมด <RightOutlined />
          <RightOutlined />
        </a>
      </div>
    </div>
  );
};

export default DocumentComponent;
