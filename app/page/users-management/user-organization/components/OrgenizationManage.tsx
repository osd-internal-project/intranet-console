"use client";
import React, { useEffect, useState } from "react";
import { Button, Card, Form, Input, Modal, Tree, message } from "antd";
import type { DataNode } from "antd/es/tree";
import Title from "antd/es/skeleton/Title";
import OrganizedServices from "../services/organized.service";
import { useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
export interface props {
  propDataManage: (res: { loading: boolean }) => void;
  manageStatus: {
    status: string | null;
    organizedId: string | null;
    organizedName: string | null;
    description: string | null;
  };
}

type organizedForm = {
  organizedId: string;
  organizedName: string;
  description: string;
};
const OrgenizationManage: React.FC<props> = ({ propDataManage, manageStatus }): React.ReactElement => {
  const userAuth = useAxiosUser();
  const organizedServices = OrganizedServices(userAuth);
  const [titel, setTitel] = useState<string>("");
  const [content, setContent] = useState<React.JSX.Element>(<></>);
  const [open, setOpen] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  useEffect(() => {
    loading();
  }, [manageStatus]);

  const loading = async () => {
    if (manageStatus.status === "add") {
      setTitel("Add Organization");
      form.setFieldsValue({
        organizedName: "",
        description: "",
      });
      setContent(
        <Form form={form} labelCol={{ span: 8 }} onFinish={finishAdd}>
          <Form.Item label="Name" name="organizedName">
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>
          <Form.Item>
            <div className=" flex justify-end space-x-4">
              <Button onClick={cancelModal}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                Confirm
              </Button>
            </div>
          </Form.Item>
        </Form>
      );
      setOpen(true);
    } else if (manageStatus.status === "edit" && manageStatus.organizedId) {
      setTitel("Edit Organization");
      form.setFieldsValue({
        organizedName: manageStatus.organizedName,
        description: manageStatus.description,
      });
      setContent(
        <Form labelCol={{ span: 8 }} form={form} onFinish={finishEdit}>
          <Form.Item label="Name" name="organizedName">
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>
          <Form.Item>
            <div className=" flex justify-end space-x-4">
              <Button onClick={cancelModal}>Cancel</Button>
              <Button type="primary" htmlType="submit" className="button-blue">
                Save Change
              </Button>
            </div>
          </Form.Item>
        </Form>
      );

      setOpen(true);
    } else if (manageStatus.status === "delete") {
      setTitel("Delete Organization");
      setContent(
        <div className=" col-span-1">
          <div>
            ยืนยันการลบ <span className="bg-gray-100 text-gray-800 text-base font-medium mr-2 px-2.5 py-0.5 rounded  border border-gray-500"> {manageStatus.organizedName}</span> ?
          </div>
          <div className=" flex justify-end space-x-4">
            <Button onClick={cancelModal}>Cancel</Button>
            <Button type="primary" onClick={finishDelete} danger>
              Delete
            </Button>
          </div>
        </div>
      );
      setOpen(true);
    }
  };
  const finishAdd = async (values: organizedForm) => {
    await organizedServices
      .addOrganized(values)
      .then((res) =>
        messageApi.open({
          type: "success",
          content: "สำเร็จ",
        })
      )
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: err,
        });
      });
    cancelModal();
  };
  const finishEdit = async (values: organizedForm) => {
    if (manageStatus.organizedId) {
      await organizedServices
        .updateOrganized(manageStatus.organizedId, values)
        .then((res) =>
          messageApi.open({
            type: "success",
            content: "สำเร็จ",
          })
        )
        .catch((err) => {
          messageApi.open({
            type: "error",
            content: err,
          });
        });
      cancelModal();
    }
  };
  const finishDelete = async () => {
    if (manageStatus.organizedId) {
      await organizedServices
        .deleteOrganized(manageStatus.organizedId)
        .then((res) => {
          if (res.data.status === 401) {
            messageApi.open({
              type: "error",
              content: res.data.status,
            });
          } else {
            messageApi.open({
              type: "success",
              content: "สำเร็จ",
            });
            propDataManage({ loading: true });
          }
        })
        .catch((err) =>
          messageApi.open({
            type: "error",
            content: err,
          })
        );
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
      {contextHolder}
      <Modal title={titel} onCancel={cancelModal} open={open} footer={[]}>
        {content}
      </Modal>
    </>
  );
};
export default OrgenizationManage;
