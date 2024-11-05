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
import { ITBranch, ITCustomer } from "@/app/common/customer";
import CustomerBranchList from "./customer-branch-list";
import { ITCustomerProduct } from "@/app/common/product";
import CustomerProductList from "./customer-product-list";
import { ITProject } from "@/app/common/project";
const { RangePicker } = DatePicker;
export interface props {
  details: ITCustomer;
  branchList: ITBranch[];
  customerProductsByCustomer: ITCustomerProduct[];
  customerProductsByBranch: ITCustomerProduct[];
  projectDatas: ITProject[];
  getCustomerProductsByCustomer: (id: number) => void;
  getCustomerBrachList: (id: number) => void;
  getCustomerProductsByBranch: (branchId: number) => void;
  getProjectDataTable: (
    productId: string,
    parentId: string,
    type: string
  ) => void;
}

const CustomerDetails: React.FC<props> = ({
  details,
  branchList,
  customerProductsByCustomer,
  customerProductsByBranch,
  projectDatas,
  getCustomerProductsByCustomer,
  getCustomerBrachList,
  getCustomerProductsByBranch,
  getProjectDataTable,
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
      await getCustomerProductsByCustomer(customerId);
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
                branchList={branchList}
                onOpenCustomerCreateForm={function (state: boolean): void {
                  throw new Error("Function not implemented.");
                }}
                customerProductsByBranch={customerProductsByBranch}
                getCustomerProductsByBranch={getCustomerProductsByBranch}
                projectDatas={projectDatas}
                getProjectDataTable={getProjectDataTable}
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
