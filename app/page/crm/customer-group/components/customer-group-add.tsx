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

import { FormInstance } from "antd/lib";
import { ITCustomerGroupForm } from "@/app/common/customer";
export interface props {
  addState: boolean;
  setAddState: (status: boolean) => void;
  handdleCreate: (form: ITCustomerGroupForm) => void;
  addForm: FormInstance<ITCustomerGroupForm>;
}

const CustomerGroupAddComponent: React.FC<props> = ({
  addState,
  setAddState,
  handdleCreate,
  addForm,
}): React.ReactElement => {
  addForm.resetFields();
  return (
    <Modal
      open={addState}
      maskClosable={false}
      title={"Add Customer Group"}
      onCancel={() => setAddState(false)}
      footer={[]}
    >
      <Form
        onFinish={handdleCreate}
        form={addForm}
        layout="vertical"
        size="small"
        autoComplete="off"
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
          <Button size="small" onClick={() => setAddState(false)}>
            Cancel
          </Button>
          <Button size="small" htmlType="submit" type="primary">
            Add
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CustomerGroupAddComponent;
