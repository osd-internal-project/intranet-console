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
  Input,
  Divider,
  message,
  Select,
  DatePicker,
  Popconfirm,
  TablePaginationConfig,
} from "antd";
import type { TableProps, FormProps } from "antd";
import {
  useAxiosIntranet,
  useAxiosUser,
} from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManageCarServices } from "../services/manage-car.service";
import dayjs, { Dayjs } from "dayjs";
import { useForm } from "antd/es/form/Form";
import { useSession } from "next-auth/react";
import isBetween from "dayjs/plugin/isBetween";
import MaCarBook from "../../ma-car-booking/components/maCarBooking";

dayjs.extend(isBetween);

interface CarType {
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
  const [modalEditMa, setModalEditMa] = useState(false);
  const [modalApproveMa, setModalApproveMa] = useState(false);
  const [carBookApprovedStatus, setMaCarBookStatus] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [createdById, setcreatedById] = useState<string | null>(null);
  const [maCarData, setMaCarData] = useState<MaCarType[]>([]);
  const [currentMaId, setCurrentMaId] = useState<string | null>(null);
  const [maData, setMaData] = useState<CarType[]>([]);
  const manageCarServices = ManageCarServices(intraAuth);
  const { data: session } = useSession();
  const [loading, setloading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const columns: TableProps<CarType>["columns"] = [
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
        // <>
        //   {console.log(status)}
        <Tag
          color={
            status === "process"
              ? "blue"
              : status === "Approve"
              ? "green"
              : status === "Cancel"
              ? "red"
              : undefined
          }
        >
          {status === "process"
            ? "กำลังรออนุมัติ"
            : status === "Approve"
            ? "อนุมัติสำเร็จ"
            : status === "Cancel"
            ? "ยกเลิกการจอง"
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
          <a onClick={() => showModalEditMa(record)}>แก้ไข</a>
          <Popconfirm
            title="คุณแน่ใจหรือไม่ว่าต้องการลบการจองนี้?"
            onConfirm={() => handleDeleteMa(record.id)}
            okText="ใช่"
            cancelText="ไม่"
          >
            <a>ลบ</a>
          </Popconfirm>
          <a onClick={() => showModalApproveMa(record)}>อนุมัติ</a>
        </Space>
      ),
    },
  ];
  const showModalEditMa = (record: CarType) => {
    if (record.carBookApprovedStatus === "Approve") {
      message.warning("ไม่สามารถแก้ไขการจองที่อนุมัติแล้วได้");
      return;
    }
    setCurrentMaId(record.id);
    form.setFieldsValue({
      ...record,
      carBookStartDate: dayjs(record.carBookStartDate),
      carBookEndDate: dayjs(record.carBookEndDate),
    });
    setModalEditMa(true);
  };
  const changePagination = (page: TablePaginationConfig) => {
    setPagination({ ...page });
    setloading(true);
  };
  const showModalApproveMa = (record: CarType) => {
    setMaCarBookStatus(record.carBookApprovedStatus);
    setCurrentMaId(record.id);
    setModalApproveMa(true);
  };

  const handleApproveBookingCancel = () => {
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
  const handleEditMaCancel = () => {
    setModalEditMa(false);
  };

  const updatedMa: FormProps<CarType>["onFinish"] = async (values) => {
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
      console.log(values);
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
      const existingMa = await manageCarServices.getMaCarBookQuery();

      const hasOverlap = existingMa.some((ma: CarType) => {
        if (ma.carName === carName && ma.id !== currentMaId) {
          const existingStart = dayjs(ma.carBookStartDate);
          const existingEnd = dayjs(ma.carBookEndDate);
          const newStart = dayjs(updatedStartDate);
          const newEnd = dayjs(updatedEndDate);
          return (
            newStart.isBetween(existingStart, existingEnd, null, "[)") ||
            newEnd.isBetween(existingStart, existingEnd, null, "(]") ||
            existingStart.isBetween(newStart, newEnd, null, "[)") ||
            existingEnd.isBetween(newStart, newEnd, null, "(]")
          );
        }
        return false;
      });
      if (hasOverlap) {
        message.error(
          "ไม่สามารถแก้ไขการจองนี้ได้เนื่องจากมีการจองห้องนี้ในช่วงเวลานี้แล้ว"
        );
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
      setModalEditMa(false);
    } catch (error) {
      message.error("แก้ไขการจองไม่สำเร็จ");
      setSubmitLoading(false);
    }
  };

  // const handleCancel = () => {
  //   setIsModaMa(false);
  // };

  const fetchData = async () => {
    const skip: number =
      (Number(pagination.current) - 1) * Number(pagination.pageSize);
    const take: number = Number(pagination.pageSize);
    try {
      const masterCar = await manageCarServices.getMaCarBookQuery();
      const maCarActive = masterCar.filter(
        (car: any) => car.carsStatus === true
      );
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

  const onFinishApprove: FormProps<CarType>["onFinish"] = async () => {
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
  };
  const onFinishFailed: FormProps<CarType>["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  useEffect(() => {
    if (loading === true) fetchData();
  }, [loading]);

  return (
    <>
      <Modal
        title="แก้ไขข้อมูลการจอง"
        open={modalEditMa}
        onCancel={handleEditMaCancel}
        footer={null}
        width={1000}
      >
        <Form
          form={form}
          layout="vertical"
          name="edit_ma"
          initialValues={{ remember: true }}
          onFinish={updatedMa}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          {/* <Form.Item<CarType> name="maId" hidden> */}
          <Form.Item<CarType> hidden>
            <Input />
          </Form.Item>
          <Divider orientation="left">ข้อมูลผู้จอง</Divider>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item<CarType>
                label="ชื่อผู้จอง"
                name="createdByName"
                rules={[{ required: true, message: "กรุณากรอกชื่อผู้จอง!" }]}
              >
                <Input disabled placeholder="กรอกชื่อผู้จอง" />
              </Form.Item>
            </Col>
          </Row>
          <Divider orientation="left">ข้อมูลการจอง</Divider>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item<CarType>
                label="ชื่อรถ"
                name="carName"
                rules={[{ required: true, message: "กรุณาเลือกรถ" }]}
              >
                <Select placeholder="โปรดเลือกรถ">
                  {maCarData.map((car) => (
                    <Select.Option key={car.carName} value={car.carName}>
                      {car.carName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<CarType>
                label="วันที่เริ่มการจอง"
                name="carBookStartDate"
                rules={[
                  { required: true, message: "กรุณากรอกวันที่เริ่มการจอง!" },
                ]}
              >
                <DatePicker showTime style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<CarType>
                label="วันที่สิ้นสุดการจอง"
                name="carBookEndDate"
                rules={[
                  { required: true, message: "กรุณากรอกวันที่สิ้นสุดการจอง!" },
                ]}
              >
                <DatePicker showTime style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item<CarType> label="หมายเหตุ" name="note">
                <Input placeholder="หมายเหตุ" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Row justify="end">
              <Button
                type="default"
                onClick={handleEditMaCancel}
                style={{ marginRight: 8 }}
              >
                ยกเลิก
              </Button>
              <Button type="primary" htmlType="submit" loading={submitLoading}>
                ตกลง
              </Button>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        width={400}
        title="อนุมัติการจองรถ"
        open={modalApproveMa}
        onCancel={handleApproveBookingCancel}
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
              type="primary"
              onClick={onFinishCancel}
              disabled={carBookApprovedStatus === "Cancel"}
              loading={submitLoading}
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
