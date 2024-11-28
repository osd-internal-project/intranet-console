"use client";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { Breadcrumb, Card, Col, Divider, Row, Tabs, Typography } from "antd";
import React, { useEffect, useState } from "react";
import OrganizeServices from "../../../services/organize-chart.service";
import dynamic from "next/dynamic";

const OrganizationalTeam = dynamic(() => import("./components/organizational-team"), {
  ssr: false,
});

export type TOrganizeDto = {
  id: number;
  positionId: string;
  description: string;
  positionName: string;
  parentPositionId: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
};

const { Text } = Typography;

export default function Page() {
  const intranetAuth = useAxiosIntranet();
  const organizeServices = OrganizeServices(intranetAuth);
  const [tabOrganize, setTabOrganize] = useState<[]>([]);

  useEffect(() => {
    loaddata();
  }, []);

  const loaddata = async () => {
    const resOrganize = await organizeServices.getOrganizeByType("department");
    setTabOrganize(
      resOrganize.map((item: TOrganizeDto) => ({
        key: item.positionId,
        label: (
          <Text style={true ? { width: 200 } : undefined} ellipsis={true ? { tooltip: item.positionName } : false}>
            {item.positionName}
          </Text>
        ),
        children: <OrganizationalTeam data={item} />,
      }))
    );
  };

  return (
    <Row>
      <Col span={24}>
        <Breadcrumb
          items={[
            {
              href: "/page",
              title: <span>Home</span>,
            },

            {
              title: <span>Team Chart</span>,
            },
          ]}
        />
      </Col>
      <Divider orientation="left" orientationMargin="0">
        <div className="title-page-font">{`Team Chart`}</div>
      </Divider>
      <Col span={24}>
        <div className=" grid-span-1 space-y-2">
          <Card>
            <Tabs size="small" type="card" className="w-full overflow-x-auto" tabPosition="top" items={tabOrganize} />
          </Card>
        </div>
      </Col>
    </Row>
  );
}
