import { Table, Tag } from "antd";
import type { TableProps } from "antd";
import { MaCarType } from "../../common/index";
import { showStatusCarPetrol } from "@/app/utils/validatefield";
export interface props {
  maCarData: MaCarType[];
}

const CarStatus: React.FC<props> = ({
  maCarData,
}: any): React.ReactElement => {

  const columns: TableProps<MaCarType>["columns"] = [
    {
      title: "ลำดับ",
      dataIndex: "carId",
      key: "carId",
      align: "center",
      render: (_, record, index) => <>{index + 1}</>,
    },
    {
      title: "ชื่อรถ",
      dataIndex: "carName",
      key: "carName",
      align: "center",
    },
    {
      title: "ระดับนํ้ามัน",
      dataIndex: "carPetrol",
      key: "carPetrol",
      align: "center",
      render: (carPetrol: string) => showStatusCarPetrol(carPetrol)
    },
    {
      title: "เลขไมล์รถล่าสุด",
      dataIndex: "carMile",
      key: "carMilea",
      align: "center",
    },
    {
      title: "สถานะการใช้งานรถ",
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
      title: <div style={{ textAlign: "center" }}>รายละเอียด</div>,
      dataIndex: "detail",
      key: "detail",
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={maCarData}
      rowKey={(e: any) => e.id}
      scroll={{ x: "max-content" }}
    />
  );
};
export default CarStatus;
