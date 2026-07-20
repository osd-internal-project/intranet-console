"use client";
import React from "react";
import { Card, Col, Row, Statistic } from "antd";
import {
  ClockCircleOutlined,
  DollarOutlined,
  FieldTimeOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { DocSummary, MatrixStatusFilter } from "../../common";
import { numberFormat } from "@/app/utils";

interface DocSummaryCardsProps {
  summary: DocSummary | null;
  loading: boolean;
  statusFilter: MatrixStatusFilter;
  onFilterChange: (filter: MatrixStatusFilter) => void;
}

/**
 * การ์ดสรุปด้านบน — 4 ใบ: เกินกำหนด / ≤30 วัน / ≤60 วัน / ค่าใช้จ่ายปีนี้
 * การ์ด SLA ทั้ง 3 ใบกดเพื่อกรองตารางได้ (ตัวเลขกลายเป็นปุ่มนำทาง)
 *
 * ระวัง: การ์ด ≤60 นับรวม ≤30 ด้วย (ค่าจะ ≥ การ์ด ≤30 เสมอ) — ตามที่ผู้ใช้เลือก
 */
export default function DocSummaryCards({
  summary,
  loading,
  statusFilter,
  onFilterChange,
}: DocSummaryCardsProps) {
  /** กดการ์ดเดิมซ้ำ = ยกเลิกตัวกรอง ผู้ใช้จึงมีทางกลับเสมอ */
  const toggle = (filter: MatrixStatusFilter) =>
    onFilterChange(statusFilter === filter ? "all" : filter);

  const activeStyle = (filter: MatrixStatusFilter) =>
    statusFilter === filter
      ? { borderColor: "#1677ff", borderWidth: 2 }
      : undefined;

  const warningDays = summary?.warningDays ?? 30;
  const slaSoonDays = summary?.slaSoonDays ?? 60;

  return (
    <Row gutter={[16, 16]} className="mb-4">
      <Col xs={24} sm={12} lg={6}>
        <Card
          hoverable
          loading={loading}
          onClick={() => toggle("expired")}
          style={activeStyle("expired")}
        >
          <Statistic
            title="หมดอายุแล้ว"
            value={summary?.expiredCount ?? 0}
            suffix="รายการ"
            prefix={<WarningOutlined />}
            valueStyle={{ color: "#cf1322" }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card
          hoverable
          loading={loading}
          onClick={() => toggle("warning")}
          style={activeStyle("warning")}
        >
          <Statistic
            title={`ใกล้หมดอายุ ≤ ${warningDays} วัน`}
            value={summary?.expiringSoonCount ?? 0}
            suffix="รายการ"
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: "#d46b08" }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card
          hoverable
          loading={loading}
          onClick={() => toggle("warning60")}
          style={activeStyle("warning60")}
        >
          <Statistic
            title={`ใกล้หมดอายุ ≤ ${slaSoonDays} วัน`}
            value={summary?.expiringSoon60Count ?? 0}
            suffix="รายการ"
            prefix={<FieldTimeOutlined />}
            valueStyle={{ color: "#d4b106" }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card loading={loading}>
          <Statistic
            title={`ค่าใช้จ่ายปีนี้ (${(summary?.year ?? new Date().getFullYear()) + 543})`}
            value={numberFormat(summary?.costThisYear ?? 0)}
            suffix="บ."
            prefix={<DollarOutlined />}
          />
        </Card>
      </Col>
    </Row>
  );
}
