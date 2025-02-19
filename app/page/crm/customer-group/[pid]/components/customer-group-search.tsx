import React, { useEffect, useState } from "react";
import type {
  BadgeProps,
  CalendarProps,
  TableColumnsType,
  TableColumnType,
  TablePaginationConfig,
} from "antd";
import {
  Badge,
  Button,
  Calendar,
  Card,
  Collapse,
  Form,
  Input,
  Modal,
  Select,
  Switch,
  Table,
  Tag,
} from "antd";
import type { Dayjs } from "dayjs";
import { ITCustomerGroup } from "@/app/common/customer";
import { ColumnType } from "antd/es/table";
import { dateToStringTh, dateToStringThNoTime } from "@/app/utils/format";
import { deleteIcon, editIcon } from "@/components/icon";
import { useForm } from "antd/es/form/Form";
import { ExclamationCircleFilled } from "@ant-design/icons";
import Link from "next/link";
const { TextArea } = Input;
export interface props {
  onSearch: (allSearch: object) => void;
}

const CustomerGroupSearch: React.FC<props> = ({
  onSearch,
}): React.ReactElement => {
  function sendFormSearch(values: any): void {
    for (const key in values) {
      if (
        values[key] === null ||
        values[key] === undefined ||
        String(values[key]).replace(" ", "") === ""
      ) {
        delete values[key];
      }
    }
    onSearch(values);
  }

  return (
    <Collapse
      collapsible="icon"
      destroyInactivePanel
      className="bg-white"
      bordered={false}
      items={[
        {
          key: "1",
          label: <b>ค้นหา</b>,
          children: (
            <div className=" w-full">
              <Form layout="vertical" size="small" onFinish={sendFormSearch}>
                <div className=" grid grid-cols-4 gap-2">
                  <Form.Item name={"referenceCode"} label={"Reference Code"}>
                    <Input />
                  </Form.Item>
                  <Form.Item name={"customerName"} label={"Customer Name"}>
                    <Input />
                  </Form.Item>
                  <Form.Item name={"name"} label={"Customer Sub Name /CustomerSub Name"}>
                    <Input />
                  </Form.Item>
                  <Form.Item name={"productName"} label={"Product Name"}>
                    <Input />
                  </Form.Item>
                </div>
                <div className=" flex justify-end">
                  <Button type="primary" htmlType="submit" size="small">
                    Search
                  </Button>
                </div>
              </Form>
            </div>
          ),
        },
      ]}
      defaultActiveKey={["1"]}
    />
  );
};

export default CustomerGroupSearch;
