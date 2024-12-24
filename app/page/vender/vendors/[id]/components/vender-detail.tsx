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

export interface props {
  details: any;
}

export const VenderDetailComponent: React.FC<props> = ({
  details,
}): React.ReactElement => {
  return (
    <Card>
      <div className=" flex justify-between">
        <div className=" text-xl">{"Vender 1"}</div>
        <div>
          <Select
            style={{ width: "150px" }}
            size="small"
            placeholder={"Status"}
            options={[
              {
                value: "default",
                label: <Badge status="default" text="Default" />,
              },
              {
                value: "Good",
                label: <Badge status="success" text="Good" />,
              },
              {
                value: "default",
                label: <Badge status="error" text="Bad" />,
              },
              {
                value: "default",
                label: <Badge status="processing" text="Processing" />,
              },
              {
                value: "default",
                label: <Badge status="warning" text="Warning" />,
              },
            ]}
          />
        </div>
      </div>
      <div className=" mb-5 mt-5">Detail...</div>
    </Card>
  );
};
