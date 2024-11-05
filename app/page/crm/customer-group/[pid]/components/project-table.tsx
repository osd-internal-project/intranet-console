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
  Row,
  Select,
  Switch,
  Table,
  Tag,
} from "antd";
import type { Dayjs } from "dayjs";
import {
  ITCustomer,
  ITCustomerForm,
  ITPagination,
} from "@/app/common/customer";
import { ColumnType } from "antd/es/table";
import { dateToStringTh, dateToStringThNoTime } from "@/app/utils/format";
import { deleteIcon, editIcon } from "@/components/icon";
import { useForm } from "antd/es/form/Form";
import { ExclamationCircleFilled } from "@ant-design/icons";
import Link from "next/link";
import { ITProject } from "@/app/common/project";

export interface props {
  productId: string;
  parentId: string;
  parentType: string;
  projectDatas: ITProject[];
  getProjectDataTable: (
    productId: string,
    parentId: string,
    type: string
  ) => void;
}

const ProjectTable: React.FC<props> = ({
  productId,
  parentId,
  parentType,
  projectDatas,
  getProjectDataTable,
}): React.ReactElement => {
  useEffect(() => {
    fetchData();
  }, [parentId, productId]);
  const fetchData = async () => {
    getProjectDataTable(productId, parentId, parentType);
  };
  const columns: TableColumnsType<ITProject> = [
    {
      key: "id",
      dataIndex: "No.",
      title: "No.",
      width: "200px",
      align: "center",
      render: (data: Date, record: ITProject, index: number) => index + 1,
    },
    {
      key: "projectName",
      dataIndex: "projectName",
      title: "Project Name",
      width: "200px",
    },
    {
      key: "customerName",
      dataIndex: ["customerBranch", "customerDetail", "customerNameTh"],
      title: "Customer Name",
      width: "200px",
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
          {/* {rules.ruleProjectShow ? (
            <Link href={`/page/crm/project/${id}`}>
              <Button type="link">View</Button>
            </Link>
          ) : (
            <></>
          )} */}
          <Link href={`/page/crm/project/${id}`}>
            <Button type="link">View</Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <Row>
      <Table
        columns={columns}
        dataSource={projectDatas}
        size="small"
        scroll={{ x: "max-content" }}
        rowKey={"id"}
      />
    </Row>
  );
};

export default ProjectTable;
