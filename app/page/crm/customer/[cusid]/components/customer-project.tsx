import React from "react";
import type { FormInstance, TableColumnsType } from "antd";
import { Button, Input, Table } from "antd";
import { ITCustomer, ITCustomerForm } from "../../common";
import { ITProject } from "../../../project/common";
import { dateToStringThNoTime } from "@/app/utils/format";
import Link from "next/link";

export interface props {
  rules: any;
  projectDetail: any;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const layout = {
  labelCol: {},
  wrapperCol: {
    md: { span: 22 },
  },
};

const BranchComponent: React.FC<props> = ({
  rules,
  projectDetail,
  loading,
}): React.ReactElement => {
  const customerColumns: TableColumnsType<ITProject> = [
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
          {rules.ruleProjectShow ? (
            <Link href={`/page/crm/project/${id}`}>
              <Button type="link">View</Button>
            </Link>
          ) : (
            <></>
          )}
        </div>
      ),
    },
  ];
  return (
    <Table
      dataSource={projectDetail}
      columns={customerColumns}
      size="small"
      rowKey={(data: ITProject) => data.id}
      loading={loading}
    />
  );
};

export default BranchComponent;
