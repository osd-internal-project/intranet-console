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
import dayjs from "dayjs";
const { RangePicker } = DatePicker;
export interface props {
  onSearch: (form: object) => void;
}

const ProjectTicketFilterComponent: React.FC<props> = ({
  onSearch,
}): React.ReactElement => {
  async function onFinishFilter(values: any): Promise<void> {
    let search = {};
    // if (values.ticketNo) {
    //   search = { ...search, ticketNo: { contains: values.ticketNo } };
    // }
    if (values.ticketTitle) {
      search = { ...search, ticketTitle: { contains: values.ticketTitle } };
    }
    if (values.dueDate) {
      search = {
        ...search,
        dueDate: {
          gte: dayjs(values.dueDate[0]).startOf("day").toISOString(),
          lte: dayjs(values.dueDate[1]).endOf("day").toISOString(),
        },
      };
      0;
    }
    if (values.createdAt) {
      search = {
        ...search,
        createdAt: {
          gte: dayjs(values.createdAt[0]).startOf("day").toISOString(),
          lte: dayjs(values.createdAt[1]).endOf("day").toISOString(),
        },
      };
    }

    if (values.status) {
      console.log(values.status);
      search = { ...search, status: { in: values.status } };
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
                {/* <Form.Item name={"ticketNo"} label={"Ticket No"}>
                  <Input />
                </Form.Item> */}
                <Form.Item name={"ticketTitle"} label={"Title"}>
                  <Input />
                </Form.Item>

                <Form.Item name={"createdAt"} label={"Create Date"}>
                  <RangePicker format={"DD/MM/YYYY"} />
                </Form.Item>
                <Form.Item name={"dueDate"} label={"Due Date"}>
                  <RangePicker format={"DD/MM/YYYY"} />
                </Form.Item>
                <Form.Item name={"status"} label={"Status"}>
                  <Select
                    mode="multiple"
                    options={[
                      {
                        label: <div style={{ color: "#faad14" }}>New</div>,
                        value: "new",
                      },
                      {
                        label: (
                          <div style={{ color: "#1677ff" }}>Inprogress</div>
                        ),
                        value: "inprogress",
                      },
                      {
                        label: <div style={{ color: "#52c41a" }}>Finish</div>,
                        value: "finish",
                      },
                      {
                        label: <div style={{ color: "#f5222d" }}>Cancel</div>,
                        value: "cancel",
                      },
                      {
                        label: <div style={{ color: "#aB5E00" }}>On Hold</div>,
                        value: "hold",
                      },
                      {
                        label: <div style={{ color: "#555" }}>Close</div>,
                        value: "close",
                      },
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

export default ProjectTicketFilterComponent;
