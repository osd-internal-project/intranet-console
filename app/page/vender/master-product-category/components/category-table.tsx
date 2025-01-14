import { ITActionStatus } from "@/app/common";
import {
  ITMasterProductCategory,
  ITMasterProductCategoryForm,
} from "@/app/common/master-product-category";
import { dateFormatTime } from "@/app/utils";
import { Button, Form, Input, Modal, Table, TableProps } from "antd";
import { FormInstance } from "antd/lib";
import { useEffect, useState } from "react";

interface props {
  categories: ITMasterProductCategory[];
  categoryForm: FormInstance;
  openModalCategory: ITActionStatus;
  setOpenModalCategory: (data: ITActionStatus) => void;
  fetchDataCategory: (search: any) => void;
  onSubmitCategory: (
    data: ITMasterProductCategoryForm | ITMasterProductCategory
  ) => void;
}
export const CategoryTable: React.FC<props> = ({
  categories,
  categoryForm,
  openModalCategory,
  setOpenModalCategory,
  fetchDataCategory,
  onSubmitCategory,
}): React.ReactElement => {
  useEffect(() => {
    fetchDataCategory({});
  }, []);

  function openEditCategory(row: any): void {
    categoryForm.setFieldsValue(row);
    setOpenModalCategory("update");
  }

  function deleteCategory(row: any): void {
    throw new Error("Function not implemented.");
  }

  const columns: TableProps["columns"] = [
    {
      title: "No.",
      key: "no",
      dataIndex: "no",
      align: "center",
      width: "100px",
    },
    { title: "Name", key: "name", dataIndex: "name" },
    { title: "Description", key: "description", dataIndex: "description" },
    {
      title: "Created Date",
      key: "createdAt",
      dataIndex: "createdAt",
      width: "200px",
      render: (data) => dateFormatTime(data),
    },
    {
      title: "Updated Date",
      key: "updatedAt",
      dataIndex: "updatedAt",
      width: "200px",
      render: (data) => dateFormatTime(data),
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      align: "center",
      width: "200px",
      render: (data, row) => (
        <div className=" space-x-2">
          <Button type="link" onClick={() => openEditCategory(row)}>
            Edit
          </Button>
          <Button type="link" onClick={() => deleteCategory(row)} danger>
            Delete
          </Button>
        </div>
      ),
    },
  ];
  return (
    <>
      <div className=" mb-2 flex justify-between">
        <div className=" font-bold text-lg">Category</div>
        <div>
          <Button type="primary" onClick={() => setOpenModalCategory("create")}>
            Add
          </Button>
        </div>
      </div>

      <div>
        <Table columns={columns} dataSource={categories} />
      </div>
      <Modal
        open={openModalCategory ? true : false}
        title={
          openModalCategory === "create"
            ? "Add Category"
            : openModalCategory === "update"
            ? "Edit Category"
            : ""
        }
        onCancel={() => {
          categoryForm.resetFields();
          setOpenModalCategory(undefined);
        }}
        footer={false}
      >
        <Form form={categoryForm} layout="vertical" onFinish={onSubmitCategory}>
          {openModalCategory && openModalCategory === "update" && (
            <Form.Item
              name={"id"}
              label={"ID"}
              hidden={true}
              rules={[{ required: true, message: "Plese Enter" }]}
            >
              <Input placeholder="Text..." />
            </Form.Item>
          )}
          <Form.Item
            name={"name"}
            label={"Name"}
            rules={[{ required: true, message: "Plese Enter" }]}
          >
            <Input placeholder="Text..." />
          </Form.Item>
          <Form.Item name={"description"} label={"Description"}>
            <Input placeholder="Text..." />
          </Form.Item>
          <div className=" flex justify-end">
            <Button type="primary" htmlType="submit">
              {openModalCategory === "create" && "Add"}
              {openModalCategory === "update" && "Edit"}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};
