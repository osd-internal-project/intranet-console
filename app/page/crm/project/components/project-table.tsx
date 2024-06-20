import React, { useEffect, useState } from "react";
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
  Form,
  Input,
  Modal,
  Select,
  Switch,
  Table,
  Tag,
} from "antd";
import type { Dayjs } from "dayjs";
import { ITCustomer, ITCustomerForm, ITPagination } from "../common";
import { ColumnType } from "antd/es/table";
import { dateToStringTh, dateToStringThNoTime } from "@/app/utils/format";
import { deleteIcon, editIcon } from "@/components/icon";
import { useForm } from "antd/es/form/Form";
import { ExclamationCircleFilled } from "@ant-design/icons";
import Link from "next/link";

export interface props {
  dataTable: ITCustomer[];
  // loading: boolean;
  // setLoading: (loading: boolean) => void;
  // pagination: ITPagination;
  // changePagination: (page: { current: number; pageSize: number }) => void;
  // // editCustomer: (id: number, data: ITCustomerForm) => void;
  // deleteCustomer: (id: number) => void;
}

const ProjectTableComponent: React.FC<props> = ({
  dataTable,
  // loading,
  // setLoading,
  // pagination,
  // changePagination,
  // // editMaType,
  // deleteCustomer,
}): React.ReactElement => {
  const customerColumns: TableColumnsType<ITCustomer> = [
    {
      key: "customerCode",
      title: "รหัส",
      dataIndex: "customerCode",
      width: "100px",
      align: "center",
    },
    {
      key: "referenceCode",
      dataIndex: "referenceCode",
      title: "รหัสอ้างอิงลูกค้า",
      width: "200px",
    },
    {
      key: "customerName",
      dataIndex: "customerName",
      title: "ชื่อ",
      width: "200px",
      render: (value: string, record, index) =>
        `${record.prefixTh ? record.prefixTh : ""} ${
          record.firstNameTh ? record.firstNameTh : ""
        } ${record.lastNameTh ? record.lastNameTh : ""}`,
    },
    {
      key: "activeStatus",
      dataIndex: "activeStatus",
      title: "Active",
      width: "200px",
      render: (value: boolean, record, index) =>
        value ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">not Active</Tag>
        ),
    },
    {
      key: "customerGroupName",
      dataIndex: "customerGroupName",
      title: "กลุ่มลูกค้า",
      width: "200px",
    },
    {
      key: "grade",
      dataIndex: "grade",
      title: "Grade",
      width: "200px",
    },
    {
      key: "responsibleName",
      dataIndex: "responsibleName",
      title: "ผู้รับผิดชอบ",
      width: "200px",
    },
    {
      key: "customerCode",
      dataIndex: "customerCode",
      title: "เลขทะเบียนบริษัท",
      width: "200px",
    },
    {
      key: "id",
      dataIndex: "id",
      title: "ตรวจสอบ",
      width: "200px",
      align: "center",
      render: (id: number, record: ITCustomer, index: number) => (
        <div className="space-x-1">
          <Link href={`/page/crm/customer/${id}`}>
            <Button type="link">View</Button>
          </Link>
        </div>
      ),
    },
    {
      key: "id",
      dataIndex: "id",
      title: "ดำเนินการ",
      width: "200px",
      align: "center",
      render: (id: number, record: ITCustomer, index: number) => (
        <div className="space-x-1">
          {/* <Button type="link" onClick={() => showModalEdit(record)}>
            {editIcon}
          </Button> */}
          <Button type="link" danger>
            {deleteIcon}
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
        rowKey={(data: ITCustomer) => data.id}
      />
    </>
  );
};

export default ProjectTableComponent;
