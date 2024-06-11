"use-client";
import React from "react";
import { Button, Table, Tabs } from "antd";
import { ITpyeUser, ITypetypeleave } from "../../common";
import { deleteIcon } from "@/components/icon";

export interface props {
  getdataUserByTypeId: ITpyeUser[];
}

export const TabeLeavManagement: React.FC<props> = ({ getdataUserByTypeId }): React.ReactElement => {
  const columns: any = [
    { key: "id", title: "ID", dataIndex: "id" },
    {
      key: "id",
      title: "ชื่อ - สกุล",
      dataIndex: "id",
      render: (event: number, row: ITpyeUser, index: number) => {
        return `${row.firstNameTh} ${row.lastNameTh}`;
      },
    },
    {
      key: "id",
      title: "ACTIVE",
      dataIndex: "id",
      align: "center",
      width: "70px",
      render: (event: number, row: ITpyeUser, index: number) => {
        return (
          <>
            <div>
              <Button type="link" danger>
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
      <Table size="small" dataSource={getdataUserByTypeId} columns={columns} rowKey={(e: any) => e.id} />
    </div>
  );
};
