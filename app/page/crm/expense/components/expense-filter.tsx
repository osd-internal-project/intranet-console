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
import { ITExpenseType } from "../common";
const { RangePicker } = DatePicker;
export interface props {
  expenseType: ITExpenseType[];
  onSearch: (form: object) => void;
}

const ExpenseFilterComponent: React.FC<props> = ({
  expenseType,
  onSearch,
}): React.ReactElement => {
  async function onFinishFilter(values: any): Promise<void> {
    let search = {};
    if (values.expenseCode) {
      search = { ...search, expenseCode: values.expenseCode };
    }
    if (values.processStatus) {
      search = { ...search, processStatus: values.processStatus };
    }
    if (values.createdDate) {
      search = {
        ...search,
        sCreatedDate: values.createdDate[0],
        eCreatedDate: values.createdDate[1],
      };
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
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <Form.Item name={"formType"} label={"ประเภทการเบิก"}>
                  <Select
                    allowClear
                    placeholder="Please Select"
                    options={[
                      { value: "normal", label: "Normal" },
                      { value: "advance", label: "Advance" },
                    ]}
                  />
                </Form.Item>
                <Form.Item name={"expenseCode"} label={"ประเภทค่าใช้จ่าย"}>
                  <Select
                    allowClear
                    placeholder="Please Select"
                    options={
                      expenseType
                        ? expenseType.map((expense) => ({
                            value: expense.expenseCode,
                            label: expense.expenseName,
                          }))
                        : []
                    }
                  />
                </Form.Item>
                <Form.Item name={"processStatus"} label={"สถานะ"}>
                  <Select
                    allowClear
                    placeholder="Please Select"
                    options={[
                      { value: "wait", label: "Wait Approve" },
                      { value: "approved", label: "Approved" },
                      { value: "canceled", label: "Cancel" },
                    ]}
                  />
                </Form.Item>
                <Form.Item name={"createdDate"} label={"ช่วงเวลาดำเนินการ"}>
                  <RangePicker format={"DD/MM/YYYY"} />
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

export default ExpenseFilterComponent;
