import React, { useState } from "react";
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
  Card,
  DatePicker,
  Form,
  Input,
  Modal,
  Popover,
  Select,
  Switch,
  Table,
  Tabs,
  Tag,
} from "antd";
import type { Dayjs } from "dayjs";
import { ITCustomer } from "@/app/common/customer";
import CustomerBranchList from "./customer-branch-list";
import { ITCustomerProduct } from "@/app/common/product";
const { RangePicker } = DatePicker;
export interface props {
  details: ITCustomer;
  customerProductsByBranch: ITCustomerProduct[];
  getCustomerProductsByBranch: (branchId: number) => void;
}

const CustomerCustomerDetails: React.FC<props> = ({
  details,
  customerProductsByBranch,
  getCustomerProductsByBranch,
}): React.ReactElement => {
  const columns: TableColumnsType<any> = [
    {
      key: "id",
      dataIndex: "id",
      title: "No",
      width: "100px",
      align: "center",
      render: (id: number, record: any, index: number) => index + 1,
    },
    {
      key: "branchCode",
      dataIndex: "branchCode",
      title: "รหัสสาขา",
      width: "200px",
    },
    {
      key: "branchName",
      dataIndex: "branchName",
      title: "ชื่อสาขา",
      width: "300px",
    },
    {
      key: "activeStatus",
      dataIndex: "activeStatus",
      title: "สถานะ",
      render: (status?: boolean) =>
        status ? (
          <Tag color="green">{`Active`}</Tag>
        ) : (
          <Tag color="volcano">{`Inactive`}</Tag>
        ),
    },
    {
      key: "id",
      dataIndex: "id",
      title: "รายละเอียด",
      width: "100px",
      render: (id: number) => (
        <div className="space-x-1">
          <Button type="link">View</Button>
        </div>
      ),
    },
    {
      key: "id",
      dataIndex: "id",
      title: "ดำเนินการ",
      width: "150px",
      align: "center",
      render: (id: number) => (
        <div className="space-x-1">
          {/* {rules.ruleCustomerBranchEdit ? ( */}
          <Button type="link">Edit</Button>
          {/* ) : (
            <></>
          )} */}
          {/* {rules.ruleCustomerBranchDelete ? ( */}
          <Button type="link" danger>
            Delete
          </Button>
          {/* ) : (
            <></>
          )} */}
        </div>
      ),
    },
  ];
  return (
    <div>
      <Tabs
        // onChange={onChangeTabs}
        // accessKey={activeTabsKey}
        items={[
          {
            key: "products",
            label: `Products`,
            children: <Card>ไม่พบข้อมูล</Card>,
          },
          {
            key: "branch",
            label: `Sub Customers/Branch`,
            children: (
              <CustomerBranchList
                branchList={[]}
                onOpenCustomerCreateForm={function (state: boolean): void {
                  throw new Error("Function not implemented.");
                }}
                customerProductsByBranch={customerProductsByBranch}
                getCustomerProductsByBranch={getCustomerProductsByBranch}
                projectDatas={[]}
                getProjectDataTable={function (
                  productId: string,
                  parentId: string,
                  type: string
                ): void {
                  throw new Error("Function not implemented.");
                }}
              />
            ),
            // icon: <Icon />,
          },
        ]}
      />
    </div>
  );
};

export default CustomerCustomerDetails;
