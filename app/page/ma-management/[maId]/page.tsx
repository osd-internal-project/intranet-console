"use client";
import React, { useEffect, useState } from "react";
import { Breadcrumb, Card, Col, message, Row } from "antd";
import MaDescriptionComponent from "./components/MaDescription";
import { ITMaTask, ITMaType, ITMaUpdateForm, ITPagination } from "../common";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import MaServices from "../services/ma.service";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
export default function MaTaskPage() {
  const { data: session } = useSession();
  const intranetAuth = useAxiosIntranet();
  const maServices = MaServices(intranetAuth);
  const params = useParams<{ maId: string }>();
  const [loading, setloading] = useState<boolean>(true);
  const [data, setData] = useState<ITMaTask>();
  const [maTypes, setMaTypes] = useState<ITMaType[]>([]);
  useEffect(() => {
    if (loading === true) fetchData();
  }, [loading]);

  const fetchData = async () => {
    const maTypes = await maServices.findActiveType();
    setMaTypes(maTypes);
    const res = await maServices.findMaTaskById(Number(params.maId));
    setData(res);
    console.log(res);
    setloading(false);
  };
  // const data: ITMaDetail = {
  //   id: 2,
  //   maName: "task 2",
  //   maStatus: "success",
  //   maTypeId: 2,
  //   maTypeName: "ตรวจสภาพ",
  //   maDate: new Date(),
  //   detail: "ทดสอบ",
  //   contact: "บริษัท",
  //   remake: "สำเร็จ",
  //   updatedDate: new Date(),
  //   createdDate: new Date(),
  // };

  async function updateMa(data: ITMaUpdateForm): Promise<void> {
    let form = { ...data, updatedById: session?.user.userId, updatedByName: `${session?.user.firstNameTh} ${session?.user.lastNameTh}` };
    if (data.nextTask) {
      const typeSelected = maTypes.findLast((type) => type.id === data.nextTask?.maTypeId);
      const submaStatus = "process";
      form = { ...form, nextTask: { create: { ...data.nextTask, maTypeName: typeSelected?.name, maStatus: submaStatus } } } as any;
    }
    await maServices
      .update(Number(params.maId), form)
      .then(() => {
        message.success("อัพเดท MA สำเร็จ");
      })
      .catch(() => {
        message.error("ไม่สามารถสร้าง MA ได้");
      });
    setloading(true);
  }

  return data ? (
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
                href: "/page/ma-management",
                title: <span>MA Mangement</span>,
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <div className="title-page-font">{`MA DESCRIPTION`}</div>
        </Col>
        <Col span={24}>
          <div className="grid grid-cols-1 ">
            <MaDescriptionComponent data={data} loading={loading} setLoading={(e: boolean) => setloading(e)} maTypes={maTypes} updateMa={updateMa} />
          </div>
        </Col>
      </Row>
    </div>
  ) : (
    ""
  );
}
