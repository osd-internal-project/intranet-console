"use client";
import React from "react";

import { TableStock } from "./components/TableStock";
import { FiltersAddStock } from "./components/FiltersAddStock";
import { Breadcrumb, Col, Row, Space } from "antd";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

const page = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const location = searchParams.get("location");
  const userId = searchParams.get("userId");
  const inventoryName = searchParams.get("inventoryName");
  const ownerGroup = searchParams.get("groupID");

  const { data: session } = useSession();

  return (
    <div>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page/inventory",
                title: <span>Home</span>,
              },
              {
                title: <span>Inventory</span>,
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <Space>
            <div className="title-page-font">
              <div>{`INVENTORY :`}</div>
            </div>
            <div className="title-page-font-username">
              <Space>
                <div> {inventoryName}</div>
              </Space>
            </div>
          </Space>
        </Col>
      </Row>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <TableStock
            inventoryId={String(id)}
            location={String(location)}
            userId={String(userId)}
            username={session?.user?.username}
            ownerGroup={ownerGroup}
            inventoryName={inventoryName}
          />
        </Col>
      </Row>
    </div>
  );
};
export default page;
