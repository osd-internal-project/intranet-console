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
import { ITBranch, ITCustomerGroup } from "@/app/common/customer";
import { ColumnType } from "antd/es/table";
import { useForm } from "antd/es/form/Form";
import { CaretRightOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import Link from "next/link";
import { ITCustomer } from "@/app/common/customer";
import CustomerDetails from "./customer-details";
import { ITCustomerProduct } from "@/app/common/product";
import { ITProject } from "@/app/common/project";

export interface props {
  customerList: ITCustomer[];
  branchList: ITBranch[];
  customerProductsByCustomer: ITCustomerProduct[];
  customerProductsByBranch: ITCustomerProduct[];
  projectDatas: ITProject[];
  onOpenCustomerCreateForm: (state: boolean) => void;
  getCustomerProductsByCustomer: (customerId: number) => void;
  getCustomerBrachList: (customerId: number) => void;
  getCustomerProductsByBranch: (branch: number) => void;
  getProductDataTable: (
    productId: string,
    parentId: string,
    type: string
  ) => void;
}

const CustomerGroupCustomerList: React.FC<props> = ({
  customerList,
  branchList,
  customerProductsByCustomer,
  customerProductsByBranch,
  projectDatas,
  onOpenCustomerCreateForm,
  getCustomerProductsByCustomer,
  getCustomerBrachList,
  getCustomerProductsByBranch,
  getProductDataTable,
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
              {customer?.customerTypeId
                ? customer?.customerTypeId === "natural"
                  ? `${
                      customer.details?.prefixTh
                        ? customer.details?.prefixTh
                        : ""
                    }${
                      customer.details?.firstNameTh
                        ? customer.details?.firstNameTh
                        : ""
                    }${
                      customer.details?.lastNameTh
                        ? ` ${customer.details?.lastNameTh}`
                        : ""
                    }`
                  : customer.customerTypeId === "juristic"
                  ? customer.details?.customerNameTh
                  : ""
                : ""}
            </div>
          </div>
          <div>
            <div>Name EN</div>
            <div className=" font-bold">
              {customer?.customerTypeId
                ? customer?.customerTypeId === "natural"
                  ? `${
                      customer.details?.prefixEn
                        ? customer.details?.prefixEn
                        : ""
                    }${
                      customer.details?.firstNameEn
                        ? customer.details?.firstNameEn
                        : ""
                    }${
                      customer.details?.lastNameEn
                        ? ` ${customer.details?.lastNameEn}`
                        : ""
                    }`
                  : customer.customerTypeId === "juristic"
                  ? customer.details?.customerNameEn
                  : ""
                : ""}
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
              <Button type="link">Edit</Button>
              <Button type="link" danger>
                Delete
              </Button>
            </div>
          </div>
        </div>
      );
      const children = (
        <CustomerDetails
          details={customer}
          branchList={branchList}
          getCustomerProductsByCustomer={getCustomerProductsByCustomer}
          customerProductsByCustomer={customerProductsByCustomer}
          getCustomerBrachList={getCustomerBrachList}
          customerProductsByBranch={customerProductsByBranch}
          getCustomerProductsByBranch={getCustomerProductsByBranch}
          projectDatas={projectDatas}
          getProductDataTable={getProductDataTable}
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
        <Button
          type="primary"
          size="small"
          onClick={() => onOpenCustomerCreateForm(true)}
        >
          Add Customer
        </Button>
      </div>
      <div>
        <Form layout="vertical" size="small">
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
        </Form>
        <div className=" mt-2 p-2 bg-blue-100" style={{ borderRadius: 5 }}>
          <div
            style={{ maxHeight: "500px" }}
            className=" bg-blue-100 mt-2  overflow-x-auto"
          >
            <Collapse
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
