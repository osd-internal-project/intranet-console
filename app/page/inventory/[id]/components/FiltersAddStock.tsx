"use client";
import { IconExport } from "@/components/icon";
import { FilterOutlined } from "@ant-design/icons";
import { Button, Col, Row, Space } from "antd";
import React from "react";

export const FiltersAddStock = () => {
  return (
    <div>
      <Row gutter={[8, 8]} style={{ justifyContent: "space-between", display: "flex", alignItems: "center" }}>
        <Col>
          <Button type="primary" icon={<FilterOutlined />}>
            Filters
          </Button>
        </Col>
        <Col></Col>
      </Row>
    </div>
  );
};
