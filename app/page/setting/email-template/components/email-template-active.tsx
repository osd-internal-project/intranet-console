"use client";
import React, { useEffect, useState } from "react";
import { Button, Form, FormInstance, Input, message, Select } from "antd";
import { TEmailTemplate } from "../common";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManageemailTemplateServices } from "../service/email-template.service";
import { useRouter } from "next/navigation";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";

interface props {
  dataSource: TEmailTemplate[];
  setLoading: (value: boolean) => void;
  formusetemplate: FormInstance;
}

export const EmailTemplateActive: React.FC<props> = ({ dataSource, setLoading, formusetemplate }): React.ReactElement => {
  const router = useRouter();
  const { id24Axios } = useId24();
  const baseUrlIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const manageemailtemplateservices = ManageemailTemplateServices(baseUrlIntranet);
  const [selectTemplate, setSelectTemplate] = useState<any[]>([]);

  useEffect(() => {
    fecthData();
    formusetemplate.setFieldsValue({
      data: dataSource.map((e: any) => ({ templateUsedId: e.templateUsedId, typeId: e.id })),
    });
  }, [dataSource, formusetemplate]);

  const fecthData = async () => {
    const result = await manageemailtemplateservices.optionsTemplate();
    setSelectTemplate(result);
  };

  const onfinish = async (record: { data: { templateUsedId: string; typeId: number }[] }) => {
    const { data } = record;
    const result = await manageemailtemplateservices.updateType(data);
    console.log(result);
    if (result.status === "success") {
      message.success(`create success`);
      router.push("/page/setting/email-template");
      setLoading(true);
    }
  };

  return (
    <div>
      <Form form={formusetemplate} name="createformforuse" layout="vertical" autoComplete="off" onFinish={onfinish}>
        <Form.List name="data">
          {(fields) => (
            <>
              {fields.map(({ key, ...restField }, index) => (
                <div key={key}>
                  <Form.Item {...restField} name={[restField.name, "typeId"]} label={dataSource[index]?.name} hidden>
                    <Input />
                  </Form.Item>
                  <Form.Item {...restField} name={[restField.name, "templateUsedId"]} label={dataSource[index]?.name}>
                    <Select
                      allowClear
                      placeholder="Please Select"
                      options={selectTemplate.map((event, index) => ({
                        value: event.templateId,
                        label: event.name,
                        key: index,
                      }))}
                    />
                  </Form.Item>
                </div>
              ))}
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button type="primary" htmlType="submit">{`Submit`}</Button>
        </Form.Item>
      </Form>
    </div>
  );
};
