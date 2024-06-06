"use client";
import { useState } from "react";
import { Breadcrumb, Card, Col, Row, Spin } from "antd";
import GroupTree from "./components/GroupTree";
import GroupManage from "./components/GroupManage";

export default function UsergroupPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [groupSelect, setGroupSelect] = useState<string | null>(null);

  const propDataTree = (e: any) => {
    setGroupSelect(e.groupSelect);
    setLoading(e.loading);
  };
  const propDataManage = (e: any) => {
    setGroupSelect(e.groupSelect);
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
                title: <span>Home</span>,
              },
              {
                href: "/page/setting",
                title: <span>Setting</span>,
              },
              {
                title: <span>User Group </span>,
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <div className="title-page-font">{`USER GROUP`}</div>
        </Col>
        <Col span={24}>
          <div className="grid grid-cols-1 "></div>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div>
              <Spin spinning={loading}>
                <GroupTree propDataTree={propDataTree} loading={loading} />
              </Spin>
            </div>
            {groupSelect ? (
              <div>
                <GroupManage propDataManage={propDataManage} groupSelect={groupSelect} />
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
