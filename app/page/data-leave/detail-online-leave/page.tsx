"use client";
import React, { useEffect, useState } from "react";
import { TableDetail } from "./components/table-detail";
import { DepartmentCalendarDetail } from "./components/department-calendar-details";
import {
  Breadcrumb,
  Card,
  Col,
  Tabs,
  Divider,
  Form,
  Modal,
  Row,
  TabsProps,
  message,
} from "antd";
import { useRouter } from "next/navigation";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import DataLeaveService from "../services/index.service";
import { useSession } from "next-auth/react";
import { IDepartMent, ITypeDataLeave } from "../common";
import { ExclamationCircleFilled } from "@ant-design/icons";

export default function Page() {
  const router = useRouter();
  const Auth = useAxiosIntranet();
  const dataleaveservice = DataLeaveService(Auth);
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(true);
  const [dataLeaveUser, setDataLeaveUser] = useState<ITypeDataLeave[]>([]);
  const [departmentId, setDataLeaveDepartmentId] = useState<ITypeDataLeave[]>(
    []
  );
  const [openModalDetail, setOpenModalDetail] = useState<boolean>(false);
  const [formdetail] = Form.useForm();

  useEffect(() => {
    if (loading) loadData();
  }, [loading]);

  const loadData = async () => {
    const res = await dataleaveservice.getdataLeaveByuserId(
      session?.user.userId as string
    );
    const dataGroupId = session?.user.ownerGroup as string;
    const resDataLeaveGrouptId = await dataleaveservice.getdataLeaveGroupById(
      dataGroupId
    );
    setDataLeaveDepartmentId(resDataLeaveGrouptId);
    setDataLeaveUser(res);
    setLoading(false);
  };

  const onFinishUpdate = async (type: string, id: number) => {
    Modal.confirm({
      title: <>{type === "cancel" ? "Cancel " : "Approved"}</>,
      icon: <ExclamationCircleFilled />,
      content: (
        <>
          {type === "cancel"
            ? "Are you sure you want to cancel this ?"
            : "Are you sure you want to Approved this ?"}
        </>
      ),
      okText: "Confirm",
      okButtonProps: { type: "primary", danger: true },
      cancelText: "Cancel",
      onOk: async () => {
        const res = await dataleaveservice.approvedDataLeave(
          type,
          id,
          session?.user
        );
        if (res) {
          type === "cancel"
            ? message.error("cancel success")
            : message.success("approved success");
          setLoading(true);
          setOpenModalDetail(false);
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

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Calendar",
      children: (
        <DepartmentCalendarDetail
          departmentId={departmentId}
          downloadFile={(id: number, filename: string) =>
            downloadFile(id, filename)
          }
        />
      ),
    },
    {
      key: "2",
      label: "Detail",
      children: (
        <TableDetail
          dataLeaveUser={dataLeaveUser}
          setOpenModalDetail={(e: boolean) => setOpenModalDetail(e)}
          openModalDetail={openModalDetail}
          formdetail={formdetail}
          onFinishUpdate={(type: string, id: number) =>
            onFinishUpdate(type, id)
          }
          downloadFile={(id: number, filename: string) =>
            downloadFile(id, filename)
          }
        />
      ),
    },
  ];

  return (
    <Row>
      <Col span={24}>
        <Breadcrumb
          items={[
            {
              href: "/page/home",
              title: <span>Home</span>,
            },
            {
              title: <span>Detail Online Leave</span>,
            },
          ]}
        />
      </Col>
      <Divider orientation="left" orientationMargin="0">
        <div className="title-page-font">{`Detail Online Leave`}</div>
      </Divider>
      <div className="w-full">
        <Card>
          <Tabs defaultActiveKey="1" items={items} />
        </Card>
      </div>
    </Row>
  );
}
