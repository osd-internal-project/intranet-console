"use client";
import React, { useEffect, useState } from "react";
import { Card, Breadcrumb, Divider, Form, Button } from "antd";
import EmailTemplateTable from "./components/email-template-table";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManageemailTemplateServices } from "./service/email-template.service";
import Link from "next/link";

const emailTemplatePage: React.FC = (): React.ReactElement => {
  const intraAuth = useAxiosIntranet();
  const manageemailtemplateservices = ManageemailTemplateServices(intraAuth);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (loading) fechdataSource();
  }, [loading]);

  const fechdataSource = async () => {
    const getdataAll = await manageemailtemplateservices.findAll();
    setDataSource(getdataAll);
    setLoading(false);
  };

  return (
    <div>
      <Breadcrumb
        items={[
          {
            href: "/page",
            title: <span>{`Home`}</span>,
          },
          {
            title: <span>{`Email Template`}</span>,
          },
        ]}
      />
      <Divider orientation="left" orientationMargin="0">
        <div className="title-page-font" style={{ display: "flex", alignItems: "left" }}>
          <span style={{ marginRight: "8px" }}>{`Email Template`}</span>
        </div>
      </Divider>
      <Card>
        <div>
          <div className="w-full mb-2">
            <div className="flex justify-end">
              <Link href="/page/setting/email-template/add-template">
                <Button type="primary">{`Add Email Template`}</Button>
              </Link>
            </div>
          </div>
        </div>
        <div>
          <EmailTemplateTable dataSource={dataSource} loading={loading} setLoading={setLoading} />
        </div>
      </Card>
    </div>
  );
};

export default emailTemplatePage;
