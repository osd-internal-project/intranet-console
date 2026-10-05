"use client";
import { Breadcrumb, Card, Col, Divider, Result, Row } from "antd";
import { RoleAccessTable } from "./components/role-access-table";
import { useUserAccess } from "@/app/config/userContext";

/** หน้ากำหนดสิทธิ์การเข้าถึงให้กลุ่มผู้ใช้งาน (ผู้ดูแลระบบและฝ่ายบุคคล) */
export default function UserRoleAccessPage() {
  const { accessRole } = useUserAccess();
  const canManage = accessRole(["admin", "hr"]);

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
              title: <span>สิทธิ์การเข้าถึง</span>,
            },
          ]}
        />
      </Col>
      <Divider orientation="left" orientationMargin="0">
        <div className="title-page-font">{`สิทธิ์การเข้าถึง`}</div>
      </Divider>
      <Col span={24}>
        <div className="grid grid-cols-1 ">
          <Card>
            {canManage ? (
              <RoleAccessTable />
            ) : (
              <Result
                status="403"
                title="403"
                subTitle="เฉพาะผู้ดูแลระบบและฝ่ายบุคคลเท่านั้นที่เข้าถึงหน้านี้ได้"
              />
            )}
          </Card>
        </div>
      </Col>
    </Row>
  );
}
