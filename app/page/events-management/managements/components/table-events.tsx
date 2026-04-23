import type { organizeManagementCreateInput } from "@/app/common/organize-management";
import { Button, Card, Table, TablePaginationConfig } from "antd";
import type { ColumnsType } from "antd/es/table";
import React from "react";

export interface props {
  data: { data: organizeManagementCreateInput[]; count: number };
  pagination: TablePaginationConfig;
  onChangePagination: (pagination: TablePaginationConfig) => void;
  handleModalOpen: (status: boolean, type: "create" | "edit", data: any) => void;
}

const TableEvents: React.FC<props> = ({ data, pagination, onChangePagination, handleModalOpen }): React.ReactElement => {
  const columns: ColumnsType<organizeManagementCreateInput> = [
    {
      title: "ชื่อกิจกรรม",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "วันที่จัดกิจกรรม",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "รายละเอียดกิจกรรม",
      key: "id",
      dataIndex: "id",
      render: (id) => {
        return <Button type="link" htmlType="button">{`ดูรายละเอียด`}</Button>;
      },
    },
    {
      title: "...",
      key: "id",
      dataIndex: "id",
      render: (id) => {
        return <Button type="link" htmlType="button" onClick={() => handleModalOpen(true, "edit", id)}>{`จัดการ`}</Button>;
      },
    },
  ];

  return (
    <div>
      <Card>
        <div className="flex justify-end mb-2">
          <Button type="primary" htmlType="button" onClick={() => handleModalOpen(true, "create", null)}>
            {`สร้างกิจกรรม`}
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
