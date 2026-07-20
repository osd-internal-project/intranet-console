import { MaVehicleType } from "@/app/page/macar/common";
import { Button, Space, Table, TableProps, Tag } from "antd";
import dayjs from "dayjs";
import React from "react";

export interface props {
  dataSource: MaVehicleType[];
  handleOpen: (status: string, values: any) => void;
  loading: boolean;
}

const ManagementVehicleTypeTable: React.FC<props> = ({
  dataSource,
  handleOpen,
  loading,
}) => {
  const columns: TableProps<MaVehicleType>["columns"] = [
    {
      title: "ลำดับ",
      dataIndex: "id",
      key: "id",
      align: "center",
      fixed: "left",
      render: (_value: number, _record: MaVehicleType, index: number) => index + 1,
    },
    {
      title: "ประเภทรถ",
      dataIndex: "typeName",
      key: "typeName",
      fixed: "left",
    },
    {
      title: "กลุ่ม",
      key: "group",
      render: (_value: unknown, record: MaVehicleType) =>
        record.maVehicleTypeGroup?.groupName || "-",
    },
    {
      title: "รายละเอียด",
      dataIndex: "detail",
      key: "detail",
      render: (detail: string | undefined) => detail || "-",
    },
    {
      title: "ชื่อ-นามสกุล",
      dataIndex: "createdByName",
      key: "createdByName",
    },
    {
      title: "เวลาการสร้าง",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: Date) =>
        `${dayjs(createdAt).format("DD/MM/YYYY HH:mm")} น.`,
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status: boolean) =>
        status ? (
          <Tag color="green">{`เปิดการมอง`}</Tag>
        ) : (
          <Tag color="red">{`ปิดการมอง`}</Tag>
        ),
    },
    {
      title: "การจัดการ",
      dataIndex: "manage",
      key: "manage",
      align: "center",
      render: (_value: string, record: MaVehicleType) => (
        <Space>
          <Button type="default" onClick={() => handleOpen("edit", record)}>
            {`แก้ไข`}
          </Button>
          <Button
            type="primary"
            onClick={() => handleOpen("delete", record)}
            danger
          >
            {`ลบ`}
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <div>
      <Table
        size="small"
        loading={loading}
        rowKey={"id"}
        dataSource={dataSource}
        columns={columns}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default ManagementVehicleTypeTable;
