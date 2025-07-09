import { MaCarBookType } from "@/app/page/macar/common";
import { dateFormatTime } from "@/app/utils";
import { CheckStatusMaCarBookType } from "@/app/utils/validatefield";
import { Button, Space, Table, TablePaginationConfig, TableProps } from "antd";
import React from "react";

export interface props {
  dataSource: any;
  loading: boolean;
  total: number;
  changePagination: (values: TablePaginationConfig) => void;
  openModalFecthStatus: (status: string, record: any) => void;
  pagination: any;
}

const ManagementCarBookingTable: React.FC<props> = ({
  dataSource,
  loading,
  total,
  changePagination,
  openModalFecthStatus,
  pagination,
}): React.ReactElement => {
  const columns: TableProps<MaCarBookType>["columns"] = [
    {
      title: "ลำดับ",
      align: "center",
      render: (event: number, row: any, index: number) => total - (index + (pagination.current - 1) * pagination.pageSize),
    },
    {
      title: "ชื่อรถ",
      dataIndex: "carName",
      key: "carName",
      align: "center",
    },
    {
      key: "carBookStartDate",
      dataIndex: "carBookStartDate",
      title: "วันที่เริ่มจอง",
      align: "center",
      render: (value) => dateFormatTime(value),
    },
    {
      key: "carBookEndDate",
      dataIndex: "carBookEndDate",
      title: "วันที่สิ้นสุดการจอง",
      align: "center",
      render: (value) => dateFormatTime(value),
    },
    {
      title: "ชื่อผู้จอง",
      dataIndex: "createdByName",
      key: "createdByName",
      align: "center",
    },
    {
      title: "สถานะ",
      key: "carBookApprovedStatus",
      dataIndex: "carBookApprovedStatus",
      align: "center",
      render: (status: string) => CheckStatusMaCarBookType(status),
    },
    {
      title: "รายละเอียด",
      key: "id",
      dataIndex: "id",
      align: "center",
      render: (_: any, record: MaCarBookType) => {
        return (
          <Button type="primary" onClick={() => openModalFecthStatus(``, record)} size="small">
            {`รายละเอียด`}
          </Button>
        );
      },
    },
    {
      title: "จัดการ",
      key: "note",
      dataIndex: "note",
      align: "center",
      render: (_: any, record: MaCarBookType) => {
        const isActionDisabled = record.carBookApprovedStatus === "Cancel" || record.carBookApprovedStatus === "Approve";
        let status = false;
        if (record.carBookApprovedStatus === "Cancel" || record.carBookApprovedStatus === "Approve") {
          status = true;
        } else {
          status = false;
        }
        return (
          <Space>
            <Button
              type="link"
              onClick={() => openModalFecthStatus(`approved`, record)}
              style={{ color: isActionDisabled ? "" : "green" }}
              disabled={status}>
              {`อนุมัติ`}
            </Button>
            <Button
              type="link"
              onClick={() => openModalFecthStatus(`cancel`, record)}
              style={{ color: isActionDisabled ? "" : "orange" }}
              disabled={status}>
              {`ยกเลิก`}
            </Button>
            {record.carBookApprovedStatus === "Return" ? (
              <Button type="link" onClick={() => openModalFecthStatus(`return`, record)}>
                {`รับคืนรถ`}
              </Button>
            ) : (
              <span style={{ color: "grey" }}>{record.carBookApprovedStatus === "Completed" ? `รับคืนแล้ว` : `รอแจ้งคืนรถ`}</span>
            )}
            <Button type="link" onClick={() => openModalFecthStatus(`delete`, record)} danger>
              {`ลบ`}
            </Button>
          </Space>
        );
      },
    },
  ];
  return (
    <div>
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={{ total: total }}
        onChange={changePagination}
        size="small"
        style={{ marginTop: "10px" }}
        rowKey={"id"}
      />
    </div>
  );
};

export default ManagementCarBookingTable;
