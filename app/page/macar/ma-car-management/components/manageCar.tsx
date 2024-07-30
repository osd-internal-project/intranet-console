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
  Select,
  InputNumber,
  Divider,
  Input,
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
}: any): React.ReactElement => {
  const intraAuth = useAxiosIntranet();
  const [formReturn] = Form.useForm();
  const [form] = Form.useForm();
  const [modalApproveMa, setModalApproveMa] = useState(false);
  const [modalReturn, setModalReturn] = useState(false);
  const [carBookApprovedStatus, setMaCarBookStatus] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [currentMaId, setCurrentMaId] = useState<number | null>(null);
  const [maBookData, setMaCarBookData] = useState<MaCarBookType[]>([]);
  const manageCarServices = ManageCarServices(intraAuth);
  const { data: session } = useSession();

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
            status === "Process"
              ? "blue"
              : status === "Cancel"
              ? "red"
              : status === "Approve"
              ? "green"
              : status === "DisapProved"
              ? "orange"
              : status === "Return"
              ? "yellow"
              : status === "Completed"
              ? "#748698 "
              : undefined
          }
        >
          {status === "Process"
            ? "กำลังรออนุมัติ"
            : status === "Cancel"
            ? "ยกเลิกการจอง"
            : status === "Approve"
            ? "อนุมัติแล้ว"
            : status === "DisapProved"
            ? "ไม่อนุมัติ"
            : status === "Return"
            ? "แจ้งคืนรถแล้ว"
            : status === "Completed"
            ? "รับคืนรถสำเร็จ"
            : ""}
        </Tag>
      ),
    },
    {
      title: "จัดการ",
      key: "note",
      dataIndex: "note",
      width: "280px",
      align: "center",
      render: (_: any, record: MaCarBookType) => (
        <Space
          size="middle"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Tooltip title="อนุมัติ">
            <a
              onClick={() => showModalApproveBook(record)}
              style={{ color: "green", width: "50px", textAlign: "center" }} // กำหนดความกว้างและจัดข้อความให้อยู่กลาง
            >
              <ApproveIcon />
            </a>
          </Tooltip>

          <Popconfirm
            title="คุณแน่ใจหรือไม่ว่าต้องการลบการจองนี้?"
            onConfirm={() => handleDeleteMa(record.id)}
            okText="ใช่"
            cancelText="ไม่"
          >
            <Tooltip title="ลบ">
              <a style={{ color: "red", width: "50px", textAlign: "center" }}>
                <DeleteIcon />
              </a>
            </Tooltip>
          </Popconfirm>

          <div style={{ width: "120px", textAlign: "center" }}>
            {" "}
            {record.carBookApprovedStatus === "Return" ? (
              <a onClick={() => showModalReturn(record)}>รับคืนรถ</a>
            ) : record.carBookApprovedStatus === "Completed" ? (
              <span style={{ color: "grey" }}>รับคืนแล้ว</span>
            ) : (
              <span style={{ color: "grey" }}>รอแจ้งคืนรถ</span>
            )}
          </div>

          <Popconfirm
            title="คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการจองนี้?"
            onConfirm={() => handleCancelMa(record)}
            okText="ใช่"
            cancelText="ไม่"
          >
            <a style={{ width: "100px", textAlign: "center" }}>ยกเลิกการจอง</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const showModalApproveBook = (record: MaCarBookType) => {
    setModalApproveMa(true);
    setMaCarBookStatus(record.carBookApprovedStatus);
    setCurrentMaId(record.id);
  };

  const handleApproveBook = () => {
    setModalApproveMa(false);
  };

  const showModalReturn = (record: MaCarBookType) => {
    setModalReturn(true);
    setMaCarBookStatus(record.carBookApprovedStatus);
    setCurrentMaId(record.id);
    formReturn.setFieldsValue({
      carName: record.maCar.carName,
      carMile: record.maCar.carMile,
      carPetrol: record.maCar.carPetrol,
      status: record.maCar.status,
      createdByName: record.createdByName,
    });
  };

  const handleReturn = () => {
    setModalReturn(false);
  };

  const handleDeleteMa = async (id: number) => {
    setSubmitLoading(true);

    try {
      await manageCarServices.deleteMaCarBook(id);
      setMaCarBookData(maBookData.filter((item) => item.id !== id));

      message.success("ลบข้อมูลการจองสำเร็จ");
      setSubmitLoading(false);
    } catch (error) {
      message.error("ลบข้อมูลการจองไม่สำเร็จ");
    }
    setLoading(true);
  };

  const handleCancelMa = async (record: MaCarBookType) => {
    setSubmitLoading(false);

    if (record.carBookApprovedStatus === "Return") {
      message.warning("ไม่สามารถยกเลิกการจองที่แจ้งคืนรถได้");
      return;
    }
    if (record.carBookApprovedStatus === "Completed") {
      message.warning("ไม่สามารถยกเลิกการจองที่คืนรถได้");
      return;
    }
    if (record.carBookApprovedStatus === "Cancel") {
      message.warning("ยกเลิกการจองนี้ไปแล้ว");
      return;
    }

    try {
      const updatedApproveMa = {
        id: record.id,
        carBookApprovedById: session?.user.userId,
        carBookApprovedByName: `${session?.user.firstNameTh} ${session?.user.lastNameTh}`,
        carBookApprovedStatus: "Cancel",
        carBookApprovedDate: dayjs().toISOString(),
      };
      await manageCarServices.updateMaCarBook(updatedApproveMa);
      message.success("ยกเลิกการจองสำเร็จ");
      setSubmitLoading(false);
    } catch (error) {
      message.error("ยกเลิกการจองไม่สำเร็จ");
    } finally {
      setSubmitLoading(false);
    }
    setLoading(true);
  };

  const onFinishCancel = async () => {
    setSubmitLoading(false);

    if (carBookApprovedStatus === "Return") {
      message.warning("ไม่สามารถไม่อนุมัติการจองที่แจ้งคืนรถได้");
      return;
    }
    if (carBookApprovedStatus === "Completed") {
      message.warning("ไม่สามารถไม่อนุมัติการจองที่คืนรถได้");
      return;
    }
    if (carBookApprovedStatus === "DisapProved") {
      message.warning("ไม่อนุมัติการจองนี้ไปแล้ว");
      return;
    }
    if (carBookApprovedStatus === "Cancel") {
      message.warning("ไม่สามารถไม่อนุมัติการจองที่ยกเลิกได้ได้");
      return;
    }
    setModalApproveMa(false);

    try {
      const updatedApproveMa = {
        id: currentMaId,
        carBookApprovedById: session?.user.userId,
        carBookApprovedByName: `${session?.user.firstNameTh} ${session?.user.lastNameTh}`,
        carBookApprovedStatus: "DisapProved",
        carBookApprovedDate: dayjs(),
      };

      await manageCarServices.updateMaCarBook(updatedApproveMa);

      setModalApproveMa(false);
      message.success("ไม่อนุมัติการจองสำเร็จ");

      setSubmitLoading(false);
    } catch (error) {
      message.error("อนุมัติการจองไม่สำเร็จ");
    } finally {
      setSubmitLoading(false);
    }
    setLoading(true);
  };

  const onFinishApprove: FormProps<MaCarBookType>["onFinish"] = async () => {
    setSubmitLoading(false);
    if (carBookApprovedStatus === "Approve") {
      message.warning("อนุมัติการจองนี้ไปแล้ว");
      return;
    }
    if (carBookApprovedStatus === "Return") {
      message.warning("ไม่สามารถอนุมัติการจองที่แจ้งคืนรถได้");
      return;
    }
    if (carBookApprovedStatus === "Completed") {
      message.warning("ไม่สามารถอนุมัติการจองที่คืนรถได้");
      return;
    }
    if (carBookApprovedStatus === "Cancel") {
      message.warning("ไม่สามารถอนุมัติการจองที่ยกเลิกได้ได้");
      return;
    }

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

  const onFinishReturn: FormProps<MaCarBookType>["onFinish"] = async () => {
    setSubmitLoading(true);

    try {
      const updatedReturn = {
        id: currentMaId,
        recipientId: session?.user.userId,
        recipientName: `${session?.user.firstNameTh} ${session?.user.lastNameTh}`,
        carBookApprovedStatus: "Completed",
        returnAt: dayjs(),
      };

      await manageCarServices.updateMaCarBook(updatedReturn);

      message.success("รับคืนรถสำเร็จ");
      setSubmitLoading(false);
    } catch (error) {
      message.error("รับคืนรถไม่สำเร็จ");
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
        title="การอนุมัติการจองรถ"
        open={modalApproveMa}
        onCancel={handleApproveBook}
        footer={null}
      >
        <Form
          form={form}
          onFinish={onFinishApprove}
          onFinishFailed={onFinishFailed}
        >
          <Row justify="end">
            <Button
              type="default"
              onClick={onFinishCancel}
              disabled={carBookApprovedStatus === "DisapProved"}
              loading={submitLoading}
              style={{ marginRight: "16px", marginTop: "16px" }}
            >
              ไม่อนุมัติ
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              disabled={carBookApprovedStatus === "Approve"}
              loading={submitLoading}
              style={{ marginTop: "16px" }}
            >
              อนุมัติ
            </Button>
          </Row>
        </Form>
      </Modal>

      <Modal
        width={500}
        title="การรับคืนรถ"
        open={modalReturn}
        onCancel={handleReturn}
        footer={null}
      >
        <Form
          form={formReturn}
          onFinish={onFinishReturn}
          layout="vertical"
          autoComplete="off"
        >
          <Divider orientation="left">ข้อมูลการคืนรถ</Divider>

          <Col span={24}>
            <Form.Item
              name="carName"
              label="ชื่อรถ"
              rules={[{ required: true, message: "กรุณากรอกชื่อรถ" }]}
            >
              <Input disabled placeholder="กรอกชื่อรถ" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="createdByName" label="ชื่อผู้คืนรถ">
              <Input disabled placeholder="กรอกชื่อ" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="carMile" label="เลขไมล์รถ">
              <InputNumber
                disabled
                style={{ width: "100%" }}
                placeholder="กรอกเลขไมล์รถ"
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="ระดับน้ำมันรถ"
              name="carPetrol"
              rules={[{ required: true, message: "กรุณาเลือกระดับน้ำมัน!" }]}
            >
              <Select placeholder="เลือกระดับน้ำมัน" disabled>
                <Select.Option value="high">มาก</Select.Option>
                <Select.Option value="medium">ปานกลาง</Select.Option>
                <Select.Option value="low">น้อย</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="สถานะของรถ"
              name="status"
              rules={[{ required: true, message: "กรุณาเลือกสถานะรถ!" }]}
            >
              <Select placeholder="เลือกสถานะรถ" disabled>
                <Select.Option value={true}>ใช้งานได้ปกติ</Select.Option>
                <Select.Option value={false}>ไม่สามารถใช้งานได้</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Row justify="end" gutter={16}>
              <Button
                type="default"
                onClick={handleReturn}
                style={{ marginRight: "16px" }}
              >
                ยกเลิก
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                disabled={carBookApprovedStatus === "Completed"}
                loading={submitLoading}
              >
                รับคืนรถ
              </Button>
            </Row>
          </Form.Item>
        </Form>
      </Modal>

      <Table columns={columns} dataSource={maCarBookData} loading={loading} />
    </>
  );
};

export default ManageCar;
