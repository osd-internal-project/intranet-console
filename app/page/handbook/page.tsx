"use client";
import React from "react";
import ManageHandbook from "./manageHandbook/managehandBook";
import Tablehandbook from "./manageHandbook/tablehandbook";
import Optionhandbook from "./manageHandbook/optionhandbook";
import { Col, Card, Tabs, TabsProps } from "antd";

const dataform: React.FC = () => {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "file PDF",
      children: <Tablehandbook />,
    },
    {
      key: "2",
      label: "เพิ่มข้อมูล PDF",
      children: <ManageHandbook />,
    },
    {
      key: "3",
      label: "ประเภท PDF",
      children: <Optionhandbook />,
    },
  ];
  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <h1
        style={{
          margin: "0 0 0 10px",
          fontSize: "32px",
          fontStyle: "initial",
          borderBottom: "2px solid black",
        }}
      >
        ข้อมูลข่าวสาร
      </h1>
      <Col span={24}>
        <div className="grid-span-1 space-y-2">
          <Card>
            <Tabs defaultActiveKey="1" items={items} />
          </Card>
        </div>
      </Col>
    </div>
  );
};

export default dataform;
