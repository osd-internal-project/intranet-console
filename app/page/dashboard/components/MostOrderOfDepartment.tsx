"use client";
import { numberFormat } from "@/app/utils";
import { Card, Col, Row, Table, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import React from "react";
import { render } from "react-dom";
import { ITypeDepartment } from "../common";
export interface props {
  datalist: ITypeDepartment[];
}

export const MostOrderOfDepartment: React.FC<props> = ({ datalist }): React.ReactElement => {
  const columns: ColumnsType<ITypeDepartment> = [
    { key: "id", title: "DEPARTMENT", dataIndex: "department" },
    { key: "id", title: "NUMBER OF INVENTORY", dataIndex: "countinventory", align: "center", render: (d: number) => numberFormat(d) },
    { key: "id", title: "TOTAL OF ORDERS", dataIndex: "countorder", align: "center", render: (d: number) => numberFormat(d) },
  ];
  return (
    <div>
      <Card style={{ width: "100%" }}>
        <Row gutter={[8, 8]} style={{ justifyContent: "space-between", display: "flex", alignItems: "center" }}>
          <Col>
            <Typography style={{ marginBottom: "20px", fontSize: "20px", fontWeight: "bold" }}>{`อันดับแผนกที่มีการเบิกจ่ายมากสุด 5 อันดับ ภายในเดือน`}</Typography>
          </Col>
          <Col style={{ marginBottom: "20px" }}></Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table pagination={false} size="small" columns={columns} dataSource={datalist} />
          </Col>
        </Row>
      </Card>
    </div>
  );
};
