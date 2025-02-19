import React, { useEffect, useState } from "react";
import type { FormInstance, TableColumnsType } from "antd";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  Modal,
  Select,
  Table,
  Tabs,
} from "antd";
import {
  ITCustomerDetailSub,
  ITCustomerDetailSubAddress,
  ITCustomerDetailSubAddressForm,
  ITCustomerDetailSubDetail,
  ITCustomerDetailSubForm,
} from "@/app/common/customer";
import {
  CloseOutlined,
  ExclamationCircleFilled,
  PlusOutlined,
} from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import CustomerSubAdressAddComponent from "../components/customer-sub-address-add";
import { deleteIcon } from "@/components/icon";
import { TUserRoles } from "@/app/config/user-roles";
// const { RangePicker } = DatePicker;

export interface props {
  roles: TUserRoles | null;
  customerId: number;
  branchDetail?: ITCustomerDetailSubDetail;
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
}

const CustomerSubAddress: React.FC<props> = ({
  roles,
  customerId,
  branchDetail,
  onSaveCustomerSubAddress,
  onDeleteCustomerSubAddress,
}): React.ReactElement => {
  const [showModalAddressAdd, setShowModalAddressAdd] = useState(false);
  useEffect(() => {
    setShowModalAddressAdd(false);
  }, [branchDetail?.customerAddress]);

  const showModalCustomerSubAddressDelete = (id: number) => {
    if (branchDetail?.id) {
      Modal.confirm({
        title: "Delete this Address",
        icon: <ExclamationCircleFilled />,
        content: "Are you sure you want to delete this ?",
        okText: "Confirm",
        okButtonProps: { type: "primary", danger: true },
        cancelText: "Cancel",
        onOk: async () => {
          onDeleteCustomerSubAddress(branchDetail.id, id, customerId);
        },
      });
    }
  };

  const columns: TableColumnsType<ITCustomerDetailSubAddress> = [
    // {
    //   key: "addressTypeName",
    //   dataIndex: "addressTypeName",
    //   title: "ประเภทที่อยู่",
    //   width: "100px",
    //   // render: (id: number, record: ITCustomerDetailSubAddress, index: number) => index + 1,
    // },
    {
      key: "houseNumber",
      dataIndex: "houseNumber",
      title: "เลขที่บ้าน",
    },
    {
      key: "roomNumber",
      dataIndex: "roomNumber",
      title: "เลขที่ห้อง",
      // width: "200px",
    },
    {
      key: "building",
      dataIndex: "building",
      title: "อาคาร/หมู่บ้าน",
      // width: "200px",
    },
    {
      key: "floor",
      dataIndex: "floor",
      title: "ชั้น",
      // width: "200px",
    },
    {
      key: "alley",
      dataIndex: "alley",
      title: "ซอย",
      // width: "200px",
    },
    {
      key: "village",
      dataIndex: "village",
      title: "หมู่ที่",
      // width: "200px",
    },
    {
      key: "road",
      dataIndex: "road",
      title: "ถนน",
      // width: "200px",
    },
    {
      key: "subDistrict",
      dataIndex: "subDistrict",
      title: "ตำบล/แขวง",
      // width: "200px",
    },
    {
      key: "district",
      dataIndex: "district",
      title: "อำเภอ/เขต",
      // width: "200px",
    },
    {
      key: "province",
      dataIndex: "province",
      title: "จังหวัด",
      // width: "200px",
    },
    {
      key: "zipCode",
      dataIndex: "zipCode",
      title: "รหัสไปรษณีย์",
      // width: "200px",
    },
    {
      key: "maplink",
      dataIndex: "maplink",
      title: "แผนที่",
      // width: "200px",
      render: (map: string) => (
        <a href={`${map}`} target="_blank">
          Link
        </a>
      ),
    },
    {
      key: "id",
      dataIndex: "id",
      title: "",
      width: "100px",
      align: "center",
      render: (id: number) => (
        <div className="space-x-1">
          {/* <Button type="link" onClick={() => showModalEdit(record)}>
            {editIcon}
          </Button> */}
          {roles?.crmCustomerEdit ? (
            <Button
              type="link"
              onClick={() => showModalCustomerSubAddressDelete(id)}
              danger
            >
              {deleteIcon}
            </Button>
          ) : (
            <></>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className=" grid gap-2">
      <div className=" flex justify-end">
        {roles?.crmCustomerEdit ? (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            ghost={!showModalAddressAdd}
            onClick={() => {
              setShowModalAddressAdd(!showModalAddressAdd);
            }}
          >
            Add Address
          </Button>
        ) : (
          <></>
        )}
      </div>
      {showModalAddressAdd && branchDetail?.id ? (
        <CustomerSubAdressAddComponent
          branchId={branchDetail?.id}
          showModalAddressAdd={showModalAddressAdd}
          onShowModalAddressAdd={function (status: boolean): void {
            setShowModalAddressAdd(status);
          }}
          customerId={customerId}
          onSaveCustomerSubAddress={onSaveCustomerSubAddress}
        />
      ) : (
        ""
      )}
      <Table
        size="small"
        columns={columns}
        dataSource={
          branchDetail?.customerAddress ? branchDetail.customerAddress : []
        }
      />
    </div>
  );
};

export default CustomerSubAddress;
