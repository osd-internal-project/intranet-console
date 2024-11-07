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
import {
  ITBranch,
  ITBranchAddressForm,
  ITBranchContactForm,
  ITBranchDetail,
  ITCustomer,
} from "@/app/common/customer";
import CustomerBranchList from "./customer-branch-list";
import { ITCustomerProduct } from "@/app/common/product";
import CustomerProductList from "./customer-product-list";
import { ITProject } from "@/app/common/project";
const { RangePicker } = DatePicker;
export interface props {
  rules: any;
  details: ITCustomer;
  branchList: ITBranchDetail[];
  customerProductsByCustomer: ITCustomerProduct[];
  customerProductsByBranch: ITCustomerProduct[];
  projectDatas: ITProject[];
  getCustomerProductsByCustomer: (id: number, search: any) => void;
  getCustomerBrachList: (id: number) => void;
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

const CustomerDetails: React.FC<props> = ({
  rules,
  details,
  branchList,
  customerProductsByCustomer,
  customerProductsByBranch,
  projectDatas,
  getCustomerProductsByCustomer,
  getCustomerBrachList,
  getCustomerProductsByBranch,
  getProjectDataTable,
  onOpenEditBranch,
  onDeleteBranch,
  onSaveBranchAddress,
  onDeleteCustomerBranchAddress,
  onSaveBranchContact,
  onDeleteCustomerBranchContact,
}): React.ReactElement => {
  const [customerTabsKey, setCustomerTabsKey] = useState<string>("products");
  useEffect(() => {
    if (details.id) {
      fetchData(details.id, customerTabsKey);
    }
  }, [details.id, customerTabsKey]);
  const fetchData = async (customerId: number, tabKey: string) => {
    console.log(customerId);
    if (customerTabsKey === "products") {
      await getCustomerProductsByCustomer(customerId, {});
    } else if (customerTabsKey === "branch") {
      await getCustomerBrachList(customerId);
    }
  };
  const onChangeCustomerTabs = (key: React.SetStateAction<string>) => {
    setCustomerTabsKey(key);
  };

  return (
    <div>
      <Tabs
        onChange={onChangeCustomerTabs}
        accessKey={customerTabsKey}
        items={[
          {
            key: "products",
            label: `Customer Products`,
            children: (
              <CustomerProductList
                customerId={details.id}
                customerProductsByCustomer={customerProductsByCustomer}
                projectDatas={projectDatas}
                getProjectDataTable={getProjectDataTable}
              />
            ),
          },
          {
            key: "branch",
            label: `Sub Customers/Branch`,
            children: (
              <CustomerBranchList
                rules={rules}
                customerId={details.id}
                branchList={branchList}
                onOpenCustomerCreateForm={function (state: boolean): void {
                  throw new Error("Function not implemented.");
                }}
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
            ),
            // icon: <Icon />,
          },
        ]}
      />
    </div>
  );
};

export default CustomerDetails;
