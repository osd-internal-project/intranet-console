"use client";
import { Breadcrumb, Button, Card, Col, Divider, Row, TablePaginationConfig } from "antd";
import React, { useEffect, useState } from "react";
import { TableStockRequestPage } from "./components/table-stock-request";
import { useRouter } from "next/navigation";
import { loadAppConfig } from "@/app/config/app-config";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import RequestOrderServices from "../services/request-order.service";
import { ITRequestOrder } from "../common/request-order";

const StockRequestPage = () => {
  const { id24Axios } = useId24();
  const navigate = useRouter();
  const baseUrlInventory = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_INVENTORY);
  const requestorderServices = RequestOrderServices(baseUrlInventory);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<{ data: ITRequestOrder[]; count: number }>({ data: [], count: 0 });
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  useEffect(() => {
    if (loading) fecthData();
  }, [loading]);

  const fecthData = async () => {
    const skip = (Number(pagination.current) - 1) * Number(pagination.pageSize);
    const take = Number(pagination.pageSize);
    const { data, count } = await requestorderServices.findMany({}, skip, take);
    setDataSource({ data, count });
    setLoading(false);
  };

  const changePagination = (page: TablePaginationConfig) => {
    setPagination({ ...page });
    setLoading(true);
  };

  return (
    <div>
      <Row>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page/home",
                title: <span>{`หน้าหลัก`}</span>,
              },
              {
                href: "/page/stock",
                title: <span>{`การจัดการสินค้า`}</span>,
              },
              {
                title: <span>{`การเบิกสินค้า`}</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font" style={{ display: "flex", alignItems: "left" }}>
            <span style={{ marginRight: "8px" }}>{`การเบิกสินค้า`}</span>
          </div>
        </Divider>
      </Row>
      <Card styles={{ body: { padding: "10px" } }}>
        <div className="grid grid-cols-1 gap-2">
          <div className="flex justify-end">
            <Button onClick={() => navigate.push(`/page/stock/stock-request/manage`)}>{`Request Order`}</Button>
          </div>
          <div>
            <TableStockRequestPage dataSource={dataSource} pagination={pagination} changePagination={changePagination} />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StockRequestPage;
