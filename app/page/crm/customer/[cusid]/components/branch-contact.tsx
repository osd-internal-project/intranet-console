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
  Tag,
} from "antd";
import {
  ITBranch,
  ITBranchContact,
  ITBranchContactForm,
  ITBranchDetail,
  ITBranchForm,
} from "../../common";
import {
  CloseOutlined,
  ExclamationCircleFilled,
  PlusOutlined,
} from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import BranchContactAddComponent from "../components/branch-contact-add";
import { deleteIcon } from "@/components/icon";
import { dateTimeFormatNoTime } from "@/app/utils";
import { dateToStringThNoTime } from "@/app/utils/format";
// const { RangePicker } = DatePicker;

export interface props {
  rules: any;
  branchDetail?: ITBranchDetail;
  onSaveBranchContact: (branchId: number, form: ITBranchContactForm) => void;
  onDeleteCustomerBranchContact: (branchId: number, contactId: number) => void;
}

const BranchContactComponent: React.FC<props> = ({
  rules,
  branchDetail,
  onSaveBranchContact,
  onDeleteCustomerBranchContact,
}): React.ReactElement => {
  const [showModalContactAdd, setShowModalContactAdd] = useState(false);
  useEffect(() => {
    setShowModalContactAdd(false);
  }, [branchDetail?.customerContact]);

  const showModalBranchContactDelete = (id: number) => {
    if (branchDetail?.id) {
      Modal.confirm({
        title: "Delete this Contact",
        icon: <ExclamationCircleFilled />,
        content: "Are you sure you want to delete this ?",
        okText: "Confirm",
        okButtonProps: { type: "primary", danger: true },
        cancelText: "Cancel",
        onOk: async () => {
          onDeleteCustomerBranchContact(branchDetail.id, id);
        },
      });
    }
  };

  const columns: TableColumnsType<ITBranchContact> = [
    {
      key: "id",
      dataIndex: "id",
      title: "No",
      width: "80px",
      render: (id: number, record: ITBranchContact, index: number) => index + 1,
    },
    {
      key: "name",
      dataIndex: "name",
      title: "ชื่อ",
    },
    {
      key: "nickName",
      dataIndex: "nickName",
      title: "ชื่อเล่น",
      // width: "200px",
    },
    {
      key: "position",
      dataIndex: "position",
      title: "ตำแหน่ง",
      // width: "200px",
    },
    {
      key: "phone",
      dataIndex: "phone",
      title: "เบอร์มือถือ",
      // width: "200px",
    },
    {
      key: "officePhone",
      dataIndex: "officePhone",
      title: "เบอร์ออฟฟิศ",
      // width: "200px",
    },
    {
      key: "fax",
      dataIndex: "fax",
      title: "เบอร์แฟกซ์",
      // width: "200px",
    },
    {
      key: "email",
      dataIndex: "email",
      title: "อีเมล",
      // width: "200px",
    },
    {
      key: "birthday",
      dataIndex: "birthday",
      title: "วันเกิด",
      // width: "200px",
      render: (data: Date) => dateToStringThNoTime(data),
    },
    {
      key: "activeStatus",
      dataIndex: "activeStatus",
      title: "Status",
      render: (status: boolean) =>
        status ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Not Active</Tag>
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
          {rules.ruleCustomerContactDelete ? (
            <Button
              type="link"
              onClick={() => showModalBranchContactDelete(id)}
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
        {rules.ruleCustomerContactDelete ? (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            ghost={!showModalContactAdd}
            onClick={() => {
              setShowModalContactAdd(!showModalContactAdd);
            }}
          >
            Add Contact
          </Button>
        ) : (
          <></>
        )}
      </div>
      {showModalContactAdd && branchDetail?.id ? (
        <BranchContactAddComponent
          branchId={branchDetail?.id}
          showModalContactAdd={showModalContactAdd}
          onShowModalContactAdd={function (status: boolean): void {
            setShowModalContactAdd(status);
          }}
          onSaveBranchContact={onSaveBranchContact}
        />
      ) : (
        ""
      )}
      <Table
        size="small"
        columns={columns}
        dataSource={
          branchDetail?.customerContact ? branchDetail.customerContact : []
        }
      />
    </div>
  );
};

export default BranchContactComponent;
