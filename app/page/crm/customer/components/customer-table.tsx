import React, { useEffect, useState } from "react";
import type {
  BadgeProps,
  CalendarProps,
  TableColumnsType,
  TableColumnType,
  TablePaginationConfig,
} from "antd";
import {
  Badge,
  Button,
  Calendar,
  Form,
  Input,
  Modal,
  Select,
  Switch,
  Table,
  Tag,
} from "antd";
import type { Dayjs } from "dayjs";
import { ITCustomer, ITCustomerForm, ITPagination } from "../common";
import { ColumnType } from "antd/es/table";
import { dateToStringTh, dateToStringThNoTime } from "@/app/utils/format";
import { deleteIcon, editIcon } from "@/components/icon";
import { useForm } from "antd/es/form/Form";
import { ExclamationCircleFilled } from "@ant-design/icons";
import Link from "next/link";

export interface props {
  rules: any;
  dataTable: ITCustomer[];
  loading: boolean;
  setLoading: (loading: boolean) => void;
  pagination: TablePaginationConfig;
  changePagination: (pagination: TablePaginationConfig) => void;
  // editCustomer: (id: number, data: ITCustomerForm) => void;
  deleteCustomer: (id: number) => void;
}

const CustomerTableComponent: React.FC<props> = ({
  rules,
  dataTable,
  loading,
  setLoading,
  pagination,
  changePagination,
  // editMaType,
  deleteCustomer,
}): React.ReactElement => {
  useEffect(() => {
    if (loading === true) {
      setEditId(undefined);
      // setDeleteId(undefined);
    }
  }, [loading]);

  const [editForm] = useForm();
  const [editId, setEditId] = useState<number | undefined>(undefined);
  function showModalEdit(record: ITCustomer): void {
    setEditId(record.id);
    editForm.setFieldsValue(record);
  }

  function showModalDelete(id: number): void {
    Modal.confirm({
      title: "Delete this Customer",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to delete this ?",
      okText: "Confirm",
      okButtonProps: { type: "primary", danger: true },
      cancelText: "Cancel",
      onOk: async () => {
        deleteCustomer(id);
      },
      // onCancel() {
      //   setDeleteId(undefined);
      // },
    });
  }
  // function onMaTypeEdit(e: ITCustomer) {
  //   if (editId) editMaType(editId, { ...e });
  // }

  const customerColumns: TableColumnsType<ITCustomer> = [
    {
      key: "customerCode",
      title: "รหัส",
      dataIndex: "customerCode",
      width: "100px",
      align: "center",
    },
    {
      key: "referenceCode",
      dataIndex: "referenceCode",
      title: "รหัสอ้างอิงลูกค้า",
      width: "200px",
    },
    {
      key: "customerTypeId",
      dataIndex: "customerTypeId",
      title: "Type",
      width: "200px",
      render: (value: string, record, index) =>
        value === "natural"
          ? "บุคคลธรรมดา"
          : value === "juristic"
          ? "นิติบุคคล"
          : "",
    },
    {
      key: "customerName",
      dataIndex: "customerName",
      title: "ชื่อ",
      width: "200px",
      render: (value: string, record, index) =>
        record?.customerTypeId
          ? record?.customerTypeId === "natural"
            ? `${record.details?.prefixTh ? record.details?.prefixTh : ""}${
                record.details?.firstNameTh ? record.details?.firstNameTh : ""
              }${
                record.details?.lastNameTh
                  ? ` ${record.details?.lastNameTh}`
                  : ""
              }`
            : record.customerTypeId === "juristic"
            ? record.details?.customerNameTh
            : ""
          : "",
    },
    {
      key: "activeStatus",
      dataIndex: "activeStatus",
      title: "Active",
      width: "200px",
      render: (value: boolean, record, index) =>
        value ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">not Active</Tag>
        ),
    },
    {
      key: "customerTypeGroupName",
      dataIndex: "customerTypeGroupName",
      title: "กลุ่มลูกค้า",
      width: "200px",
    },
    {
      key: "grade",
      dataIndex: "grade",
      title: "Grade",
      width: "200px",
    },
    {
      key: "responsible",
      dataIndex: "responsible",
      title: "พนักงานขาย",
      width: "200px",
      render: (value: { uid: string; name: string }[]) =>
        value
          ? value.map((data, index) => <div key={index}>{data.name}</div>)
          : "",
    },
    {
      key: "companyRegisNumber",
      dataIndex: "companyRegisNumber",
      title: "เลขทะเบียนบริษัท",
      width: "200px",
    },
    {
      key: "id",
      dataIndex: "id",
      title: "ตรวจสอบ",
      width: "200px",
      align: "center",
      render: (id: number, record: ITCustomer, index: number) => (
        <div className="space-x-1" key={index}>
          <Link href={`/page/crm/customer/${id}`}>
            <Button type="link">View</Button>
          </Link>
        </div>
      ),
    },
    {
      key: "id",
      dataIndex: "id",
      title: "ดำเนินการ",
      width: "200px",
      align: "center",
      render: (id: number, record: ITCustomer, index: number) => (
        <div className="space-x-1" key={index}>
          {/* <Button type="link" onClick={() => showModalEdit(record)}>
            {editIcon}
          </Button> */}
          {rules.ruleCustomerDelete ? (
            <Button type="link" onClick={() => showModalDelete(id)} danger>
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
    <>
      <Table
        columns={customerColumns}
        dataSource={dataTable}
        size="small"
        pagination={pagination}
        onChange={changePagination}
        rowKey={(data: ITCustomer) => data.id}
      />
    </>
  );
};

export default CustomerTableComponent;
