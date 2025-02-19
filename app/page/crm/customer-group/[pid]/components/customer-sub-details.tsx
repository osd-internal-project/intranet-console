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
import CustomerSubProductList from "./customer-sub-product-list";
import { ITCustomerProduct } from "@/app/common/product";
import { ITProject } from "@/app/common/project";
import CustomerSubContact from "./customer-sub-contact";
import CustomerSubAddress from "./customer-sub-address";
import { TUserRoles } from "@/app/config/user-roles";
const { RangePicker } = DatePicker;
export interface props {
  roles: TUserRoles | null;
  details: ITCustomerDetailSubDetail;
  customerProductsByCustomerSub: ITCustomerProduct[];
  projectDatas: ITProject[];
  getCustomerProductsByCustomerSub: (branchId: number, search: any) => void;
  getProjectDataTable: (
    productId: string,
    parentId: string,
    type: string,
    search: any
  ) => void;
  customerId: number;
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
}

const CustomerSubDetails: React.FC<props> = ({
  roles,
  details,
  customerProductsByCustomerSub,
  projectDatas,
  customerId,
  getCustomerProductsByCustomerSub,
  getProjectDataTable,
  onSaveCustomerSubAddress,
  onDeleteCustomerSubAddress,
  onSaveCustomerSubContact,
  onDeleteCustomerSubContact,
}): React.ReactElement => {
  const [branchTabsKey, setCustomerSubTabsKey] = useState<string>("products");
  useEffect(() => {
    if (details.id) {
      fetchData(details.id, branchTabsKey);
    }
  }, [details.id, branchTabsKey]);
  const fetchData = async (branchId: number, tabKey: string) => {
    if (branchTabsKey === "products") {
      getCustomerProductsByCustomerSub(branchId, {});
    }
  };
  const onChangeTabs = (key: React.SetStateAction<string>) => {
    setCustomerSubTabsKey(key);
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
      key: "code",
      dataIndex: "code",
      title: "รหัสสาขา",
      width: "200px",
    },
    {
      key: "name",
      dataIndex: "name",
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
          {roles?.crmCustomerEdit ? <Button type="link">Edit</Button> : <></>}
          {roles?.crmCustomerDelete ? (
            <Button type="link" danger>
              Delete
            </Button>
          ) : (
            <></>
          )}
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
            label: `CustomerSub Products`,
            children: (
              <CustomerSubProductList
                customerProductsByCustomerSub={customerProductsByCustomerSub}
                parentId={String(details.id)}
                projectDatas={projectDatas}
                getProjectDataTable={getProjectDataTable}
                getCustomerProductsByCustomerSub={
                  getCustomerProductsByCustomerSub
                }
              />
            ),
          },
          {
            key: "address",
            label: `Address`,
            children: (
              <CustomerSubAddress
                roles={roles}
                customerId={customerId}
                branchDetail={details}
                onSaveCustomerSubAddress={onSaveCustomerSubAddress}
                onDeleteCustomerSubAddress={
                  onDeleteCustomerSubAddress
                }
              />
            ),
            // icon: <Icon />,
          },
          {
            key: "contact",
            label: `Contact`,
            children: (
              <CustomerSubContact
                roles={roles}
                customerId={customerId}
                branchDetail={details}
                onSaveCustomerSubContact={onSaveCustomerSubContact}
                onDeleteCustomerSubContact={
                  onDeleteCustomerSubContact
                }
              />
            ),
            // icon: <Icon />,
          },
        ]}
      />
    </div>
  );
};

export default CustomerSubDetails;
