import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Row,
  Col,
  Space,
  Modal,
  Form,
  message,
  Popconfirm,
  TablePaginationConfig,
  Tooltip,
} from "antd";
import { DeleteIcon, ApproveIcon } from "@/components/icon";
import type { TableProps, FormProps } from "antd";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManageCarServices } from "../services/manage-car.service";
import dayjs, { Dayjs } from "dayjs";
import { useSession } from "next-auth/react";
import isBetween from "dayjs/plugin/isBetween";
import { MaCarType, MaCarBookType } from "../../common/index";

dayjs.extend(isBetween);

export interface props {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  maCarBookData: any[];
  pagination: TablePaginationConfig;
  // changePagination: (pagination: TablePaginationConfig) => void;
}

const ManageCar: React.FC<props> = ({
  setLoading,
  loading,
  maCarBookData,
  pagination,
}: // changePagination,
any): React.ReactElement => {
  // const ManageCar: React.FC = () => {
  const intraAuth = useAxiosIntranet();
  const [isModaMa, setIsModaMa] = useState(false);
  const [form] = Form.useForm();
  const [modalApproveMa, setModalApproveMa] = useState(false);
  const [carBookApprovedStatus, setMaCarBookStatus] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  // const [maCarData, setMaCarData] = useState<MaCarType[]>([]);
  const [currentMaId, setCurrentMaId] = useState<number | null>(null);
  const [maData, setMaData] = useState<MaCarBookType[]>([]);
  const manageCarServices = ManageCarServices(intraAuth);
  const { data: session } = useSession();
  // const [loading, setLoading] = useState<boolean>(true);
  // const [pagination, setPagination] = useState<TablePaginationConfig>({
  //   current: 1,
  //   pageSize: 10,
  //   total: 0,
  // });

  const columns: TableProps<MaCarBookType>["columns"] = [
    {
      title: "ลำดับ",
      width: "50px",
      align: "center",
      render: (id: number, record: any, index: number) =>
        pagination.current && pagination.pageSize
          ? (pagination.current - 1) * pagination.pageSize + (index + 1)
          : "",
    },
    {
      title: "ชื่อรถ",
      dataIndex: "carName",
      key: "carName",
      width: "200px",
      align: "center",
    },
    {
      title: "วันที่จอง",
      key: "createdAt",
      width: "200px",
      align: "center",
      render: (_, record) => (
        <span>
          {dayjs(record.carBookStartDate).format("YYYY-MM-DD")} -{" "}
          {dayjs(record.carBookEndDate).format("YYYY-MM-DD")}
        </span>
      ),
    },
    {
      title: "เวลาจอง",
      key: "bookingTime",
      width: "150px",
      align: "center",
      render: (_, record) => (
        <span>
          {dayjs(record.carBookStartDate).format("HH:mm")} -{" "}
          {dayjs(record.carBookEndDate).format("HH:mm")}
        </span>
      ),
    },
    {
      title: "ชื่อผู้จอง",
      dataIndex: "createdByName",
      key: "createdByName",
      width: "150px",
      align: "center",
    },
    {
      title: "สถานะ",
      key: "carBookApprovedStatus",
      dataIndex: "carBookApprovedStatus",
      width: "100px",
      align: "center",
      render: (status: string) => (
        <Tag
          color={
            status === "process"
              ? "blue"
              : status === "Approve"
              ? "green"
              : status === "Cancel"
              ? "red"
              : status === "Return"
              ? "#748698 "
              : undefined
          }
        >
          {status === "process"
            ? "กำลังรออนุมัติ"
            : status === "Approve"
            ? "อนุมัติสำเร็จ"
            : status === "Cancel"
            ? "ไม่อนุมัติ"
            : status === "Return"
            ? "คืนรถสำเร็จ"
            : ""}
        </Tag>
        // </>
      ),
    },
    {
      title: "จัดการ",
      key: "note",
      dataIndex: "note",
      width: "150px",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="คุณแน่ใจหรือไม่ว่าต้องการลบการจองนี้?"
            onConfirm={() => handleDeleteMa(record.id)}
            okText="ใช่"
            cancelText="ไม่"
          >
            <Tooltip title="ลบ">
              <a>
                {" "}
                <DeleteIcon width="24" height="24" />{" "}
              </a>
            </Tooltip>
          </Popconfirm>
          <Tooltip title="อนุมัติ">
            <a
              onClick={() => showModalApprove(record)}
              style={{ color: "green" }}
            >
              <ApproveIcon strokeColor="blue" width="2rem" height="2rem" />
            </a>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const showModalApprove = (record: MaCarBookType) => {
    setMaCarBookStatus(record.carBookApprovedStatus);
    setCurrentMaId(record.id);
    setModalApproveMa(true);
  };

  const handleApproveBooking = () => {
    setModalApproveMa(false);
  };

  const handleDeleteMa = async (id: number) => {
    setSubmitLoading(true);

    try {
      await manageCarServices.deleteMaCarBook(id);
      setMaData(maData.filter((item) => item.id !== id));

      message.success("ลบข้อมูลการจองสำเร็จ");
      setSubmitLoading(false);
    } catch (error) {
      message.error("ลบข้อมูลการจองไม่สำเร็จ");
    }
    setLoading(true);
  };

  const onFinishCancel = async () => {
    setSubmitLoading(true);

    try {
      const updatedApproveMa = {
        id: currentMaId,
        carBookApprovedById: session?.user.userId,
        carBookApprovedByName: `${session?.user.firstNameTh} ${session?.user.lastNameTh}`,
        carBookApprovedStatus: "Cancel",
        carBookApprovedDate: dayjs(),
      };

      await manageCarServices.updateMaCarBook(updatedApproveMa);
      console.log(onFinishCancel);

      setModalApproveMa(false);

      message.success("อนุมัติการจองสำเร็จ");
      setSubmitLoading(false);
    } catch (error) {
      message.error("อนุมัติการจองไม่สำเร็จ");
    } finally {
      setSubmitLoading(false);
    }
    setLoading(true);
  };

  const onFinishApprove: FormProps<MaCarBookType>["onFinish"] = async () => {
    setSubmitLoading(true);

    try {
      const updatedApproveMa = {
        id: currentMaId,
        carBookApprovedById: session?.user.userId,
        carBookApprovedByName: `${session?.user.firstNameTh} ${session?.user.lastNameTh}`,
        carBookApprovedStatus: "Approve",
        carBookApprovedDate: dayjs(),
      };

      await manageCarServices.updateMaCarBook(updatedApproveMa);

      setModalApproveMa(false);

      message.success("อนุมัติการจองสำเร็จ");
      setSubmitLoading(false);
    } catch (error) {
      message.error("อนุมัติการจองไม่สำเร็จ");
    } finally {
      setSubmitLoading(false);
    }
    setLoading(true);
  };

  const onFinishFailed: FormProps<MaCarBookType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Modal
        width={400}
        title="อนุมัติการจองรถ"
        open={modalApproveMa}
        onCancel={handleApproveBooking}
        footer={null}
      >
        <p>ยืนยันอนุมัติการจองรถ</p>
        <Form
          form={form}
          layout="vertical"
          name="edit_macarbook"
          initialValues={{ remember: true }}
          onFinish={onFinishApprove}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Row justify="end">
            <Button
              type="default"
              onClick={onFinishCancel}
              disabled={carBookApprovedStatus === "Cancel"}
              loading={submitLoading}
              style={{ marginRight: "16px" }}
            >
              ไม่อนุมัติ
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              disabled={carBookApprovedStatus === "Approve"}
              loading={submitLoading}
            >
              อนุมัติ
            </Button>
          </Row>
        </Form>
      </Modal>
      <Table
        columns={columns}
        dataSource={maCarBookData}
        rowKey="id"
        // pagination={pagination}
        loading={loading}
        // onChange={changePagination}
      />
    </>
  );
};

export default ManageCar;
