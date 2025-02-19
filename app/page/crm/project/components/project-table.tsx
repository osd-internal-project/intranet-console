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
import { deleteIcon, editIcon } from "@/components/icon";
import { useForm } from "antd/es/form/Form";
import { ExclamationCircleFilled } from "@ant-design/icons";
import Link from "next/link";
import { ITCustomer, ITCustomerSub } from "@/app/common/customer";
import { ITProject, ITSelectUsers } from "@/app/common/project";
import { TUserRoles, UserRoles } from "@/app/config/user-roles";

export interface props {
  dataTable: ITProject[];
  pagination: TablePaginationConfig;
  changePagination: (page: TablePaginationConfig) => void;
  roles: TUserRoles | null;
}

const ProjectTableComponent: React.FC<props> = ({
  dataTable,
  pagination,
  changePagination,
  roles,
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
      key: "customerProjectProductMap",
      dataIndex: ["customerProjectProductMap"],
      title: "Product Name",
      width: "200px",
      render: (datas: { customerProduct: { name: string } }[]) =>
        datas ? datas.map((data) => <Tag>{data.customerProduct.name}</Tag>) : "-",
    },
    {
      key: "customerName",
      dataIndex: ["customerDetailSub", "customerDetail", "customerNameTh"],
      title: "Customer Name TH",
      width: "200px",
      render: (data: string) => (data ? data : ""),
    },
    {
      key: "customerName",
      dataIndex: ["customerDetailSub", "customerDetail", "customerNameTh"],
      title: "Customer Name EN",
      width: "200px",
      render: (record: ITCustomer) =>
        record?.customerNameEn ? record.customerNameEn : "",
    },
    // {
    //   key: "customerName",
    //   dataIndex: ["customerSub", "customerDetail"],
    //   title: "Customer",
    //   width: "200px",
    // },
    {
      key: "customerDetailSub",
      dataIndex: ["customerDetailSub", "name"],
      title: "Sub Customer / CustomerSub",
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
    {
      key: "id",
      dataIndex: "id",
      title: "ดำเนินการ",
      width: "200px",
      align: "center",
      render: (id: number, record: ITProject, index: number) => (
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
        pagination={pagination}
        onChange={changePagination}
        rowKey={(data: ITProject) => data.id}
      />
    </>
  );
};

export default ProjectTableComponent;
