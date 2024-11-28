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
  details: ITCustomerGroup;
}

const CustomerGroupDetails: React.FC<props> = ({
  details,
}): React.ReactElement => {
  return (
    <Collapse
      collapsible="icon"
      destroyInactivePanel
      className="bg-white"
      bordered={false}
      items={[
        {
          key: "1",
          label: <b>รายละเอียด</b>,
          children: (
            <div className="grid md:grid-cols-4">
              <div>
                <div className="text-sm/6 text-gray-600">Code :</div>
                <div className="text-sm/6 font-medium text-gray-900 ">
                  {details.customerGroupCode}
                </div>
              </div>
              <div>
                <div className="text-sm/6 text-gray-600">Name :</div>
                <div className="text-sm/6 font-medium text-gray-900 ">
                  {details.customerGroupName}
                </div>
              </div>
              <div>
                <div className="text-sm/6 text-gray-600">Create Date :</div>
                <div className="text-sm/6 font-medium text-gray-900 ">
                  {details?.createdAt
                    ? dateToStringThNoTime(details.createdAt)
                    : "-"}
                </div>
              </div>
              <div>
                <div className="text-sm/6 text-gray-600">Update Date :</div>
                <div className="text-sm/6 font-medium text-gray-900 ">
                  {details?.updatedAt
                    ? dateToStringThNoTime(details.updatedAt)
                    : "-"}
                </div>
              </div>
              <div className=" md:col-span-4">
                <div className="text-sm/6 text-gray-600">Description :</div>
                <div className="text-sm/6 font-medium text-gray-900 ">
                  {details?.description ? (
                    <TextArea value={details.description} />
                  ) : (
                    "-"
                  )}
                </div>
              </div>
            </div>
          ),
        },
      ]}
      defaultActiveKey={["1"]}
    />
  );
};

export default CustomerGroupDetails;
