"use client";
import { useEffect, useState } from "react";
import { Breadcrumb, Card, Col, Row, Spin } from "antd";
import { useParams } from "next/navigation";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import OrganizeServices from "../services/organize-chart.service";
import OrganizeTeamTree from "./components/organize-team-tree";
import OrganizeTeamManage from "./components/organize-team-manage";

export default function Page() {
  const intranetAuth = useAxiosIntranet();
  const organizeServices = OrganizeServices(intranetAuth);
  const params = useParams();
  const positionId = params.uid as string;
  const [loading, setLoading] = useState<boolean>(true);
  const [organizeSelect, setOrganizeSelect] = useState<string | null>(null);

  // const featchData = async () => {
  //   const organizeDetail = await organizeServices.getOneOrganizeById(positionId);
  //   console.log(organizeDetail);
  // };

  const propDataTree = (e: any) => {
    setOrganizeSelect(e.organizeSelect);
    setLoading(e.loading);
  };

  const propDataManage = (e: any) => {
    setOrganizeSelect(e.organizeSelect);
    setLoading(e.loading);
  };

  return (
    <>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page",
                title: <span>Home</span>,
              },
              {
                href: "/page/setting",
                title: <span>Setting</span>,
              },
              {
                title: <span>Organize Chart</span>,
              },
              {
                title: <span>{positionId}</span>,
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <div className="title-page-font">{`Organize Chart`}</div>
        </Col>
        <Col span={24}>
          <div className="grid grid-cols-1 "></div>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div>
              <Spin spinning={loading}>
                <OrganizeTeamTree propDataTree={propDataTree} loading={loading} positionId={positionId} />
              </Spin>
            </div>
            {organizeSelect ? (
              <div>
                <OrganizeTeamManage propDataManage={propDataManage} organizeSelect={organizeSelect} />
              </div>
            ) : (
              <></>
            )}
          </div>
        </Col>
      </Row>
    </>
  );
}
