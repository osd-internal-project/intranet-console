"use client";
import React, { useEffect, useState } from "react";
import { TableDetail } from "./components/table-detail";
import { Breadcrumb, Card, Col, Divider, Form, Modal, Row, message } from "antd";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import DataLeaveService from "../../../services/leave-management.service";
import { useSession } from "next-auth/react";
import { ITypeDataLeave } from "../common";
import { ExclamationCircleFilled } from "@ant-design/icons";

export default function Page() {
  const Auth = useAxiosIntranet();
  const dataleaveservice = DataLeaveService(Auth);
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(true);
  const [dataLeaveUser, setDataLeaveUser] = useState<ITypeDataLeave[]>([]);
  const [openModalDetail, setOpenModalDetail] = useState<boolean>(false);
  const [formdetail] = Form.useForm();
  const [messages, messageHeader] = message.useMessage();
  const [Modals, modelsHeader] = Modal.useModal();

  useEffect(() => {
    if (loading) loadData();
  }, [loading]);

  const loadData = async () => {
    const res = await dataleaveservice.getdataLeaveAll();
    setDataLeaveUser(res);
    setLoading(false);
  };

  const onFinishUpdate = (type: string, id: number) => {
    Modals.confirm({
      title: <>{type === "cancel" ? "Cancel " : "Approved"}</>,
      icon: <ExclamationCircleFilled />,
      content: <>{type === "cancel" ? "Are you sure you want to cancel this ?" : "Are you sure you want to Approved this ?"}</>,
      okText: "Confirm",
      okButtonProps: {
        type: "primary",
        style: {
          backgroundColor: type === "cancel" ? "#ff4d4f" : "#1890ff",
          borderColor: type === "cancel" ? "#ff4d4f" : "#1890ff",
          color: "white",
        },
      },
      cancelText: "Cancel",
      cancelButtonProps: {
        style: {
          backgroundColor: "#f0f0f0",
          borderColor: "#d9d9d9",
          color: "#000",
        },
      },
      onOk: async () => {
        const res = await dataleaveservice.approvedDataLeave(type, id, session?.user);
        if (res) {
          type === "cancel" ? messages.error("cancel success") : messages.success("approved success");
          setLoading(true);
          setOpenModalDetail(false);
        }
      },
      onCancel() {},
    });
  };

  const onFinishDelete = (type: string, id: number) => {
    Modals.confirm({
      title: <>{"Delete"}</>,
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to delete this ?",
      okText: "Confirm",
      okButtonProps: {
        type: "primary",
        style: { backgroundColor: "#ff4d4f", borderColor: "#ff4d4f" },
      },
      cancelText: "Cancel",
      cancelButtonProps: {
        style: {
          backgroundColor: "#f0f0f0",
          borderColor: "#d9d9d9",
          color: "#000",
        },
      },
      onOk: async () => {
        try {
          const res = await dataleaveservice.deleteDataLeave(id);
          if (res) {
            messages.success("Delete success");
          } else {
            messages.error("Delete failed");
          }
          setLoading(true);
          setOpenModalDetail(false);
        } catch (error) {
          messages.error("Delete failed");
        }
      },
      onCancel() {},
    });
  };

  async function downloadFile(id: number, name: string): Promise<void> {
    if (id) {
      const response = await dataleaveservice.downloadFile(id);
      const url = URL.createObjectURL(response);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  return (
    <>
      {modelsHeader}
      {messageHeader}
      <Row>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page/home",
                title: <span>Home</span>,
              },
              {
                title: <span>Leave History (Admin)</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font">{`Leave History ( Admin )`}</div>
        </Divider>
        <div className="w-full">
          <Card>
            <TableDetail
              dataLeaveUser={dataLeaveUser}
              setOpenModalDetail={(e: boolean) => setOpenModalDetail(e)}
              openModalDetail={openModalDetail}
              formdetail={formdetail}
              onFinishUpdate={(type: string, id: number) => onFinishUpdate(type, id)}
              onFinishDelete={(type: string, id: number) => onFinishDelete(type, id)}
              downloadFile={(id: number, filename: string) => downloadFile(id, filename)}
            />
          </Card>
        </div>
      </Row>
    </>
  );
}
