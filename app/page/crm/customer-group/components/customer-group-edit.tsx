import React, { useState } from "react";
import type {
  BadgeProps,
  CalendarProps,
  TableColumnsType,
  TableColumnType,
} from "antd";
import {
  Badge,
  Button,
  Calendar,
  Collapse,
  DatePicker,
  Form,
  Input,
  Modal,
  Popover,
  Select,
  Switch,
  Table,
  Tag,
} from "antd";
import type { Dayjs } from "dayjs";
const { RangePicker } = DatePicker;
import { ITCustomerGroup, ITCustomerGroupForm } from "@/app/common/customer";
import { FormInstance } from "antd/lib";
export interface props {
  editId: string | undefined;
  setEditId: (state: string | undefined) => void;
  handdleUpdate: (form: ITCustomerGroupForm) => void;
  editForm: FormInstance<ITCustomerGroupForm>;
}

const CustomerGroupEditComponent: React.FC<props> = ({
  editId,
  setEditId,
  handdleUpdate,
  editForm,
}): React.ReactElement => {
  return (
    <Modal
      open={editId ? true : false}
      maskClosable={false}
      title={"Edit Customer Group"}
      onCancel={() => setEditId(undefined)}
      footer={[]}
    >
      <Form
        onFinish={handdleUpdate}
        form={editForm}
        layout="vertical"
        size="small"
      >
        <Form.Item
          name={"customerGroupCode"}
          label={"Customer Group Code"}
          rules={[{ required: true, message: "กรุณากรอก Customer Group Code" }]}
        >
          <Input placeholder="Text" />
        </Form.Item>
        <Form.Item
          name={"customerGroupName"}
          label={"Customer Group Name"}
          rules={[{ required: true, message: "กรุณากรอก Customer Group Name" }]}
        >
          <Input placeholder="Text" />
        </Form.Item>
        <Form.Item name={"description"} label={"Description"}>
          <Input placeholder="Text" />
        </Form.Item>
        <div className=" flex justify-end space-x-2">
          <Button size="small" onClick={() => setEditId(undefined)}>
            Cancel
          </Button>
          <Button size="small" htmlType="submit" type="primary">
            Edit
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CustomerGroupEditComponent;
