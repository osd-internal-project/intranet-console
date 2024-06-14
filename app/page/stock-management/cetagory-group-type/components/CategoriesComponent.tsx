"use client";
import { useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import MasterProductCategoryServices from "../services/master-product-category.service";
import { InfoCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Card, Form, Input, Modal, Space, Table, message } from "antd";
import { Button } from "antd/lib";
import { useState, useEffect } from "react";
import { deleteIcon, editIcon } from "@/components/icon";
import { checkRule } from "@/app/utils/rules";
type DataType = {
  id: number;
  categoryCode: string;
  categoryName: string;
};

export interface props {
  propCategory: (categoryCode: string | null, categoryId: number | null, checkBoolean: boolean) => void;
}

const CategoriesComponent: React.FC<props> = ({ propCategory }): React.ReactElement => {
  const stockAuth = useAxiosStock();
  const addRule = checkRule("sm-c-a");
  const editRule = checkRule("sm-c-e");
  const deleteRule = checkRule("sm-c-d");
  const masterProductCagetoryServices = MasterProductCategoryServices(stockAuth);
  const [dataTable, setDataTable] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [addform] = Form.useForm();
  const [editform] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [buttonLoading, setbuttonLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [buttonconfirm, setButtonConfirm] = useState<boolean>(false);
  const [buttondel, setButtondel] = useState<boolean>(false);

  useEffect(() => {
    if (loading === true) {
      getDefaultData();
    }
  }, [loading]);
  const getDefaultData = async () => {
    const data = await masterProductCagetoryServices.getMasterProductCategoryAll();
    setDataTable(data);
    setLoading(false);
  };

  const columns = [
    {
      title: "categoryCode",
      dataIndex: "categoryCode",
      key: "categoryCode",
      render: (d: string, record: DataType, index: number) => (
        <Button
          key={`category-show-${index}`}
          onClick={() => {
            propCategory(d, record.id, true);
            setSelectedRowKeys(index);
          }}
          type="link"
          className=" text-blue-600 font-bold "
        >
          <span className={index === selectedRowKeys ? "underline  " : ""}>{d}</span>
        </Button>
      ),
    },
    { title: "categoryName", dataIndex: "categoryName", key: "categoryName" },
    {
      title: "active",
      dataIndex: "active",
      key: "active",
      width: "100px",
      render: (text: string, record: any, index: number) => (
        <div className="space-x-2">
          {editRule ? (
            <Button className="p-0" type="link" key={`category-edit-${index}`} onClick={() => openModal("edit", record)}>
              {editIcon}
            </Button>
          ) : (
            <></>
          )}
          {deleteRule ? (
            <Button
              className="p-0"
              key={`category-delete-${index}`}
              type="link"
              danger
              onClick={() => {
                openModal("delete", record), setbuttonLoading(true);
              }}
              disabled={buttonLoading}
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

  const openModal = (type: string, record: DataType | null) => {
    if (type === "add") {
      addform.resetFields();
      setOpenAddModal(true);
    } else if (type === "edit" && record) {
      editform.resetFields();
      const form = {
        id: record.id,
        categoryName: record.categoryName,
      };

      editform.setFieldsValue(form);
      setOpenEditModal(true);
    } else if (type === "delete" && record?.id) {
      setDeleteId(record.id);
      setOpenDeleteModal(true);
    }
  };
  const onFinishAdd = async (values: DataType) => {
    setbuttonLoading(true);
    setButtonConfirm(true);
    const form = {
      categoryName: values.categoryName,
    };
    await masterProductCagetoryServices
      .create(form)
      .then(() => {
        messageApi.open({
          type: "success",
          content: "Add success",
        });
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "ไม่สามารถดำเนินการได้",
        });
      });
    setLoading(true);
    setOpenAddModal(false);
    setbuttonLoading(false);
    setButtonConfirm(false);
  };
  const onFinishEdit = async (values: DataType) => {
    setbuttonLoading(true);
    if (values.id) {
      const form = {
        categoryName: values.categoryName,
      };
      await masterProductCagetoryServices
        .update(values.id, form)
        .then(() => {
          messageApi.open({
            type: "success",
            content: "Edit success",
          });
        })
        .catch((err) => {
          messageApi.open({
            type: "error",
            content: "ไม่สามารถดำเนินการได้",
          });
        });
    }

    setLoading(true);
    setOpenEditModal(false);
    setbuttonLoading(false);
  };
  const onFinishDelete = async () => {
    setbuttonLoading(true);
    setButtondel(true);
    if (deleteId) {
      await masterProductCagetoryServices
        .delete(deleteId)
        .then(() => {
          messageApi.open({
            type: "success",
            content: "Delete success",
          });
        })
        .catch((err) => {
          messageApi.open({
            type: "error",
            content: "ไม่สามารถดำเนินการได้",
          });
        });
    }
    setLoading(true);
    setOpenDeleteModal(false);
    setbuttonLoading(false);
    setButtondel(false);
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <>
      {contextHolder}
      <Card className=" w-full ">
        <div>
          <div className="flex justify-between ">
            <div className="sub-title-page-font  ">Category</div>
            <div>
              {addRule ? (
                <Button
                  type="primary"
                  ghost
                  icon={<PlusOutlined />}
                  onClick={() => {
                    openModal("add", null);
                    setbuttonLoading(true);
                  }}
                  disabled={buttonLoading}
                >
                  Add Category
                </Button>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div style={{ overflowX: "auto", maxHeight: "400px" }}>
            <Table
              columns={columns}
              rowKey="id"
              showHeader={false}
              dataSource={dataTable}
              pagination={{ onChange: handlePageChange, showSizeChanger: false }}
            />
          </div>
        </div>
      </Card>

      <Modal
        title="Add Category"
        onCancel={() => {
          setOpenAddModal(false), setbuttonLoading(false);
        }}
        open={openAddModal}
        footer={[]}
      >
        <Form layout="vertical" className=" w-full" onFinish={onFinishAdd} form={addform}>
          <div className=" grid grid-cols-1 gap-4">
            <div>
              <Form.Item name={`categoryName`} label={`Category :`} rules={[{ required: true, message: "Please enter category" }]}>
                <Input placeholder="Text" width={100} className="" />
              </Form.Item>
            </div>
            <div className=" col-span-3 text-right space-x-2">
              <Button
                onClick={() => {
                  setOpenAddModal(false), setbuttonLoading(false);
                }}
              >
                Cancel
              </Button>
              <Button type="primary" loading={buttonconfirm} htmlType="submit">
                Add
              </Button>
            </div>
          </div>
        </Form>
      </Modal>

      <Modal title="Edit Category" onCancel={() => setOpenEditModal(false)} open={openEditModal} footer={[]}>
        <Form layout="vertical" className=" w-full" onFinish={onFinishEdit} form={editform}>
          <div className=" grid grid-cols-1 gap-4">
            <Form.Item name="id" label={`Type of Chemical  :`} hidden>
              <Input placeholder="Text" width={100} />
            </Form.Item>
            <div className=" col-span-1">
              <Form.Item name="categoryName" label={`Category  :`} rules={[{ required: true, message: "Please enter category" }]}>
                <Input placeholder="Text" width={100} />
              </Form.Item>
            </div>

            <div className=" col-span-1 text-right space-x-2 ">
              <Button onClick={() => setOpenEditModal(false)}>Cancel</Button>
              <Button type="primary" loading={buttonLoading} htmlType="submit">
                Save Change
              </Button>
            </div>
          </div>
        </Form>
      </Modal>
      <Modal
        title={
          <>
            <Space>
              <InfoCircleOutlined style={{ color: "orange", fontSize: "18px" }} />
              {"Delete this category"}
            </Space>
          </>
        }
        onCancel={() => {
          setOpenDeleteModal(false), setbuttonLoading(false);
        }}
        open={openDeleteModal}
        footer={[]}
      >
        <div className=" grid grid-cols-1 gap-4">
          <div className=" col-span-1">Are you sure you want to delete this ?</div>
          <div className=" col-span-1 text-right space-x-2 ">
            <Button
              onClick={() => {
                setOpenDeleteModal(false), setbuttonLoading(false);
              }}
            >
              Cancel
            </Button>
            <Button type="primary" danger loading={buttondel} onClick={onFinishDelete}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default CategoriesComponent;
