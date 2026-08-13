"use client";
import { useState } from "react";
import { Breadcrumb, Col, Divider, Row } from "antd";
import GroupTree from "./components/GroupTree";
import GroupManage from "./components/GroupManage";

export default function UsergroupPage() {
  const [selectedOrganize, setSelectedOrganize] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  /** เพิ่มค่าเพื่อสั่งให้ทรีโหลดข้อมูลใหม่ หลังเพิ่ม/แก้ไข/ลบกลุ่ม */
  const [refreshToken, setRefreshToken] = useState<number>(0);

  /**
   * โหลดข้อมูลกลุ่มใหม่ทั้งหมด แล้วเลือกกลุ่มที่ระบุ
   * @param groupId กลุ่มที่ต้องการให้เลือกค้างไว้ (null = ไม่เลือกกลุ่มใด)
   */
  const refreshGroups = (groupId: string | null): void => {
    setSelectedGroupId(groupId);
    setRefreshToken((previous) => previous + 1);
  };

  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Breadcrumb
          items={[
            { href: "/page", title: <span>{"หน้าหลัก"}</span> },
            { title: <span>{"จัดการผู้ใช้งาน"}</span> },
            { title: <span>{"กลุ่มผู้ใช้งาน"}</span> },
          ]}
        />
      </Col>

      <Divider orientation="left" orientationMargin="0">
        <div className="title-page-font">{"กลุ่มผู้ใช้งาน"}</div>
      </Divider>

      <Col span={24}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="md:col-span-1">
            <GroupTree
              selectedOrganize={selectedOrganize}
              selectedGroupId={selectedGroupId}
              refreshToken={refreshToken}
              onSelectOrganize={setSelectedOrganize}
              onSelectGroup={setSelectedGroupId}
            />
          </div>
          <div className="md:col-span-2">
            <GroupManage
              groupId={selectedGroupId}
              selectedOrganize={selectedOrganize}
              refreshToken={refreshToken}
              onRefresh={refreshGroups}
            />
          </div>
        </div>
      </Col>
    </Row>
  );
}
