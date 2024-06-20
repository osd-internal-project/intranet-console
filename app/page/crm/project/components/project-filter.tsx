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
import { ColumnType } from "antd/es/table";
import { dateToStringThNoTime } from "@/app/utils/format";
import { FilterOutlined } from "@ant-design/icons";
import { exportIcon } from "@/components/icon";
const { RangePicker } = DatePicker;
export interface props {
  onSearch: (form: object) => void;
}

const ProjectFilterComponent: React.FC<props> = ({
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
    if (values.activestatus) {
      search = { ...search, activestatus: values.activestatus };
    }
    await onSearch(search);
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
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <Form.Item name={"customername"} label={"ชื่อ Customer"}>
                  <Input />
                </Form.Item>
                <Form.Item name={"projectname"} label={"ชื่อ Project"}>
                  <Input />
                </Form.Item>
                <Form.Item name={"activeDate"} label={"ช่วงเวลาดำเนินการ"}>
                  <RangePicker format={"DD/MM/YYYY"} />
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

export default ProjectFilterComponent;
