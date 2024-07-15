import React, { useState, useEffect } from "react";
import { Table, message } from "antd";
import type { TableProps, FormProps } from "antd";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { MaCarBookServices } from "../services/ma-car-book.service";
import { useForm } from "antd/es/form/Form";

interface MaCarType {
  id: number;
  carId: number;
  typeName: string;
  detail: string;
  status: boolean;
  createdAt: Date;
  createdById?: string;
  createdByName?: string;
  carName?: string;
}

const MaCarHistory = () => {
  const intraAuth = useAxiosIntranet();
  const [form] = useForm();
  const maCarBook = MaCarBookServices(intraAuth);
  const maCarType = MaCarBookServices(intraAuth);
  const [maData, setMaData] = useState<MaCarType[]>([]);
  const [maCarBookData, setMaCarBookData] = useState<any[]>([]); // ปรับชนิดข้อมูลตามที่คุณต้องการ
  const columns: TableProps<MaCarType>["columns"] = [
    {
      title: "ลำดับ",
      dataIndex: "id",
      key: "id",
      render: (_, __, index) => <>{index + 1}</>,
    },
    {
      title: "ชื่อรถ",
      dataIndex: "carName",
      key: "carName",
    },
    {
      title: "ไอดี",
      dataIndex: "createdById",
      key: "createdById",
    },

    {
      title: "ชื่อ-นามสกุล",
      dataIndex: "createdByName",
      key: "createdByName",
    },
    {
      title: "วันที่ทำการจอง",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "รายละเอียด",
      dataIndex: "detail",
      key: "detail",
    },
  ];

  const fetchData = async () => {
    try {
      // เรียกใช้ทั้งสองฟังก์ชันควบคู่กัน
      const [maCarTypeResponse, maCarBookResponse] = await Promise.all([
        maCarType.getMaCarTypeQuery(),
        maCarBook.getMaCarBookQuery(),
      ]);

      // จัดการข้อมูล maCarType
      const MaCarTypeData: MaCarType[] = maCarTypeResponse.map(
        (item: any, index: number) => ({
          ...item,
          key: index.toString(),
          carName: maCarBookResponse[index]?.carName || "N/A", // กำหนดค่า carName จาก maCarBookResponse
        })
      );

      // จัดการข้อมูล maCarBook (เพิ่มการจัดการข้อมูลตามโครงสร้างที่คุณต้องการ)
      const MaCarBookData = maCarBookResponse.map(
        (item: any, index: number) => ({
          ...item,
          key: index.toString(),
        })
      );
      // ตั้งค่าข้อมูลในสถานะ (คุณอาจต้องสร้างสถานะใหม่สำหรับ maCarBookData)
      setMaData(MaCarTypeData);
      setMaCarBookData(maCarBookResponse); // ไม่จำเป็นต้องแปลงข้อมูล maCarBookResponse เป็น MaCarBookData อีก
    } catch (error) {
      message.error("Failed to fetch car data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Table columns={columns} dataSource={maData} />
    </>
  );
};

export default MaCarHistory;
