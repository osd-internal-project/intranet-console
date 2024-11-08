"use client";
import { useState } from "react";
import { Breadcrumb, Card, Col, Divider, Row, Spin } from "antd";
import OrganizeTree from "./components/organize-tree";
import OrganizeManage from "./components/organize-manage";

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true);
  const [organizeSelect, setOrganizeSelect] = useState<string | null>(null);

  const propDataTree = (e: any) => {
    setOrganizeSelect(e.organizeSelect);
    setLoading(e.loading);
  };
  const propDataManage = (e: any) => {
    setOrganizeSelect(e.organizeSelect);
    setLoading(e.loading);
  };

  return (
    <>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page",
                title: <span>หน้าหลัก</span>,
              },
              {
                title: <span>Setting</span>,
              },
              {
                title: <span>Organize Chart</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font">{`Organize Chart`}</div>
        </Divider>
        <Col span={24}>
          <div className="grid grid-cols-1 "></div>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div>
              <Spin spinning={loading}>
                <OrganizeTree propDataTree={propDataTree} loading={loading} />
              </Spin>
            </div>
            {organizeSelect ? (
              <div>
                <OrganizeManage
                  propDataManage={propDataManage}
                  organizeSelect={organizeSelect}
                />
              </div>
            ) : (
              <></>
            )}
          </div>
        </Col>
      </Row>
    </>
  );
}
