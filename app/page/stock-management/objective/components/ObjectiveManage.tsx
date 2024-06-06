"use client";
import React, { useEffect, useState } from "react";
import { Button, Card, Form, Input, Modal, Switch, Tree, message } from "antd";
import type { DataNode } from "antd/es/tree";
import Title from "antd/es/skeleton/Title";
import { useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import MasterObjectiveServices from "../services/master-objective.service";
import { ExclamationCircleFilled } from "@ant-design/icons";
export interface props {
  propDataManage: (res: { loading: boolean; manageStatus?: { status?: string; id?: number } }) => void;
  data?: {
    id: number;
    name: string;
    status: boolean;
    description?: string;
  };
  manageStatus?: { status?: string; id?: number };
  setbuttonLoading: (e: boolean) => void;
  buttonLoading: boolean;
}

type objectiveType = {
  id?: number;
  name: string;
  status: boolean;
  description: string;
};
const ObjectiveManage: React.FC<props> = ({ propDataManage, manageStatus, setbuttonLoading, buttonLoading }): React.ReactElement => {
  const stockAuth = useAxiosStock();
  const masterObjectiveServices = MasterObjectiveServices(stockAuth);
  const [addform] = Form.useForm();
  const [editform] = Form.useForm();
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [switchChecked, setSwitchChecked] = useState(true);
  const [buttonconfirm, setButtonConfirm] = useState(false);

  useEffect(() => {
    loaddata();
  }, [manageStatus]);
  const loaddata = async () => {
    if (manageStatus?.status === "add") {
      addform.resetFields();
      setSwitchChecked(true);
      setOpenModalAdd(true);
    } else if (manageStatus?.status === "edit" && manageStatus.id) {
      const form = await masterObjectiveServices.getMasterObjectiveById(manageStatus.id);
      editform.resetFields();
      editform.setFieldsValue(form);
      setSwitchChecked(form.status);
      setOpenModalEdit(true);
    } else if (manageStatus?.status === "delete" && manageStatus.id) {
      onFinishDelete(manageStatus.id);
    }
  };
  const onFinishAdd = async (values: objectiveType) => {
    setbuttonLoading(true);
    setButtonConfirm(true);
    const form = { name: values.name, status: switchChecked, description: values.description };
    await masterObjectiveServices
      .addMasterObjective(form)
      .then((res) =>
        message.open({
          type: "success",
          content: "Add success",
        }),
      )
      .catch((err) => {
        message.open({
          type: "error",
          content: err,
        });
      });
    cancelModal("add");
    setbuttonLoading(false);
    setButtonConfirm(false);
  };
  const onFinishEdit = async (values: objectiveType) => {
    setbuttonLoading(true);
    const form = { name: values.name, status: switchChecked, description: values.description };
    if (values.id) {
      await masterObjectiveServices
        .updateMasterObjective(values.id, form)
        .then((res) =>
          message.open({
            type: "success",
            content: "Edit success",
          }),
        )
        .catch((err) => {
          message.open({
            type: "error",
            content: err,
          });
        });
    } else {
      message.open({
        type: "error",
        content: "ไม่พบ Objective",
      });
    }
    cancelModal("edit");
    setbuttonLoading(false);
  };

  const onFinishDelete = (id: number) => {
    setbuttonLoading(true);
    Modal.confirm({
      title: "Delete this objective",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to delete this ?",
      okText: "Confirm",
      okButtonProps: { type: "primary", danger: true },
      cancelText: "Cancel",
      onOk: async () => {
        const dataResult = await masterObjectiveServices.deleteMasterObjective(id);
        if (dataResult) {
          message.success(`Delete success`);
          propDataManage({ loading: true });
        }
        setbuttonLoading(false);
      },
      onCancel() {
        setbuttonLoading(false);
      },
    });
  };
  const cancelModal = (type: string) => {
    if (type === "add") {
      setOpenModalAdd(false);
      propDataManage({ loading: true });
    } else if (type === "edit") {
      setOpenModalEdit(false);
      propDataManage({ loading: true });
    } else if (type === "delete") {
      setOpenModalDelete(false);
      propDataManage({ loading: true });
    }
  };

  return (
    <>
      <Modal
        open={openModalAdd}
        footer={[]}
        title="Add Objective"
        onCancel={() => {
          setOpenModalAdd(false);
          propDataManage({ loading: true, manageStatus: { status: undefined, id: undefined } });
        }}
      >
        <Form layout="vertical" className=" w-full" onFinish={onFinishAdd} form={addform}>
          <div className=" grid grid-cols-3 gap-4">
            <div className=" col-span-2">
              <Form.Item name="name" label={`Objective Name  :`} rules={[{ required: true, message: "Please enter objective name" }]}>
                <Input placeholder="Text" width={100} />
              </Form.Item>
            </div>
            <div>
              <Form.Item name="status" label={`Status  :`}>
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
                  setOpenModalAdd(false), setbuttonLoading(false), setButtonConfirm(false);
                }}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={buttonconfirm}>
                Add
              </Button>
            </div>
          </div>
        </Form>
      </Modal>
      <Modal
        title="Edit Objective"
        open={openModalEdit}
        onCancel={() => {
          setOpenModalEdit(false);
          propDataManage({ loading: true, manageStatus: undefined });
        }}
        footer={[]}
      >
        <Form layout="vertical" className=" w-full" onFinish={onFinishEdit} form={editform}>
          <div className=" grid grid-cols-3 gap-4">
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
            <div className=" col-span-2">
              <Form.Item name="name" label={`Objective Name  :`} rules={[{ required: true, message: "Please enter objective name" }]}>
                <Input placeholder="Text" width={100} />
              </Form.Item>
            </div>
            <div>
              <Form.Item name="status" label={`Status  :`}>
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
                  setOpenModalEdit(false), setbuttonLoading(false);
                }}
              >
                Cancel
              </Button>
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
export default ObjectiveManage;
