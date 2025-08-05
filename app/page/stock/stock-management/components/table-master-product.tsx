import React from "react";
import { Button, Image, Table, TablePaginationConfig, Tag, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { dateToStringTh } from "@/app/utils/format";
import { deleteIcon, editIcon } from "@/components/icon";
import { ITMasterProduct } from "../../common/master-product";
import { useRouter } from "next/navigation";

export interface props {
  dataSource: { data: ITMasterProduct[]; count: number };
  changePagination: (values: TablePaginationConfig) => void;
  pagination: TablePaginationConfig;
  handleManage: (status: boolean, type: string, value?: ITMasterProduct) => void;
}

const TableMasterProductPage: React.FC<props> = ({ dataSource, changePagination, pagination, handleManage }): React.ReactElement => {
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
      render: (_, record, index) => {
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
      title: "นำเข้าโดย",
      dataIndex: "updatedBy",
      key: "updatedBy",
    },

    {
      title: "วันหมดอายุ",
      dataIndex: "expired",
      key: "expired",
      render: (value, record, index) => (value ? dateToStringTh(value) : ""),
    },
    {
      title: "วันที่สร้าง",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value, record, index) => (value ? dateToStringTh(value) : ""),
    },
    // {
    //   title: "นำเข้าสินค้า",
    //   dataIndex: "prdId",
    //   key: "prdId",
    //   render: (value) => (
    //     <div>
    //       <Button type="primary" className="p-1 gap-2" onClick={() => navigate.push(`/page/stock/stock-management/${value}`)}>
    //         {IconImport} {`นำเข้าสินค้า`}
    //       </Button>
    //     </div>
    //   ),
    // },
    {
      title: "...",
      key: "id",
      dataIndex: "id",
      fixed: "right" as "right",
      align: "center",
      render: (value, record, index) => (
        <div className=" space-x-2">
          <Button type="link" className="p-1" onClick={() => handleManage(true, "edit", record)}>
            {editIcon}
          </Button>
          <Button type="link" className="p-1" danger onClick={() => handleManage(true, "delete", record)}>
            {deleteIcon}
          </Button>
        </div>
      ),
    },
  ];

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
      />
    </div>
  );
};

export default TableMasterProductPage;
