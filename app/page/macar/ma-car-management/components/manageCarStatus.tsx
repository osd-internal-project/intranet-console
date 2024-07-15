import React, { useState, useEffect } from "react";
import {
  Select,
  Table,
  Space,
  Button,
  Row,
  Col,
  Modal,
  Form,
  Input,
  Divider,
  Tag,
  message,
  Popconfirm,
  InputNumber,
} from "antd";
import type { TableProps, FormProps } from "antd";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManageCarServices } from "../services/manage-car.service";
import { useForm } from "antd/es/form/Form";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";

interface MaCarType {
  id: number;
  carId: string;
  carName: string;
  carPetrol: string;
  carMile: number;
  detail: string;
  status: boolean;
  createdAt: Date;
  createdById?: string;
  createdByName?: string;
  updatedAt?: Date;
  updatedById?: string;
  updatedByName?: string;
}

const ManageCarStatus = () => {
  const intraAuth = useAxiosIntranet();
  const [form] = useForm();
  const manageCarServices = ManageCarServices(intraAuth);
  const [maData, setMaData] = useState<MaCarType[]>([]);
  const [currentMaId, setCurrentMaId] = useState<string | null>(null);
  const [modalEditMaCar, setModalEditMaCar] = useState(false);
  const [modalCreateMaCar, setModalCreateMaCar] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const { data: session } = useSession();

  const columns: TableProps<MaCarType>["columns"] = [
    {
      title: "ลำดับ",
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (_, __, index) => <>{index + 1}</>,
    },
    {
      title: "ชื่อรถ",
      dataIndex: "carName",
      key: "carName",
      align: "center",
    },
    {
      title: "ระดับน้ำมัน",
      dataIndex: "carPetrol",
      key: "carPetrol",
      align: "center",
      render: (carPetrol: string) => {
        if (carPetrol === "high") {
          return <Tag color="green">มาก</Tag>;
        } else if (carPetrol === "medium") {
          return <Tag color="orange">ปานกลาง</Tag>;
        } else if (carPetrol === "low") {
          return <Tag color="red">น้อย</Tag>;
        }
      },
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
      width: "100px",
      align: "center",
    },
    {
      // title: "รายละเอียด",
      title: <div style={{ textAlign: "center" }}>รายละเอียด</div>,
      dataIndex: "detail",
      key: "detail",
      align: "center",
    },
    {
      title: "จัดการ",
      dataIndex: "manage",
      key: "manage",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => showModalEditMaCar(record)}>แก้ไข</a>
          <Popconfirm
            title="คุณแน่ใจหรือไม่ว่าต้องการลบการจองนี้?"
            onConfirm={() => handleDeleteCarStatus(record.carId)}
            okText="ใช่"
            cancelText="ไม่"
          >
            <a>ลบ</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleEditMaCarCancel = () => {
    setModalEditMaCar(false);
    form.resetFields();
  };

  const showModalEditMaCar = (record: MaCarType) => {
    setCurrentMaId(record.carId);

    form.setFieldsValue(record);
    setModalEditMaCar(true);
  };

  const showModalCreateMaCar = () => {
    setModalCreateMaCar(true);
    form.resetFields();
  };
  const handleCancelCreateMaCar = () => {
    form.resetFields();
    setModalCreateMaCar(false);
  };

  const createMaCar: FormProps<MaCarType>["onFinish"] = async (values) => {
    setSubmitLoading(true);
    const carName = values.carName as string;

    const maCarCreateData = {
      // id: id
      carId: values.carId,
      carName: carName,
      carPetrol: values.carPetrol,
      carMile: values.carMile,
      detail: values.detail || "",
      status: values.status,
      createdById: session?.user.userId,
      createdByName: `${session?.user.firstNameTh} ${session?.user.lastNameTh}`,
    };
    try {
      const response = await manageCarServices.createMaCar(maCarCreateData);
      if (response) {
        message.success("เพิ่มรถสำเร็จ");
        form.resetFields();
        // setIsModalBooking(false);
      } else {
        message.error("เพิ่มรถไม่สำเร็จ");
      }

      setSubmitLoading(false);
      fetchData();
    } catch (error) {
      message.error("เพิ่มรถไม่สำเร็จ");
      setSubmitLoading(false);
    }
    setModalCreateMaCar(false);
  };

  const onFinishFailed: FormProps<MaCarType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  const handleDeleteCarStatus = async (carId: string) => {
    setSubmitLoading(true);
    try {
      await manageCarServices.deleteMaCar(carId);
      setMaData(maData.filter((item) => item.carId !== carId));
      message.success("ลบการจองสำเร็จ");
    } catch (error) {
      message.error("ลบการจองไม่สำเร็จ");
    }
  };

  const updatedCar: FormProps<MaCarType>["onFinish"] = async (values) => {
    setSubmitLoading(true);
    console.log(values);

    try {
      const { ...restValues } = values;
      const updatedMaCar = {
        ...restValues,
        carId: currentMaId,
        updatedAt: dayjs().toISOString(),
        updatedById: session?.user.userId,
        updatedByName: `${session?.user.firstNameTh} ${session?.user.lastNameTh}`,
      };
      await manageCarServices.updateMaCar(updatedMaCar);
      message.success("แก้ไขข้อมูลห้องสำเร็จ");

      fetchData();
      handleEditMaCarCancel();
      setSubmitLoading(false);
    } catch (error) {
      message.error("แก้ไขข้อมูลห้องไม่สำเร็จ");
    }
  };

  const fetchData = async () => {
    try {
      const maresponse = await manageCarServices.getMaCarQuery();
      const MaCar: MaCarType[] = maresponse.map((item: any, index: number) => ({
        ...item,

        key: index.toString(),
      }));
      setMaData(MaCar);
    } catch (error) {
      message.error("Failed to fetch car data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Modal
        title="แก้ไขรถ"
        open={modalEditMaCar}
        onCancel={handleEditMaCarCancel}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          name="edit_macar"
          initialValues={{ remember: true }}
          onFinish={updatedCar}
          autoComplete="off"
        >
          <Divider orientation="left">แก้ไขรถ</Divider>
          <Form.Item
            label="ชื่อรถ"
            name="carName"
            rules={[{ required: true, message: "กรุณากรอกชื่อรถ!" }]}
          >
            <Input placeholder="กรอกชื่อรถ" />
          </Form.Item>

          <Form.Item
            label="ระดับของน้ำมัน"
            name="carPetrol"
            rules={[{ required: true, message: "กรุณาเลือกระดับน้ำมัน!" }]}
          >
            <Select placeholder="เลือกระดับน้ำมัน">
              <Select.Option value="high">มาก</Select.Option>
              <Select.Option value="medium">ปานกลาง</Select.Option>
              <Select.Option value="low">น้อย</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="สถานะของรถ"
            name="status"
            rules={[{ required: true, message: "กรุณาเลือกสถานะรถ!" }]}
          >
            <Select placeholder="เลือกสถานะรถ">
              <Select.Option value={true}>ใช้งานได้ปกติ</Select.Option>
              <Select.Option value={false}>ไม่สามารถใช้งานได้</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="เลขไมค์รถ"
            name="carMile"
            rules={[{ required: true, message: "กรุณากรอกเลขไมค์รถ!" }]}
          >
            <InputNumber placeholder="เลขไมค์รถ" />
          </Form.Item>
          <Form.Item
            label="รายละเอียดรถ"
            name="detail"
            rules={[{ required: true, message: "กรุณากรอกรายละเอียดรถ!" }]}
          >
            <Input placeholder="กรอกรายละเอียดรถ" />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Row justify="end">
              <Button
                type="default"
                onClick={handleEditMaCarCancel}
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
      <Table columns={columns} dataSource={maData} />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginRight: "50px",
          marginTop: "10px",
        }}
      >
        <Button
          type="primary"
          onClick={showModalCreateMaCar}
          style={{ width: "120px" }}
        >
          เพิ่มรถ
        </Button>
      </div>

      <Modal
        title="เพิ่มรถ"
        visible={modalCreateMaCar}
        onCancel={handleCancelCreateMaCar}
        footer={null}
        width={1000}
      >
        <Form
          form={form}
          layout="vertical"
          name="create"
          labelCol={{ span: 16 }}
          wrapperCol={{ span: 120 }}
          initialValues={{ remember: true }}
          onFinish={createMaCar}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="ชื่อรถ"
                name="carName"
                rules={[{ required: true, message: "กรุณากรอกชื่อรถ!" }]}
              >
                <Input placeholder="กรอกชื่อรถ" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<MaCarType>
                label="ระดับของน้ำมัน"
                name="carPetrol"
                rules={[{ required: true, message: "กรุณาเลือกระดับน้ำมัน!" }]}
              >
                <Select placeholder="เลือกระดับน้ำมัน">
                  <Select.Option value="high">มาก</Select.Option>
                  <Select.Option value="medium">ปานกลาง</Select.Option>
                  <Select.Option value="low">น้อย</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="สถานะ"
                name="status"
                rules={[{ required: true, message: "กรุณาเลือกระสถานะรถ!" }]}
              >
                <Select placeholder="เลือกสถานะรถ">
                  <Select.Option value={true}>ใช้งานได้ปกติ</Select.Option>
                  <Select.Option value={false}>
                    ไม่สามารถใช้งานได้
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="เลขไมล์รถ"
                name="carMile"
                rules={[{ required: true, message: "กรุณากรอกเลขไมล์รถ!" }]}
              >
                <InputNumber placeholder="กรอกเลขไมล์รถ" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="รายละเอียด" name="detail">
                <Input.TextArea rows={4} placeholder="รายละเอียด" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Row justify="end">
              <Button
                type="default"
                onClick={handleCancelCreateMaCar}
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
    </>
  );
};

export default ManageCarStatus;
