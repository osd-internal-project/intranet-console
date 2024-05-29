"use client";
import { IconBeaker, IconCash, IconInboxIn, IconInboxOut } from "@/components/icon";
import { Card, Col, Row, Typography } from "antd";
import React from "react";

export interface props {
  countstatusPay: number;
  countstatusRecieve: number;
  countCost: number;
  countOutofstock: number;
}

export const DepartmentOverview: React.FC<props> = ({ countstatusPay, countstatusRecieve, countCost, countOutofstock }): React.ReactElement => {
  return (
    <div>
      <Card style={{ width: "100%" }}>
        <Typography style={{ marginBottom: "20px", fontSize: "20px", fontWeight: "bold" }}>{`Department Overview`}</Typography>
        <Row style={{ width: "100%" }}>
          <Col span={6}>
            <Row gutter={[8, 8]} className="aligncenter">
              <Col span={23}>{IconInboxIn}</Col>
              <Col span={11}>{`${countstatusPay}`}</Col>
              <Col span={11}>{`การจ่าย(รายวัน)`}</Col>
              <Col span={1}>
                <div className="divider" />
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <Row gutter={[8, 8]} className="aligncenter">
              <Col span={23}>{IconInboxOut}</Col>
              <Col span={11}>{`${countstatusRecieve}`}</Col>
              <Col span={11}>{`รับเข้า(รายวัน)`}</Col>
              <Col span={1}>
                <div className="divider" />
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <Row gutter={[8, 8]} className="aligncenter">
              <Col span={23}>{IconCash}</Col>
              <Col span={11}>{`${countCost.toFixed(0)}`}</Col>
              <Col span={11}>{`ค่าใช้จ่าย(รายเดือน)`}</Col>
              <Col span={1}>
                <div className="divider" />
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <Row gutter={[8, 8]} className="aligncenter">
              <Col span={23}>{IconBeaker}</Col>
              <Col span={11}>{`${countOutofstock}`}</Col>
              <Col span={11}>{`Low Stock`}</Col>
              <Col span={1}>
                <div className="divider2" />
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </div>
  );
};
