import React, { useState, useEffect } from "react";
import { Table, Tag } from "antd";
import type { TableProps } from "antd";
import { MaCarType } from "../../common/index";

export interface props {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  maCarData: MaCarType[];
}

const CarStatus: React.FC<props> = ({
  maCarData,
  setLoading,
}: any): React.ReactElement => {
  const columns: TableProps<MaCarType>["columns"] = [
    {
      title: "ลำดับ",
      dataIndex: "carId",
      key: "carId",
      width: "80px",
      align: "center",
      render: (_, record, index) => <>{index + 1}</>,
    },
    {
      title: "ชื่อรถ",
      dataIndex: "carName",
      key: "carName",
      width: "250px",
      align: "center",
    },

    {
      title: "ระดับนํ้ามัน",
      dataIndex: "carPetrol",
      key: "carPetrol",
      width: "120px",
      align: "center",
      render: (carPetrol: string) => {
        if (carPetrol === "high") {
          return <Tag color="green">มาก</Tag>;
        } else if (carPetrol === "medium") {
          return <Tag color="orange">ปานกลาง</Tag>;
        } else if (carPetrol === "low") {
          return <Tag color="red">น้อย</Tag>;
        }
      },
    },
    {
      title: "เลขไมล์รถล่าสุด",
      dataIndex: "carMile",
      key: "carMilea",
      width: "140px",
      align: "center",
    },
    {
      title: "สถานะการใช้งานรถ",
      dataIndex: "status",
      key: "status",
      width: "180px",
      align: "center",
      render: (status: boolean) =>
        status ? (
          <Tag color="green">ใช้งานได้ปกติ</Tag>
        ) : (
          <Tag color="red">ไม่สามารถใช้งานได้</Tag>
        ),
    },
    {
      title: <div style={{ textAlign: "center" }}>รายละเอียด</div>,
      dataIndex: "detail",
      key: "detail",
    },
  ];

  useEffect(() => {
    setLoading();
  }, []);

  return <Table columns={columns} dataSource={maCarData} />;
};
export default CarStatus;
