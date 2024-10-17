"use client";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Divider, Form, Input, message, Row, Select } from "antd";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManageemailTemplateServices } from "../service/email-template.service";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const addEmailTemplate = () => {
  const [FormCreateTemplate] = Form.useForm();
  const intraAuth = useAxiosIntranet();
  const manageemailtemplateservices = ManageemailTemplateServices(intraAuth);
  const [optionsType, setoptionsType] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [emailTemplateFields, setEmailTemplateFields] = useState<any[]>([]);
  const [typeName, setTypeName] = useState<string>("");

  useEffect(() => {
    if (loading) fechdataSource();
  }, [loading]);

  const fechdataSource = async () => {
    const getdataOptionsType = await manageemailtemplateservices.optionsType();
    setoptionsType(getdataOptionsType);
    setLoading(false);
  };

  const checkField = (value: number) => {
    setEmailTemplateFields([]);
    setTypeName("");

    if (value) {
      let data = optionsType.filter((e: any) => e.id === value);
      setEmailTemplateFields(data[0].emailTemplateFields);
      setTypeName(data[0].name);
    }
  };

  const onFinish = async (value: any) => {
    const onFinish = await manageemailtemplateservices.create(value);
    if (onFinish) {
      message.success(`create success`);
    }
  };

  return (
    <div>
      <Card title={`Add Template`}>
        <Form name="createForm" autoComplete="off" layout="vertical" form={FormCreateTemplate} onFinish={onFinish}>
          <Row gutter={[8, 8]}>
            <Col span={12}>
              <Form.Item name={"name"} label="Name" required>
                <Input placeholder="Text" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={"type"} label="Type" required>
                <Select
                  allowClear
                  placeholder="Please Select"
                  options={optionsType.map((e: any) => {
                    return { value: e.id, label: e.name };
                  })}
                  onChange={checkField}
                />
              </Form.Item>
            </Col>
            <Col span={emailTemplateFields.length > 0 ? 17 : 24}>
              <Form.Item name={"htmlTemplate"} label="HTML Template" required>
                <ReactQuill theme="snow" />
              </Form.Item>
            </Col>
            <Col className={emailTemplateFields.length > 0 ? "" : "hidden"} span={7}>
              <Card
                style={{
                  padding: 0,
                  marginTop: "27px",
                }}>
                <div style={{ justifyContent: "center", display: "flex", fontSize: "32px", marginTop: "-18px" }}>{`${typeName}`}</div>
                <Divider style={{ marginTop: "-2px", marginBottom: "10px" }}></Divider>
                {emailTemplateFields.map((e: any, index: number) => {
                  return (
                    <Row gutter={[8, 8]} style={{ marginBottom: "10px" }} key={index}>
                      <Col span={12} style={{ color: "grey", fontWeight: "bold" }}>{`${e.name}`}</Col>
                      <Col span={12}>{`: ${e.description}`}</Col>
                    </Row>
                  );
                })}
              </Card>
            </Col>
          </Row>
          <Form.Item style={{ textAlign: "center" }}>
            <Button type="primary" htmlType="submit">{`Confirm`}</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default addEmailTemplate;
