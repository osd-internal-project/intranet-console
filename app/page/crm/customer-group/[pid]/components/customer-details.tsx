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
  ITCustomerDetailSub,
  ITCustomerDetailSubAddressForm,
  ITCustomerDetailSubContactForm,
  ITCustomerDetailSubDetail,
  ITCustomer,
} from "@/app/common/customer";
import CustomerSubList from "./customer-sub-list";
import { ITCustomerProduct } from "@/app/common/product";
import CustomerProductList from "./customer-product-list";
import { ITProject } from "@/app/common/project";
import { TUserRoles } from "@/app/config/user-roles";
const { RangePicker } = DatePicker;
export interface props {
  roles: TUserRoles | null;
  details: ITCustomer;
  customerDetailSubList: ITCustomerDetailSubDetail[];
  customerProductsByCustomer: ITCustomerProduct[];
  customerProductsByCustomerSub: ITCustomerProduct[];
  projectDatas: ITProject[];
  getCustomerProductsByCustomer: (id: number, search: any) => void;
  getCustomerBrachList: (id: number) => void;
  getCustomerProductsByCustomerSub: (branchId: number, search: any) => void;
  getProjectDataTable: (
    productId: string,
    parentId: string,
    type: string,
    search: any
  ) => void;
  onOpenEditCustomerSub: (branchId: number, customerId: number) => void;
  onDeleteCustomerSub: (branchId: number, customerId: number) => void;
  onSaveCustomerSubAddress: (
    branchId: number,
    form: ITCustomerDetailSubAddressForm,
    customerId: number
  ) => void;
  onDeleteCustomerSubAddress: (
    branchId: number,
    addressId: number,
    customerId: number
  ) => void;
  onSaveCustomerSubContact: (
    branchId: number,
    form: ITCustomerDetailSubContactForm,
    customerId: number
  ) => void;
  onDeleteCustomerSubContact: (
    branchId: number,
    contactId: number,
    customerId: number
  ) => void;
  onOpenCustomerSubCreateForm: (customerId: number) => void;
}

const CustomerDetails: React.FC<props> = ({
  roles,
  details,
  customerDetailSubList,
  customerProductsByCustomer,
  customerProductsByCustomerSub,
  projectDatas,
  getCustomerProductsByCustomer,
  getCustomerBrachList,
  getCustomerProductsByCustomerSub,
  getProjectDataTable,
  onOpenEditCustomerSub,
  onDeleteCustomerSub,
  onSaveCustomerSubAddress,
  onDeleteCustomerSubAddress,
  onSaveCustomerSubContact,
  onDeleteCustomerSubContact,
  onOpenCustomerSubCreateForm,
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
  useEffect(() => {
    console.log("customerDetailSubList");
    console.log(customerDetailSubList);
  }, [customerDetailSubList]);

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
            label: `Sub Customers/Branchs`,
            children: (
              <CustomerSubList
                roles={roles}
                customerId={details.id}
                customerDetailSubList={customerDetailSubList}
                customerProductsByCustomerSub={customerProductsByCustomerSub}
                getCustomerProductsByCustomerSub={
                  getCustomerProductsByCustomerSub
                }
                projectDatas={projectDatas}
                getProjectDataTable={getProjectDataTable}
                onOpenEditCustomerSub={onOpenEditCustomerSub}
                onDeleteCustomerSub={onDeleteCustomerSub}
                onSaveCustomerSubAddress={onSaveCustomerSubAddress}
                onDeleteCustomerSubAddress={
                  onDeleteCustomerSubAddress
                }
                onSaveCustomerSubContact={onSaveCustomerSubContact}
                onDeleteCustomerSubContact={
                  onDeleteCustomerSubContact
                }
                onOpenCustomerSubCreateForm={onOpenCustomerSubCreateForm}
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
