import React from "react";
import { ITUnit, ITUnitCreateInput } from "../common";
import { Button, Table, TablePaginationConfig, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { dateToStringTh } from "@/app/utils/format";
import { deleteIcon, editIcon } from "@/components/icon";

export interface props {
  dataSource: { data: ITUnit[]; count: number };
  changePagination: (values: TablePaginationConfig) => void;
  pagination: TablePaginationConfig;
  handleManage: (status: boolean, type: string, value?: ITUnitCreateInput) => void;
}

const TableUnitPage: React.FC<props> = ({ dataSource, changePagination, pagination, handleManage }): React.ReactElement => {
  const columns: ColumnsType<ITUnit> = [
    {
      title: "NO.",
      dataIndex: "id",
      key: "id",
      render: (id, record, index) => (pagination.current && pagination.pageSize ? (pagination.current - 1) * pagination.pageSize + (index + 1) : ""),
    },
    {
      title: "Name Unit",
      dataIndex: "unitName",
      key: "unitName",
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (value, record, index) => (value ? <Tag color="green">Active</Tag> : <Tag color="volcano">Inactive</Tag>),
    },
    {
      title: "CREATED",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value, record, index) => (value ? dateToStringTh(value) : ""),
    },
    {
      title: "ACTIVE",
      key: "userId",
      dataIndex: "userId",
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

export default TableUnitPage;
