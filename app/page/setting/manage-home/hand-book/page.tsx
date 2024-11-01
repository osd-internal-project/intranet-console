"use client";
import React, { useState } from "react";
import HandBookManage from "./components/hand-book-manage";
import HandBookList from "./components/hand-book-list";
import HandBookOption from "./components/hand-book-option";
import { Col, Card, Tabs, TabsProps, Breadcrumb, Divider } from "antd";

const HandBook: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>("1");

  const handleTabChange = (key: string) => {
    setActiveKey(key);
  };
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "รายการ เอกสาร",
      children: activeKey === "1" ? <HandBookList /> : null,
    },
    {
      key: "2",
      label: "อัปโหลด เอกสาร",
      children: activeKey === "2" ? <HandBookManage /> : null,
    },
    {
      key: "3",
      label: "ประเภท เอกสาร",
      children: activeKey === "3" ? <HandBookOption /> : null,
    },
  ];
  return (
    <div>
      <Col span={24}>
        <div className="grid-span-1 space-y-2">
          <Tabs activeKey={activeKey} onChange={handleTabChange} items={items} tabPosition="left" type="card" />
        </div>
      </Col>
    </div>
  );
};

export default HandBook;
