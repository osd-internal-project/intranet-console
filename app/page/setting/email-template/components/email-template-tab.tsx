import React from "react";
import { FormInstance, Tabs } from "antd";
import EmailTemplateTable from "./email-template-table";
import { EmailTemplateActive } from "./email-template-active";

interface props {
  dataSource: any[];
  loading: boolean;
  setLoading: (value: boolean) => void;
  formusetemplate: FormInstance;
}

export const EmailTemplateTab: React.FC<props> = ({ dataSource, loading, setLoading, formusetemplate }): React.ReactElement => {
  const Items = [
    {
      label: "Template",
      key: "1",
      children: <EmailTemplateTable dataSource={dataSource} loading={loading} setLoading={setLoading} />,
    },
    {
      label: "Used",
      key: "3",
      children: <EmailTemplateActive dataSource={dataSource}setLoading={setLoading} formusetemplate={formusetemplate} />,
    },
  ];

  return <Tabs defaultActiveKey="1" items={Items} size="small" type="card" />;
};
