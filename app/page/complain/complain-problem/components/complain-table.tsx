import type { ITComplainProblem } from "@/app/common/complain-problem";
import { Button, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import React from "react";

export const problemTypeMap: Record<string, { label: string; color: string }> = {
  NO_ISSUE: {
    label: "ไม่พบปัญหาใดๆในการทำงาน",
    color: "default",
  },
  COMPUTER_EQUIPMENT: {
    label: "ปัญหาจากอุปกรณ์คอมพิวเตอร์",
    color: "blue",
  },
  OFFICE_EQUIPMENT: {
    label: "ปัญหาจากเครื่องใช้สำนักงาน",
    color: "cyan",
  },
  INTERNET: {
    label: "ปัญหาจากอินเตอร์เน็ต",
    color: "purple",
  },
  ENVIRONMENT: {
    label: "ปัญหาจากสิ่งแวดล้อม",
    color: "orange",
  },
  OTHER: {
    label: "Other",
    color: "volcano",
  },
};

export interface Props {
  dataSource: ITComplainProblem[];
}

const ComplainTable: React.FC<Props> = ({ dataSource }): React.ReactElement => {
  const complainColumns: ColumnsType<ITComplainProblem> = [
    {
      title: "ลำดับ",
      dataIndex: "id",
      key: "id",
      width: "100px",
      align: "center",
    },
    {
      title: "ชื่อผู้ร้องเรียน",
      dataIndex: "users",
      key: "users",
      align: "center",
      width: 100,
      render: (users) => `${users.firstNameTh} ${users.lastNameTh}`,
    },
    {
      title: "ประเภทปัญหา",
      dataIndex: "name",
      key: "name",
      width: "200px",
      render: (value: string) => {
        const type = problemTypeMap[value];

        if (!type) {
          return <Tag>{value}</Tag>;
        }

        return <Tag color={type.color}>{type.label}</Tag>;
      },
    },
    {
      title: "รายละเอียด",
      dataIndex: "detail",
      key: "detail",
      width: "300px",
      ellipsis: true, // ตัด ... อัตโนมัติ
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 100,
      render: (status: boolean) => (status ? <Tag color="green">รับทราบปัญหา</Tag> : <Tag color="orange">ส่งปัญหา</Tag>),
    },
    {
      title: "วันที่แจ้ง",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 100,
      render: (value: string) => new Date(value).toLocaleDateString("th-TH"),
    },
  ];
  return (
    <div>
      <Table size="small" dataSource={dataSource} scroll={{ x: "max-content" }} columns={complainColumns} rowKey={"id"} />
    </div>
  );
};

export default ComplainTable;
