import type { ITMasterTypeEvents } from "@/app/common/master-type-events";
import { Button, Popover, Table, type TablePaginationConfig } from "antd";
import type { ColumnsType } from "antd/es/table";
import React from "react";

export interface props {
  dataTable: { data: ITMasterTypeEvents[]; count: number };
  pagination: TablePaginationConfig;
  handleTableChange: (values: TablePaginationConfig) => void;
  handleModalOpen: (status: boolean, type: "create" | "edit" | "delete" | "close", data: ITMasterTypeEvents | null) => void;
  handleDelete: (id: number) => void;
}

const tableMasterTypeEvents: React.FC<props> = ({ dataTable, pagination, handleTableChange, handleModalOpen, handleDelete }): React.ReactElement => {
  const [openRowId, setOpenRowId] = React.useState<any>(null);
  const columns: ColumnsType<ITMasterTypeEvents> = [
    {
      dataIndex: "name",
      title: "ชื่อประเภทการจัด Event",
      key: "name",
    },
    {
      dataIndex: "remark",
      title: "รายละเอียด",
      key: "remark",
    },
    {
      dataIndex: "id",
      title: "...",
      key: "id",
      render: (_, records) => {
        return (
          <>
            <Button type="link" onClick={() => handleModalOpen(true, "edit", records)}>{`แก้ไข`}</Button>
            <Popover
              trigger="click"
              placement="bottomRight"
              open={openRowId === Number(_)}
              onOpenChange={(visible) => {
                setOpenRowId(visible ? Number(_) : null);
              }}
              content={
                <div className="space-x-2">
                  <Button size="small" danger onClick={() => setOpenRowId(null)}>
                    cancel
                  </Button>
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => {
                      handleDelete(Number(_));
                      setOpenRowId(null);
                    }}
                  >
                    ok
                  </Button>
                </div>
              }
            >
              <Button type="link" danger>
                ลบ
              </Button>
            </Popover>
          </>
        );
      },
    },
  ];
  return (
    <div>
      <Table
        dataSource={dataTable.data}
        columns={columns}
        pagination={{ ...pagination, total: dataTable.count }}
        onChange={handleTableChange}
        rowKey={"id"}
      />
    </div>
  );
};

export default tableMasterTypeEvents;
