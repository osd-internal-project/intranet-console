"use client";
import { useState } from "react";
import { Breadcrumb, Card, Col, Divider, Row, Spin } from "antd";
import RuleTable from "./components/RuleTable";
import RuleManage from "./components/RuleManage";

const InitialFilter = {
  take: 10,
  skip: 0,
  current: 1,
};

export default function UsergroupPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<{ take: number; skip: number; current: number }>(InitialFilter);
  const [manageStatus, setManageStatus] = useState<{
    status: string | null;
    ruleCode: string | null;
    ruleName: string | null;
    description: string | null;
  }>({
    status: null,
    ruleCode: null,
    ruleName: null,
    description: null,
  });
  const [paginationConfig, setPaginationConfig] = useState<number>(0);

  const propDataTable = (e: any) => {
    setManageStatus(e);
  };
  const propDataManage = (e: any) => {
    setLoading(e.loading);
  };

  const propLoading = (e: any) => {
    setLoading(e);
  };

  const handlerPaginationTable = (paginate: any) => {
    const skip = paginate.current * paginate.pageSize - paginate.pageSize;
    const { current, pageSize } = paginate;
    setFilter((prevState) => ({
      ...prevState,
      skip: skip,
      take: pageSize,
      current: current,
    }));
    propLoading(true);
  };
  return (
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
              title: <span>Users Management</span>,
            },
            {
              title: <span>Rules</span>,
            },
          ]}
        />
      </Col>
      <Divider orientation="left" orientationMargin="0">
        <div className="title-page-font">{`Rules`}</div>
      </Divider>
      <Col span={24}>
        <div className="grid grid-cols-1 ">
          <Card>
            <RuleTable
              propLoading={propLoading}
              propDataTable={propDataTable}
              loading={loading}
              handlerPaginationTable={(e: any) => handlerPaginationTable(e)}
              filter={filter}
              setPaginationConfig={(e: number) => setPaginationConfig(e)}
              paginationConfig={paginationConfig}
            />
            <RuleManage propDataManage={propDataManage} manageStatus={manageStatus} />
          </Card>
        </div>
      </Col>
    </Row>
  );
}
