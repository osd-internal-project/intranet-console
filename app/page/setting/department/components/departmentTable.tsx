import React, { useEffect, useState } from "react";
import type { TableColumnsType } from "antd";
import { Button, Form, Input, InputNumber, Modal, Switch, Table, Tag } from "antd";
import { dateToStringTh } from "@/app/utils/format";
import { deleteIcon, editIcon } from "@/components/icon";
import { useForm } from "antd/es/form/Form";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { TdepartmentCreateDto, TdepartmentFindMany } from "../common";
import { TPagination } from "@/app/types/user-type";

type Props = {
  dataTable: TdepartmentFindMany[];
  loading: boolean;
  setLoading: (loading: boolean) => void;
  pagination: TPagination;
  changePagination: (page: { current: number; pageSize: number }) => void;
  editDepartMent: (id: number, data: TdepartmentCreateDto) => void;
  deleteDepartMent: (id: number) => void;
};

const DepartmentComponent: React.FC<Props> = ({
  dataTable,
  loading,
  setLoading,
  pagination,
  changePagination,
  editDepartMent,
  deleteDepartMent,
}): React.ReactElement => {
  const [editForm] = useForm();
  const [editId, setEditId] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (loading === true) {
      setEditId(undefined);
    }
  }, [loading]);

  function showModalEdit(record: TdepartmentFindMany): void {
    setEditId(record.id);
    editForm.setFieldsValue(record);
  }

  function showModalDelete(id: number): void {
    Modal.confirm({
      title: "Delete this DepartMent",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to delete this ?",
      okText: "Confirm",
      okButtonProps: { type: "primary", danger: true },
      cancelText: "Cancel",
      onOk: async () => {
        deleteDepartMent(id);
      },
    });
  }

  function onDepartMentEdit(e: TdepartmentCreateDto) {
    if (editId) editDepartMent(editId, { ...e });
  }

  const maColumns: TableColumnsType<TdepartmentFindMany> = [
    { key: "departId", dataIndex: "departId", title: "Department Id.", width: "120px", align: "center" },
    { key: "departName", dataIndex: "departName", title: "Department Name.", width: "280px" },
    { key: "createdAt", dataIndex: "createdAt", title: "Created.", width: "150px", render: (data: Date) => (data ? dateToStringTh(data) : "-") },
    { key: "updatedAt", dataIndex: "updatedAt", title: "Updated.", width: "150px", render: (data: Date) => (data ? dateToStringTh(data) : "-") },
    {
      key: "id",
      dataIndex: "id",
      title: "ดำเนินการ",
      width: "200px",
      align: "center",
      render: (id: number, record: TdepartmentFindMany, index: number) => (
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
      <Table columns={maColumns} dataSource={dataTable} size="small" rowKey={(data: TdepartmentFindMany) => data.id} />
      <Modal
        title="Edit DepartMent"
        open={editId ? true : false}
        footer={[]}
        onCancel={() => {
          setEditId(undefined);
        }}
      >
        <Form form={editForm} onFinish={onDepartMentEdit}>
          <Form.Item label={"DepartMent Id"}  name={"departId"}>
            <InputNumber />
          </Form.Item>
          <Form.Item label={"DepartMent Name"} name={"departName"}>
            <Input />
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

export default DepartmentComponent;
