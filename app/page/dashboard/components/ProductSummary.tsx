"use client";
import { IconCash, IconInboxIn, IconInboxOut } from "@/components/icon";
import { Card, Col, Row, Typography } from "antd";
import React from "react";

export interface props {
  countVender: number;
  countMasterproduct: number;
  countMasterInventory: number;
}

export const ProductSummary: React.FC<props> = ({ countVender, countMasterproduct, countMasterInventory }): React.ReactElement => {
  return (
    <div>
      <Card style={{ width: "100%" }}>
        <Typography style={{ marginBottom: "20px", fontSize: "20px", fontWeight: "bold" }}>{`Product Summary`}</Typography>
        <Row style={{ width: "100%" }}>
          <Col span={8}>
            <Row gutter={[8, 1]} className="aligncenter-right">
              <Col span={22}>{IconInboxIn}</Col>
              <Col span={22}>{`${countMasterproduct}`}</Col>
              <Col span={22} style={{ fontSize: "10px" }}>{`Total of Master product`}</Col>
              <Col span={1}>
                <div className="divider-right" />
              </Col>
            </Row>
          </Col>
          <Col span={8}>
            <Row gutter={[8, 1]} className="aligncenter-right">
              <Col span={22}>{IconInboxOut}</Col>
              <Col span={22}>{`${countVender}`}</Col>
              <Col span={22}>
                <Typography style={{ fontSize: "10px" }}>{`Number of Venders`}</Typography>
              </Col>
              <Col span={1}>
                <div className="divider-right" />
              </Col>
            </Row>
          </Col>
          <Col span={8}>
            <Row gutter={[8, 1]} className="aligncenter-right">
              <Col span={22}>{IconCash}</Col>
              <Col span={22}>{`${countMasterInventory}`}</Col>
              <Col span={22} style={{ fontSize: "10px" }}>{`Number of Inventory`}</Col>
              <Col span={1}>
                <div className="divider2-right" />
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </div>
  );
};
