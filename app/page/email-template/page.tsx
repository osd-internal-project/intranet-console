"use client";
import React, { useEffect, useState } from "react";
import { Card, Breadcrumb, Divider, Form } from "antd";
import EmailTemplateTable from "./components/email-template-table";
import EmailTemplateCreate from "./components/email-template-create";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManageemailTemplateServices } from "./service/email-template.service";

const emailTemplatePage: React.FC = () => {
  const intraAuth = useAxiosIntranet();
  const manageemailtemplateservices = ManageemailTemplateServices(intraAuth);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
  const [optionsType, setoptionsType] = useState<any[]>([]);

  useEffect(() => {
    if (loading) fechdataSource();
  }, [loading]);

  const fechdataSource = async () => {
    const getdataAll = await manageemailtemplateservices.findAll();
    const getdataOptionsType = await manageemailtemplateservices.optionsType();

    setDataSource(getdataAll);
    setoptionsType(getdataOptionsType);
    setLoading(false);
  };

  return (
    <div>
      <Breadcrumb
        items={[
          {
            href: "/page",
            title: <span>Home</span>,
          },
          {
            title: <span>Email Template</span>,
          },
        ]}
      />
      <Divider orientation="left" orientationMargin="0">
        <div className="title-page-font" style={{ display: "flex", alignItems: "left" }}>
          <span style={{ marginRight: "8px" }}>Email Template</span>
        </div>
      </Divider>
      <Card>
        <div>
          <EmailTemplateCreate />
        </div>
        <div>
          <EmailTemplateTable dataSource={dataSource} loading={loading} />
        </div>
      </Card>
    </div>
  );
};

export default emailTemplatePage;
