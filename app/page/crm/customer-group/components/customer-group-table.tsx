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
import { ITCustomerGroup } from "@/app/common/customer";
import { ColumnType } from "antd/es/table";
import { dateToStringTh, dateToStringThNoTime } from "@/app/utils/format";
import { deleteIcon, editIcon } from "@/components/icon";
import { useForm } from "antd/es/form/Form";
import { ExclamationCircleFilled } from "@ant-design/icons";
import Link from "next/link";

export interface props {
  dataTable: ITCustomerGroup[];
  pagination: TablePaginationConfig;
  changePagination: (page: TablePaginationConfig) => void;
  onOpenEdit: (data: ITCustomerGroup) => void;
  handdleDelete: (id: string) => void;
}

const CustomerGroupTableComponent: React.FC<props> = ({
  dataTable,
  pagination,
  changePagination,
  onOpenEdit,
  handdleDelete,
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
      title: "Code",
      width: "200px",
    },
    {
      key: "customerGroupName",
      dataIndex: "customerGroupName",
      title: "Name",
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
    {
      key: "id",
      dataIndex: "id",
      title: "Action",
      width: "200px",
      align: "center",
      render: (id: string, record: ITCustomerGroup) => (
        <div className="space-x-2">
          <Button type="link" onClick={() => onOpenEdit(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handdleDelete(id)}>
            Delete
          </Button>
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
        scroll={{ x: "max-content" }}
        onChange={changePagination}
        rowKey={(data: ITCustomerGroup) => data.id}
      />
    </>
  );
};

export default CustomerGroupTableComponent;
