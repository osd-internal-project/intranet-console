import { Badge, Button, Card, Col, Input, Row, Table, TableColumnsType, Tag, Typography } from "antd";
import React from "react";
// import { dataReport } from "../test/data";
import { countWithCommas, dateToStringThNoTime, numberWithCommas } from "@/app/utils/format";

export interface props {
  gatdataAll: any[];
  paginationConfig: number;
  handlerPaginationTable: (value: any) => void;
  filter: any;
  getloading: boolean;
}

export const ReportTable: React.FC<props> = ({ gatdataAll, paginationConfig, handlerPaginationTable, filter, getloading }): React.ReactElement => {
  const columns: TableColumnsType<any> = [
    {
      title: "LOT NO.",
      dataIndex: "lotNo",
      key: "lotNo",
    },
    {
      title: "CAS NO.",
      dataIndex: "casNo",
      key: "casNo",
      render: (_, row: any) => row?.inventoryStock?.masterProduct?.casNo,
    },
    {
      title: "PRODUCT NAME",
      dataIndex: "productName",
      key: "productName",
      render: (_, row: any) => row?.inventoryStock?.masterProduct?.masterProductDetails.map((obj: { name: string }) => obj.name).join(", "),
    },
    {
      title: "DEPARTMENT",
      dataIndex: "location",
      key: "location",
      render: (_, row: any) => row?.inventoryStock?.inventory?.location?.locationName,
    },
    {
      title: "INVENTORY",
      dataIndex: "inventory",
      key: "inventory",
      render: (_, row: any) => row?.inventoryStock?.inventory?.inventoryName,
    },
    {
      title: "CHEMICAL FORMULA",
      dataIndex: "chemicalFormula",
      key: "chemicalFormula",
      render: (_, row: any) => row?.inventoryStock?.masterProduct?.chemicalFormula,
    },
    {
      title: "GROUP",
      dataIndex: "groupName",
      key: "groupName",
      render: (_, row: any) => row?.inventoryStock?.masterProduct?.masterProductGroup?.groupName,
    },
    {
      title: "VENDER",
      dataIndex: "venderName",
      key: "venderName",
    },
    {
      title: "BRAND",
      dataIndex: "brandName",
      key: "brandName",
    },

    {
      title: "EXPRIED DATE",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (value, record, index) => <>{dateToStringThNoTime(value)}</>,
    },
    {
      title: "QTY(EXP)",
      dataIndex: "remain",
      key: "remain",
      align: "right",
      render: (value, record, index) => (
        <div className=" font-bold" style={{ color: "red" }}>
          {numberWithCommas(value)}
        </div>
      ),
    },
    {
      title: "UNIT",
      dataIndex: "unit",
      key: "unit",
      render: (_, row: any) => row?.inventoryStock?.masterProduct?.unit?.unitName,
    },
  ];
  return (
    <div>
      <Table
        loading={getloading}
        dataSource={gatdataAll}
        columns={columns}
        rowKey={(e: any) => e.id}
        scroll={{ x: "calc(800px + 100%)" }}
        pagination={{ total: paginationConfig, current: filter?.current, showSizeChanger: false }}
        onChange={handlerPaginationTable}
      />
    </div>
  );
};
