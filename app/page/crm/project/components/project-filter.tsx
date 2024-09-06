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

const ProjectFilterComponent: React.FC<props> = ({
  onSearch,
}): React.ReactElement => {
  async function onFinishFilter(values: any): Promise<void> {
    let search = {};
    if (values.projectcode) {
      search = { ...search, projectcode: values.projectcode };
    }
    if (values.projectname) {
      search = { ...search, projectname: values.projectname };
    }
    if (values.activeDate) {
      search = {
        ...search,
        fdate: values.activeDate[0],
        ldate: values.activeDate[1],
      };
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
                {/* <Form.Item name={"projectcode"} label={"Project Code"}>
                  <Input />
                </Form.Item> */}
                <Form.Item name={"projectname"} label={"Project Name"}>
                  <Input />
                </Form.Item>{" "}
                <Form.Item name={"productName"} label={"Project Name"}>
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
