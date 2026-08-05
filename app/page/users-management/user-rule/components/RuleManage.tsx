"use client";
import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, message } from "antd";
import RuleServices from "../services/rule.service";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import { notifyError, notifySuccess } from "@/app/utils/message";
export interface props {
  propDataManage: (res: { loading: boolean }) => void;
  manageStatus: {
    status: string | null;
    ruleCode: string | null;
    ruleName: string | null;
    description: string | null;
  };
}

type ruleForm = {
  ruleCode: string;
  ruleName: string;
  description: string;
};
const GroupManage: React.FC<props> = ({ propDataManage, manageStatus }): React.ReactElement => {
  const { id24Axios } = useId24();
  const baseUrlUser = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_USER);
  const [titel, setTitel] = useState<string>("");
  const [content, setContent] = useState<React.JSX.Element>(<></>);
  const [open, setOpen] = useState<boolean>(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loading();
  }, [manageStatus]);

  const loading = async () => {
    if (manageStatus.status === "add") {
      setTitel("Add Rule");
      form.setFieldsValue({
        ruleName: "",
        description: "",
      });
      setContent(
        <Form form={form} labelCol={{ span: 8 }} onFinish={finishAdd}>
          <Form.Item label="Name" name="ruleName" rules={[{ required: true, message: "Plese Select" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>
          <Form.Item>
            <div className=" flex justify-end space-x-4">
              <Button onClick={cancelModal}>Cancel</Button>
              <Button type="primary" className="button-blue" htmlType="submit">
                Add
              </Button>
            </div>
          </Form.Item>
        </Form>,
      );
      setOpen(true);
    } else if (manageStatus.status === "edit" && manageStatus.ruleCode) {
      setTitel("Edit Rule");
      form.setFieldsValue({
        ruleName: manageStatus.ruleName,
        description: manageStatus.description,
      });
      setContent(
        <Form labelCol={{ span: 8 }} form={form} onFinish={finishEdit}>
          <Form.Item label="Name" name="ruleName" rules={[{ required: true, message: "Plese Select" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>
          <Form.Item>
            <div className=" flex justify-end space-x-4">
              <Button onClick={cancelModal}>Cancel</Button>
              <Button type="primary" htmlType="submit" className="button-blue">
                Edit
              </Button>
            </div>
          </Form.Item>
        </Form>,
      );

      setOpen(true);
    } else if (manageStatus.status === "delete") {
      setTitel("Delete Rule");
      setContent(
        <div className=" col-span-1">
          <div>
            ยืนยันการลบ
            <span className="bg-gray-100 text-gray-800 text-base font-medium mr-2 px-2.5 py-0.5 rounded  border border-gray-500">
              {manageStatus.ruleName}
            </span>
            ?
          </div>
          <div className=" flex justify-end space-x-4">
            <Button onClick={cancelModal}>Cancel</Button>
            <Button type="primary" onClick={finishDelete} danger>
              Delete
            </Button>
          </div>
        </div>,
      );
      setOpen(true);
    }
  };
  const finishAdd = async (values: ruleForm) => {
    await RuleServices(baseUrlUser)
      .addMasterRule(values)
      .then((res) => notifySuccess("userrule.create"))
      .catch((err) => {
        notifyError(err, "userrule.create");
      });
    cancelModal();
  };
  const finishEdit = async (values: ruleForm) => {
    if (manageStatus.ruleCode) {
      await RuleServices(baseUrlUser)
        .updateMasterRule(manageStatus.ruleCode, values)
        .then((res) => notifySuccess("userrule.update"))
        .catch((err) => {
          notifyError(err, "userrule.update");
        });
      cancelModal();
    }
  };
  const finishDelete = async () => {
    if (manageStatus.ruleCode) {
      await RuleServices(baseUrlUser)
        .deleteMasterRule(manageStatus.ruleCode)
        .then((res) => {
          if (res.data.status === 401) {
            message.error(res.data.message);
          } else {
            notifySuccess("userrule.delete");
            propDataManage({ loading: true });
          }
        })
        .catch((err) => notifyError(err, "userrule.delete"));
      setOpen(false);
    }
  };
  const cancelModal = () => {
    setOpen(false);
    setContent(<></>);
    propDataManage({ loading: true });
  };

  return (
    <>
      <Modal title={titel} onCancel={cancelModal} open={open} footer={[]}>
        {content}
      </Modal>
    </>
  );
};
export default GroupManage;
