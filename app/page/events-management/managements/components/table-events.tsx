import type { organizeManagementTaskCreateInput } from "@/app/common/organize-management-task";
import { dateToStringThNoTime } from "@/app/utils/format";
import { Button, Card, Table, TablePaginationConfig } from "antd";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import React from "react";

export interface props {
  data: { data: organizeManagementTaskCreateInput[]; count: number };
  pagination: TablePaginationConfig;
  onChangePagination: (pagination: TablePaginationConfig) => void;
  handleModalOpen: (status: boolean, type: "create" | "edit" | "delete" | "close", data: any) => void;
}

const TableEvents: React.FC<props> = ({ data, pagination, onChangePagination, handleModalOpen }): React.ReactElement => {
  const columns: ColumnsType<organizeManagementTaskCreateInput> = [
    {
      title: "ชื่อกิจกรรม",
      dataIndex: "name",
      key: "name",
      width: "80%",
    },
    {
      title: "วันที่จัดกิจกรรม",
      dataIndex: "date",
      width: "10%",
      align: "center",
      key: "date",
      render: (_: any) => dateToStringThNoTime(_),
    },
    {
      title: "คนสร้างกิจกรรม",
      dataIndex: "createdBy",
      width: "10%",
      align: "center",
      key: "createdBy",
    },
    {
      title: "...",
      key: "id",
      dataIndex: "id",
      align: "center",
      render: (id) => {
        return (
          <Link href={`/page/events-management/${id}`}>
            <Button type="link">รายละเอียด</Button>
          </Link>
        );
      },
    },
  ];

  return (
    <div>
      <Card>
        <div className="flex justify-end mb-2">
          <Button type="primary" onClick={() => handleModalOpen(true, "create", null)}>
            สร้างกิจกรรม
          </Button>
        </div>
        <Table
          rowKey={"id"}
          scroll={{ x: "max-content" }}
          size="small"
          columns={columns}
          dataSource={data.data}
          pagination={{
            total: data.count,
          }}
          onChange={onChangePagination}
        />
      </Card>
    </div>
  );
};

export default TableEvents;
