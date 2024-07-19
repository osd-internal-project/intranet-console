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
import type { FormProps, TableProps } from "antd";
import dayjs from "dayjs";
import { MaCarServices } from "../services/ma-car.service";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { useSession } from "next-auth/react";

interface MaCarType {
  id: string;
  carId: string;
  carName: string;
  carPetrol: string;
  detail: string;
  remark: string;
  status: string;
  createdAt: Date;
  createdById: string;
  createdByName: string;
  updatedAt: Date;
  updatedById: string;
  updatedByName: string;
  carBookProvince: string;
  carBookPlace: string;
  carBookUsers: number;
  carBookStartDate: Date;
  carBookEndDate: Date;
  carBookTitle: string;
  carBookApprovedDate?: Date;
  carBookApprovedById?: string;
  carBookApprovedByName?: string;
  carBookApprovedStatus: string;
}

export interface props {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  maFetchData: any[];
  pagination: TablePaginationConfig;
  changePagination: (pagination: TablePaginationConfig) => void;
  maCarData: any[];
}

const MaCarTable: React.FC<props> = ({
  changePagination,
  pagination,
  maFetchData,
  setLoading,
  loading,
  maCarData,
}: any): React.ReactElement => {
  const { data: session } = useSession();
  const [form] = Form.useForm();
  const intraAuth = useAxiosIntranet();
  const maCarServices = MaCarServices(intraAuth);
  const [modalEditMaCarBook, setModalEditMa] = useState(false);
  const [currentMaId, setCurrentMaId] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const columns: TableProps<MaCarType>["columns"] = [
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
          {dayjs(record.carBookStartDate).format("YYYY-MM-DD")} -{" "}
          {dayjs(record.carBookEndDate).format("YYYY-MM-DD")}
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
            text = "ไม่อนุมัติ";
            break;
          case "Return":
            color = "yellow";
            text = "คืนรถสำเร็จ";
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
      title: "จัดการ",
      key: "note",
      dataIndex: "note",
      width: "150px",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => showModalEditMaCarBook(record)}>แก้ไข</a>
          <Popconfirm
            title="คุณแน่ใจหรือไม่ว่าต้องการลบการจองนี้?"
            onConfirm={() => handleDeleteMa(record.id)}
            okText="ใช่"
            cancelText="ไม่"
          >
            <a style={{ color: "red" }}>ลบ</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const showModalEditMaCarBook = (record: MaCarType) => {
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
    setLoading(true);
  };

  const { TextArea } = Input;

  const handleEditMaCancel = () => {
    setModalEditMa(false);
  };

  const handleDeleteMa = async (id: string) => {
    setSubmitLoading(true);
    try {
      const res = await maCarServices.deleteMaCarBook(id);
      if (!res) {
        message.error("ลบข้อมูลการจองไม่สำเร็จ");
      }
      message.success("ลบข้อมูลการจองสำเร็จ");
      setSubmitLoading(false);
    } catch (error) {
      message.error("ลบข้อมูลการจองไม่สำเร็จ");
    }
    setLoading(true);
  };

  const updatedMaCarBook: FormProps<MaCarType>["onFinish"] = async (values) => {
    setSubmitLoading(true);

    if (currentMaId === null) {
      message.error("No ma selected for update");
      return;
    }

    const carSelected = maCarData.findLast(
      (car: any) => car.carId === values.carId
    );

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

      // const userIdData = session?.user.userId;

      // const existingMa = await maCarServices.getMaCarBookQuery(userIdData);

      const maCarBookData = {
        ...restValues,
        id: currentMaId,
        carName: carSelected?.carName,
        carBookStartDate: updatedStartDate,
        carBookEndDate: updatedEndDate,
        carBookTitle: values.carBookTitle,
        carBookUsers: Number(values.carBookUsers),
        detail: values.detail,
        remark: values.remark || null,
        updatedAt: dayjs().toISOString(),
        updatedById: session?.user.userId,
        updatedByName: `${session?.user.firstNameTh} ${session?.user.lastNameTh}`,
      };
      await maCarServices.updateMaCarBook(maCarBookData);
      message.success("แก้ไขการจองสำเร็จ");
      setSubmitLoading(false);
      setModalEditMa(false);
    } catch (error) {
      message.error("แก้ไขการจองไม่สำเร็จ");
      setSubmitLoading(false);
    }
    setLoading(true);
  };

  return (
    <>
      <Modal
        title="แก้ไขข้อมูลการจอง"
        open={modalEditMaCarBook}
        onCancel={handleEditMaCancel}
        footer={null}
        width={1000}
      >
        <Form
          form={form}
          layout="vertical"
          name="edit_ma"
          initialValues={{ remember: true }}
          onFinish={updatedMaCarBook}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item<MaCarType>
                name="createdByName"
                label="ชื่อผู้จอง"
                rules={[{ required: true, message: "กรุณากรอกชื่อผู้จอง" }]}
              >
                <Input disabled placeholder="กรอกชื่อผู้จอง" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">ข้อมูลการจองรถ</Divider>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item<MaCarType>
                name="carId"
                label="ชื่อรถ"
                rules={[{ required: true, message: "กรุณาเลือกรถ" }]}
              >
                <Select placeholder="โปรดเลือกรถ" style={{ width: "100%" }}>
                  {maCarData.map((car: any, index: any) => (
                    <Select.Option key={index} value={car.carId}>
                      {car.carName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<MaCarType>
                name="carBookTitle"
                label="วัตถุประสงค์การใช้งาน"
                rules={[
                  { required: true, message: "กรุณากรอกวัตถุประสงค์การใช้งาน" },
                ]}
              >
                <Input placeholder="กรอกวัตถุประสงค์การใช้งาน" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<MaCarType>
                name="carBookPlace"
                label="สถานที่ไป"
                rules={[{ required: true, message: "กรุณากรอกสถานที่ไป" }]}
              >
                <Input placeholder="กรอกสถานที่ไป" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<MaCarType>
                name="carBookProvince"
                label="จังหวัด"
                rules={[{ required: true, message: "กรุณากรอกจังหวัด" }]}
              >
                <Input placeholder="กรอกจังหวัด" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<MaCarType>
                name="carBookUsers"
                label="จำนวนผู้ใช้"
                rules={[{ required: true, message: "กรุณากรอกจำนวนผู้ใช้" }]}
              >
                <Input placeholder="กรอกจำนวนผู้ใช้" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item<MaCarType>
                name="carBookStartDate"
                label="วันที่เริ่มการจอง"
                rules={[
                  { required: true, message: "กรุณาเลือกวันที่เริ่มจอง!" },
                ]}
              >
                <DatePicker
                  placeholder="กรอกวันที่เริ่มการจอง"
                  showTime
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="carBookEndDate"
                label="วันที่สิ้นสุดการจอง"
                rules={[{ required: true, message: "กรุณาเลือกวันที่สิ้นสุด" }]}
              >
                <DatePicker
                  placeholder="กรอกวันที่สิ้นสุดการจอง"
                  showTime
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={16}>
              <Form.Item name="detail" label="รายยละเอียด">
                <TextArea placeholder="กรอกรายยละเอียด" rows={2} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="remark" label="หมายเหตุ">
                <TextArea placeholder="กรอกหมายเหตุ" rows={2} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Row justify="end" gutter={16}>
              <Button
                type="default"
                onClick={handleEditMaCancel}
                style={{ marginRight: "16px" }}
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
      <Table
        columns={columns}
        dataSource={maFetchData}
        rowKey="id"
        onChange={changePagination}
        pagination={pagination}
        loading={loading}
      />
    </>
  );
};

export default MaCarTable;
