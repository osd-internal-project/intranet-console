import React, { useState } from "react";
import type { BadgeProps, CalendarProps, TableColumnsType, TableColumnType } from "antd";
import { Badge, Button, Calendar, Card, DatePicker, Divider, Form, Input, Modal, Select, Table, Tag } from "antd";
import type { Dayjs } from "dayjs";
import { ColumnType } from "antd/es/table";
import { dateToStringThNoTime } from "@/app/utils/format";
import { ITMaDetail, ITMaType, ITMaCreateForm } from "../../common";
import TextArea from "antd/es/input/TextArea";
import { Label } from "recharts";

export interface props {
  maTypes: ITMaType[];
  loading: boolean;
  setLoading: (loading: boolean) => void;
  createMa: (data: ITMaCreateForm) => void;
}

const MaTaskCreateComponent: React.FC<props> = ({ maTypes, loading, setLoading, createMa }): React.ReactElement => {
  return (
    <Card>
      <Form labelCol={{ span: 8 }} layout="vertical" onFinish={createMa}>
        <div className="grid  grid-cols-1 md:grid-cols-3 gap-2">
          <Form.Item name={"maTypeId"} label={"ประเภท MA"} rules={[{ required: true, message: "กรุณาเลือก ประเภท MA" }]}>
            <Select options={maTypes ? maTypes.map((type) => ({ value: type.id, label: type.name })) : []} />
          </Form.Item>
          <Form.Item name={"maName"} label={"ชื่อ MA"} rules={[{ required: true, message: "กรุณากรอกชื่อ MA" }]}>
            <Input />
          </Form.Item>
          <Form.Item name={"maDate"} label={"วันนัดหมาย"} rules={[{ required: true, message: "กรุณาเลือกวันนัดหมาย" }]}>
            <DatePicker showTime={true} className=" w-full" format={"DD/MM/YYYY HH:mm"} />
          </Form.Item>
          <Form.Item name={"contact"} label={"ผู้นัดหมาย"}>
            <Input />
          </Form.Item>
          <Form.Item labelCol={{}} name={"detail"} label={"เนื้อหา"} className="md:col-span-3">
            <TextArea maxLength={255} showCount={true} />
          </Form.Item>
          <div className="  md:col-span-3 text-right">
            <Button type="primary" htmlType="submit">
              เพิ่ม MA
            </Button>
          </div>
        </div>
      </Form>
    </Card>
  );
};

export default MaTaskCreateComponent;
