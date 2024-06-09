"use client";
import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Card, Col, Popover, Row, Spin, TablePaginationConfig } from "antd";
import MaTableComponent from "./components/MaTable";
import { ITMaDetail, ITMaTask, ITPagination } from "./common";
import { FilterOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import MaServices from "./services/ma.service";

export default function MaTaskPage() {
  const intranetAuth = useAxiosIntranet();
  const maServices = MaServices(intranetAuth);
  const [loading, setloading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<TablePaginationConfig>({ current: 1, pageSize: 10, total: 20 });
  const [dataTable, setDataTable] = useState<ITMaTask[]>([]);
  useEffect(() => {
    if (loading === true) fetchData();
  }, [loading]);

  const fetchData = async () => {
    const skip: number = (Number(pagination.current) - 1) * Number(pagination.pageSize);
    const take: number = Number(pagination.pageSize);
    const res = await maServices.findMaDataTable({ take: take, skip: skip });
    setDataTable(res.data);
    setPagination({ ...pagination, total: res.count });
    setloading(false);
  };

  const changePagination = (page: TablePaginationConfig) => {
    setPagination({ ...page });
    setloading(true);
  };
  return (
    <Spin spinning={loading}>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page",
                title: <span>Home</span>,
              },
              {
                title: <span>MA Mangement</span>,
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <div className="title-page-font">{`MA MANAGEMENT`}</div>
        </Col>
        <Col span={24} className=" flex justify-between">
          <Popover
            // onOpenChange={handleOpenFilter}
            // open={openFilter}
            // content={searchContent}
            placement="bottomLeft"
            title="Search"
            trigger="click"
            overlayStyle={{ width: "calc(100% - 240px)" }}
          >
            <Button type="primary" icon={<FilterOutlined />}>
              Filters
            </Button>
          </Popover>
          <Link href={"/page/ma-management/create"}>
            <Button type="primary">เพิ่ม MA</Button>
          </Link>
        </Col>
        <Col span={24}>
          <div className="grid grid-cols-1 ">
            <Card>
              <MaTableComponent
                dataTable={dataTable}
                loading={loading}
                setLoading={(e: boolean) => setloading(e)}
                pagination={pagination}
                changePagination={changePagination}
              />
            </Card>
          </div>
        </Col>
      </Row>
    </Spin>
  );
}
