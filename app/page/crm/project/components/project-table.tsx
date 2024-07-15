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
import { ITProject, ITSelectUsers } from "../common";
import { ColumnType } from "antd/es/table";
import { dateToStringTh, dateToStringThNoTime } from "@/app/utils/format";
import { deleteIcon, editIcon } from "@/components/icon";
import { useForm } from "antd/es/form/Form";
import { ExclamationCircleFilled } from "@ant-design/icons";
import Link from "next/link";
import { ITCustomer } from "../../customer/common";

export interface props {
  dataTable: ITProject[];
  // loading: boolean;
  // setLoading: (loading: boolean) => void;
  pagination: TablePaginationConfig;
  changePagination: (page: TablePaginationConfig) => void;
  // // editCustomer: (id: number, data: ITCustomerForm) => void;
  // deleteCustomer: (id: number) => void;
}

const ProjectTableComponent: React.FC<props> = ({
  dataTable,
  // loading,
  // setLoading,
  pagination,
  changePagination,
  // // editMaType,
  // deleteCustomer,
}): React.ReactElement => {
  const customerColumns: TableColumnsType<ITProject> = [
    {
      key: "id",
      dataIndex: "id",
      title: "No.",
      width: "200px",
      align: "center",
      render: (data: Date, record: ITProject, index: number) =>
        (pagination?.current ? pagination?.current - 1 : 0) * 10 + index + 1,
    },
    {
      key: "projectName",
      dataIndex: "projectName",
      title: "Project Name",
      width: "200px",
    },
    {
      key: "customerName",
      dataIndex: ["customerBranch", "customerDetail"],
      title: "Customer",
      width: "200px",
      render: (data: ITCustomer) =>
        data?.prefixTh && data.firstNameTh && data.lastNameTh
          ? `${data.prefixTh} ${data.firstNameTh} ${data.lastNameTh}`
          : "",
    },
    {
      key: "branchName",
      dataIndex: ["customerBranch", "branchName"],
      title: "Branch",
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
      key: "startDate",
      dataIndex: "startDate",
      title: "Start Date",
      width: "200px",
      render: (data: Date) => dateToStringThNoTime(data),
    },
    {
      key: "endDate",
      dataIndex: "endDate",
      title: "End Date",
      width: "200px",
      render: (data: Date) => dateToStringThNoTime(data),
    },

    {
      key: "id",
      dataIndex: "id",
      title: "ตรวจสอบ",
      width: "200px",
      align: "center",
      render: (id: number, record: ITProject, index: number) => (
        <div className="space-x-1">
          <Link href={`/page/crm/project/${id}`}>
            <Button type="link">View</Button>
          </Link>
        </div>
      ),
    },
    // {
    //   key: "id",
    //   dataIndex: "id",
    //   title: "ดำเนินการ",
    //   width: "200px",
    //   align: "center",
    //   render: (id: number, record: ITProject, index: number) => (
    //     <div className="space-x-1">
    //       {/* <Button type="link" onClick={() => showModalEdit(record)}>
    //         {editIcon}
    //       </Button> */}
    //       <Button type="link" danger>
    //         {deleteIcon}
    //       </Button>
    //     </div>
    //   ),
    // },
  ];

  return (
    <>
      <Table
        columns={customerColumns}
        dataSource={dataTable}
        size="small"
        pagination={pagination}
        onChange={changePagination}
        rowKey={(data: ITProject) => data.id}
      />
    </>
  );
};

export default ProjectTableComponent;
