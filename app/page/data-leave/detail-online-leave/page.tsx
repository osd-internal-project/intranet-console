"use client";
import React, { useEffect, useState } from "react";
import { TableDetail } from "./components/table-detail";
import { Card, Form } from "antd";
import { useRouter } from "next/navigation";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import DataLeaveService from "../services/index.service";
import { useSession } from "next-auth/react";
import { ITypeDataLeave } from "../common";

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
  }, []);
  const loadData = async () => {
    const res = await dataleaveservice.getdataLeaveByuserID(session?.user.userId as string);
    setDataLeaveUser(res);
    setLoading(false);
  };
  return (
    <div>
      <Card>
        <TableDetail
          dataLeaveUser={dataLeaveUser}
          setOpenModalDetail={(e: boolean) => setOpenModalDetail(e)}
          openModalDetail={openModalDetail}
          formdetail={formdetail}
        />
      </Card>
    </div>
  );
}
