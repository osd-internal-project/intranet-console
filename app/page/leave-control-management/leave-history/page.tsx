"use client";
import React, { useContext, useEffect, useState } from "react";
import { Breadcrumb, Card, Col, Tabs, Divider, Form, Modal, Row, TabsProps, message } from "antd";
import { TableDetail } from "./components/table-detail";
import { DepartmentCalendarDetail } from "./components/leave-history-calendar";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import DataLeaveService from "../../../services/leave-management.service";
import { ITypeDataLeave } from "../common";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { UserContectType, UserContext } from "@/app/config/userContext";

export default function Page() {
  const { user } = (useContext(UserContext) as UserContectType) || { user: null };
  const Auth = useAxiosIntranet();
  const dataleaveservice = DataLeaveService(Auth);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<ITypeDataLeave[]>([]);
  const [department, setDataLeaveDepartment] = useState<ITypeDataLeave[]>([]);
  const [openModalDetail, setOpenModalDetail] = useState<boolean>(false);
  const [formdetail] = Form.useForm();

  useEffect(() => {
    if (loading) loadData();
  }, [loading]);

  const loadData = async () => {
    if (user?.userId) {
      const result = await dataleaveservice.getdataLeaveUserById({ userId: user?.userId });
      const resDataLeaveGrouptId = await dataleaveservice.getdataLeavefindBygroup(user?.userId);
      setDataLeaveDepartment(resDataLeaveGrouptId);
      setDataSource(result);
    }
    setLoading(false);
  };

  const onFinishUpdate = async (type: string, id: number) => {
    Modal.confirm({
      title: <>{type === "cancel" ? "Cancel " : "Approved"}</>,
      icon: <ExclamationCircleFilled />,
      content: <>{type === "cancel" ? "Are you sure you want to cancel this ?" : "Are you sure you want to Approved this ?"}</>,
      okText: "Confirm",
      okButtonProps: { type: "primary", danger: true },
      cancelText: "Cancel",
      onOk: async () => {
        const res = await dataleaveservice.approvedDataLeave(type, id, user);
        if (res) {
          type === "cancel" ? message.error("cancel success") : message.success("approved success");
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
      label: "ปฏิธินการลา",
      children: <DepartmentCalendarDetail dataSource={dataSource} downloadFile={(id: number, filename: string) => downloadFile(id, filename)} />,
    },
    {
      key: "2",
      label: "ปฏิธินการลาทีม",
      children: <DepartmentCalendarDetail dataSource={department} downloadFile={(id: number, filename: string) => downloadFile(id, filename)} />,
    },
    {
      key: "3",
      label: "รายละเอียดการลา",
      children: (
        <TableDetail
          dataSource={dataSource}
          setOpenModalDetail={(e: boolean) => setOpenModalDetail(e)}
          openModalDetail={openModalDetail}
          formdetail={formdetail}
          onFinishUpdate={(type: string, id: number) => onFinishUpdate(type, id)}
          downloadFile={(id: number, filename: string) => downloadFile(id, filename)}
        />
      ),
    },
  ];

  const onChange = () => {
    setLoading(true);
  };

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
                title: <span>ประวัติการลา</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font">{`ประวัติการลา`}</div>
        </Divider>
        <div className="w-full">
          <Card>
            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
          </Card>
        </div>
      </Row>
    </>
  );
}
