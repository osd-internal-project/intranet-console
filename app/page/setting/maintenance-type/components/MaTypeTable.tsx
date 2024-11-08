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

const MaTypeTableComponent: React.FC<props> = ({ dataTable, loading, editMaType, deleteMaType }): React.ReactElement => {
  const [editForm] = useForm();
  const [editId, setEditId] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (loading === true) {
      setEditId(undefined);
    }
  }, [loading]);

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
    });
  }

  function onMaTypeEdit(e: ITMaTypeForm) {
    if (editId) editMaType(editId, { ...e });
  }

  const maColumns: TableColumnsType<ITMaType> = [
    {
      key: "id",
      title: "ลำดับ",
      dataIndex: "id",
      align: "center",
      render: (id: number, record: ITMaType, index: number) => index + 1,
    },
    { key: "name", dataIndex: "name", title: "ประเภทการบำรุงรักษา" },
    {
      key: "activeStatus",
      dataIndex: "activeStatus",
      title: "สถานะ",
      align: "center",
      render: (data: Boolean) => (data ? <Tag color="green">ใช้งาน</Tag> : <Tag color="red">ปิดการใช้งาน</Tag>),
    },
    { key: "createdAt", dataIndex: "createdAt", title: "วันที่สร้าง", render: (data: Date) => (data ? dateToStringTh(data) : "-") },
    { key: "updatedAt", dataIndex: "updatedAt", title: "วันที่แก้ไข", render: (data: Date) => (data ? dateToStringTh(data) : "-") },
    {
      key: "id",
      dataIndex: "id",
      title: "...",
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
      <Table columns={maColumns} dataSource={dataTable} size="small" rowKey={(data: ITMaType) => data.id} scroll={{ x: "max-content" }} />
      <Modal
        title="แก้ไขข้อมูล"
        open={editId ? true : false}
        footer={false}
        onCancel={() => {
          setEditId(undefined);
        }}>
        <Form form={editForm} onFinish={onMaTypeEdit} layout="vertical">
          <div className=" col-span-2 grid grid-cols-2 space-x-2">
            <div>
              <Form.Item name={"name"} label={`ประเภทการบำรุงรักษา :`} rules={[{ required: true, message: "Plase enter MA Type Name" }]}>
                <Input />
              </Form.Item>
            </div>
            <div>
              <Form.Item name={"activeStatus"} label={`สถานะ :`}>
                <Switch />
              </Form.Item>
            </div>
          </div>
          <Form.Item>
            <div className=" space-x-2 text-right">
              <Button
                onClick={() => {
                  setEditId(undefined);
                }}>
                ยกเลิก
              </Button>
              <Button type="primary" htmlType="submit">
                แก้ไข
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default MaTypeTableComponent;
