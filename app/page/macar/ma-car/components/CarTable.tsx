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
  InputNumber,
  TimePicker,
} from "antd";
import type { FormProps, TableProps } from "antd";
import { DeleteIcon, EditIcon } from "@/components/icon";
import dayjs from "dayjs";
import ShareMaCarBook from "../share-ma-car-book/share-xlsx";
import { MaCarServices } from "../services/ma-car.service";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MaCarBookType } from "../../common/index";

export interface props {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  maCarBookData: any[];
  pagination: TablePaginationConfig;
  changePagination: (pagination: TablePaginationConfig) => void;
  maCarData: any[];
}

const MaCarBookTable: React.FC<props> = ({
  changePagination,
  pagination,
  maCarBookData,
  setLoading,
  loading,
  maCarData,
}: any): React.ReactElement => {
  const { data: session } = useSession();
  const [form] = Form.useForm();
  const router = useRouter();
  const intraAuth = useAxiosIntranet();
  const maCarServices = MaCarServices(intraAuth);
  const [modalEditMaCarBook, setModalEditMa] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [currentMaCarBookId, setCurrentMaCarBookId] = useState<number | null>(
    null
  );

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
      key: "carName",
      title: "ชื่อรถ",
      dataIndex: "carName",
      width: "200px",
      align: "center",
    },
    {
      key: "createdAt",
      title: "วันที่จอง",
      width: "200px",
      align: "center",
      render: (_, record) => (
        <span>
          {dayjs(record.carBookStartDate).format("DD-MM-YYYY")} -{" "}
          {dayjs(record.carBookEndDate).format("DD-MM-YYYY")}
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
            text = "อนุมัติแล้ว";
            break;
          case "Cancel":
            color = "red";
            text = "ไม่อนุมัติ";
            break;
          case "Return":
            color = "orange";
            text = "แจ้งคืนรถแล้ว";
            break;
          case "Completed":
            color = "#748698";
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
          <a
            onClick={() => showModalEditMaCarBook(record)}
            role="button"
            aria-label="Edit"
            style={{ cursor: "pointer" }}
          >
            <EditIcon width="24" height="24" />
          </a>
          <Popconfirm
            title="คุณแน่ใจหรือไม่ว่าต้องการลบการจองนี้?"
            onConfirm={() => handleDeleteMa(record.id)}
            okText="ใช่"
            cancelText="ไม่"
          >
            <a>
              {" "}
              <DeleteIcon />{" "}
            </a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const showModalEditMaCarBook = (record: MaCarBookType) => {
    if (record.carBookApprovedStatus === "Approve") {
      message.warning("ไม่สามารถแก้ไขการจองที่อนุมัติได้");
      return;
    }
    if (record.carBookApprovedStatus === "Return") {
      message.warning("ไม่สามารถแก้ไขการจองที่แจ้งคืนรถได้");
      return;
    }
    if (record.carBookApprovedStatus === "Completed") {
      message.warning("ไม่สามารถแก้ไขการจองที่คืนรถได้");
      return;
    }
    setCurrentMaCarBookId(record.id);
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

  const handleDeleteMa = async (id: any) => {
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

  const updatedMaCarBook: FormProps<MaCarBookType>["onFinish"] = async (
    values
  ) => {
    setSubmitLoading(true);

    if (currentMaCarBookId === null) {
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
        updatedById,
        carName,
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

      const existingMaCarBook = await maCarServices.getMaCarBookAllQuery();

      const hasOverlap = existingMaCarBook.some((maCar: MaCarBookType) => {
        if (maCar.carName === carName && maCar.id !== carSelected) {
          const existingStart = dayjs(maCar.carBookStartDate);
          const existingEnd = dayjs(maCar.carBookEndDate);
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
          "ไม่สามารถแก้ไขการจองนี้ได้เนื่องจากมีการจองรถคันนี้ในช่วงเวลานี้แล้ว"
        );
        setSubmitLoading(false);
        return;
      }

      const maCarBookData = {
        ...restValues,
        id: currentMaCarBookId,
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

  const handleReturnCar = () => {
    router.push("/page/macar/ma-car-booking/");
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
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item<MaCarBookType>
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
              <Form.Item<MaCarBookType>
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
              <Form.Item<MaCarBookType>
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
              <Form.Item<MaCarBookType>
                name="carBookPlace"
                label="สถานที่ไป"
                rules={[{ required: true, message: "กรุณากรอกสถานที่ไป" }]}
              >
                <Input placeholder="กรอกสถานที่ไป" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<MaCarBookType>
                name="carBookProvince"
                label="จังหวัด"
                rules={[{ required: true, message: "กรุณากรอกจังหวัด" }]}
              >
                <Input placeholder="กรอกจังหวัด" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<MaCarBookType>
                name="carBookUsers"
                label="จำนวนผู้ใช้"
                rules={[{ required: true, message: "กรุณากรอกจำนวนผู้ใช้" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="กรอกจำนวนผู้ใช้"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="remark" label="หมายเหตุ">
                <TextArea placeholder="กรอกหมายเหตุ" rows={2} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item
                name="carBookStartDate"
                label="วันที่เริ่มการจอง"
                rules={[
                  { required: true, message: "กรุณาเลือกวันที่เริ่มจอง!" },
                ]}
              >
                <DatePicker
                  format="DD-MM-YYYY"
                  placeholder="กรอกวันที่เริ่มการจอง"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="carBookStartDate"
                label="เวลาเริ่มการจอง"
                rules={[{ required: true, message: "กรุณาเลือกเวลาเริ่มจอง!" }]}
              >
                <TimePicker
                  format="HH:mm"
                  placeholder="กรอกเวลาเริ่มการจอง"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="carBookEndDate"
                label="วันที่สิ้นสุดการจอง"
                rules={[
                  { required: true, message: "กรุณาเลือกวันที่สิ้นสุดการจอง!" },
                ]}
              >
                <DatePicker
                  format="DD-MM-YYYY"
                  placeholder="กรอกวันที่สิ้นสุดการจอง"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="carBookEndDate"
                label="เวลาสิ้นสุดการจอง"
                rules={[
                  { required: true, message: "กรุณาเลือกเวลาสิ้นสุดการจอง!" },
                ]}
              >
                <TimePicker
                  format="HH:mm"
                  placeholder="กรอกเวลาสิ้นสุดการจอง"
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

      <Row gutter={[18, 18]}>
        <Col md={18}>
          <ShareMaCarBook data={maCarBookData} />
        </Col>
        <Col
          md={6}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Button type="primary" onClick={handleReturnCar}>
            คืนรถ
          </Button>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={maCarBookData}
        rowKey="id"
        onChange={changePagination}
        pagination={pagination}
        loading={loading}
        style={{ marginTop: "15px" }}
      />
    </>
  );
};

export default MaCarBookTable;
