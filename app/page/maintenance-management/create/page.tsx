"use client";
import React, { useEffect, useState } from "react";
import { Breadcrumb, Card, Col, message, Row } from "antd";
import MaTaskCreate from "./components/MaTaskCreate";
import { ITMaCreateForm, ITMaDetail, ITMaType, ITPagination } from "../common";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import MaServices from "../services/ma.service";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function MaTaskCreatePage() {
  const router = useRouter();
  const { data: session } = useSession();

  const intranetAuth = useAxiosIntranet();
  const maServices = MaServices(intranetAuth);
  const [loading, setloading] = useState<boolean>(true);
  const [maTypes, setMaTypes] = useState<ITMaType[]>([]);
  useEffect(() => {
    if (loading === true) fetchData();
  }, [loading]);

  const fetchData = async () => {
    const maTypes = await maServices.findActiveType();
    setMaTypes(maTypes);
  };
  const changePagination = (page: ITPagination) => {
    console.log(page);
  };

  async function createMa(data: ITMaCreateForm): Promise<void> {
    const maTypeSelected = maTypes.findLast((type) => type.id === data.maTypeId);
    const form = {
      ...data,
      maTypeName: maTypeSelected?.name,
      maStatus: "process",
      createdById: session?.user.userId,
      createdByName: `${session?.user.firstNameTh} ${session?.user.lastNameTh}`,
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
                title: <span>Home</span>,
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
          <div className="title-page-font">{`CREATE MAINTENANCE TASK`}</div>
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
