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
import BranchProductList from "./branch-product-list";
import { ITCustomerProduct } from "@/app/common/product";
import { ITProject } from "@/app/common/project";
import BranchContact from "./branch-contact";
import BranchAddress from "./branch-address";
const { RangePicker } = DatePicker;
export interface props {
  rules: any;
  details: ITBranchDetail;
  customerProductsByBranch: ITCustomerProduct[];
  projectDatas: ITProject[];
  getCustomerProductsByBranch: (branchId: number, search: any) => void;
  getProjectDataTable: (
    productId: string,
    parentId: string,
    type: string,
    search: any
  ) => void;
  customerId: number;
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

const BranchDetails: React.FC<props> = ({
  rules,
  details,
  customerProductsByBranch,
  projectDatas,
  customerId,
  getCustomerProductsByBranch,
  getProjectDataTable,
  onSaveBranchAddress,
  onDeleteCustomerBranchAddress,
  onSaveBranchContact,
  onDeleteCustomerBranchContact,
}): React.ReactElement => {
  const [branchTabsKey, setBranchTabsKey] = useState<string>("products");
  useEffect(() => {
    if (details.id) {
      fetchData(details.id, branchTabsKey);
    }
  }, [details.id, branchTabsKey]);
  const fetchData = async (branchId: number, tabKey: string) => {
    if (branchTabsKey === "products") {
      getCustomerProductsByBranch(branchId, {});
    }
  };
  const onChangeTabs = (key: React.SetStateAction<string>) => {
    setBranchTabsKey(key);
  };
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
        onChange={onChangeTabs}
        accessKey={branchTabsKey}
        items={[
          {
            key: "products",
            label: `Branch Products`,
            children: (
              <BranchProductList
                customerProductsByBranch={customerProductsByBranch}
                parentId={String(details.id)}
                projectDatas={projectDatas}
                getProjectDataTable={getProjectDataTable}
                getCustomerProductsByBranch={getCustomerProductsByBranch}
              />
            ),
          },
          {
            key: "address",
            label: `Address`,
            children: (
              <BranchAddress
                rules={rules}
                customerId={customerId}
                branchDetail={details}
                onSaveBranchAddress={onSaveBranchAddress}
                onDeleteCustomerBranchAddress={onDeleteCustomerBranchAddress}
              />
            ),
            // icon: <Icon />,
          },
          {
            key: "contact",
            label: `Contact`,
            children: (
              <BranchContact
                rules={rules}
                customerId={customerId}
                branchDetail={details}
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

export default BranchDetails;
