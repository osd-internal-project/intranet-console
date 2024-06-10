import React, { useEffect, useState } from "react";
import type { BadgeProps, CalendarProps, TableColumnsType, TableColumnType } from "antd";
import { Badge, Button, Calendar, Form, Input, Modal, Select, Switch, Table, Tag } from "antd";
import type { Dayjs } from "dayjs";
import { ITMaType, ITMaTypeForm, ITPagination } from "../common";
import { ColumnType } from "antd/es/table";
import { dateToStringTh, dateToStringThNoTime } from "@/app/utils/format";
import { deleteIcon, editIcon } from "@/components/icon";
import { useForm } from "antd/es/form/Form";
import { ExclamationCircleFilled } from "@ant-design/icons";

export interface props {
  dataTable: ITMaType[];
  loading: boolean;
  setLoading: (loading: boolean) => void;
  pagination: ITPagination;
  changePagination: (page: { current: number; pageSize: number }) => void;
  editMaType: (id: number, data: ITMaTypeForm) => void;
  deleteMaType: (id: number) => void;
}

const MaTypeTableComponent: React.FC<props> = ({ dataTable, loading, setLoading, pagination, changePagination, editMaType, deleteMaType }): React.ReactElement => {
  useEffect(() => {
    if (loading === true) {
      setEditId(undefined);
      // setDeleteId(undefined);
    }
  }, [loading]);

  const [editForm] = useForm();
  const [editId, setEditId] = useState<number | undefined>(undefined);
  function showModalEdit(record: ITMaType): void {
    setEditId(record.id);
    editForm.setFieldsValue(record);
  }

  function showModalDelete(id: number): void {
    Modal.confirm({
      title: "Delete this Maintenance Type",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to delete this ?",
      okText: "Confirm",
      okButtonProps: { type: "primary", danger: true },
      cancelText: "Cancel",
      onOk: async () => {
        deleteMaType(id);
      },
      // onCancel() {
      //   setDeleteId(undefined);
      // },
    });
  }
  function onMaTypeEdit(e: ITMaTypeForm) {
    if (editId) editMaType(editId, { ...e });
  }

  const maColumns: TableColumnsType<ITMaType> = [
    {
      key: "id",
      title: "NO",
      dataIndex: "id",
      width: "100px",
      align: "center",
      render: (id: number, record: ITMaType, index: number) => index + 1,
    },
    { key: "name", dataIndex: "name", title: "ประเภท MA", width: "200px" },
    {
      key: "activeStatus",
      dataIndex: "activeStatus",
      title: "ACTIVE STATUS",
      width: "200px",
      render: (data: Boolean) => (data ? <Tag color="green">Active</Tag> : <Tag color="red">In Active</Tag>),
    },
    { key: "createdAt", dataIndex: "createdAt", title: "CREATED AT", width: "200px", render: (data: Date) => (data ? dateToStringTh(data) : "-") },
    { key: "updatedAt", dataIndex: "updatedAt", title: "UPDATED AT", width: "200px", render: (data: Date) => (data ? dateToStringTh(data) : "-") },
    {
      key: "id",
      dataIndex: "id",
      title: "ดำเนินการ",
      width: "200px",
      align: "center",
      render: (id: number, record: ITMaType, index: number) => (
        <div className="space-x-1">
          <Button type="link" onClick={() => showModalEdit(record)}>
            {editIcon}
          </Button>
          <Button type="link" onClick={() => showModalDelete(id)} danger>
            {deleteIcon}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table columns={maColumns} dataSource={dataTable} size="small" rowKey={(data: ITMaType) => data.id} />
      <Modal
        title="Edit Maintenance Type"
        open={editId ? true : false}
        footer={[]}
        onCancel={() => {
          setEditId(undefined);
        }}
      >
        <Form form={editForm} onFinish={onMaTypeEdit}>
          <Form.Item name={"name"} rules={[{ required: true, message: "Plase enter MA Type Name" }]}>
            <Input />
          </Form.Item>
          <Form.Item name={"activeStatus"}>
            <Switch />
          </Form.Item>
          <Form.Item>
            <div className=" space-x-2 text-right">
              <Button
                onClick={() => {
                  setEditId(undefined);
                }}
              >
                Close
              </Button>
              <Button type="primary" htmlType="submit">
                Confirm
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default MaTypeTableComponent;
