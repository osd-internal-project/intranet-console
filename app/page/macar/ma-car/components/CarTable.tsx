import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Modal,
  Divider,
  TablePaginationConfig,
} from "antd";
import type { TableProps } from "antd";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { MaCarServices } from "../services/ma-car.service";
import dayjs from "dayjs";

interface CarType {
  id: string;
  carId: string;
  carName: string;
  detail: string;
  carPetrol: string;
  status: boolean;
  createdById: string;
  createdByName: string;
  updatedById: string;
  updatedByName: string;
  startDate: string;
  endDate: string;
  carType: string;
  carBookApprovedStatus: string;
  carBookApprovedByName: string;
  carBookApprovedById: string;
  carBookStartDate: string;
  carBookEndDate: string;
}

export interface props {
  maFetchData: any[];
  pagination: TablePaginationConfig;
  changePagination: (pagination: TablePaginationConfig) => void;
}

const maTable: React.FC<props> = ({
  maFetchData,
  pagination,
  changePagination,
}: any): React.ReactElement => {
  const intraAuth = useAxiosIntranet();
  const bookingRoomServices = MaCarServices(intraAuth);
  const [maData, setMaData] = useState<CarType[]>([]);
  const [modalBookingDetails, setModalDetails] = useState(false);
  const [currentBookingDetails, setCurrentMaDetails] = useState<CarType | null>(
    null
  );

  const columns: TableProps<CarType>["columns"] = [
    {
      key: "no",
      title: "ลำดับ",
      dataIndex: "no",
      width: "50px",
      align: "center",
      render: (id: number, record: any, index: number) =>
        pagination.current && pagination.pageSize
          ? (pagination.current - 1) * pagination.pageSize + (index + 1)
          : "",
    },
    {
      key: "carName",
      title: "ชื่อรถ",
      dataIndex: "carName",
      width: "150px",
      align: "center",
    },

    {
      key: "createdAt",
      title: "วันที่จอง",
      width: "200px",
      align: "center",
      render: (_, record) => (
        <span>
          {dayjs(record.startDate).format("YYYY-MM-DD")} -{" "}
          {dayjs(record.endDate).format("YYYY-MM-DD")}
        </span>
      ),
    },
    {
      title: "เวลาจอง",
      key: "bookingTime",
      width: "100px",
      align: "center",
      render: (_, record) => (
        <span>
          {dayjs(record.carBookStartDate).format("HH:mm")} -{" "}
          {dayjs(record.carBookEndDate).format("HH:mm")}
        </span>
      ),
    },

    {
      key: "createdByName",
      title: "ชื่อผู้จอง",
      dataIndex: "createdByName",
      width: "150px",
      align: "center",
    },
    {
      key: "carBookApprovedStatus",
      title: "สถานะ",
      dataIndex: "carBookApprovedStatus",
      width: "100px",
      align: "center",
      render: (status: string) => {
        let color = "";
        let text = "";

        switch (status) {
          case "process":
            color = "blue";
            text = "กำลังรออนุมัติ";
            break;
          case "Approve":
            color = "green";
            text = "อนุมัติสำเร็จ";
            break;
          case "Cancel":
            color = "red";
            text = "ยกเลิกการจอง";
            break;
          default:
            color = "default";
            text = "Unknown Status";
            break;
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      key: "carBookApprovedByName",
      title: "ผู้อนุมัติ",
      dataIndex: "carBookApprovedByName",
      width: "150px",
      align: "center",
    },

    {
      key: "details",
      title: "รายละเอียด",
      dataIndex: "details",
      width: "100px",
      align: "center",
      render: (_, record) => (
        <Button type="link" onClick={() => showModaMaDetails(record)}>
          รายละเอียด
        </Button>
      ),
    },
  ];
  {
    console.log(maFetchData);
  }
  const renderStatusTag = (status: any) => {
    switch (status) {
      case "Approve":
        return <Tag color={"green"}>อนุมัติสำเร็จ</Tag>;
      case "process":
        return <Tag color={"blue"}>กำลังรออนุมัติ</Tag>;
      case "Cancel":
        return <Tag color="red">ยกเลิกการจอง</Tag>;
      default:
        return "Unknown Status";
    }
  };

  const showModaMaDetails = (record: CarType) => {
    setCurrentMaDetails(record);
    setModalDetails(true);
  };

  const handleBookingDetailsCancel = () => {
    setModalDetails(false);
    setCurrentMaDetails(null);
  };

  useEffect(() => {}, []);

  return (
    <>
      <Modal
        title="รายละเอียดการจอง"
        visible={modalBookingDetails}
        onCancel={handleBookingDetailsCancel}
        footer={null}
        centered
        width={400}
        style={{ top: 20 }}
      >
        {currentBookingDetails && (
          <>
            <Divider />
            <p>
              <strong>ชื่อรถ : </strong>{" "}
              <span className="modal-content">
                {currentBookingDetails.carName}
              </span>
            </p>

            <p>
              <strong>วันที่จอง : </strong>{" "}
              <span className="modal-content">
                {dayjs(currentBookingDetails.carBookStartDate).format(
                  "YYYY-MM-DD"
                )}{" "}
                -{" "}
                {dayjs(currentBookingDetails.carBookEndDate).format(
                  "YYYY-MM-DD"
                )}
              </span>
            </p>
            <p>
              <strong>เวลาจอง : </strong>{" "}
              <span className="modal-content">
                {dayjs(currentBookingDetails.carBookStartDate).format("HH:mm")}{" "}
                - {dayjs(currentBookingDetails.carBookEndDate).format("HH:mm")}
              </span>
            </p>
            <p>
              <strong>สถานะ : </strong>
              <span className="modal-content">
                {currentBookingDetails.status
                  ? renderStatusTag(currentBookingDetails.carBookApprovedStatus)
                  : "ไม่มีสถานะ"}
              </span>
            </p>
            <p>
              <strong>ผู้อนุมัติ : </strong>{" "}
              <span className="modal-content">
                {currentBookingDetails.carBookApprovedByName}
              </span>
            </p>
            <Divider />
            <p>
              <strong>ชื่อผู้จอง : </strong>{" "}
              <span className="modal-content">
                {currentBookingDetails.createdByName}
              </span>
            </p>
          </>
        )}
      </Modal>
      <Table
        columns={columns}
        dataSource={maFetchData}
        rowKey="id"
        onChange={changePagination}
        pagination={pagination}
      />
    </>
  );
};

export default maTable;
