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
  Form,
  Input,
  Modal,
  Select,
  Switch,
  Table,
  Tag,
} from "antd";
import type { Dayjs } from "dayjs";
import { ColumnType } from "antd/es/table";
import { dateToStringTh, dateToStringThNoTime } from "@/app/utils/format";

import { useForm } from "antd/es/form/Form";
import { ExclamationCircleFilled } from "@ant-design/icons";
import Link from "next/link";
import { ITCustomerGroup } from "@/app/common/customer";

export interface props {
  dataTable: ITCustomerGroup[];
  pagination: TablePaginationConfig;
  changePagination: (page: TablePaginationConfig) => void;
}

const ProductTableComponent: React.FC<props> = ({
  dataTable,
  pagination,
  changePagination,
}): React.ReactElement => {
  const customerColumns: TableColumnsType<ITCustomerGroup> = [
    {
      key: "id",
      dataIndex: "id",
      title: "No.",
      width: "100px",
      align: "center",
      render: (data: Date, record: ITCustomerGroup, index: number) =>
        (pagination?.current ? pagination?.current - 1 : 0) * 10 + index + 1,
    },
    {
      key: "customerGroupCode",
      dataIndex: "customerGroupCode",
      title: "Customer Group Code",
      width: "200px",
    },
    {
      key: "customerGroupName",
      dataIndex: "customerGroupName",
      title: "Customer Group Name",
      width: "200px",
    },
    {
      key: "description",
      dataIndex: "description",
      title: "Description",
      ellipsis: true,
      width: "200px",
    },
    {
      key: "createdAt",
      dataIndex: "createdAt",
      title: "Create Date",
      width: "200px",
      render: (data: Date) => dateToStringThNoTime(data),
    },
    {
      key: "updatedAt",
      dataIndex: "updatedAt",
      title: "Update Date",
      width: "200px",
      render: (data: Date) => dateToStringThNoTime(data),
    },
    {
      key: "id",
      dataIndex: "id",
      title: "รายละเอียด",
      width: "200px",
      align: "center",
      render: (id: number) => (
        <div className="space-x-1">
          <Link href={`/page/crm/customer-group/${id}`}>
            <Button type="link">View</Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={customerColumns}
        dataSource={dataTable}
        size="small"
        pagination={pagination}
        onChange={changePagination}
        rowKey={(data: ITCustomerGroup) => data.id}
      />
    </>
  );
};

export default ProductTableComponent;
