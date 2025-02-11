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
  ITCustomerDetailSub,
  ITCustomerDetailSubAddressForm,
  ITCustomerDetailSubContactForm,
  ITCustomerDetailSubDetail,
  ITCustomerGroup,
} from "@/app/common/customer";
import { ColumnType } from "antd/es/table";
import { useForm } from "antd/es/form/Form";
import { CaretRightOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import Link from "next/link";
import { ITCustomer } from "@/app/common/customer";
import CustomerDetails from "./customer-details";
import { ITCustomerProduct } from "@/app/common/product";
import { ITProject } from "@/app/common/project";
import data from "@iconify/icons-icon-park-outline/setting-two";
import { TUserRoles } from "@/app/config/user-roles";

export interface props {
  customerList: ITCustomer[];
  customerDetailSubList: ITCustomerDetailSubDetail[];
  roles: TUserRoles | null;
  customerProductsByCustomer: ITCustomerProduct[];
  customerProductsByBranch: ITCustomerProduct[];
  projectDatas: ITProject[];
  onOpenCustomerCreateForm: (state: boolean) => void;
  getCustomerProductsByCustomer: (customerId: number, search: any) => void;
  getCustomerBrachList: (customerId: number) => void;
  getCustomerProductsByBranch: (branch: number, search: any) => void;
  getProjectDataTable: (
    productId: string,
    parentId: string,
    type: string,
    search: any
  ) => void;
  onDeleteCustomer: (customerId: number) => void;
  onOpenCustomerDescription: (customerId: number) => void;
  onOpenEditBranch: (branchId: number, customerId: number) => void;
  onDeleteBranch: (branchId: number, customerId: number) => void;
  onSaveBranchAddress: (
    branchId: number,
    form: ITCustomerDetailSubAddressForm,
    customerId: number
  ) => void;
  onDeleteCustomerBranchAddress: (
    branchId: number,
    addressId: number,
    customerId: number
  ) => void;
  onSaveBranchContact: (
    branchId: number,
    form: ITCustomerDetailSubContactForm,
    customerId: number
  ) => void;
  onDeleteCustomerBranchContact: (
    branchId: number,
    contactId: number,
    customerId: number
  ) => void;
}

const CustomerGroupCustomerList: React.FC<props> = ({
  customerList,
  customerDetailSubList,
  roles,
  customerProductsByCustomer,
  customerProductsByBranch,
  projectDatas,
  onOpenCustomerCreateForm,
  getCustomerProductsByCustomer,
  getCustomerBrachList,
  getCustomerProductsByBranch,
  getProjectDataTable,
  onDeleteCustomer,
  onOpenCustomerDescription,
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
    customerList.map((customer) => {
      const label = (
        <div className="  text-xs text-center grid grid-cols-7">
          <div>
            <div>Customer Code</div>
            <div className=" font-bold">{customer.customerCode}</div>
          </div>
          <div>
            <div>Name TH</div>
            <div className=" font-bold">
              {customer?.customerNameTh ? customer.customerNameTh : ""}
            </div>
          </div>
          <div>
            <div>Name EN</div>
            <div className=" font-bold">
              {customer?.customerNameEn ? customer.customerNameEn : ""}
            </div>
          </div>
          <div>
            <div>Active Status</div>
            <div className=" font-bold">
              {customer.activeStatus ? (
                <Tag color="green">Active</Tag>
              ) : (
                <Tag color="red">not Active</Tag>
              )}
            </div>
          </div>
          <div>
            <div>Register Code</div>
            <div className=" font-bold">
              {customer.companyRegisNumber ? customer.companyRegisNumber : "-"}
            </div>
          </div>
          <div>
            <div>Sale</div>
            <div className=" font-bold">
              {customer.responsible
                ? customer.responsible.map((data, index) => (
                    <div key={index}>{data.name}</div>
                  ))
                : ""}
            </div>
          </div>
          <div>
            <div className=" space-x-2">
              <Button
                type="link"
                onClick={() => onOpenCustomerDescription(customer.id)}
              >
                Edit
              </Button>
              <Button
                type="link"
                danger
                onClick={() => onDeleteCustomer(customer.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      );
      const children = (
        <CustomerDetails
          roles={roles}
          details={customer}
          customerDetailSubList={customerDetailSubList}
          getCustomerProductsByCustomer={getCustomerProductsByCustomer}
          customerProductsByCustomer={customerProductsByCustomer}
          getCustomerBrachList={getCustomerBrachList}
          customerProductsByBranch={customerProductsByBranch}
          getCustomerProductsByBranch={getCustomerProductsByBranch}
          projectDatas={projectDatas}
          getProjectDataTable={getProjectDataTable}
          onOpenEditBranch={onOpenEditBranch}
          onDeleteBranch={onDeleteBranch}
          onSaveBranchAddress={onSaveBranchAddress}
          onDeleteCustomerBranchAddress={onDeleteCustomerBranchAddress}
          onSaveBranchContact={onSaveBranchContact}
          onDeleteCustomerBranchContact={onDeleteCustomerBranchContact}
        />
      );
      return {
        key: customer.id,
        label: label,
        children: children,
        style: panelStyle,
      };
    });

  return (
    <div>
      <div className=" flex justify-between mb-2">
        <div className=" font-bold text-base">Customers</div>
        {roles?.crmCustomerAdd ? (
          <Button
            type="primary"
            size="small"
            onClick={() => onOpenCustomerCreateForm(true)}
          >
            Add Customer
          </Button>
        ) : (
          <div></div>
        )}
      </div>
      <div>
        <div className=" mt-2 p-2 bg-blue-100" style={{ borderRadius: 5 }}>
          <div
            style={{ maxHeight: "500px" }}
            className=" bg-blue-100 mt-2  overflow-x-auto"
          >
            <Collapse
              collapsible="icon"
              destroyInactivePanel
              accordion
              bordered={false}
              expandIcon={({ isActive }) => (
                <CaretRightOutlined rotate={isActive ? 90 : 0} />
              )}
              style={{ background: "#dbeafe" }}
              items={dataList(panelStyle)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerGroupCustomerList;
