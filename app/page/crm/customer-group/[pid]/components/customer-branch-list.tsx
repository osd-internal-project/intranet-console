import React, { CSSProperties, useEffect, useState } from "react";
import type {
  BadgeProps,
  CalendarProps,
  CollapseProps,
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
import {
  ITBranchAddressForm,
  ITBranchContactForm,
  ITBranchDetail,
  ITCustomerGroup,
} from "@/app/common/customer";
import { ColumnType } from "antd/es/table";
import { useForm } from "antd/es/form/Form";
import { CaretRightOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import Link from "next/link";
import { ITBranch, ITCustomer } from "@/app/common/customer";
import BranchDetails from "./branch-details";
import { ITCustomerProduct } from "@/app/common/product";
import { ITProject } from "@/app/common/project";

export interface props {
  rules: any;
  branchList: ITBranchDetail[];
  customerId: number;
  customerProductsByBranch: ITCustomerProduct[];
  projectDatas: ITProject[];
  onOpenCustomerCreateForm: (state: boolean) => void;
  getCustomerProductsByBranch: (branchId: number, search: any) => void;

  getProjectDataTable: (
    productId: string,
    parentId: string,
    type: string,
    search: any
  ) => void;
  onOpenEditBranch: (branchId: number, customerId: number) => void;
  onDeleteBranch: (branchId: number, customerId: number) => void;
  onSaveBranchAddress: (
    branchId: number,
    form: ITBranchAddressForm,
    customerId: number
  ) => void;
  onDeleteCustomerBranchAddress: (
    branchId: number,
    addressId: number,
    customerId: number
  ) => void;
  onSaveBranchContact: (
    branchId: number,
    form: ITBranchContactForm,
    customerId: number
  ) => void;
  onDeleteCustomerBranchContact: (
    branchId: number,
    contactId: number,
    customerId: number
  ) => void;
}

const CustomerBranchList: React.FC<props> = ({
  rules,
  branchList,
  customerId,
  customerProductsByBranch,
  projectDatas,
  onOpenCustomerCreateForm,
  getCustomerProductsByBranch,
  getProjectDataTable,
  onOpenEditBranch,
  onDeleteBranch,
  onSaveBranchAddress,
  onDeleteCustomerBranchAddress,
  onSaveBranchContact,
  onDeleteCustomerBranchContact,
}): React.ReactElement => {
  const panelStyle: React.CSSProperties = {
    marginBottom: 10,
    background: "#fff",
    borderRadius: 5,
    border: "1px solid #dcf0fa",
  };
  const dataList: (panelStyle: CSSProperties) => CollapseProps["items"] = (
    panelStyle
  ) =>
    branchList.map((branch) => {
      const label = (
        <div className="  text-xs text-center grid grid-cols-7">
          <div>
            <div>Code</div>
            <div className=" font-bold">{branch.branchCode}</div>
          </div>
          <div>
            <div>Name</div>
            <div className=" font-bold">{branch.branchName}</div>
          </div>
          <div>
            <div>Active Status</div>
            <div className=" font-bold">
              {branch.activeStatus ? (
                <Tag color="green">Active</Tag>
              ) : (
                <Tag color="red">not Active</Tag>
              )}
            </div>
          </div>
          <div className=" col-span-3"> </div>
          <div>
            <div className=" space-x-2">
              {rules.ruleCustomerBranchEdit && (
                <Button
                  type="link"
                  onClick={() => onOpenEditBranch(branch.id, customerId)}
                >
                  Edit
                </Button>
              )}
              {rules.ruleCustomerBranchDelete && (
                <Button
                  type="link"
                  danger
                  onClick={() => onDeleteBranch(branch.id, customerId)}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        </div>
      );
      const children = (
        <BranchDetails
          rules={rules}
          details={branch}
          customerId={customerId}
          customerProductsByBranch={customerProductsByBranch}
          getCustomerProductsByBranch={getCustomerProductsByBranch}
          projectDatas={projectDatas}
          getProjectDataTable={getProjectDataTable}
          onSaveBranchAddress={onSaveBranchAddress}
          onDeleteCustomerBranchAddress={onDeleteCustomerBranchAddress}
          onSaveBranchContact={onSaveBranchContact}
          onDeleteCustomerBranchContact={onDeleteCustomerBranchContact}
        />
      );
      return {
        key: branch.id,
        label: label,
        children: children,
        style: panelStyle,
      };
    });

  return (
    <div>
      <div className=" flex justify-between mb-2">
        <div className=" font-bold text-base">Branch</div>
        <Button
          type="primary"
          size="small"
          onClick={() => onOpenCustomerCreateForm(true)}
        >
          Add Branch
        </Button>
      </div>
      <div>
        {/* <Form layout="vertical" size="small">
          <div className=" grid grid-cols-4 gap-2">
            <Form.Item name={"referenceCode"} label={"Reference Code"}>
              <Input />
            </Form.Item>
            <Form.Item name={"name"} label={"Name"}>
              <Input />
            </Form.Item>
            <Form.Item name={"status"} label={"Status"}>
              <Select />
            </Form.Item>
          </div>
          <div className=" flex justify-end">
            <Button type="primary" size="small">
              Search
            </Button>
          </div>
        </Form> */}
        <div className=" mt-2 p-2 bg-slate-100" style={{ borderRadius: 5 }}>
          <div
            style={{ maxHeight: "500px" }}
            className=" bg-slate-100 mt-2  overflow-x-auto"
          >
            <Collapse
              collapsible="icon"
              accordion
              bordered={false}
              expandIcon={({ isActive }) => (
                <CaretRightOutlined rotate={isActive ? 90 : 0} />
              )}
              style={{ background: " #f1f5f9" }}
              destroyInactivePanel
              items={dataList(panelStyle)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerBranchList;
