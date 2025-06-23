"use-client";
import React from "react";
import { Button, Empty, Skeleton, Table } from "antd";
import { ITpyeUser } from "../../common";
import { deleteIcon } from "@/components/icon";

export interface props {
  getdataUserByTypeId: ITpyeUser[];
  onFinishDel: (event: number) => void;
  getLoading: boolean;
}

export const TableLeavManagement: React.FC<props> = ({ getdataUserByTypeId, onFinishDel, getLoading }): React.ReactElement => {
  const columns: any = [
    {
      key: "id",
      dataIndex: "id",
      title: "ลำดับ",
      align: "center",
      width: "100px",
      render: (values: string, row: any, index: number) => index + 1,
    },
    {
      key: "id",
      title: "ชื่อ - นามสกุล",
      dataIndex: "id",
      render: (event: number, row: ITpyeUser, index: number) => {
        return `${row.user.firstNameTh} ${row.user.lastNameTh}`;
      },
    },
    {
      key: "id",
      title: "...",
      align: "center",
      width: "100px",
      render: (row: any, event: number, index: number) => {
        return (
          <>
            <div>
              <Button
                type="link"
                danger
                onClick={() => {
                  onFinishDel(row.id);
                }}>
                {deleteIcon}
              </Button>
            </div>
          </>
        );
      },
    },
  ];
  return (
    <div>
      <Table
        size="small"
        loading={getLoading}
        dataSource={getdataUserByTypeId}
        columns={columns}
        scroll={{ x: "max-content" }}
        rowKey={(e: any) => e.id}
        locale={{
          emptyText: getLoading ? <Skeleton active={true} /> : <Empty />,
        }}
      />
    </div>
  );
};
