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
  ITBranch,
  ITBranchAddress,
  ITBranchAddressForm,
  ITBranchDetail,
  ITBranchForm,
} from "../../common";
import {
  CloseOutlined,
  ExclamationCircleFilled,
  PlusOutlined,
} from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import BranchAdressAddComponent from "../components/branch-address-add";
import { deleteIcon } from "@/components/icon";
// const { RangePicker } = DatePicker;

export interface props {
  branchDetail?: ITBranchDetail;
  onSaveBranchAddress: (branchId: number, form: ITBranchAddressForm) => void;
  onDeleteCustomerBranchAddress: (branchId: number, addressId: number) => void;
}

const BranchAddressComponent: React.FC<props> = ({
  branchDetail,
  onSaveBranchAddress,
  onDeleteCustomerBranchAddress,
}): React.ReactElement => {
  const [showModalAddressAdd, setShowModalAddressAdd] = useState(false);
  useEffect(() => {
    setShowModalAddressAdd(false);
  }, [branchDetail?.customerAddress]);

  const showModalBranchAddressDelete = (id: number) => {
    if (branchDetail?.id) {
      Modal.confirm({
        title: "Delete this Address",
        icon: <ExclamationCircleFilled />,
        content: "Are you sure you want to delete this ?",
        okText: "Confirm",
        okButtonProps: { type: "primary", danger: true },
        cancelText: "Cancel",
        onOk: async () => {
          onDeleteCustomerBranchAddress(branchDetail.id, id);
        },
      });
    }
  };

  const columns: TableColumnsType<ITBranchAddress> = [
    // {
    //   key: "addressTypeName",
    //   dataIndex: "addressTypeName",
    //   title: "ประเภทที่อยู่",
    //   width: "100px",
    //   // render: (id: number, record: ITBranchAddress, index: number) => index + 1,
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
      title: "ตำบล",
      // width: "200px",
    },
    {
      key: "district",
      dataIndex: "district",
      title: "อำเภอ",
      // width: "200px",
    },
    {
      key: "province",
      dataIndex: "province",
      title: "จังหวัด",
      // width: "200px",
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
          <Button
            type="link"
            onClick={() => showModalBranchAddressDelete(id)}
            danger
          >
            {deleteIcon}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className=" grid gap-2">
      <div className=" flex justify-end">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          ghost={!showModalAddressAdd}
          onClick={() => {
            setShowModalAddressAdd(!showModalAddressAdd);
          }}
        >
          เพิ่มที่อยู่
        </Button>
      </div>
      {showModalAddressAdd && branchDetail?.id ? (
        <BranchAdressAddComponent
          branchId={branchDetail?.id}
          showModalAddressAdd={showModalAddressAdd}
          onShowModalAddressAdd={function (status: boolean): void {
            setShowModalAddressAdd(status);
          }}
          onSaveBranchAddress={onSaveBranchAddress}
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

export default BranchAddressComponent;
