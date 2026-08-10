"use client";
import { Breadcrumb, Card, Col, Divider, Result, Row } from "antd";
import RoleTable from "./components/RoleTable";
import { useUserAccess } from "@/app/config/userContext";

/** หน้าแสดงสิทธิ์การใช้งานทั้งหมดของระบบ (เฉพาะผู้ดูแลระบบ) */
export default function UserRulePage() {
  const { accessRole } = useUserAccess();
  const isAdmin = accessRole(["admin"]);

  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Breadcrumb
          items={[
            {
              href: "/page",
              title: <span>หน้าหลัก</span>,
            },
            {
              href: "/page/users-management/users",
              title: <span>Users Management</span>,
            },
            {
              title: <span>สิทธิ์การใช้งาน</span>,
            },
          ]}
        />
      </Col>
      <Divider orientation="left" orientationMargin="0">
        <div className="title-page-font">{`สิทธิ์การใช้งาน (Roles)`}</div>
      </Divider>
      <Col span={24}>
        <div className="grid grid-cols-1 ">
          <Card>
            {isAdmin ? (
              <RoleTable />
            ) : (
              <Result
                status="403"
                title="403"
                subTitle="เฉพาะผู้ดูแลระบบเท่านั้นที่เข้าถึงหน้านี้ได้"
              />
            )}
          </Card>
        </div>
      </Col>
    </Row>
  );
}
