"use client";
import { useState } from "react";
import { Breadcrumb, Card, Col, Divider, Row, Spin } from "antd";
import GroupTree from "./components/GroupTree";
import GroupManage from "./components/GroupManage";

export default function UsergroupPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [groupSelect, setGroupSelect] = useState<string | null>(null);
  const [selectedOrganize, setSelectedOrganize] = useState<string | null>(null);

  const propDataTree = (e: any) => {
    setSelectedOrganize(e.selectOrganize);
    setGroupSelect(e.groupSelect);
    setLoading(e.loading);
  };
  const propDataManage = (e: any) => {
    setSelectedOrganize(e.selectOrganize);
    setGroupSelect(e.groupSelect);
    setLoading(e.loading);
  };
  const onSetPermission = () => {};
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
                title: <span>Users Management</span>,
              },
              {
                title: <span>Groups</span>,
              },
            ]}
          />
        </Col>

        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font">{`Groups`}</div>
        </Divider>
        <Col span={24}>
          <div className="grid grid-cols-1 "></div>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div>
              <Spin spinning={loading}>
                <GroupTree
                  propDataTree={propDataTree}
                  loading={loading}
                  selectOrganize={selectedOrganize}
                />
              </Spin>
            </div>
            {groupSelect ? (
              <div>
                <GroupManage
                  propDataManage={propDataManage}
                  groupSelect={groupSelect}
                  selectOrganize={selectedOrganize}
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
