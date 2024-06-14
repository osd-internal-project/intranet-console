"use client";
import React, { useEffect, useState } from "react";
import { TableDetail } from "./components/table-detail";
import { Card, Form, Modal, message } from "antd";
import { useRouter } from "next/navigation";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import DataLeaveService from "../services/index.service";
import { useSession } from "next-auth/react";
import { ITypeDataLeave } from "../common";
import { ExclamationCircleFilled } from "@ant-design/icons";

export default function Page() {
  const router = useRouter();
  const Auth = useAxiosIntranet();
  const dataleaveservice = DataLeaveService(Auth);
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(true);
  const [dataLeaveUser, setDataLeaveUser] = useState<ITypeDataLeave[]>([]);
  const [openModalDetail, setOpenModalDetail] = useState<boolean>(false);

  const [formdetail] = Form.useForm();
  useEffect(() => {
    if (loading) loadData();
  }, [loading]);

  const loadData = async () => {
    const res = await dataleaveservice.getdataLeaveByuserID(session?.user.userId as string);
    setDataLeaveUser(res);
    setLoading(false);
  };

  const onFinishUpdate = (type: string, id: number) => {
    Modal.confirm({
      title: <>{type === "cancel" ? "Cancel " : "Approved"}</>,
      icon: <ExclamationCircleFilled />,
      content: <>{type === "cancel" ? "Are you sure you want to cancel this ?" : "Are you sure you want to Approved this ?"}</>,
      okText: "Confirm",
      okButtonProps: { type: "primary", danger: true },
      cancelText: "Cancel",
      onOk: async () => {
        const res = await dataleaveservice.approvedDataLeave(type, id, session?.user);
        if (res) {
          type === "cancel" ? message.error("cancel success") : message.success("approved success");
          setLoading(true);
        }
      },
      onCancel() {
        setLoading(true);
      },
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
    <div>
      <Card>
        <TableDetail
          dataLeaveUser={dataLeaveUser}
          setOpenModalDetail={(e: boolean) => setOpenModalDetail(e)}
          openModalDetail={openModalDetail}
          formdetail={formdetail}
          onFinishUpdate={(type: string, id: number) => onFinishUpdate(type, id)}
          downloadFile={(id: number, filename: string) => downloadFile(id, filename)}
        />
      </Card>
    </div>
  );
}
