import React, { useState } from "react";
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
  Tag,
  message,
  Popconfirm,
  InputNumber,
  Tooltip,
} from "antd";
import { DeleteIcon, EditIcon } from "@/components/icon";
import type { TableProps, FormProps } from "antd";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManageCarServices } from "../services/manage-car.service";
import { useForm } from "antd/es/form/Form";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import { MaCarType } from "../../common/index";
import { TablePaginationConfig } from "antd";

export interface props {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  maCarData: any[];
  pagination: TablePaginationConfig;
  changePagination: (pagination: TablePaginationConfig) => void;
}

const ManageCarStatus: React.FC<props> = ({
  setLoading,
  loading,
  maCarData,
  pagination,
  changePagination,
}: any): React.ReactElement => {
  const intraAuth = useAxiosIntranet();
  const [form] = useForm();
  const manageCarServices = ManageCarServices(intraAuth);
  const [maData, setMaData] = useState<MaCarType[]>([]);
  const [currentMaId, setCurrentMaId] = useState<string | null>(null);
  const [modalEditMaCar, setModalEditMaCar] = useState(false);
  const [modalCreateMaCar, setModalCreateMaCar] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(true);
  const { data: session } = useSession();

  const columns: TableProps<MaCarType>["columns"] = [
    {
      title: "ลำดับ",
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (_: any, __: any, index: number) =>
        pagination.current && pagination.pageSize
          ? (pagination.current - 1) * pagination.pageSize + (index + 1)
          : "",
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
      title: <div style={{ textAlign: "center" }}>รายละเอียด</div>,
      dataIndex: "detail",
      key: "detail",
    },
    {
      title: "จัดการ",
      align: "center",
      render: (_, record) => (
        <Space>
          <Tooltip title="แก้ไข">
            <Button
              type="link"
              onClick={() => showModalEditMaCar(record)}
              role="button"
              aria-label="Edit"
              style={{ cursor: "pointer" }}
            >
              {EditIcon}
            </Button>
          </Tooltip>
          <Popconfirm
            title="คุณแน่ใจหรือไม่ว่าต้องการลบรถคันนี้?"
            onConfirm={() => handleDeleteCarStatus(record.carId)}
            okText="ใช่"
            cancelText="ไม่"
          >
            <Tooltip title="ลบ">
              <Button type="link">
                {" "}
                <DeleteIcon />{" "}
              </Button>
            </Tooltip>
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
    setSubmitLoading(false);
    form.setFieldsValue(record);
    setModalEditMaCar(true);
  };

  const showModalCreateMaCar = () => {
    setModalCreateMaCar(true);
    setSubmitLoading(false);
    form.resetFields();
  };

  const handleCancelCreateMaCar = () => {
    form.resetFields();
    setModalCreateMaCar(false);
    setSubmitLoading(true);
  };

  const createMaCar: FormProps<MaCarType>["onFinish"] = async (values) => {
    console.log(values);

    setSubmitLoading(true);
    const carName = values.carName as string;

    const maCarCreateData = {
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
      } else {
        message.error("เพิ่มรถไม่สำเร็จ");
      }
    } catch (error) {
      message.error("เพิ่มรถไม่สำเร็จ");
      setSubmitLoading(false);
    }
    setModalCreateMaCar(false);
    setLoading(true);
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
      message.success("ลบรถสำเร็จ");
    } catch (error) {
      message.error("ลบรถไม่สำเร็จ");
      setSubmitLoading(false);
    }
    setLoading(true);
  };

  const updatedCar: FormProps<MaCarType>["onFinish"] = async (values) => {
    setSubmitLoading(true);

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

      message.success("แก้ไขข้อมูลรถสำเร็จ");

      handleEditMaCarCancel();
      setSubmitLoading(false);
    } catch (error) {
      message.error("แก้ไขข้อมูลรถไม่สำเร็จ");
    }
    setLoading(true);
  };

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
          onFinish={updatedCar}
          autoComplete="off"
          layout="vertical"
          size="small"
        >
          <Form.Item
            label="ชื่อรถ"
            name="carName"
            rules={[{ required: true, message: "กรุณากรอกชื่อรถ!" }]}
          >
            <Input placeholder="กรอกชื่อรถ" />
          </Form.Item>

          <Form.Item
            label="ระดับน้ำมันรถ"
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
            <InputNumber
              placeholder="กรอกเลขไมล์รถ"
              onKeyDown={(event) => {
                if (!/[0-9]/.test(event.key) && event.key !== "Backspace") {
                  event.preventDefault();
                }
              }}
            />
          </Form.Item>
          <Form.Item
            label="รายละเอียดรถ"
            name="detail"
            rules={[{ required: true, message: "กรุณากรอกรายละเอียดรถ!" }]}
          >
            <Input.TextArea rows={2} placeholder="กรอกรายละเอียดรถ" />
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

      <Modal
        title="เพิ่มรถ"
        open={modalCreateMaCar}
        onCancel={handleCancelCreateMaCar}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          name="create"
          onFinish={createMaCar}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          size="small"
        >
          <Col span={24}>
            <Form.Item
              label="ชื่อรถ"
              name="carName"
              rules={[{ required: true, message: "กรุณากรอกชื่อรถ!" }]}
            >
              <Input placeholder="กรอกชื่อรถ" />
            </Form.Item>
          </Col>
          <Col span={24}>
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
          <Col span={24}>
            <Form.Item
              label="สถานะ"
              name="status"
              rules={[{ required: true, message: "กรุณาเลือกระสถานะรถ!" }]}
            >
              <Select placeholder="เลือกสถานะรถ">
                <Select.Option value={true}>ใช้งานได้ปกติ</Select.Option>
                <Select.Option value={false}>ไม่สามารถใช้งานได้</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="เลขไมล์รถ"
              name="carMile"
              rules={[{ required: true, message: "กรุณากรอกเลขไมล์รถ!" }]}
            >
              <InputNumber
                placeholder="กรอกเลขไมล์รถ"
                onKeyDown={(event) => {
                  if (!/[0-9]/.test(event.key) && event.key !== "Backspace") {
                    event.preventDefault();
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="รายละเอียด"
              name="detail"
              rules={[{ required: true, message: "กรุณากรอกรายละเอียดรถ!" }]}
            >
              <Input.TextArea rows={4} placeholder="รายละเอียด" />
            </Form.Item>
          </Col>

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

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginRight: "50px",
          marginTop: "10px",
          marginBottom: "20px",
        }}
      >
        <Button
          type="primary"
          onClick={showModalCreateMaCar}
          style={{
            float: "right",
            margin: "5px",
            padding: " 15px 20px 15px 20px",
            fontSize: "16px",
          }}
        >
          เพิ่มรถ
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={maCarData}
        loading={loading}
        pagination={pagination}
        onChange={changePagination}
        size="small"
      />
    </>
  );
};

export default ManageCarStatus;
