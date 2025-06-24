"use client";
import React, { useContext, useEffect, useState } from "react";
import { TableDetail } from "./components/table-detail";
import { Breadcrumb, Card, Col, Divider, Form, Modal, Row, message } from "antd";
import DataLeaveService from "../../../services/leave-management.service";
import { ITypeDataLeave } from "../common";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { UserContectType, UserContext } from "@/app/config/userContext";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import { intersection } from "lodash";

export default function Page() {
  const { id24Axios, tokenAccess } = useId24();
  const { user } = (useContext(UserContext) as UserContectType) || { user: null };
  const sideMenuGroups =
    tokenAccess && tokenAccess.userAccess.length > 0 ? Array.from(new Set(tokenAccess?.userAccess.map((item) => item.roles).flat())) : [];
  const baseUrlIntranet = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_INTRANET);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataLeaveUser, setDataLeaveUser] = useState<ITypeDataLeave[]>([]);
  const [openModalDetail, setOpenModalDetail] = useState<boolean>(false);
  const [submitAction, setSubmitAction] = useState<"approved" | "cancel">("approved");
  const [formdetail] = Form.useForm();

  useEffect(() => {
    if (loading) loadData();
  }, [loading, user]);

  const loadData = async () => {
    if (user?.userId) {
      const isHr = intersection(sideMenuGroups, ["hr"]).length > 0;
      const res = isHr
        ? await DataLeaveService(baseUrlIntranet).getdataLeaveHrfindBygroup(user.userId)
        : await DataLeaveService(baseUrlIntranet).getdataLeavefindBygroup(user.userId);
      setDataLeaveUser(res);
      setLoading(false);
    }
  };

  const onFinishUpdate = (values: any, type: string, id: number) => {
    Modal.confirm({
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
        const res = await DataLeaveService(baseUrlIntranet).approvedDataLeave(values.detailApproved, type, id, user);
        if (res) {
          type === "cancel" ? message.error("cancel success") : message.success("approved success");
          setSubmitAction("approved");
          setLoading(true);
          setOpenModalDetail(false);
        }
      },
      onCancel() {},
    });
  };

  const onFinishDelete = (type: string, id: number) => {
    Modal.confirm({
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
          const res = await DataLeaveService(baseUrlIntranet).deleteDataLeave(id);
          if (res) {
            message.success("Delete success");
          } else {
            message.error("Delete failed");
          }
          setLoading(true);
          setOpenModalDetail(false);
        } catch (error) {
          message.error("Delete failed");
        }
      },
      onCancel() {},
    });
  };

  async function downloadFile(id: number, name: string): Promise<void> {
    if (id) {
      const response = await DataLeaveService(baseUrlIntranet).downloadFile(id);
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
      <Row>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page/home",
                title: <span>หน้าหลัก</span>,
              },
              {
                title: <span>จัดการการลา</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0" style={{ padding: "0px 0px 0px 0px", marginBottom: "0px", marginTop: "0px" }}>
          <div className="title-page-font">{`จัดการการลา`}</div>
        </Divider>
        <div className="w-full">
          <Card>
            <TableDetail
              dataLeaveUser={dataLeaveUser}
              setOpenModalDetail={(e: boolean) => setOpenModalDetail(e)}
              openModalDetail={openModalDetail}
              formdetail={formdetail}
              onFinishUpdate={onFinishUpdate}
              onFinishDelete={onFinishDelete}
              downloadFile={downloadFile}
              sideMenuGroups={sideMenuGroups}
              setSubmitAction={setSubmitAction}
              submitAction={submitAction}
            />
          </Card>
        </div>
      </Row>
    </>
  );
}
