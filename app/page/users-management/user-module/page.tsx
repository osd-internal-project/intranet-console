"use client";
import { use, useEffect, useState } from "react";
import { UserModuleTable } from "./components/user-module-type-table";
import {
  Breadcrumb,
  Button,
  Card,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Row,
  Spin,
  Switch,
} from "antd";
import { Col } from "antd/lib";
import { useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
import UserModuleServices from "@/app/services/user-module.service";
import { ITUserModule, ITUserModuleForm } from "@/app/common/user-module";
import { useForm } from "antd/es/form/Form";
import modal from "antd/es/modal";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { TextArea } = Input;

export default function UserModulePage() {
  const userAuth = useAxiosUser();
  const userModuleServices = UserModuleServices(userAuth);
  const [form] = useForm();
  const [loading, setLoading] = useState<boolean>(true);
  const [titleModal, setTitleModal] = useState<string>("");
  const [stateModal, setStateModal] = useState<
    "add" | "edit" | "delete" | undefined
  >(undefined);
  const [userModules, setUserModules] = useState<ITUserModule[]>([]);

  useEffect(() => {
    fetchData();
  }, [loading]);

  async function fetchData() {
    const userModules = await userModuleServices.findMany({});
    if (userModules) {
      setUserModules(userModules);
    } else {
      setUserModules([]);
    }
    setLoading(false);
  }

  function openModal(state: string, record: ITUserModule | undefined): void {
    form.resetFields();
    if (state === "add") {
      setStateModal(state);
      setTitleModal("Add Module");
    } else if (state === "edit") {
      setStateModal(state);
      setTitleModal("Edit Module");
      form.setFieldsValue(record);
    } else if (state === "delete") {
      if (record?.id) {
        modal.confirm({
          title: "ยืนยันการลบ",
          icon: <ExclamationCircleOutlined />,
          content: "ยืนยันการลบ Module",
          okText: "Delete",
          cancelText: "Cancel",
          okButtonProps: { danger: true },
          async onOk() {
            await userModuleServices
              .delete(Number(record?.id))
              .then(() => {
                message.success("Success");
                setLoading(true);
              })
              .catch((err: any) => {
                console.log(err);
                message.error("Error");
              });
          },
        });
      }
    } else {
      setStateModal(undefined);
      setTitleModal("");
    }
  }

  async function onFinishModule(
    values: ITUserModule | ITUserModuleForm
  ): Promise<void> {
    if (stateModal === "add") {
      const dataForm = values as ITUserModuleForm;
      await userModuleServices
        .create(dataForm)
        .then(() => {
          message.success("Success");
          setLoading(true);
          setStateModal(undefined);
          setTitleModal("");
        })
        .catch((err) => {
          console.log(err);
          message.error("Error");
        });
    } else if (stateModal === "edit") {
      if (values) {
        const data = values as ITUserModule;
        const dataForm = {
          code: data.code,
          name: data.name,
          status: data.status,
          description: data.description,
        };
        await userModuleServices
          .update(data.id, dataForm)
          .then(() => {
            message.success("Success");
            setLoading(true);
            setStateModal(undefined);
            setTitleModal("");
          })
          .catch((err) => {
            console.log(err);
            message.error("Error");
          });
      }
    }
  }

  return (
    <Spin spinning={loading}>
      <Row>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page/home",
                title: <span>หน้าหลัก</span>,
              },
              {
                title: <span>Module</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font">{`Module`}</div>
        </Divider>
        <div className="w-full">
          <Card>
            <div className=" flex justify-end mb-2 ">
              <Button
                type="primary"
                onClick={() => openModal("add", undefined)}
              >
                Add Module
              </Button>
            </div>
            <UserModuleTable userModules={userModules} openModal={openModal} />
          </Card>
        </div>
      </Row>
      <Modal
        title={titleModal}
        open={stateModal && (stateModal === "add" || "edit") ? true : false}
        footer={false}
        onCancel={() => {
          setStateModal(undefined);
          setTitleModal("");
        }}
      >
        <Form form={form} layout="vertical" onFinish={onFinishModule}>
          {stateModal === "edit" && (
            <Form.Item name={"id"} hidden>
              <Input placeholder="Plese Enter" />
            </Form.Item>
          )}
          <Form.Item name={"code"} label={"Code"}>
            <Input placeholder="Plese Enter" />
          </Form.Item>
          <Form.Item name={"name"} label={"Name"}>
            <Input placeholder="Plese Enter" />
          </Form.Item>
          <Form.Item name={"status"} label={"Status"} valuePropName="checked">
            <Switch
              checkedChildren={"Used"}
              unCheckedChildren={"Not Used"}
              defaultChecked
            />
          </Form.Item>
          <Form.Item name={"description"} label={"Description"}>
            <TextArea placeholder="Plese Enter" />
          </Form.Item>
          <div className=" flex justify-end">
            <Button htmlType="submit" type="primary">
              {"Save"}
            </Button>
          </div>
        </Form>
      </Modal>
    </Spin>
  );
}
