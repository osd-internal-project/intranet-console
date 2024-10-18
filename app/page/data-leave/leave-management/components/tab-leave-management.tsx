"use-client";
import React from "react";
import { Button, Table } from "antd";
import { ITpyeUser } from "../../common";
import { deleteIcon } from "@/components/icon";
import "../../common/style.css";

export interface props {
  getdataUserByTypeId: ITpyeUser[];
  onFinishDel: (event: number) => void;
}

export const TabeLeavManagement: React.FC<props> = ({
  getdataUserByTypeId,
  onFinishDel,
}): React.ReactElement => {
  const columns: any = [
    {
      key: "id",
      dataIndex: "id",
      title: "No",
      align: "center",
      render: (values: string, row: any, index: number) => index + 1,
    },
    {
      key: "id",
      title: "Full Name",
      dataIndex: "id",
      render: (event: number, row: ITpyeUser, index: number) => {
        return `${row.user.firstNameTh} ${row.user.lastNameTh}`;
      },
    },
    {
      key: "id",
      title: "Active",
      align: "center",
      render: (row: any, event: number, index: number) => {
        return (
          <>
            <div>
              <Button
                type="link"
                danger
                onClick={() => {
                  onFinishDel(row.id);
                }}
              >
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
        dataSource={getdataUserByTypeId}
        columns={columns}
        scroll={{ x: "max-content" }}
        rowKey={(e: any) => e.id}
      />
    </div>
  );
};
