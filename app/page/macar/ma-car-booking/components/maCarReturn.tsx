import React, { useState, useEffect } from "react";
import {
  Select,
  Table,
  Space,
  Button,
  Row,
  Modal,
  Form,
  Input,
  Divider,
  Tag,
  message,
  Popconfirm,
} from "antd";
import type { TableProps, FormProps } from "antd";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { MaCarBookServices } from "../services/ma-car-book.service";
import { useForm } from "antd/es/form/Form";

interface MaCarType {
  id: string; // รหัส
  carId: string; // รหัสรถ
  carName: string; // ชื่อรถ
  carPetrol: string; // ระดับน้ำมัน
  detail: string; // รายละเอียด
  status: string; // สถานะ
  createdAt: Date; // วันที่สร้าง
  createdById: string; // รหัสผู้สร้าง
  createdByName: string; // ชื่อผู้สร้าง
  updatedAt: Date; // วันที่แก้ไขล่าสุด
  updatedById: string; // รหัสผู้แก้ไข
  updatedByName: string; // ชื่อผู้แก้ไข
  carBookProvince: string; // จังหวัดที่จองรถ
  carBookPlace: string; // สถานที่จองรถ
  carBookUsers: number; // จำนวนผู้ใช้ที่จองรถ
  carBookStartDate: Date; // วันที่เริ่มการจองรถ
  carBookEndDate: Date; // วันที่สิ้นสุดการจองรถ
  // carBookStartDate: string; // วันที่เริ่มการจองรถ   71,91
  // carBookEndDate: string; // วันที่สิ้นสุดการจองรถ
  carBookApprovedDate?: Date; // วันที่อนุมัติการจองรถ (อาจจะไม่มีในกรณีที่ยังไม่ได้อนุมัติ)
  carBookApprovedById?: string; // รหัสผู้อนุมัติการจองรถ (อาจจะไม่มีในกรณีที่ยังไม่ได้อนุมัติ)
  carBookApprovedByName?: string; // ชื่อผู้อนุมัติการจองรถ (อาจจะไม่มีในกรณีที่ยังไม่ได้อนุมัติ)
}
const MaCarReturn = () => {
  const intraAuth = useAxiosIntranet();
  const [form] = useForm();
  const maCarBookServices = MaCarBookServices(intraAuth);
  const [maData, setMaData] = useState<MaCarType[]>([]);
  const columns: TableProps<MaCarType>["columns"] = [
    {
      title: "ลำดับ",
      dataIndex: "id",
      key: "id",
      render: (_, __, index) => <>{index + 1}</>,
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
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
      title: "วันที่ใช้งาน",
      dataIndex: "carBookStartDate",
      key: "carBookStartDate",
    },
    {
      title: "ผู้อนุมัติ",
      dataIndex: "carBookApprovedByName",
      key: "carBookApprovedByName",
    },
    {
      title: "รายละเอียด",
      dataIndex: "detail",
      key: "detail",
    },
  ];

  const fetchData = async () => {
    try {
      const maresponse = await maCarBookServices.getMaCarBookQuery();
      const MaCar: MaCarType[] = maresponse.map((item: any, index: number) => ({
        ...item,
        key: index.toString(),
      }));
      setMaData(MaCar);
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

export default MaCarReturn;
