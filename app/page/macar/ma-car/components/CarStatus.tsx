import React, { useState, useEffect } from "react";
import { Table, Tag } from "antd";
import type { TableProps } from "antd";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { MaCarServices } from "../services/ma-car.service";

interface CarType {
  carId: string;
  carName: string;
  carUser: string;
  status: string;
  createdByName: string;
  carMileage: string;
  carPetrol: String; // ระดับน้ำมัน (Low, Medium, High)
  carDescription: string;
  detail: string;
  note: string;
}

const columns: TableProps<CarType>["columns"] = [
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
    width: "200px",
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

const CarStatus = () => {
  const stockAuth = useAxiosIntranet();
  const maCarServices = MaCarServices(stockAuth);
  const [maData, setmaData] = useState<CarType[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const maresponse = await maCarServices.getMaCarQuery();
    const MaCar: CarType[] = maresponse.map((item: any, index: number) => ({
      ...item,
      key: index.toString(),
    }));
    setmaData(MaCar);
  };
  return <Table columns={columns} dataSource={maData} />;
};
export default CarStatus;
