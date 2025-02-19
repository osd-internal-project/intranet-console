"use client";
import React, { useContext, useEffect, useState } from "react";
import { Breadcrumb, Col, message, Row } from "antd";
import MaTaskCreate from "./components/MaTaskCreate";
import { ITMaCreateForm, ITMaType } from "../common";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import MaServices from "../services/ma.service";
import { useRouter } from "next/navigation";
import { UserContectType, UserContext } from "@/app/config/userContext";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";

export default function MaTaskCreatePage() {
  const { user } = (useContext(UserContext) as UserContectType) || {
    user: null,
  };
  const router = useRouter();
  // const intranetAuth = useAxiosIntranet();
  const { id24Axios } = useId24();
  const baseUrIntranet = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_INTRANET);
  const maServices = MaServices(baseUrIntranet);
  const [loading, setloading] = useState<boolean>(true);
  const [maTypes, setMaTypes] = useState<ITMaType[]>([]);
  useEffect(() => {
    if (loading) fetchData();
  }, [loading]);

  const fetchData = async () => {
    const maTypes = await maServices.findActiveType();
    setMaTypes(maTypes);
  };

  async function createMa(data: ITMaCreateForm): Promise<void> {
    const maTypeSelected = maTypes.findLast((type) => type.id === data.maTypeId);
    const form = {
      ...data,
      maTypeName: maTypeSelected?.name,
      maStatus: "process",
      createdById: user?.userId,
      createdByName: `${user?.firstNameTh} ${user?.lastNameTh}`,
    };
    await maServices
      .create(form)
      .then((res) => {
        message.success("สร้าง MA สำเร็จ");
        router.push("/page/maintenance-management");
      })
      .catch((err) => {
        message.error("ไม่สามารถสร้าง MA ได้");
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
            <MaTaskCreate maTypes={maTypes} loading={loading} setLoading={(e: boolean) => setloading(e)} createMa={createMa} />
          </div>
        </Col>
      </Row>
    </div>
  );
}
