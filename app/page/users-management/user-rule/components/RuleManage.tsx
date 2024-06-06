"use client";
import React, { useEffect, useState } from "react";
import { Button, Card, Form, Input, Modal, Tree, message } from "antd";
import type { DataNode } from "antd/es/tree";
import Title from "antd/es/skeleton/Title";
import RuleServices from "../services/rule.service";
import { useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
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
  const userAuth = useAxiosUser();
  const ruleServices = RuleServices(userAuth);
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
          <Form.Item label="Name" name="ruleName">
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
          <Form.Item label="Name" name="ruleName">
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
    await ruleServices
      .addMasterRule(values)
      .then((res) => message.success(`สำเร็จ`))
      .catch((err) => {
        message.error(err);
      });
    cancelModal();
  };
  const finishEdit = async (values: ruleForm) => {
    if (manageStatus.ruleCode) {
      await ruleServices
        .updateMasterRule(manageStatus.ruleCode, values)
        .then((res) => message.success(`สำเร็จ`))
        .catch((err) => {
          message.error(err);
        });
      cancelModal();
    }
  };
  const finishDelete = async () => {
    if (manageStatus.ruleCode) {
      await ruleServices
        .deleteMasterRule(manageStatus.ruleCode)
        .then((res) => {
          if (res.data.status === 401) {
            message.error(res.data.message);
          } else {
            message.success(`สำเร็จ`);
            propDataManage({ loading: true });
          }
        })
        .catch((err) => message.error(err));
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
