import { Button, Table, TablePaginationConfig, Typography, Image, Tag, Tooltip } from "antd";
import React from "react";
import { ITOrder } from "../../common/order";
import { ITMasterProduct } from "../../common/master-product";
// import { deleteIcon, editIcon } from "@/components/icon";
import { dateToStringTh, dateToStringThNoTime } from "@/app/utils/format";
import { ColumnsType } from "antd/es/table";
import { useRouter } from "next/navigation";
import { editIcon } from "@/components/icon";

export interface props {
  dataSource: { data: ITMasterProduct[]; count: number };
  changePagination: (values: TablePaginationConfig) => void;
  pagination: TablePaginationConfig;
}

export const OrderTablePage: React.FC<props> = ({ dataSource, changePagination, pagination }): React.ReactElement => {
  const navigate = useRouter();
  const columns: ColumnsType<ITMasterProduct> = [
    {
      title: "ลำดับ",
      dataIndex: "id",
      key: "id",
      render: (id, record, index) => (pagination.current && pagination.pageSize ? (pagination.current - 1) * pagination.pageSize + (index + 1) : ""),
    },
    {
      title: "ชื่อสินค้า",
      dataIndex: "prdName",
      key: "prdName",
      render: (_, record) => {
        return (
          <div className="grid grid-cols-3">
            <div className="grid col-span-1 justify-center items-center align-middle">
              <Image
                width={"40px"}
                height={"40px"}
                src={`${process.env.REACT_APP_API_BASE_URL_INVENTORY}/master-product-image/get-image/${
                  record?.masterProductImage?.[0]?.prdImageId ?? ""
                }`}
              />
            </div>
            <div className="grid grid-cols-1 col-span-2">
              <div className="grid col-span-1">
                <Typography.Text className="font-bold text-lg">{_}</Typography.Text>
              </div>
              <div className="grid col-span-1">
                <Typography.Text className="text-gray-400">{record.description}</Typography.Text>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "หน่วย",
      dataIndex: ["unit", "unitName"],
      key: "updatedBy",
    },

    {
      title: "ราคา / หน่วย",
      dataIndex: "price",
      key: "price",
      render: (value: number) => `${value?.toLocaleString(undefined, { minimumFractionDigits: 2 })} บาท`,
    },
    {
      title: "จำนวนทั้งหมด",
      dataIndex: "totalQty",
      key: "totalQty",
    },
    {
      title: "สถานะสินค้า",
      dataIndex: "totalQty",
      key: "totalQty",
      render: (value) => (value === 0 ? <Tag color="error">{`สินค้าหมด`}</Tag> : <Tag color="blue-inverse">{`มีสินค้าในคลัง`}</Tag>),
    },
    {
      title: "นำเข้าโดย",
      dataIndex: "updatedBy",
      key: "updatedBy",
    },
    {
      title: "...",
      key: "prdId",
      dataIndex: "prdId",
      fixed: "right" as "right",
      align: "center",
      render: (value) => (
        <div className=" space-x-2">
          <Tooltip placement="topLeft" title={`นำเข้าสินค้า`}>
            <Button type="link" className="p-1" onClick={() => navigate.push(`/page/stock/order/${value}`)}>
              {editIcon}
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const orderColumns: ColumnsType<ITOrder> = [
    {
      title: "รหัส Order",
      dataIndex: "oderId",
      key: "oderId",
    },
    {
      title: "วันที่นำเข้า",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) => (value ? dateToStringThNoTime(value) : ""),
    },
    {
      title: "ชื่อสินค้า",
      dataIndex: "prdName",
      key: "prdName",
    },
    {
      title: "จำนวน",
      dataIndex: "totalQty",
      key: "totalQty",
    },
    {
      title: "หน่วย",
      dataIndex: "unit",
      key: "unit",
    },
    {
      title: "ราคา / หน่วย",
      dataIndex: "price",
      key: "price",
      render: (value: number) => `${value?.toLocaleString(undefined, { minimumFractionDigits: 2 })} บาท`,
    },
    {
      title: "ราคารวม",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (value: number) => `${value?.toLocaleString(undefined, { minimumFractionDigits: 2 })} บาท`,
    },

    {
      title: "นำเข้าโดย",
      dataIndex: "updatedBy",
      key: "updatedBy",
    },
    // {
    //   title: "สถานะสินค้า",
    //   dataIndex: "status",
    //   key: "status",
    //   align: "center",
    //   render: (e) => (e === "in-stock" ? <Tag color="blue-inverse">{`มีสินค้าในคลัง`}</Tag> : <Tag color="error">{`สินค้าถูกนำจ่าย`}</Tag>),
    // },
    // {
    //   title: "...",
    //   dataIndex: "id",
    //   key: "id",
    //   align: "center",
    //   render: (value, record, index) => (
    //     <Button size="small" type="link" onClick={() => navigate.push(`/page/stock/order/order-lot/${record.oderId}`)}>{`รายละเอียด`}</Button>
    //   ),
    // },
  ];

  const expandedRowRender = (record: any) => {
    return (
      <Table<ITOrder> size="small" columns={orderColumns} dataSource={record.order} pagination={false} rowKey="id" scroll={{ x: "max-content" }} />
    );
  };

  return (
    <div>
      <Table
        size="small"
        columns={columns}
        dataSource={dataSource.data}
        pagination={{ ...pagination, total: dataSource.count }}
        rowKey={"id"}
        scroll={{ x: "max-content" }}
        onChange={changePagination}
        expandable={{
          expandedRowRender,
        }}
      />
    </div>
  );
};
