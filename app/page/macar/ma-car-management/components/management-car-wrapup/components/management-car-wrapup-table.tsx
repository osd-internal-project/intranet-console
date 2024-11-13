import { Space, Table, TableProps, Tag, Tooltip } from "antd";
import React from "react";
import { MaCarwarpup } from "../../wrapup-car";
import { EyeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { dateFormatTime, numberFormat } from "@/app/utils";
import { numberWithCommas } from "@/app/utils/format";

export interface props {
  handleOpen: (status: string, values: any) => void;
  dataSource: any;
  loading: boolean;
}

const ManagementCarWrapupTable: React.FC<props> = ({ handleOpen, dataSource, loading }): React.ReactElement => {
  const columns: TableProps<MaCarwarpup>["columns"] = [
    {
      title: "ลำดับ",
      dataIndex: "id",
      key: "id",
      align: "center",
      fixed: "left",
    },
    {
      title: "ชื่อรถ",
      dataIndex: "carName",
      key: "carName",
      fixed: "left",
    },
    {
      title: "ประเภทการตรวจสภาพ",
      dataIndex: "typeName",
      key: "typeName",
    },
    {
      title: "รายละเอียดการตรวจ",
      dataIndex: "detail",
      key: "detail",
    },
    {
      title: "สถานที่เช็คสภาพ",
      dataIndex: "vender",
      key: "vender",
    },
    {
      title: "เลขไมล์ตรวจสภาพ",
      dataIndex: "wrapupMiles",
      key: "wrapupMiles",
      align: "center",
      render: (values: number) => numberFormat(values),
    },
    {
      title: "ราคา",
      dataIndex: "cost",
      key: "cost",
      align: "center",
      render: (values: number) => numberWithCommas(values),
    },
    {
      title: "วันที่ตรวจสภาพ",
      dataIndex: "dateStart",
      key: "dateStart",
      align: "center",
      render: (values: string) => dateFormatTime(values),
    },
    {
      title: "วันตรวจสภาพครั้งถัดไป",
      dataIndex: "dateEnd",
      key: "dateEnd",
      align: "center",
      render: (values: string) => dateFormatTime(values),
    },
    {
      title: "หมายเหตุ",
      dataIndex: "remark",
      key: "remark",
      align: "center",
      render: (_: any, record: MaCarwarpup) => (
        <a
        // onClick={() => detailswarpup(record)}
        >
          <Tooltip title="ดูรายละเอียด">
            <EyeOutlined style={{ fontSize: "24px", color: "#08c", cursor: "pointer" }} />
          </Tooltip>
        </a>
      ),
    },
    {
      title: "ชื่อ - นามสกุล",
      dataIndex: "createbyName",
      key: "createbyName",
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status: boolean) =>
        status === null ? (
          <Tag color="blue">รอตรวจสภาพ</Tag>
        ) : status === true ? (
          <Tag color="green">เช็คแล้ว</Tag>
        ) : (
          <Tag color="red">ยกเลิกการเช็ค</Tag>
        ),
    },
    {
      title: "ตัวเลือก",
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (_: any, record: MaCarwarpup) => {
        return (
          <Space size="middle">
            {/* <Tooltip title="แก้ไข">
              <a
                onClick={() => isEditable && showModalEditMaCarWarpup(record)}
                style={{
                  pointerEvents: isEditable ? "auto" : "none",
                  visibility: isEditable ? "visible" : "hidden",
                  color: isEditable ? "inherit" : "gray",
                }}>
                {EditIcon}
              </a>
            </Tooltip>
            <Popconfirm
              title="คุณแน่ใจหรือไม่ว่าต้องการลบการตรวจสภาพนี้ ?"
              onConfirm={() => handleDeletemaCarWarpup(record.carWrapupId)}
              okText="ยืนยัน"
              cancelText="ยกเลิก">
              <Tooltip title="ลบ">
                <a>
                  <DeleteIcon width="20" height="20" />
                </a>
              </Tooltip>
            </Popconfirm>
            <Tooltip title="การเช็ค">
              <a
                onClick={() => isEditable && modalopensubmit(record)}
                style={{
                  pointerEvents: isEditable ? "auto" : "none",
                  visibility: isEditable ? "visible" : "hidden",
                  color: isEditable ? "inherit" : "gray",
                }}>
                {ApproveIcon}
              </a>
            </Tooltip> */}
          </Space>
        );
      },
    },
  ];
  return (
    <div>
      <Table size="small" loading={loading} dataSource={dataSource} columns={columns} scroll={{ x: "max-content" }} rowKey="id" />
    </div>
  );
};

export default ManagementCarWrapupTable;
