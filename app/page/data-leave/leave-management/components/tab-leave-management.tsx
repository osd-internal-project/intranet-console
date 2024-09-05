"use-client";
import React from "react";
import { Button, Table, Tabs } from "antd";
import { ITpyeUser, ITypeDataleaveMap } from "../../common";
import { deleteIcon } from "@/components/icon";

export interface props {
  getdataUserByTypeId: ITpyeUser[];
  onFinishDel: (event: number) => void;
  getLoading: boolean;
}

export const TabeLeavManagement: React.FC<props> = ({
  getdataUserByTypeId,
  onFinishDel,
  getLoading,
}): React.ReactElement => {
  const columns: any = [
    {
      key: "id",
      dataIndex: "id",
      title: "ID",
      width: "50px",
      render: (values: string, row: any, index: number) => index + 1,
    },
    {
      key: "id",
      title: "Fullname",
      width: "300px",
      dataIndex: "id",
      render: (event: number, row: ITpyeUser, index: number) => {
        return `${row.user.firstNameTh} ${row.user.lastNameTh}`;
      },
    },
    {
      key: "id",
      title: "ACTIVE",
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
        rowKey={(e: any) => e.id}
      />
    </div>
  );
};
