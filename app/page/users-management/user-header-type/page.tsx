"use client";
import { use, useEffect, useState } from "react";
import { UserPermissionTypeTable } from "./components/user-permission-type-table";
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
import UserPermissionTypeServices from "@/app/services/user-permission-type.service";
import {
  ITUserPermissionType,
  ITUserPermissionTypeForm,
} from "@/app/common/user-permission-type";
import { useForm } from "antd/es/form/Form";
import modal from "antd/es/modal";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { TextArea } = Input;

export default function UserPermissionTypePage() {
  const userAuth = useAxiosUser();
  const userPermissionTypeServices = UserPermissionTypeServices(userAuth);
  const [form] = useForm();
  const [loading, setLoading] = useState<boolean>(true);
  const [titleModal, setTitleModal] = useState<string>("");
  const [stateModal, setStateModal] = useState<
    "add" | "edit" | "delete" | undefined
  >(undefined);
  const [userPermissionTypes, setUserPermissionTypes] = useState<
    ITUserPermissionType[]
  >([]);

  useEffect(() => {
    fetchData();
  }, [loading]);

  async function fetchData() {
    const userPermissionTypes = await userPermissionTypeServices.findMany({});
    if (userPermissionTypes) {
      setUserPermissionTypes(userPermissionTypes);
    } else {
      setUserPermissionTypes([]);
    }
    setLoading(false);
  }

  function openModal(
    state: string,
    record: ITUserPermissionType | undefined
  ): void {
    form.resetFields();
    if (state === "add") {
      setStateModal(state);
      setTitleModal("Add Permission Type");
    } else if (state === "edit") {
      setStateModal(state);
      setTitleModal("Edit Permission Type");
      form.setFieldsValue(record);
    } else if (state === "delete") {
      if (record?.id) {
        modal.confirm({
          title: "ยืนยันการลบ",
          icon: <ExclamationCircleOutlined />,
          content: "ยืนยันการลบ Permission Type",
          okText: "Delete",
          cancelText: "Cancel",
          okButtonProps: { danger: true },
          async onOk() {
            await userPermissionTypeServices
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

  async function onFinishPermissionType(
    values: ITUserPermissionType | ITUserPermissionTypeForm
  ): Promise<void> {
    if (stateModal === "add") {
      const dataForm = values as ITUserPermissionTypeForm;
      await userPermissionTypeServices
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
        const data = values as ITUserPermissionType;
        const dataForm = {
          code: data.code,
          name: data.name,
          status: data.status,
          description: data.description,
        };
        await userPermissionTypeServices
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
                title: <span>Permission Type</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font">{`Permission Type`}</div>
        </Divider>
        <div className="w-full">
          <Card>
            <div className=" flex justify-end mb-2 ">
              <Button
                type="primary"
                onClick={() => openModal("add", undefined)}
              >
                Add Permission Type
              </Button>
            </div>
            <UserPermissionTypeTable
              userPermissionTypes={userPermissionTypes}
              openModal={openModal}
            />
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
        <Form form={form} layout="vertical" onFinish={onFinishPermissionType}>
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
            <Switch checkedChildren={"Used"} unCheckedChildren={"Not Used"} />
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
