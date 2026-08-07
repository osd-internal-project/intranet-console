import React from "react";
import {
  Button,
  Space,
  Table,
  TablePaginationConfig,
  TableProps,
  Tag,
} from "antd";
import { MaCarType } from "../../../../common/index";
import { numberWithCommas } from "@/app/utils/format";
import Link from "next/link";

export interface props {
  dataSource: any;
  loading: boolean;
  pagination: any;
  changePagination: (pagination: TablePaginationConfig) => void;
  handleOpenModal: (status: string, a: any) => void;
  handleCloseModalFiles: (status: string, a: any) => void;
  handleOpenFuelCardModal: (record: any) => void;
}

const ManagementCarAvailableTable: React.FC<props> = ({
  dataSource,
  loading,
  pagination,
  changePagination,
  handleOpenModal,
  handleCloseModalFiles,
  handleOpenFuelCardModal,
}): React.ReactElement => {
  const columns: TableProps<MaCarType>["columns"] = [
    {
      title: "ลำดับ",
      dataIndex: "carId",
      key: "carId",
      align: "center",
      render: (id: number, record: any, index: number) =>
        pagination.current && pagination.pageSize
          ? (pagination.current - 1) * pagination.pageSize + (index + 1)
          : "",
    },
    {
      title: "ทะเบียน",
      dataIndex: "licensePlate",
      key: "licensePlate",
      align: "center",
      render: (licensePlate: string) => licensePlate || "-",
    },
    {
      title: "ชื่อรถ",
      dataIndex: "carName",
      key: "carName",
      // align: "center",
      // render: (value, record, index) => (
      //   <Link href={`/page/macar/ma-car-management/car/${record.carId}`}>
      //     <Button type="link">{value}</Button>
      //   </Link>
      // ),
    },
    {
      title: "ระดับน้ำมัน",
      dataIndex: "carPetrol",
      key: "carPetrol",
      align: "center",
      render: (carPetrol: string) =>
        carPetrol === "high" ? (
          <Tag color="green">มาก</Tag>
        ) : carPetrol === "medium" ? (
          <Tag color="orange">ปานกลาง</Tag>
        ) : carPetrol === "low" ? (
          <Tag color="red">น้อย</Tag>
        ) : null,
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status: boolean) =>
        status ? (
          <Tag color="green">ใช้งานได้ปกติ</Tag>
        ) : (
          <Tag color="red">ไม่สามารถใช้งานได้</Tag>
        ),
    },
    {
      title: "เลขไมล์รถ",
      dataIndex: "carMile",
      key: "carMile",
      align: "center",
    },
    {
      title: "วงเงินรายเดือน",
      dataIndex: "fuelMonthlyLimit",
      key: "fuelMonthlyLimit",
      align: "center",
      render: (_, record) =>
        !record.fuelCardStatus ? (
          <Tag color="red">ไม่มี Fleet Card</Tag>
        ) : record.fuelCardStatus === "active" ? (
          <>
            {numberWithCommas(record.fuelMonthlyRemaining || 0)}/
            {numberWithCommas(record.fuelMonthlyLimit || 0)}
          </>
        ) : (
          <Tag color="red">ไม่มี Fleet Card</Tag>
        ),
    },
    {
      title: <div style={{ textAlign: "center" }}>รายละเอียด</div>,
      dataIndex: "detail",
      key: "detail",
    },
    {
      title: "ข้อมูลรถ",
      dataIndex: "carName",
      key: "carName",
      align: "center",
      render: (value, record, index) => (
        <Link href={`/page/macar/ma-car-management/car/${record.carId}`}>
          <Button type="link">ตรวจสอบ</Button>
        </Link>
      ),
    },
    {
      title: "จัดการ",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleOpenModal("edit", record)}>
            {`แก้ไข`}
          </Button>
          <Button
            type="link"
            onClick={() => handleOpenFuelCardModal(record)}
            // danger={!record?.fuelCardNumber ? true : false}
          >
            {`Fleet Card`}
          </Button>
          <Button
            type="link"
            onClick={() => handleOpenModal("delete", record)}
            danger
          >{`ลบ`}</Button>
        </Space>
      ),
    },
    {
      title: "ไฟล์แนบ",
      dataIndex: "carId",
      key: "carId",
      align: "center",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => handleCloseModalFiles("open", record)}
          disabled={record.maCarFiles.length > 0 ? false : true}
        >
          {`ไฟล์ทั้งหมด`}
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={pagination}
        onChange={changePagination}
        size="small"
        scroll={{ x: "max-content" }}
        rowKey={(e: any) => e.carId}
      />
    </div>
  );
};

export default ManagementCarAvailableTable;
