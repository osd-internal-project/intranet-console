"use client";
import React from "react";
import { Card, Empty, List, Tag } from "antd";
import dayjs from "dayjs";
import { DocExpiryRow } from "../services/dashboard.service";

const DOC_LABEL: Record<string, string> = {
  insurance: "ประกันภัย",
  act: "พ.ร.บ.",
  tax: "ภาษี",
};

/** รายการเอกสารใกล้หมดอายุ (ภายใน 60 วัน) */
const DocExpiryCard: React.FC<{ data: DocExpiryRow[] }> = ({ data }) => (
  <Card title="เอกสารใกล้หมดอายุ (60 วัน)" size="small" className="h-full">
    {data.length ? (
      <List
        size="small"
        dataSource={data}
        style={{ maxHeight: 300, overflowY: "auto" }}
        renderItem={(d) => {
          const left = dayjs(d.expireDate).startOf("day").diff(dayjs().startOf("day"), "day");
          return (
            <List.Item>
              <div className="flex items-center justify-between w-full gap-2">
                <div className="min-w-0">
                  <div className="truncate">{d.carName || d.carId}</div>
                  <div className="text-xs text-gray-400">
                    {DOC_LABEL[d.docType] ?? d.docType} ·{" "}
                    {dayjs(d.expireDate).format("DD/MM/YYYY")}
                  </div>
                </div>
                <Tag color={left <= 30 ? "red" : "orange"}>เหลือ {left} วัน</Tag>
              </div>
            </List.Item>
          );
        }}
      />
    ) : (
      <Empty description="ไม่มีเอกสารใกล้หมดอายุ" image={Empty.PRESENTED_IMAGE_SIMPLE} />
    )}
  </Card>
);

export default DocExpiryCard;
