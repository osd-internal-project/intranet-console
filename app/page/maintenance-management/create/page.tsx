"use client";
import React, { useContext, useEffect, useState } from "react";
import { Breadcrumb, Col, Row } from "antd";
import MaTaskCreate from "./components/MaTaskCreate";
import { ITMaCreateForm, ITMaType } from "../common";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import MaServices from "../services/ma.service";
import { useRouter } from "next/navigation";
import { UserContectType, UserContext } from "@/app/config/userContext";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import { UsersServices } from "@/app/services/users.service";

import { notifyError, notifySuccess } from "@/app/utils/message";
export default function MaTaskCreatePage() {
  const { user } = (useContext(UserContext) as UserContectType) || {
    user: null,
  };
  const router = useRouter();
  // const intranetAuth = useAxiosIntranet();
  const { id24Axios } = useId24();
  const baseUrIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const baseUrUser = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_USER);
  const maServices = MaServices(baseUrIntranet);
  const userservices = UsersServices(baseUrUser);
  const [loading, setloading] = useState<boolean>(true);
  const [maTypes, setMaTypes] = useState<ITMaType[]>([]);
  const [userAll, setUserAll] = useState<any[]>([]);
  useEffect(() => {
    if (loading) fetchData();
  }, [loading]);

  const fetchData = async () => {
    const userAll = await userservices.findAll();
    const maTypes = await maServices.findActiveType();
    setUserAll(userAll);
    setMaTypes(maTypes);
  };

  async function createMa(data: ITMaCreateForm): Promise<void> {
    const maTypeSelected = maTypes.findLast((type) => type.id === data.maTypeId);
    const userNameSelect = userAll.find((type) => type.userId === data.assignUserId);
    const form = {
      ...data,
      maTypeName: maTypeSelected?.name,
      maStatus: "process",
      createdById: user?.userId,
      assignUsername: `${userNameSelect.firstNameTh} ${userNameSelect.lastNameTh}`,
      createdByName: `${user?.firstNameTh} ${user?.lastNameTh}`,
    };
    await maServices
      .create(form)
      .then((res) => {
        notifySuccess("maintenance.create");
        router.push("/page/maintenance-management");
      })
      .catch((err) => {
        notifyError(undefined, "maintenance.create");
      });
    setloading(true);
  }

  return (
    <div>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page",
                title: <span>หน้าหลัก</span>,
              },
              {
                href: "/page/maintenance-management",
                title: <span>Maintenance Mangement</span>,
              },
              {
                title: <span>Create Maintenance Task</span>,
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <div className="title-page-font">{`Create Maintenance Task`}</div>
        </Col>
        <Col span={24}>
          <div className="grid grid-cols-1 ">
            <MaTaskCreate maTypes={maTypes} loading={loading} setLoading={(e: boolean) => setloading(e)} createMa={createMa} userAll={userAll} />
          </div>
        </Col>
      </Row>
    </div>
  );
}
