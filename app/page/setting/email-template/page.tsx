"use client";
import React, { useEffect, useState } from "react";
import { Card, Breadcrumb, Divider, Button, Form } from "antd";
import { ManageemailTemplateServices } from "./service/email-template.service";
import Link from "next/link";
import { EmailTemplateTab } from "./components/email-template-tab";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";

const emailTemplatePage: React.FC = (): React.ReactElement => {
  const { id24Axios } = useId24();
  const baseUrIntranet = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_INTRANET);
  const manageemailtemplateservices = ManageemailTemplateServices(baseUrIntranet);
  const [formusetemplate] = Form.useForm();
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (loading) fechdataSource();
  }, [loading]);

  const fechdataSource = async () => {
    const getdataAll = await manageemailtemplateservices.optionsType();
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
          <EmailTemplateTab dataSource={dataSource} loading={loading} setLoading={setLoading} formusetemplate={formusetemplate} />
        </div>
      </Card>
    </div>
  );
};

export default emailTemplatePage;
