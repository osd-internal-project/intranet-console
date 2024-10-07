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
import { ITCustomerForm, ITPagination } from "../common";
import { ColumnType } from "antd/es/table";
import { dateToStringThNoTime } from "@/app/utils/format";
import { FilterOutlined } from "@ant-design/icons";
import { exportIcon } from "@/components/icon";
const { RangePicker } = DatePicker;
export interface props {
  onSearch: (form: object) => void;
}

const CustomerFilterComponent: React.FC<props> = ({
  onSearch,
}): React.ReactElement => {
  async function onFinishFilter(values: any): Promise<void> {
    let search = {};
    if (values.refcode) {
      search = { ...search, refcode: values.refcode };
    }
    if (values.customername) {
      search = { ...search, customername: values.customername };
    }
    if (values.activestatus !== null || values.activestatus !== undefined) {
      search = { ...search, activestatus: values.activestatus };
    }

    onSearch(search);
  }

  return (
    <Collapse
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
              autoComplete="off"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <Form.Item name={"refcode"} label={"รหัสอ้างอิงลูกค้า"}>
                  <Input />
                </Form.Item>
                <Form.Item name={"customername"} label={"ชื่อ"}>
                  <Input />
                </Form.Item>
                <Form.Item name={"activestatus"} label={"สถานะ"}>
                  <Select
                    allowClear
                    placeholder={"All"}
                    options={[
                      { label: "Active", value: true },
                      { label: "Not Active", value: false },
                    ]}
                  />
                </Form.Item>
              </div>
              <div className=" flex justify-end space-x-2">
                <Button type="primary" htmlType="submit">
                  Search
                </Button>
                {/* <Button
                  type="primary"
                  ghost
                  icon={exportIcon}
                  // onClick={handdleExport}
                >
                  {`Export`}
                </Button> */}
              </div>
            </Form>
          ),
        },
      ]}
      defaultActiveKey={["1"]}
    />
  );
};

export default CustomerFilterComponent;
