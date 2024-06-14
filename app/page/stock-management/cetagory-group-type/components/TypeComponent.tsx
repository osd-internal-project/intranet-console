import { useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import MasterProductTypeServices from "../services/master-product-type.service";
import { ExclamationCircleFilled, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Modal, Switch, Table, Tag, message } from "antd";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { checkRule } from "@/app/utils/rules";
type DataType = {
  id: number;
  typeCode: string;
  typeName: string;
  activeStatus: boolean;
  typeDesc: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface props {
  propType: (checkBoolean: boolean) => void;
}

const TypeComponent: React.FC<props> = ({ propType }): React.ReactElement => {
  const stockAuth = useAxiosStock();
  const addRule = checkRule("sm-ct-a");
  const editRule = checkRule("sm-ct-e");
  const deleteRule = checkRule("sm-ct-d");
  const masterProductTypeServices = MasterProductTypeServices(stockAuth);
  const [addform] = Form.useForm();
  const [editform] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState<boolean>(true);
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [dataTable, setDataTable] = useState<DataType[]>([]);
  const [switchChecked, setSwitchChecked] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [buttonLoading, setbuttonLoading] = useState<boolean>(false);
  const [buttonconfirm, setButtonConfirm] = useState<boolean>(false);

  useEffect(() => {
    if (loading === true) getDefaultData();
  }, [loading]);
  const getDefaultData = async () => {
    const data = await masterProductTypeServices.getMasterProductTypeAll();
    setDataTable(data);
    setLoading(false);
  };
  const columns = [
    { title: "No.", dataIndex: "no", key: "no", width: "10%", render: (d: string, r: any, i: number) => (currentPage - 1) * 10 + i + 1 },
    {
      title: "CODE",
      dataIndex: "typeCode",
      key: "typeCode",
      width: "20%",
      render: (d: string) => <div className=" text-blue-500 font-bold">{d}</div>,
    },
    { title: "NAME", dataIndex: "typeName", key: "typeName", width: "40%" },
    {
      title: "STATUS",
      dataIndex: "activeStatus",
      key: "activeStatus",
      width: "10%",
      render: (d: boolean) => (d ? <Tag color="green">Active</Tag> : <Tag color="red">InActive</Tag>),
    },
    {
      title: "ACTIVE",
      dataIndex: "active",
      key: "active",

      width: "20%",
      render: (text: string, record: any) => (
        <div className="space-x-1">
          {editRule ? (
            <Button className="p-1" type="link" onClick={() => openModal("edit", record)}>
              <Icon icon="akar-icons:edit" width="25" height="25" />
            </Button>
          ) : (
            <></>
          )}
          {deleteRule ? (
            <Button
              className="p-1"
              type="link"
              danger
              onClick={() => {
                openModal("delete", record);
                setbuttonLoading(true);
              }}
              disabled={buttonLoading}
            >
              <Icon icon="solar:trash-bin-minimalistic-linear" width="25" height="25" />
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
      setSwitchChecked(true);
      setOpenAddModal(true);
    } else if (type === "edit" && record) {
      editform.resetFields();
      const form = {
        id: record.id,
        typeName: record.typeName,
      };

      editform.setFieldsValue(form);
      setSwitchChecked(record.activeStatus);
      setOpenEditModal(true);
    } else if (type === "delete" && record?.typeCode) {
      onFinishDelete(record.id);
    }
  };
  const onFinishAdd = async (values: DataType) => {
    setbuttonLoading(true);
    setButtonConfirm(true);
    await masterProductTypeServices
      .create(values)
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
    propType(false);
  };
  const onFinishEdit = async (values: DataType) => {
    setbuttonLoading(true);
    if (values.id) {
      const form = {
        typeName: values.typeName,
        activeStatus: values.activeStatus,
      };
      await masterProductTypeServices
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
    propType(false);
  };

  const onFinishDelete = async (id: number) => {
    setbuttonLoading(true);
    Modal.confirm({
      title: "Delete this type of chemical",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to delete this ?",
      okText: "Confirm",
      okButtonProps: { type: "primary", danger: true, loading: buttonLoading },
      cancelText: "Cancel",
      onOk: async () => {
        await masterProductTypeServices
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
        propType(false);
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
            <div className="sub-title-page-font">Type of Chemical</div>
            <div>
              {addRule ? (
                <Button
                  type="primary"
                  onClick={() => {
                    openModal("add", null), setbuttonLoading(true);
                  }}
                  ghost
                  icon={<PlusOutlined />}
                  disabled={buttonLoading}
                >
                  Add Type of Chemical
                </Button>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div>
            <Table
              rowKey="typeCode"
              scroll={{ x: "auto" }}
              loading={loading}
              columns={columns}
              dataSource={dataTable}
              pagination={{ onChange: handlePageChange, showSizeChanger: false }}
            />
          </div>
        </div>
      </Card>
      <Modal
        title="Add Type of Chemical"
        onCancel={() => {
          setOpenAddModal(false), setbuttonLoading(false);
        }}
        open={openAddModal}
        footer={[]}
      >
        <Form form={addform} layout="vertical" className=" w-full" onFinish={onFinishAdd}>
          <div className=" grid grid-cols-3 gap-4">
            <div className=" col-span-2">
              <Form.Item name={`typeName`} label={`Type of Chemical  :`} rules={[{ required: true, message: "Please enter type of chemical" }]}>
                <Input placeholder="Text" width={100} />
              </Form.Item>
            </div>
            <div>
              <Form.Item name={`activeStatus`} label={`Status  :`}>
                <Switch
                  checkedChildren="Active"
                  unCheckedChildren="InActive"
                  defaultChecked
                  onChange={() => {
                    setSwitchChecked(!switchChecked);
                  }}
                  className={switchChecked === true ? "active-switch" : "inactive-switch"}
                />
              </Form.Item>
            </div>

            <div className=" col-span-3 text-right space-x-2 ">
              <Button
                onClick={() => {
                  setOpenAddModal(false), setbuttonLoading(false);
                }}
              >
                Cancel
              </Button>
              <Button type="primary" loading={buttonconfirm} htmlType="submit">
                Save
              </Button>
            </div>
          </div>
        </Form>
      </Modal>
      <Modal title="Edit Type of Chemical" onCancel={() => setOpenEditModal(false)} open={openEditModal} footer={[]}>
        <Form layout="vertical" className=" w-full" onFinish={onFinishEdit} form={editform}>
          <div className=" grid grid-cols-3 gap-4">
            <Form.Item name="id" label={`Type of Chemical  :`} hidden>
              <Input placeholder="Text" width={100} />
            </Form.Item>
            <div className=" col-span-2">
              <Form.Item name="typeName" label={`Type of Chemical  :`} rules={[{ required: true, message: "Please enter type of chemical" }]}>
                <Input placeholder="Text" width={100} />
              </Form.Item>
            </div>
            <div>
              <Form.Item name="activeStatus" label={`Status  :`}>
                <Switch
                  checkedChildren="Active"
                  unCheckedChildren="InActive"
                  onChange={() => {
                    setSwitchChecked(!switchChecked);
                  }}
                  checked={switchChecked}
                  className={switchChecked === true ? "active-switch" : "inactive-switch"}
                />
              </Form.Item>
            </div>

            <div className=" col-span-3 text-right space-x-2 ">
              <Button
                onClick={() => {
                  setOpenEditModal(false), setbuttonLoading(false);
                }}
              >
                Cancel
              </Button>
              <Button type="primary" loading={buttonLoading} htmlType="submit">
                Save Change
              </Button>
            </div>
          </div>
        </Form>
      </Modal>
    </>
  );
};
export default TypeComponent;
