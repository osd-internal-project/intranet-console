"use client";
import React, { useContext, useEffect, useState } from "react";
import ComplainTable from "./components/complain-table";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { UserContext, type UserContectType } from "@/app/config/userContext";
import { loadAppConfig } from "@/app/config/app-config";
import { Modal, Form, Input, Select, Button, Card, Breadcrumb, Divider } from "antd";
import ComplainProblemServices from "@/app/services/complain-problem.service";
import type { ITComplainProblem } from "@/app/common/complain-problem";
import TextArea from "antd/es/input/TextArea";

const ComplainProblemPage = () => {
  const { user } = (useContext(UserContext) as UserContectType) || {
    user: null,
  };
  const { id24Axios } = useId24();
  const baseUrIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const complainproblemservice = ComplainProblemServices(baseUrIntranet);
  const [open, setOpen] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<ITComplainProblem[]>([]);

  useEffect(() => {
    if (loading) {
      fecthData();
    }
  }, [loading]);

  const fecthData = async () => {
    const response = await complainproblemservice.findByUserId(user!.userId, { type: "", name: "" });
    setDataSource(response);
    setLoading(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  const onFinish = async (values: ITComplainProblem) => {
    if (!user) return;
    try {
      await complainproblemservice.create({ ...values, userId: user.userId });
      setLoading(true);
      setOpen(false);
      form.resetFields();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <Breadcrumb
        items={[
          {
            href: "/page/home",
            title: <span>หน้าหลัก</span>,
          },
          {
            title: <span>ร้องเรียนปัญหา</span>,
          },
        ]}
      />
      <Divider orientation="left" orientationMargin="0">
        <div className="title-page-font" style={{ display: "flex", alignItems: "left" }}>
          <span style={{ marginRight: "8px" }}>ข้อมูลการร้องเรียนปัญหา</span>
        </div>
      </Divider>
      <Card>
        <div className="flex justify-end mb-2">
          <Button type="primary" onClick={handleOpen}>
            แจ้งปัญหา
          </Button>
        </div>

        <Modal title="ร้องเรียน / แจ้งปัญหา" open={open} footer={false} onCancel={handleCancel} okText="ส่งเรื่อง" cancelText="ยกเลิก" width={1200}>
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              status: false,
            }}
            onFinish={onFinish}
          >
            <Form.Item label="ประเภทปัญหา" name="name" rules={[{ required: true, message: "กรุณาเลือกประเภทปัญหา" }]}>
              <Select
                placeholder="เลือกประเภทปัญหา"
                options={[
                  { label: "ไม่พบปัญหาใดๆในการทำงาน", value: "NO_ISSUE" },
                  { label: "ปัญหาจากอุปกรณ์คอมพิวเตอร์", value: "COMPUTER_EQUIPMENT" },
                  { label: "ปัญหาจากเครื่องใช้สำนักงาน", value: "OFFICE_EQUIPMENT" },
                  { label: "ปัญหาจากอินเตอร์เน็ต", value: "INTERNET" },
                  { label: "ปัญหาจากสิ่งแวดล้อม เช่น ได้รับแสงไม่เพียงพอ เป็นต้น", value: "ENVIRONMENT" },
                  { label: "Other", value: "OTHER" },
                ]}
              />
            </Form.Item>

            {/* รายละเอียด */}
            <Form.Item label="รายละเอียดปัญหา" name="detail" rules={[{ required: true, message: "กรุณากรอกรายละเอียดปัญหา" }]}>
              <TextArea rows={4} placeholder="อธิบายรายละเอียดปัญหา..." />
            </Form.Item>
            <div className="flex justify-end">
              <Button htmlType="submit" type={`primary`}>{`ยืนยัน`}</Button>
            </div>
          </Form>
        </Modal>
        <ComplainTable dataSource={dataSource} />
      </Card>
    </div>
  );
};

export default ComplainProblemPage;
