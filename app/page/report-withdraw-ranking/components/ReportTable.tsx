import { Card, Col, Row, Table, TableColumnsType, Typography } from "antd";
import React from "react";
import {
  countWithCommas,
  numberWithCommas,
  dateToStringTh,
} from "@/app/utils/format";
export interface props {
  getdataresult: any;
  loading: boolean;
}
export const ReportTable: React.FC<props> = ({ getdataresult, loading }) => {
  const columns: TableColumnsType<any> = [
    {
      title: "CAS NO.",
      dataIndex: "casno",
      key: "casno",
    },
    {
      title: "PRODUCT NAME",
      dataIndex: "productname",
      key: "productname",
      render: (value, record, index) => (
        <div className="flex items-center ">{value}</div>
      ),
    },
    {
      title: "LOCATION",
      dataIndex: "location",
      key: "location",
    },

    {
      title: "CHEMICAL FORMULA",
      dataIndex: "chemicalformula",
      key: "chemicalformula",
    },
    {
      title: "GROUP",
      dataIndex: "groupname",
      key: "groupname",
    },
    {
      title: "VENDER",
      dataIndex: "vender",
      key: "vender",
    },
    {
      title: "BRAND",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "QTY",
      dataIndex: "qty",
      key: "qty",
      align: "right",
      render: (value, record, index) => <div>{numberWithCommas(value)}</div>,
    },
    {
      title: "UNIT",
      dataIndex: "unit",
      key: "unit",
    },
    {
      title: "LAST ORDER DATE",
      dataIndex: "updatedat",
      key: "updatedat",
      render: (value, record, index) => <div>{dateToStringTh(value)}</div>,
    },
    {
      title: "ORDER AMOUNT",
      dataIndex: "price",
      key: "price",
      align: "right",
      defaultSortOrder: "descend",
      render: (value, record, index) => (
        <div className=" font-bold">{numberWithCommas(value)}</div>
      ),
    },
  ];
  return (
    <div>
      <Table
        rowKey="id"
        dataSource={getdataresult}
        loading={loading}
        columns={columns}
        pagination={false}
      />
    </div>
  );
};
