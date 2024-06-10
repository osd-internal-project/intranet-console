"use client";
import React, { useEffect, useState } from "react";
import { Breadcrumb, Card, Col, Row, Typography } from "antd";
import { useSession } from "next-auth/react";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import DataLeaveService from "../services/index.service";
import { IDataUser, ISelect, ITypetypeleave } from "../common";
import { CreateOnlineLeave } from "./components/create-online-leave";
import { TableOnlineDetailLeave } from "./components/table-online-detail-leave";

export default function Page() {
  const Auth = useAxiosIntranet();
  const dataleaveservice = DataLeaveService(Auth);
  const { data: session } = useSession();
  const [getUser, setUser] = useState<IDataUser | null>(session ? session.user : null);
  const [getTypeLeaveOption, setTypeLeaveOption] = useState<ISelect[]>([]);
  const [getTypeLeave, setTypeLeave] = useState<ITypetypeleave[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (loading) loadDataTypeLeave();
  }, [loading]);

  const loadDataTypeLeave = async () => {
    const res = await dataleaveservice.getdataAll();
    const options = res.map((event: ITypetypeleave) => {
      return { value: event.typeId, label: event.typeName };
    });
    setTypeLeaveOption(options);
    setTypeLeave(res);
    setLoading(false);
  };

  return (
    <div>
      <Row gutter={[8, 8]}>
        <Col span={24} style={{ marginBottom: "20px" }}>
          <Breadcrumb
            items={[
              {
                href: "/page",
                title: <span>Home</span>,
              },

              {
                title: <span>Set Data Leave </span>,
              },
            ]}
          />
        </Col>
        <Card className=" grid grid-cols-1 gap-y-2">
          <Typography>{`Set Date Leave`}</Typography>
        </Card>
      </Row>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={12}>
          <CreateOnlineLeave getUser={getUser} getTypeLeaveOption={getTypeLeaveOption} />
        </Col>
        <Col span={12}>
          <TableOnlineDetailLeave />
        </Col>
      </Row>
    </div>
  );
}
