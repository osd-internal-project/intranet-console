"use client";
import React, { useContext, useState } from "react";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Divider,
  Result,
  Row,
  Space,
  message,
} from "antd";
import { UserContectType, UserContext } from "@/app/config/userContext";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import AlertTypesConfig from "./components/alert-types-config";
import { NotificationSettingServices } from "./services/notification-setting.service";

/** หน้าตั้งค่าการแจ้งเตือน (แอดมิน) — ตั้งค่าประเภท + จัดการผู้รับ */
const NotificationSettingPage: React.FC = () => {
  const { accessRole } = (useContext(UserContext) as UserContectType) || {
    accessRole: () => false,
  };
  const isAdmin = accessRole(["admin"]);
  const { id24Axios } = useId24();
  const [testing, setTesting] = useState(false);

  /** ยิงทดสอบทันที (force) — ต้องมีผู้รับอย่างน้อย 1 คน */
  const handleTestRun = async () => {
    setTesting(true);
    const services = NotificationSettingServices(
      id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_NOTIFICATION),
    );
    const res = await services.runNow(true);
    setTesting(false);
    if (res) {
      message.success(
        `ยิงทดสอบสำเร็จ — สร้างแจ้งเตือน ${res.created} รายการ, ส่งอีเมล ${res.emailed} ฉบับ`,
      );
    } else {
      message.error("ยิงทดสอบไม่สำเร็จ (ตรวจว่ามีผู้รับและ service ทำงานอยู่)");
    }
  };

  return (
    <Row>
      <Col span={24}>
        <Breadcrumb
          items={[
            { href: "/page/home", title: <span>หน้าหลัก</span> },
            { title: <span>ตั้งค่าการแจ้งเตือน</span> },
          ]}
        />
      </Col>
      <Divider orientation="left" orientationMargin="0">
        <div className="title-page-font">ตั้งค่าการแจ้งเตือน</div>
      </Divider>
      <Col span={24}>
        <Card>
          {isAdmin ? (
            <>
              <Row className="mb-3 flex justify-end">
                <Space>
                  <Button loading={testing} onClick={handleTestRun}>
                    ทดสอบส่งแจ้งเตือน (ยิงทันที)
                  </Button>
                </Space>
              </Row>
              <AlertTypesConfig />
            </>
          ) : (
            <Result
              status="403"
              title="403"
              subTitle="เฉพาะผู้ดูแลระบบเท่านั้นที่เข้าถึงหน้านี้ได้"
            />
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default NotificationSettingPage;
