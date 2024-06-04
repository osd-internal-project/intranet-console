import React, { useState } from "react";
import type { BadgeProps, CalendarProps, TableColumnsType, TableColumnType } from "antd";
import { Badge, Button, Calendar, Card, DatePicker, Divider, Form, Input, Modal, Select, Table, Tag } from "antd";
import type { Dayjs } from "dayjs";
import { ColumnType } from "antd/es/table";
import { dateToStringThNoTime } from "@/app/utils/format";
import { ITMaDetail, ITPagination } from "../../common";
import TextArea from "antd/es/input/TextArea";

export interface props {
  data: ITMaDetail;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const MaDescriptionComponent: React.FC<props> = ({ data, loading, setLoading }): React.ReactElement => {
  return (
    <Card>
      <div className="grid  grid-cols-1 md:grid-cols-3">
        <div className="grid  grid-cols-3 mb-2">
          <div className=" col-span-1">ประเภท MA :</div>
          <div className=" col-span-2">{data.maTypeName}</div>
        </div>
        <div className="grid  grid-cols-3 mb-2 ">
          <div className=" col-span-1">ชื่อ MA :</div>
          <div className=" col-span-2">{data.maName}</div>
        </div>
        <div className="grid  grid-cols-3  mb-2">
          <div className=" col-span-1">วันนัดหมาย :</div>
          <div className=" col-span-2">{data.maDate ? dateToStringThNoTime(data.maDate) : ""}</div>
        </div>
        <div className="grid  grid-cols-3 mb-2 ">
          <div className=" col-span-1">ผู้นัดหมาย :</div>
          <div className=" col-span-2">{data.contact}</div>
        </div>
        <div className="grid  grid-cols-3  mb-2">
          <div className=" col-span-1">วันที่สร้าง :</div>
          <div className=" col-span-2">{data.createdDate ? dateToStringThNoTime(data.createdDate) : ""}</div>
        </div>
        <div className="grid  grid-cols-3  mb-2">
          <div className=" col-span-1">วันที่อัพเดท :</div>
          <div className=" col-span-2">{data.updatedDate ? dateToStringThNoTime(data.updatedDate) : ""}</div>
        </div>
      </div>
      <Divider />
      <h2>สรุปผล</h2>

      <Form layout="vertical">
        <Form.Item name={"date"} label={"Remark"}>
          <DatePicker />
        </Form.Item>
        <Form.Item name={"remake"} label={"Remark"}>
          <TextArea rows={4} placeholder="maxLength is 6" maxLength={6} />
        </Form.Item>
        <Button type="primary">Save</Button>
      </Form>
    </Card>
  );
};

export default MaDescriptionComponent;
