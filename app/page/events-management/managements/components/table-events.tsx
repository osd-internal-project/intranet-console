import type { organizeManagementTaskCreateInput } from "@/app/common/organize-management-task";
import { dateToStringThNoTime } from "@/app/utils/format";
import { Button, Card, Popover, Table, TablePaginationConfig, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import React from "react";

export interface props {
  data: { data: organizeManagementTaskCreateInput[]; count: number };
  pagination: TablePaginationConfig;
  onChangePagination: (pagination: TablePaginationConfig) => void;
  handleModalOpen: (status: boolean, type: "create" | "edit" | "delete" | "close", data: any) => void;
  handleDelete: (id: number) => void;
}

const TableEvents: React.FC<props> = ({ data, pagination, onChangePagination, handleModalOpen, handleDelete }): React.ReactElement => {
  const columns: ColumnsType<organizeManagementTaskCreateInput> = [
    {
      title: "ชื่อกิจกรรม",
      dataIndex: "name",
      key: "name",
      width: "70%",
    },
    {
      title: "สถานที่",
      dataIndex: "location",
      width: "10%",
      align: "center",
      key: "location",
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
      title: "สถานะ",
      dataIndex: "status",
      width: "10%",
      align: "center",
      key: "date",
      render: (_: string) => {
        let color = "";
        let text = "";
        if (_ === "inprocess") {
          color = "processing";
          text = "In Progress";
        } else if (_ === "done") {
          color = "success";
          text = "Done";
        } else {
          color = "default";
          text = _;
        }
        return <Tag color={color}>{text}</Tag>;
      },
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
    {
      title: "จัดการ",
      key: "id",
      dataIndex: "id",
      align: "center",
      render: (id) => {
        return (
          <Popover
            trigger="click"
            placement="bottomRight"
            content={
              <Button type="primary" onClick={() => handleDelete(id)} size="small">
                ยืนยัน
              </Button>
            }
          >
            <Button type="link" danger>
              ลบ
            </Button>
          </Popover>
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
