import { Badge, Card, Col, Row, Table, TableColumnsType, Tag, Typography } from "antd";
import React from "react";
import { countWithCommas, dateToStringTh, dateToStringThNoTime, numberWithCommas } from "@/app/utils/format";

export interface props {
  getdataresult: any;
  paginationConfig: number;
  handlerPaginationTable: (value: any) => void;
  filter: any;
  status?: string;
  loading: boolean;
  checkvaluestatus: string;
}

export const ReportTable: React.FC<props> = ({
  status,
  getdataresult,
  paginationConfig,
  handlerPaginationTable,
  filter,
  loading,
  checkvaluestatus,
}) => {
  const columnsPay: TableColumnsType<any> = [
    {
      title: "CAS NO.",
      dataIndex: "casNo",
      key: "casNo",
    },
    {
      title: "PRODUCT NAME",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "DEPARTMENT",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "INVENTORY",
      dataIndex: "inventory",
      key: "inventory",
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
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (value, record, index) => (
        <div>
          {value === "pay" ? (
            <Tag>
              <Badge color="red" text="เบิกจ่าย" />
            </Tag>
          ) : (
            <Tag>
              {" "}
              <Badge color="blue" text="รับเข้า" />
            </Tag>
          )}
        </div>
      ),
    },

    {
      title: "ORDER STATUS",
      dataIndex: "orderStatus",
      key: "orderStatus",
      align: "center",
      render: (value, record, index) => <div>{value ? <Tag>{value}</Tag> : ""}</div>,
    },
    {
      title: "OBJECTIVE",
      dataIndex: "objective",
      key: "objective",
    },

    {
      title: "REQUESTER NAME",
      dataIndex: "requesterName",
      key: "requesterName",
    },
    {
      title: "REQUESTER GROUP",
      dataIndex: "requesterGroupName",
      key: "requesterGroupName",
    },
    {
      title: "QTY",
      dataIndex: "qty",
      key: "qty",
      align: "right",
      render: (value, record, index) => <>{numberWithCommas(value)}</>,
    },
    {
      title: "UNIT",
      dataIndex: "unit",
      key: "unit",
    },
    {
      title: "ORDER DATE",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (value, record, index) => <>{dateToStringTh(value)}</>,
    },
    {
      title: "RESOPNSIBLE PRESON",
      dataIndex: "updatedByName",
      key: "updatedByName",
    },
  ];

  const columnsRecieve: TableColumnsType<any> = [
    {
      title: "CAS NO.",
      dataIndex: "casNo",
      key: "casNo",
    },
    {
      title: "PRODUCT NAME",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "DEPARTMENT",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "INVENTORY",
      dataIndex: "inventory",
      key: "inventory",
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
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (value, record, index) => (
        <div>
          {value === "pay" ? (
            <Tag>
              <Badge color="red" text="เบิกจ่าย" />
            </Tag>
          ) : (
            <Tag>
              <Badge color="blue" text="รับเข้า" />
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "QTY",
      dataIndex: "qty",
      key: "qty",
      align: "right",
      render: (value, record, index) => <>{numberWithCommas(value)}</>,
    },
    {
      title: "UNIT",
      dataIndex: "unit",
      key: "unit",
    },
    {
      title: "ORDER DATE",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (value, record, index) => <>{dateToStringTh(value)}</>,
    },
    {
      title: "RESOPNSIBLE PRESON",
      dataIndex: "updatedByName",
      key: "updatedByName",
    },
  ];
  return (
    <div>
      <Table
        dataSource={getdataresult}
        columns={checkvaluestatus === "pay" ? columnsPay : columnsRecieve}
        rowKey={(e) => e.id}
        scroll={{ x: "calc(800px + 100%)" }}
        pagination={{ total: paginationConfig, current: filter?.current, showSizeChanger: false }}
        onChange={handlerPaginationTable}
        loading={loading}
      />
    </div>
  );
};
