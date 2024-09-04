"use client";
import React, { useState } from "react";
import ManageHandbook from "./manageHandbook/managehandBook";
import Tablehandbook from "./manageHandbook/tablehandbook";
import Optionhandbook from "./manageHandbook/optionhandbook";
import { Col, Card, Tabs, TabsProps } from "antd";

const dataform: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>("1");

  const handleTabChange = (key: string) => {
    setActiveKey(key);
  };
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "file PDF",
      children: activeKey === "1" ?<Tablehandbook />: null,
    },
    {
      key: "2",
      label: "เพิ่มข้อมูล PDF",
      children: activeKey === "2" ?<ManageHandbook />: null,
    },
    {
      key: "3",
      label: "ประเภท PDF",
      children: activeKey === "3" ?<Optionhandbook />: null,
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
        หนังสือ และ เอกสาร
      </h1>
      <Col span={24}>
        <div className="grid-span-1 space-y-2">
          <Card>
            <Tabs
              activeKey={activeKey}
              onChange={handleTabChange}
              items={items}
            />
          </Card>
        </div>
      </Col>
    </div>
  );
};

export default dataform;
