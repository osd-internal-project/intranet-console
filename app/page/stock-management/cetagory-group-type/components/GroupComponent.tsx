"use client";
import { useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ExclamationCircleFilled, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Modal, Select, Switch, Table, Tag, message } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useEffect, useState } from "react";
import MasterProductGroupServices from "../services/master-product-group.service";
// import MasterProductTypeServices from "../services/master-product-type.service";
import { deleteIcon, editIcon } from "@/components/icon";
import { checkRule } from "@/app/utils/rules";
export interface props {
  categoryCode: string;
  categoryId: number;
  checkcreatetypeChem: boolean;
}
type optionType = { label: string; value: string };
type producttypeType = { typeCode: string; typeName: string };
const GroupComponent: React.FC<props> = ({ categoryCode, categoryId, checkcreatetypeChem }): React.ReactElement => {
  const stockAuth = useAxiosStock();
  const addRule = checkRule("sm-cg-a");
  const editRule = checkRule("sm-cg-e");
  const deleteRule = checkRule("sm-cg-d");
  const masterProductGroupServices = MasterProductGroupServices(stockAuth);
  // const masterProductTypeServices = MasterProductTypeServices(stockAuth);
  const [addform] = Form.useForm();
  const [editform] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState<boolean>(true);
  const [dataTable, setDataTable] = useState<any[]>([]);
  const [switchChecked, setSwitchChecked] = useState<boolean>(true);
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  // const [productTypeOption, setProductTypeOption] = useState<optionType[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [buttonLoading, setbuttonLoading] = useState<boolean>(false);
  const [buttonconfirm, setButtonConfirm] = useState<boolean>(false);
  useEffect(() => {
    getDefaultData();
  }, [loading, categoryId]);

  useEffect(() => {
    if (checkcreatetypeChem) {
      getDefaultData();
    }
  }, [checkcreatetypeChem]);

  const getDefaultData = async () => {
    // const type = await masterProductTypeServices.getMasterProductTypeAllConditinons();
    // setProductTypeOption(
    //   type.map((d: any) => ({
    //     label: d.typeName,
    //     value: d.typeCode,
    //   }))
    // );
    const data = await masterProductGroupServices.getMasterProductGroupByCategoryId(categoryId);
    setDataTable(data);
    setLoading(false);
  };
  const columns: ColumnsType<any> = [
    {
      title: "CODE",
      dataIndex: "groupCode",
      key: "groupCode",
    },
    {
      title: "GROUP",
      dataIndex: "groupName",
      key: "groupName",
    },
    // {
    //   title: "type of chemical",
    //   dataIndex: "masterProductGroupMapType",
    //   key: "masterProductGroupMapType",
    //   render: (type: producttypeType[]) => type.map((t: producttypeType) => <Tag key={`tag-${t.typeCode}`}>{t.typeName}</Tag>),
    // },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (d: boolean, r: any, index: number) =>
        d ? (
          <Tag key={`atag-${1}`} color="green">
            Active
          </Tag>
        ) : (
          <Tag key={`atag-${2}`} color="red">
            InActive
          </Tag>
        ),
    },
    {
      title: "ACTIVE",
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (id: number, record: any, index: number) => (
        <div className="space-x-2">
          {editRule ? (
            <Button
              className="p-0"
              type="link"
              onClick={() => {
                openEdit(record);
              }}
              key={`group-edit-${id}`}
            >
              {editIcon}
            </Button>
          ) : (
            <></>
          )}
          {deleteRule ? (
            <Button
              className="p-0"
              key={`group-delete-${id}`}
              type="link"
              danger
              onClick={() => {
                onFinishDelete(id);
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
  async function openAdd() {
    setSwitchChecked(true);
    addform.resetFields();
    setOpenAddModal(true);
    setbuttonLoading(true);
  }
  async function onFinishAdd(values: any) {
    setbuttonLoading(true);
    setButtonConfirm(true);
    // let typeList: producttypeType[] = [];

    // if (values.typeList.length > 0) {
    //   typeList = productTypeOption.filter((item: optionType) => values.typeList.includes(item.value)).map((item: optionType) => ({ typeCode: item.value, typeName: item.label }));
    // }
    const form = {
      masterProductCategoriesId: categoryId,
      groupName: values.groupName,
      status: switchChecked,
      // masterProductGroupMapType: {
      //   create: typeList,
      // },
    };
    const data = await masterProductGroupServices.create(form);
    if (data) {
      message.success("Add success");
    }
    setLoading(true);
    setOpenAddModal(false);
    setbuttonLoading(false);
    setButtonConfirm(false);
  }
  async function openEdit(field: any) {
    setEditId(field.id);
    // const optionSelected: string[] = field.masterProductGroupMapType?.map((type: producttypeType) => type.typeCode);
    setSwitchChecked(field.status);
    editform.setFieldsValue({
      groupName: field.groupName,
      activeStatus: field.status,
      // , typeList: optionSelected
    });
    setOpenEditModal(true);
  }
  async function onFinishEdit(values: any) {
    setbuttonLoading(true);
    // let typeList: producttypeType[] = [];

    // if (values.typeList.length > 0) {
    //   typeList = productTypeOption
    //     .filter((item: optionType) => values.typeList.includes(item.value))
    //     .map((item: optionType) => ({ typeCode: item.value, typeName: item.label }));
    // }
    const form = {
      groupName: values.groupName,
      status: switchChecked,
      // masterProductGroupMapType: {
      //   deleteMany: {},
      //   createMany: { data: typeList },
      // },
    };
    if (editId) {
      const data = await masterProductGroupServices.update(editId, form);
      if (data) {
        message.success("Edit success");
      }
      setLoading(true);
      setOpenEditModal(false);
    }
    setbuttonLoading(false);
  }
  const onFinishDelete = async (id: number) => {
    setbuttonLoading(true);
    Modal.confirm({
      title: "Delete this group",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to delete this ?",
      okText: "Confirm",
      okButtonProps: { type: "primary", danger: true },
      cancelText: "Cancel",
      onOk: async () => {
        await masterProductGroupServices
          .delete(id)
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
        setLoading(true);
        setbuttonLoading(false);
      },
      onCancel() {
        setLoading(true);
        setbuttonLoading(false);
      },
    });
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <>
      {contextHolder}
      <Card>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex justify-between">
            <div className="sub-title-page-font">Group</div>
            <div>
              {addRule ? (
                <Button type="primary" ghost icon={<PlusOutlined />} onClick={openAdd} disabled={buttonLoading}>
                  Add Group
                </Button>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div>
            <Table
              scroll={{ x: "auto" }}
              columns={columns}
              dataSource={dataTable}
              rowKey="id"
              pagination={{ onChange: handlePageChange, showSizeChanger: false }}
            />
          </div>
        </div>
      </Card>
      {/* add */}
      <Modal
        title="Add Group"
        onCancel={() => {
          setOpenAddModal(false);
          addform.resetFields();
          setbuttonLoading(false);
        }}
        open={openAddModal}
        footer={[]}
      >
        <Form form={addform} layout="vertical" className=" w-full" onFinish={onFinishAdd}>
          <div className=" grid grid-cols-3 gap-x-4">
            <div className=" col-span-2">
              <Form.Item name={`groupName`} label={`Group  :`} rules={[{ required: true, message: "Please enter group" }]}>
                <Input placeholder="Text" width={100} />
              </Form.Item>
            </div>
            <div>
              <Form.Item name={`activeStatus`} label={`Status  :`}>
                <Switch
                  checkedChildren="Active"
                  unCheckedChildren="InActive"
                  defaultChecked
                  checked={switchChecked}
                  onChange={() => {
                    setSwitchChecked(!switchChecked);
                  }}
                  className={switchChecked === true ? "active-switch" : "inactive-switch"}
                />
              </Form.Item>
            </div>
            {/* <div className=" col-span-3 m-0">
              <Form.Item name={`typeList`} label={`Type of Chemical : `} rules={[{ required: true, message: "Please enter type of chemical " }]}>
                <Select showSearch={false} placeholder="Select Type" allowClear options={productTypeOption} mode="multiple" />
              </Form.Item>
            </div> */}

            <div className=" col-span-3 text-right space-x-2 ">
              <Button
                onClick={() => {
                  setOpenAddModal(false);
                  addform.resetFields();
                  setbuttonLoading(false);
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

      {/* edit */}
      <Modal
        title="Edit Group"
        onCancel={() => {
          setOpenEditModal(false), setbuttonLoading(false);
        }}
        open={openEditModal}
        footer={[]}
      >
        <Form form={editform} layout="vertical" className=" w-full" onFinish={onFinishEdit}>
          <div className=" grid grid-cols-3 gap-x-4">
            <div className=" col-span-2">
              <Form.Item name={`groupName`} label={`Group  :`} rules={[{ required: true, message: "Please enter group" }]}>
                <Input placeholder="Text" width={100} />
              </Form.Item>
            </div>
            <div>
              <Form.Item name={`activeStatus`} label={`Status  :`}>
                <Switch
                  checkedChildren="Active"
                  unCheckedChildren="InActive"
                  defaultChecked
                  checked={switchChecked}
                  onChange={() => {
                    setSwitchChecked(!switchChecked);
                  }}
                  className={switchChecked === true ? "active-switch" : "inactive-switch"}
                />
              </Form.Item>
            </div>
            {/* <div className=" col-span-3 m-0">
              <Form.Item name={`typeList`} label={`Type of Chemical : `} rules={[{ required: true, message: "Please enter type of chemical " }]}>
                <Select allowClear placeholder="Select Type" options={productTypeOption} mode="multiple" />
              </Form.Item>
            </div> */}

            <div className=" col-span-3 text-right space-x-2 ">
              <Button onClick={() => setOpenEditModal(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={buttonLoading}>
                Save Change
              </Button>
            </div>
          </div>
        </Form>
      </Modal>
    </>
  );
};
export default GroupComponent;
