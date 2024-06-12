"use client";
import { Card, Col, Row, Table, Tag, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { ITypeOption, ITypeDataTable } from "../common";
import NotificationBeforeExpiredServices from "../services/index.service";
import { useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ColumnsType } from "antd/es/table";
import { numberWithCommas, dateToStringThNoTime } from "@/app/utils/format";
import { diffDayDate } from "@/app/utils";
export interface props {
  location: number[];
}
export const NotificationTable: React.FC<props> = ({
  location,
}): React.ReactElement => {
  const stockAuth = useAxiosStock();
  const notificationBeforeExpiredServices =
    NotificationBeforeExpiredServices(stockAuth);
  const [dataTable, setDataTable] = useState<ITypeDataTable[]>([]);
  useEffect(() => {
    fetchData();
  }, [location]);
  const fetchData = async () => {
    if (location.length > 0) {
      const data: ITypeDataTable[] =
        await notificationBeforeExpiredServices.findLotBeforeExpiredByLocation(
          location
        );

      setDataTable(data);
    } else {
      setDataTable([]);
    }
  };
  const columns: ColumnsType<ITypeDataTable> = [
    {
      key: "notiExpiryDate",
      title: "SENT DATE",
      dataIndex: "notiExpiryDate",
      render: (d: Date) => dateToStringThNoTime(d),
    },
    {
      key: "locationName",
      title: "LOCATION",
      dataIndex: ["inventoryStock", "inventory", "location", "locationName"],
    },
    {
      key: "inventoryName",
      title: "INVENTORY",
      dataIndex: ["inventoryStock", "inventory", "inventoryName"],
    },
    { key: "lotNo", title: "LOT NO.", dataIndex: "lotNo" },
    {
      key: "casNo",
      title: "CAS NO.",
      dataIndex: ["inventoryStock", "masterProduct", "casNo"],
    },
    {
      key: "masterProductDetails",
      title: "PRODUCT NAME",
      dataIndex: ["inventoryStock", "masterProduct", "masterProductDetails"],
      render: (d: { name: string }[]) =>
        d.map((product, index) => (
          <Tag key={index} color="blue">
            {product.name}
          </Tag>
        )),
    },
    {
      key: "remain",
      title: "REMAIN",
      dataIndex: "remain",
      align: "right",
      render: (d: number, r: ITypeDataTable) =>
        `${numberWithCommas(d)} ${
          r.inventoryStock.masterProduct.unit.unitName
        }`,
    },
    {
      key: "id",
      title: "DAYS BEFORE EXPIRY",
      dataIndex: "expiredCountDate",
      align: "center",
      render: (d: number, r: ITypeDataTable) =>
        diffDayDate(new Date(), r.expiryDate) > 0 ? (
          `${diffDayDate(new Date(), r.expiryDate)} `
        ) : (
          <Tag className=" font-bold" color="red">
            Expired
          </Tag>
        ),
    },
    {
      key: "expiryDate",
      title: "EXPIRED DATE",
      dataIndex: "expiryDate",
      render: (d: Date) => dateToStringThNoTime(d),
    },
  ];
  return (
    <div>
      <Card style={{ width: "100%", height: "250px", overflowY: "scroll" }}>
        <Row>
          <Col span={24}>
            <Table
              size="small"
              columns={columns}
              dataSource={dataTable}
              rowKey={"lotNo"}
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
};
