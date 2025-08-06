import { ITOrder, ITOrderLot } from "@/app/page/stock/common/order";
import { dateToStringThNoTime } from "@/app/utils/format";
import { Table, TablePaginationConfig, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import React from "react";

export interface props {
  dataOrderLot: { data: ITOrderLot[]; count: number };
  changePagination: (page: TablePaginationConfig) => void;
  pagination: TablePaginationConfig;
}

const TableOrderLotPage: React.FC<props> = ({ dataOrderLot, changePagination, pagination }): React.ReactElement => {
  const columns: ColumnsType<ITOrder> = [
    {
      title: "ลำดับ",
      dataIndex: "id",
      key: "id",
      render: (id, record, index) => (pagination.current && pagination.pageSize ? (pagination.current - 1) * pagination.pageSize + (index + 1) : ""),
    },
    {
      title: "Product Name",
      dataIndex: "prdName",
      key: "prdName",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
    },

    {
      title: "Updated By",
      dataIndex: "updatedBy",
      key: "updatedBy",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) => dateToStringThNoTime(value),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (value) => dateToStringThNoTime(value),
    },
    {
      title: "Barcode",
      dataIndex: "barcode",
      key: "barcode",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (e) => (e === "in-stock" ? <Tag color="blue-inverse">{`มีสินค้าในคลัง`}</Tag> : <Tag color="error">{`สินค้าถูกนำจ่าย`}</Tag>),
    },
  ];
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">ข้อมูล Order Lot</h2>
        <div className="h-1 w-20 bg-blue-500 rounded"></div>
      </div>
      <Table
        dataSource={dataOrderLot.data}
        columns={columns}
        size="small"
        rowKey="id"
        scroll={{ x: "max-content" }}
        pagination={{ ...pagination, total: dataOrderLot.count }}
        onChange={changePagination}
      />
    </div>
  );
};

export default TableOrderLotPage;
