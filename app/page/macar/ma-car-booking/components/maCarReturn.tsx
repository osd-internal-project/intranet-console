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
  DatePicker,
} from "antd";
import type { TableProps, FormProps } from "antd";
import dayjs from "dayjs";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { MaCarBookServices } from "../services/ma-car-book.service";
import { useForm } from "antd/es/form/Form";
import { useSession } from "next-auth/react";

interface MaCarType {
  id: string;
  carId: string;
  carName: string;
  carPetrol: string;
  detail: string;
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
  carBookApprovedStatus: string;
}
const MaCarReturn = () => {
  const intraAuth = useAxiosIntranet();
  const [formBookData] = Form.useForm();
  const { data: session } = useSession();
  const [modalEditReturn, setModalEditReturn] = useState(false);
  const [modalEditDetail, setModalEditDetail] = useState(false);
  const maCarBookServices = MaCarBookServices(intraAuth);
  const [maData, setMaData] = useState<MaCarType[]>([]);

  const columns: TableProps<MaCarType>["columns"] = [
    {
      title: "ลำดับ",
      dataIndex: "id",
      key: "id",
      width: "50px",
      align: "center",
      render: (_, __, index) => <>{index + 1}</>,
    },

    {
      title: "ชื่อรถ",
      dataIndex: "carName",
      key: "carName",
      width: "150px",
      align: "center",
    },
    {
      title: "ไอดี",
      dataIndex: "id",
      key: "id",
      width: "50px",
      align: "center",
    },
    {
      title: "ชื่อ-นามสกุล",
      dataIndex: "createdByName",
      key: "createdByName",
      width: "150px",
      align: "center",
    },
    {
      title: "วันที่ใช้งาน",
      dataIndex: "carBookStartDate",
      key: "carBookStartDate",
      width: "150px",
      align: "center",
      render: (_, record) => (
        <span>
          {dayjs(record.carBookStartDate).format("YYYY-MM-DD")} ถึง{" "}
          {dayjs(record.carBookEndDate).format("YYYY-MM-DD")}
        </span>
      ),
    },
    {
      title: "ผู้อนุมัติ",
      dataIndex: "carBookApprovedByName",
      key: "carBookApprovedByName",
      width: "100px",
      align: "center",
    },
    {
      title: "สถานะการคืนรถ",
      dataIndex: "carBookApprovedStatus",
      key: "carBookApprovedStatus",
      width: "100px",
      align: "center",
      render: (status: string) => {
        let color = "";
        let text = "";
        switch (status) {
          case "process":
            color = "blue";
            text = "กำลังจองรถ";
            break;
          case "Approve":
            color = "green";
            text = "อนุมัติให้ใช้รถ";
            break;
          case "Cancel":
            color = "red";
            text = "ไม่อนุมัติให้ใช้รถ";
            break;
          case "Return":
            color = "orange";
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
      title: "รายละเอียด",
      width: "150px",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => showModalDetail(record)} style={{ color: "bule" }}>
            รายละเอียดการจองรถ
          </a>
        </Space>
      ),
    },
    {
      title: "จัดการ",
      width: "110px",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          {record.carBookApprovedStatus === "Approve" ? (
            <a onClick={() => showModalReturn(record)}>คืนรถ</a>
          ) : record.carBookApprovedStatus === "Return" ? (
            <span style={{ color: "grey" }}>คืนรถสำเร็จ</span>
          ) : record.carBookApprovedStatus === "process" ? (
            <span style={{ color: "grey" }}>ไม่สามารถคืนรถได้</span>
          ) : (
            <span style={{ color: "grey" }}>ไม่สามารถคืนรถได้</span>
          )}
        </Space>
      ),
    },
  ];

  const showModalReturn = (record: MaCarType) => {
    formBookData.setFieldsValue({
      ...record,

      carBookStartDate: dayjs(record.carBookStartDate),
      carBookEndDate: dayjs(record.carBookEndDate),
    });
    setModalEditReturn(true);
  };
  const handleModalReturn = () => {
    setModalEditReturn(false);
  };

  const showModalDetail = (record: MaCarType) => {
    setModalEditDetail(true);
    formBookData.setFieldsValue({
      ...record,

      carBookStartDate: dayjs(record.carBookStartDate),
      carBookEndDate: dayjs(record.carBookEndDate),
    });
  };
  const handleModalDetail = () => {
    setModalEditDetail(false);
  };

  const fetchData = async () => {
    try {
      const userIdData = session?.user.userId;

      console.log(userIdData);

      const maresponse = await maCarBookServices.getMaCarBookQuery(userIdData);
      console.log(maresponse);

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
        title="การคืนรถ"
        open={modalEditReturn}
        onCancel={handleModalReturn}
        footer={null}
        width={1000}
      >
        <Form
          form={formBookData}
          layout="vertical"
          name="edit_ma"
          initialValues={{ remember: true }}
          // onFinish={updatedMaCarBook}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Divider orientation="left">ข้อมูลการคืนรถ</Divider>

          <Divider orientation="left">ข้อมูลผู้จอง</Divider>
          <Row gutter={8}>
            <Col span={6}>
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
            <Col span={6}>
              <Form.Item<MaCarType>
                name="carName"
                label="ชื่อรถ"
                rules={[{ required: true, message: "กรุณาเลือกรถ" }]}
              >
                <Input disabled placeholder="กรุณาเลือกรถ" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item<MaCarType>
                name="carBookTitle"
                label="วัตถุประสงค์การใช้งาน"
                rules={[
                  { required: true, message: "กรุณากรอกวัตถุประสงค์การใช้งาน" },
                ]}
              >
                <Input disabled placeholder="กรอกวัตถุประสงค์การใช้งาน" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item<MaCarType>
                name="carBookPlace"
                label="สถานที่ไป"
                rules={[{ required: true, message: "กรุณากรอกสถานที่ไป" }]}
              >
                <Input disabled placeholder="กรอกสถานที่ไป" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item<MaCarType>
                name="carBookProvince"
                label="จังหวัด"
                rules={[{ required: true, message: "กรุณากรอกจังหวัด" }]}
              >
                <Input disabled placeholder="กรอกจังหวัด" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item<MaCarType>
                name="carBookUsers"
                label="จำนวนผู้ใช้"
                rules={[{ required: true, message: "กรุณากรอกจำนวนผู้ใช้" }]}
              >
                <Input disabled placeholder="กรอกจำนวนผู้ใช้" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item<MaCarType>
                name="carBookStartDate"
                label="วันที่เริ่มการจอง"
                rules={[
                  { required: true, message: "กรุณาเลือกวันที่เริ่มจอง!" },
                ]}
              >
                <DatePicker
                  disabled
                  placeholder="กรอกวันที่เริ่มการจอง"
                  showTime
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="carBookEndDate"
                label="วันที่สิ้นสุดการจอง"
                rules={[{ required: true, message: "กรุณาเลือกวันที่สิ้นสุด" }]}
              >
                <DatePicker
                  disabled
                  placeholder="กรอกวันที่สิ้นสุดการจอง"
                  showTime
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Row justify="end" gutter={16}>
              <Button
                type="default"
                onClick={handleModalReturn}
                style={{ marginRight: "16px" }}
              >
                ยกเลิก
              </Button>
              {/* <Button type="primary" htmlType="submit" loading={submitLoading}> */}
              <Button type="primary" htmlType="submit">
                ตกลง
              </Button>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="รายละเอียดการจองรถ"
        open={modalEditDetail}
        onCancel={handleModalDetail}
        footer={null}
        width={800}
      >
        <Form
          form={formBookData}
          layout="vertical"
          name="edit_ma"
          initialValues={{ remember: true }}
          autoComplete="off"
        >
          <Divider orientation="left">ข้อมูลผู้จอง</Divider>
          <Row gutter={8}>
            <Col span={6}>
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
            <Col span={6}>
              <Form.Item<MaCarType>
                name="carName"
                label="ชื่อรถ"
                rules={[{ required: true, message: "กรุณาเลือกรถ" }]}
              >
                <Input disabled placeholder="กรุณาเลือกรถ" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item<MaCarType>
                name="carBookTitle"
                label="วัตถุประสงค์การใช้งาน"
                rules={[
                  { required: true, message: "กรุณากรอกวัตถุประสงค์การใช้งาน" },
                ]}
              >
                <Input disabled placeholder="กรอกวัตถุประสงค์การใช้งาน" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item<MaCarType>
                name="carBookPlace"
                label="สถานที่ไป"
                rules={[{ required: true, message: "กรุณากรอกสถานที่ไป" }]}
              >
                <Input disabled placeholder="กรอกสถานที่ไป" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item<MaCarType>
                name="carBookProvince"
                label="จังหวัด"
                rules={[{ required: true, message: "กรุณากรอกจังหวัด" }]}
              >
                <Input disabled placeholder="กรอกจังหวัด" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item<MaCarType>
                name="carBookUsers"
                label="จำนวนผู้ใช้"
                rules={[{ required: true, message: "กรุณากรอกจำนวนผู้ใช้" }]}
              >
                <Input disabled placeholder="กรอกจำนวนผู้ใช้" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item<MaCarType>
                name="carBookStartDate"
                label="วันที่เริ่มการจอง"
                rules={[
                  { required: true, message: "กรุณาเลือกวันที่เริ่มจอง!" },
                ]}
              >
                <DatePicker
                  disabled
                  placeholder="กรอกวันที่เริ่มการจอง"
                  showTime
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="carBookEndDate"
                label="วันที่สิ้นสุดการจอง"
                rules={[{ required: true, message: "กรุณาเลือกวันที่สิ้นสุด" }]}
              >
                <DatePicker
                  disabled
                  placeholder="กรอกวันที่สิ้นสุดการจอง"
                  showTime
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Table columns={columns} dataSource={maData} />
    </>
  );
};

export default MaCarReturn;
