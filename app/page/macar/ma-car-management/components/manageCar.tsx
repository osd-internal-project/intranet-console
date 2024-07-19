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
} from "antd";
import { DeleteIcon, ApproveIcon } from "@/components/icon";
import type { TableProps, FormProps } from "antd";
import {
  useAxiosIntranet,
} from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManageCarServices } from "../services/manage-car.service";
import dayjs, { Dayjs } from "dayjs";
import { useSession } from "next-auth/react";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

interface MaCarType {
  id: string;
  carId: string;
  carName: string;
  detail: string;
  carPetrol: string;
  status: string;
  carBookApprovedStatus: string;
  createdById: string;
  createdByName: string;
  updatedById: string;
  updatedByName: string;
  carBookStartDate: Dayjs;
  carBookEndDate: Dayjs;
  updatedAt: string;
  title: string;
  member: string;
  outSider: string;
  note: string;
  carType: string;
}
interface MaCarType {
  carName: string;
}

const ManageCar: React.FC = () => {
  const intraAuth = useAxiosIntranet();
  const [isModaMa, setIsModaMa] = useState(false);
  const [form] = Form.useForm();
  const [modalApproveMa, setModalApproveMa] = useState(false);
  const [carBookApprovedStatus, setMaCarBookStatus] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [maCarData, setMaCarData] = useState<MaCarType[]>([]);
  const [currentMaId, setCurrentMaId] = useState<string | null>(null);
  const [maData, setMaData] = useState<MaCarType[]>([]);
  const manageCarServices = ManageCarServices(intraAuth);
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const columns: TableProps<MaCarType>["columns"] = [
    {
      title: "ลำดับ",
      dataIndex: "no",
      key: "no",
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
      width: "150px",
      align: "center",
    },
    {
      title: "วันที่จอง",
      key: "createdAt",
      width: "250px",
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
            <a>
              {" "}
              <DeleteIcon width="24" height="24" />{" "}
            </a>
          </Popconfirm>
          <a
            onClick={() => showModalApprove(record)}
            style={{ color: "green" }}
          >
            <ApproveIcon strokeColor="blue" width="2rem" height="2rem" />
          </a>
        </Space>
      ),
    },
  ];

  const changePagination = (page: TablePaginationConfig) => {
    setPagination({ ...page });
    setLoading(true);
  };

  const showModalApprove = (record: MaCarType) => {
    setMaCarBookStatus(record.carBookApprovedStatus);
    setCurrentMaId(record.id);
    setModalApproveMa(true);
  };

  const handleApproveBooking = () => {
    setModalApproveMa(false);
  };

  const handleDeleteMa = async (id: string) => {
    setSubmitLoading(true);

    try {
      await manageCarServices.deleteMaCarBook(id);
      setMaData(maData.filter((item) => item.id !== id));

      message.success("ลบข้อมูลการจองสำเร็จ");
      setSubmitLoading(false);
    } catch (error) {
      message.error("ลบข้อมูลการจองไม่สำเร็จ");
    }
  };

  const updatedMa: FormProps<MaCarType>["onFinish"] = async (values) => {
    setSubmitLoading(true);

    if (currentMaId === null) {
      message.error("No ma selected for update");
      return;
    }

    try {
      const {
        carBookStartDate,
        carBookEndDate,
        carName,
        updatedById,
        updatedByName,
        ...restValues
      } = values;

      const updatedStartDate = carBookStartDate.toISOString();
      const updatedEndDate = carBookEndDate.toISOString();

      const today = new Date();
      if (new Date(updatedStartDate) < today) {
        message.error("ไม่สามารถจองในวันที่ผ่านมาได้");
        setSubmitLoading(false);
        return;
      }
      if (new Date(updatedEndDate) < new Date(updatedStartDate)) {
        message.error("วันที่สิ้นสุดการจองต้องหลังวันที่เริ่มการจอง");
        setSubmitLoading(false);
        return;
      }

      const updatedMa = {
        ...restValues,
        id: currentMaId,
        carName,
        carBookStartDate: updatedStartDate,
        carBookEndDate: updatedEndDate,
        updatedAt: dayjs().toISOString(),
        updatedById: session?.user.userId,
        updatedByName: `${session?.user.firstNameTh} ${session?.user.lastNameTh}`,
      };
      await manageCarServices.updateMaCarBook(updatedMa);
      fetchData();
      message.success("แก้ไขการจองสำเร็จ");
      setSubmitLoading(false);
    } catch (error) {
      message.error("แก้ไขการจองไม่สำเร็จ");
      setSubmitLoading(false);
    }
    setLoading(true);
  };

  const fetchData = async () => {
    const skip: number =
      (Number(pagination.current) - 1) * Number(pagination.pageSize);
    const take: number = Number(pagination.pageSize);
    try {
      const masterCar = await manageCarServices.getMaCarBookQuery();
      console.log(masterCar);

      const maCarActive = masterCar.filter(
        (car: any) => car.carsStatus === true
      );
      console.log(masterCar.carId);

      setMaCarData(maCarActive);
      const ma = await manageCarServices.findMaCarBook(skip, take);
      setPagination({ ...pagination, total: ma.count });
      setMaData(
        ma.map((item: any, index: number) => ({
          ...item,
          key: index.toString(),
          id: item.id,
        }))
      );
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
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
      fetchData();
      message.success("อนุมัติการจองสำเร็จ");
      setSubmitLoading(false);
    } catch (error) {
      message.error("อนุมัติการจองไม่สำเร็จ");
    } finally {
      setSubmitLoading(false);
    }
  };

  const onFinishApprove: FormProps<MaCarType>["onFinish"] = async () => {
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
      fetchData();
      message.success("อนุมัติการจองสำเร็จ");
      setSubmitLoading(false);
    } catch (error) {
      message.error("อนุมัติการจองไม่สำเร็จ");
    } finally {
      setSubmitLoading(false);
    }
    setLoading(false);
  };

  const onFinishFailed: FormProps<MaCarType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    if (loading) fetchData();
  }, [loading]);

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
        dataSource={maData}
        rowKey="id"
        pagination={pagination}
        onChange={changePagination}
      />
    </>
  );
};

export default ManageCar;
