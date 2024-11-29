"use client";
import React, { useContext } from "react";
import { TableStock } from "./components/TableStock";
import { Breadcrumb, Col, Divider, Row, Space } from "antd";
import { useSearchParams } from "next/navigation";
import { UserContectType, UserContext } from "@/app/config/userContext";

const page = () => {
  const { user } = (useContext(UserContext) as UserContectType) || { user: null };
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const location = searchParams.get("location");
  const userId = searchParams.get("userId");
  const inventoryName = searchParams.get("inventoryName");
  const ownerGroup = searchParams.get("groupID");

  return (
    <div>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page/inventory",
                title: <span>หน้าหลัก</span>,
              },
              {
                title: <span>Inventory</span>,
              },
            ]}
          />
        </Col>

        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font">{`Inventory`}</div>
        </Divider>
        <div className="title-page-font-username">
          <Space>
            <div> {inventoryName}</div>
          </Space>
        </div>
      </Row>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <TableStock
            inventoryId={String(id)}
            location={String(location)}
            userId={String(userId)}
            username={user?.username}
            ownerGroup={ownerGroup}
            inventoryName={inventoryName}
          />
        </Col>
      </Row>
    </div>
  );
};
export default page;
