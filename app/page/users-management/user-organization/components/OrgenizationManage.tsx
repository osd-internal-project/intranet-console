"use client";
import React, { useEffect, useState } from "react";
import { Button, Card, Form, Input, Modal, Tree, message } from "antd";
import type { DataNode } from "antd/es/tree";
import Title from "antd/es/skeleton/Title";
import OrganizedServices from "../services/organized.service";
import { useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import { notifyError, notifySuccess } from "@/app/utils/message";
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
  const { id24Axios } = useId24();
  const baseUrlUser = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_USER);
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
        </Form>,
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
        </Form>,
      );

      setOpen(true);
    } else if (manageStatus.status === "delete") {
      setTitel("Delete Organization");
      setContent(
        <div className=" col-span-1">
          <div>
            ยืนยันการลบ{" "}
            <span className="bg-gray-100 text-gray-800 text-base font-medium mr-2 px-2.5 py-0.5 rounded  border border-gray-500">
              {" "}
              {manageStatus.organizedName}
            </span>{" "}
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
  const finishAdd = async (values: organizedForm) => {
    await OrganizedServices(baseUrlUser)
      .addOrganized(values)
      .then(() => notifySuccess("userorganize.create"))
      .catch((err) => notifyError(err, "userorganize.create"));
    cancelModal();
  };
  const finishEdit = async (values: organizedForm) => {
    if (manageStatus.organizedId) {
      await OrganizedServices(baseUrlUser)
        .updateOrganized(manageStatus.organizedId, values)
        .then(() => notifySuccess("userorganize.update"))
        .catch((err) => notifyError(err, "userorganize.update"));
      cancelModal();
    }
  };
  const finishDelete = async () => {
    if (manageStatus.organizedId) {
      await OrganizedServices(baseUrlUser)
        .deleteOrganized(manageStatus.organizedId)
        .then((res) => {
          if (res.data.status === 401) {
            notifyError(undefined, "userorganize.delete");
          } else {
            notifySuccess("userorganize.delete");
            propDataManage({ loading: true });
          }
        })
        .catch((err) => notifyError(err, "userorganize.delete"));
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
