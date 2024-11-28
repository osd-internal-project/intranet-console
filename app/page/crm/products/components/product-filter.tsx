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

const ProductFilterComponent: React.FC<props> = ({
  onSearch,
}): React.ReactElement => {
  function onFinishFilter(values: any) {
    let search = {};
    if (values.name) {
      search = { ...search, name: values.name };
    }
    onSearch(search);
  }

  return (
    <Collapse
      bordered={false}
      destroyInactivePanel
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
                {/* <Form.Item name={"projectcode"} label={"Project Code"}>
                  <Input />
                </Form.Item> */}
                <Form.Item name={"name"} label={"Project Name"}>
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

export default ProductFilterComponent;
