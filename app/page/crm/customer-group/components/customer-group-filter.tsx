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
export interface props {
  onSearch: (form: object) => void;
}

const CustomerGroupFilterComponent: React.FC<props> = ({
  onSearch,
}): React.ReactElement => {
  function onFinishFilter(values: any) {
    let search = {};
    if (values.customerGroupCode) {
      search = { ...search, customerGroupCode: values.customerGroupCode };
    }
    if (values.customerGroupName) {
      search = { ...search, customerGroupName: values.customerGroupName };
    }
    onSearch(search);
  }

  return (
    <Collapse
      destroyInactivePanel
      bordered={false}
      items={[
        {
          key: "1",
          label: <b>Filter</b>,
          children: (
            <Form
              size="small"
              layout="vertical"
              onFinish={onFinishFilter}
              // form={filterForm}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <Form.Item name={"customerGroupCode"} label={"Code"}>
                  <Input />
                </Form.Item>
                <Form.Item name={"customerGroupName"} label={"Name"}>
                  <Input />
                </Form.Item>
              </div>
              <div className=" flex justify-end space-x-2">
                <Button type="primary" htmlType="submit">
                  Search
                </Button>
              </div>
            </Form>
          ),
        },
      ]}
      defaultActiveKey={["1"]}
    />
  );
};

export default CustomerGroupFilterComponent;
