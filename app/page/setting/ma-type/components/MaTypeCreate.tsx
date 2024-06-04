import React, { useState } from "react";
import type { BadgeProps, CalendarProps, TableColumnsType, TableColumnType } from "antd";
import { Badge, Button, Calendar, Form, Input, Modal, Select, Switch, Table, Tag } from "antd";
import type { Dayjs } from "dayjs";
import { ITMaType, ITMaTypeForm, ITPagination } from "../common";
import { ColumnType } from "antd/es/table";
import { dateToStringThNoTime } from "@/app/utils/format";

export interface props {
  createMaType: (form: ITMaTypeForm) => void;
}

const MaTypeCreateComponent: React.FC<props> = ({ createMaType }): React.ReactElement => {
  return (
    <>
      <Form onFinish={createMaType}>
        <div className="grid grid-cols-1   md:grid-cols-3 space-x-2">
          <Form.Item label={"MA Type Name"} name={"name"} rules={[{ required: true, message: "Plase enter MA Type Name" }]}>
            <Input />
          </Form.Item>

          <Form.Item label={"Active Status"} name={"activeStatus"} initialValue={true}>
            <Switch />
          </Form.Item>

          <Form.Item className=" md:text-right">
            <Button type="primary" htmlType="submit">
              Add MA Type
            </Button>
          </Form.Item>
        </div>
      </Form>
    </>
  );
};

export default MaTypeCreateComponent;
