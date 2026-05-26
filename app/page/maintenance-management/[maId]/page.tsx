"use client";
import React, { useContext, useEffect, useState } from "react";
import { Breadcrumb, Card, Col, Divider, message, Row, UploadFile } from "antd";
import MaDescriptionComponent from "./components/MaDescription";
import { ITMaTask, ITMaType, ITMaUpdateForm, ITPagination } from "../common";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import MaServices from "../services/ma.service";
import { useParams } from "next/navigation";
import { UserContectType, UserContext } from "@/app/config/userContext";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";

export default function MaTaskPage() {
  const { user } = (useContext(UserContext) as UserContectType) || { user: null };
  // const intranetAuth = useAxiosIntranet();
  const { id24Axios } = useId24();
  const baseUrIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const maServices = MaServices(baseUrIntranet);
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
    setloading(false);
  };

  async function updateMa(data: ITMaUpdateForm, attendFiles: UploadFile[], imageFiles: UploadFile[]): Promise<void> {
    let form = {
      ...data,
      updatedById: user?.userId,
      updatedByName: `${user?.firstNameTh} ${user?.lastNameTh}`,
    };

    if (data.nextTask) {
      const typeSelected = maTypes.findLast((type) => type.id === data.nextTask?.maTypeId);
      const submaStatus = "process";
      form = {
        ...form,
        nextTask: {
          create: {
            ...data.nextTask,
            maTypeName: typeSelected?.name,
            maStatus: submaStatus,
          },
        },
      } as any;
    }
    await maServices
      .update(Number(params.maId), form)
      .then((response) => {
        if (response.id && imageFiles.length > 0) {
          imageFiles.forEach(async (file) => {
            const formData: any = new FormData();
            formData.append("type", "image");
            formData.append("files", file.originFileObj);
            await maServices.uploadFiles(response.id, formData);
          });
        }
        if (response.id && attendFiles.length > 0) {
          attendFiles.forEach(async (file) => {
            const formData: any = new FormData();
            formData.append("type", "attend");
            formData.append("files", file.originFileObj);
            await maServices.uploadFiles(response.id, formData);
          });
        }
        message.success("อัพเดท MA สำเร็จ");
      })
      .catch(() => {
        message.error("ไม่สามารถสร้าง MA ได้");
      });
    setloading(true);
  }

  async function downloadFile(id: number, name: string): Promise<void> {
    if (id) {
      const response = await maServices.downloadFile(id);
      const url = URL.createObjectURL(response);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  async function getImageBlob(id: number, name: string) {
    if (id) {
      const response = await maServices.downloadFile(id);
      if (response) return response;
      else return undefined;
    }
  }

  return data ? (
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
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0" style={{ padding: "0px 0px 0px 0px", marginBottom: "0px", marginTop: "0px" }}>
          <div className="title-page-font">{`MAINTENANCE DESCRIPTION`}</div>
        </Divider>
        <Col span={24}>
          <div className="grid grid-cols-1 ">
            <MaDescriptionComponent
              data={data}
              loading={loading}
              setLoading={(e: boolean) => setloading(e)}
              maTypes={maTypes}
              updateMa={updateMa}
              downloadFile={downloadFile}
              getImageBlob={getImageBlob}
            />
          </div>
        </Col>
      </Row>
    </div>
  ) : (
    ""
  );
}
