import { Button, Table, TablePaginationConfig, Tag, Tooltip } from "antd";
import React from "react";
import { ITRequestOrder, ITRequestOrderList } from "../../common/request-order";
import { ColumnsType } from "antd/es/table";
import { dateFormatTimeNoTIme } from "@/app/utils";
import { useRouter } from "next/navigation";

export interface props {
  dataSource: { data: ITRequestOrder[]; count: number };
  pagination: TablePaginationConfig;
  changePagination: (values: TablePaginationConfig) => void;
}

export const TableStockRequestPage: React.FC<props> = ({ dataSource, pagination, changePagination }): React.ReactElement => {
  const navigate = useRouter();
  const handleClick = (requestId: string) => {
    navigate.push(`/page/stock/stock-request/${requestId}`);
  };
  const columns: ColumnsType<ITRequestOrder> = [
    {
      title: "รหัสการเบิก",
      dataIndex: "requestId",
      key: "requestId",
      render: (value: string) => (
        <Tooltip title={`คลิกเพื่อดูรายละเอียด`}>
          <Button type="link" onClick={() => handleClick(value)}>
            {value}
          </Button>
        </Tooltip>
      ),
    },
    {
      title: "ผู้ขอเบิก",
      dataIndex: "requester",
      key: "requester",
    },
    {
      title: "วันที่ใช้",
      dataIndex: "requestDate",
      key: "requestDate",
      render: (value: string) => dateFormatTimeNoTIme(value),
    },
    {
      title: "เนื่องจาก",
      dataIndex: "object",
      key: "object",
    },
    // {
    //   title: "จำนวนสินค้า",
    //   dataIndex: "requestQty",
    //   key: "requestQty",
    //   render: (value: number) => `${value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
    // },
    // {
    //   title: "ราคารวม",
    //   dataIndex: "requestPrice",
    //   key: "requestPrice",
    //   render: (value: number) => `฿ ${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
    // },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      render: (value: string) => {
        const statusMap: Record<string, { text: string; color: string }> = {
          new: { text: "ใหม่", color: "blue" },
          approved: { text: "อนุมัติ", color: "green" },
          rejected: { text: "ปฏิเสธ", color: "red" },
          cancelled: { text: "ยกเลิก", color: "orange" },
        };
        const status = statusMap[value] || { text: value, color: "default" };
        return <Tag color={status.color}>{status.text}</Tag>;
      },
    },
    {
      title: "สร้างโดย",
      dataIndex: "createdBy",
      key: "createdBy",
    },
    {
      title: "สร้างเมื่อ",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: string) => dateFormatTimeNoTIme(value),
    },
  ];
  const expandedRowRender = (record: ITRequestOrder) => {
    console.log(record.requestList);

    return (
      <Table<ITRequestOrderList>
        size="small"
        columns={columnsRequestOrderList}
        dataSource={record.requestList}
        pagination={false}
        rowKey="id"
        scroll={{ x: "max-content" }}
        summary={(pageData) => {
          let totalQty = 0;
          let totalAmount = 0;
          pageData.forEach(({ qty, amount }) => {
            totalQty += qty || 0;
            totalAmount += amount || 0;
          });
          return (
            <Table.Summary.Row className=" font-bold bg-gray-700 text-white">
              <Table.Summary.Cell index={0} colSpan={2} className=" font-bold">
                {`รวม ${pageData.length} รายการ`}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2} className=" font-bold">
                {totalQty.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3} className=" font-bold">
                ฿ {totalAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </Table.Summary.Cell>
            </Table.Summary.Row>
          );
        }}
      />
    );
  };

  const columnsRequestOrderList: ColumnsType<ITRequestOrderList> = [
    {
      title: "รหัสสินค้า",
      dataIndex: "masterProductId",
      key: "masterProductId",
    },
    {
      title: "ชื่อสินค้า",
      dataIndex: ["masterProduct", "prdName"],
      key: "masterProductId",
    },
    {
      title: "จำนวน",
      dataIndex: "qty",
      key: "qty",
      render: (value: number) => `${value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
    },
    {
      title: "ราคา",
      dataIndex: "amount",
      key: "amount",
      render: (value: number) => `฿ ${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
    },
  ];

  return (
    <div>
      <Table
        size="small"
        columns={columns}
        dataSource={dataSource.data}
        pagination={{ ...pagination, total: dataSource.count }}
        onChange={changePagination}
        rowKey={`id`}
        scroll={{ x: "max-content" }}
        expandable={{
          expandedRowRender,
        }}
      />
    </div>
  );
};
