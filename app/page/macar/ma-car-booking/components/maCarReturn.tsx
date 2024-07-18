import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Row,
  Col,
  Space,
  Select,
  Modal,
  Form,
  Input,
  Divider,
  message,
  DatePicker,
  InputNumber,
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
  status: boolean;
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
  //
  carMile: number;
}

interface MaCarWrapupType {
  id: number;
  carWrapupId: string; // รหัส Wrapup ของรถ
  carId: string; // รหัสของรถที่เชื่อมโยงกับ Wrapup
  carName: string; // ชื่อของรถ
  typeId: number; // รหัสประเภทของรถ
  typeName: string; // ชื่อประเภทของรถ
  vender: string; // ยี่ห้อของรถ
  cost: number; // ราคาของรถ (ใช้ number ใน TypeScript)
  detail: string; // รายละเอียดเพิ่มเติมเกี่ยวกับ Wrapup ของรถ
  wrapupMiles: string; // จำนวนไมล์ที่รถเคยใช้ในช่วงเวลา Wrapup
  dateStart: Date; // วันที่เริ่มต้นของช่วง Wrapup (ใช้ Date ใน TypeScript)
  dateEnd: Date; // วันที่สิ้นสุดของช่วง Wrapup (ใช้ Date ใน TypeScript)
  remark: string; // ข้อความหมายเหตุเพิ่มเติมเกี่ยวกับ Wrapup ของรถ
  createdAt: Date; // วันที่และเวลาที่เริ่มต้นของการสร้างข้อมูล Wrapup
  updatedAt?: Date; // วันที่และเวลาที่ปรับปรุงข้อมูล Wrapup ล่าสุด (ใช้ Date | undefined ใน TypeScript)
  carBookApprovedStatus: string; // สถานะการอนุมัติของการจองรถ
}

const MaCarReturn = () => {
  const intraAuth = useAxiosIntranet();
  const [formBookData] = Form.useForm();
  const [formWrapup] = Form.useForm();
  const { data: session } = useSession();
  const [currentMaId, setCurrentMaId] = useState<string | null>(null);
  const [currentMaBookId, setCurrentMaBookId] = useState<number | null>(null);
  const [modalEditReturn, setModalEditReturn] = useState(false);
  const [modalEditDetail, setModalEditDetail] = useState(false);
  const maCarBookServices = MaCarBookServices(intraAuth);
  const [maCarData, setMaCarData] = useState<[]>([]);
  const [maData, setMaData] = useState<MaCarType[]>([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [maCarWrapupData, setMaCarWrapupData] = useState<MaCarWrapupType[]>([]);

  console.log(maCarWrapupData);
  console.log(maCarData);

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
      render: (_: any, record: MaCarType) => (
        <Space size="middle">
          <a onClick={() => showModalDetail(record)}>รายละเอียดการจองรถ</a>
        </Space>
      ),
    },
    {
      title: "จัดการ",
      width: "110px",
      align: "center",
      render: (_: any, record: any) => (
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

  const showModalReturn = (record: MaCarWrapupType) => {
    console.log(record);
    setCurrentMaId(record.carId);
    setCurrentMaBookId(record.id);
    formWrapup.setFieldsValue({
      ...record,
      carBookStartDate: dayjs(record.dateStart),
      carBookEndDate: dayjs(record.dateEnd),
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

  const updatedMaCarReturn: FormProps<MaCarType>["onFinish"] = async (
    values
  ) => {
    setSubmitLoading(true);
    console.log(values);
    if (currentMaId && currentMaBookId) {
      try {
        const { ...restValues } = values;
        const updatedMaCar = {
          ...restValues,

          carMile: values.carMile,
          carPetrol: values.carPetrol,
          status: values.status === true,
          updatedAt: dayjs().toISOString(),
          updatedById: session?.user.userId,
          updatedByName: `${session?.user.firstNameTh} ${session?.user.lastNameTh}`,
          // carBookApprovedStatus: "Return",
        };
        const maCarBook = {
          carBookApprovedStatus: "Return",
        };

        await maCarBookServices.updateMaCar(currentMaId, updatedMaCar);
        message.success("คืนรถสำเร็จ");

        await maCarBookServices.updateMaCarBook(currentMaBookId, maCarBook);

        fetchData();
        handleModalReturn();
        setSubmitLoading(false);
        formWrapup.resetFields();
      } catch (error) {
        message.error("คืนรถไม่สำเร็จ");
        setSubmitLoading(false);
      }
    }
    setModalEditReturn(false);
  };

  const fetchData = async () => {
    try {
      const userIdData = session?.user.userId;

      console.log(userIdData);

      const maresponse = await maCarBookServices.getMaCarBookQuery(userIdData);
      console.log(maresponse);

      const maCarWrapupData = await maCarBookServices.getMaCarWrapupQuery();
      setMaCarWrapupData(maCarWrapupData);
      console.log(maCarWrapupData);

      const maCarData = await maCarBookServices.getMaCarQuery();
      setMaCarData(maCarData);

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
          form={formWrapup}
          layout="vertical"
          name="edit_ma"
          initialValues={{ remember: true }}
          onFinish={updatedMaCarReturn}
          // onFinishFailed={onFinishFailedReturn}
          autoComplete="off"
        >
          <Divider orientation="left">ข้อมูลการคืนรถ</Divider>
          <Row gutter={8}>
            <Col span={6}>
              <Form.Item<MaCarType>
                name="carName"
                label="ชื่อรถ"
                rules={[{ required: true, message: "กรุณากรอกชื่อรถ" }]}
              >
                <Input disabled placeholder="กรอกชื่อรถ" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item<MaCarType>
                name="carMile"
                label="เลขไมล์รถ"
                rules={[{ required: true, message: "กรุณากรอกเลขไมล์รถ" }]}
              >
                <InputNumber placeholder="กรอกเลขไมล์รถ" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item<MaCarType>
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
            </Col>
            <Col span={6}>
              <Form.Item
                label="สถานะของรถ"
                name="status"
                rules={[{ required: true, message: "กรุณาเลือกสถานะรถ!" }]}
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

          {/* <Divider orientation="left">ข้อมูลผู้จอง</Divider>
          <Row gutter={8}>
            <Col span={6}>
              <Form.Item<MaCarWrapupType>
                name="typeName"
                label="ชื่อประเภทของรถ"
                rules={[
                  { required: true, message: "กรุณากรอกชื่อประเภทของรถ" },
                ]}
              >
                <Input disabled placeholder="กรอกชื่อประเภทของรถ" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">ข้อมูลการจองรถ</Divider>

          <Row gutter={16}>
            <Col span={6}>
              <Form.Item<MaCarWrapupType>
                name="carName"
                label="ชื่อรถ"
                rules={[{ required: true, message: "กรุณาเลือกรถ" }]}
              >
                <Input disabled placeholder="กรุณาเลือกรถ" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item<MaCarWrapupType>
                name="vender"
                label="ยี่ห้อของรถ"
                rules={[{ required: true, message: "กรุณากรอกยี่ห้อของรถ" }]}
              >
                <Input disabled placeholder="กรอกวัตถุประสงค์การใช้งาน" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item<MaCarWrapupType>
                name="detail"
                label="รายละเอียด"
                rules={[{ required: true, message: "กรุณากรอกรายละเอียด" }]}
              >
                <Input disabled placeholder="กรอกรายละเอียด" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item<MaCarWrapupType>
                name="wrapupMiles"
                label="จำนวนไมล์ที่ใช้"
                rules={[
                  { required: true, message: "กรุณากรอกจำนวนไมล์ที่ใช้" },
                ]}
              >
                <Input disabled placeholder="กรอกจำนวนไมล์ที่ใช้" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item<MaCarWrapupType>
                name="remark"
                label="จำนวนผู้ใช้"
                rules={[{ required: true, message: "กรุณากรอกจำนวนผู้ใช้" }]}
              >
                <Input disabled placeholder="กรอกจำนวนผู้ใช้" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item<MaCarWrapupType>
                name="wrapupMiles"
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
                name="endDate"
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
          </Row> */}
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Row justify="end" gutter={16}>
              <Button
                type="default"
                onClick={handleModalReturn}
                style={{ marginRight: "16px" }}
              >
                ยกเลิก
              </Button>
              <Button type="primary" htmlType="submit" loading={submitLoading}>
                {/* <Button type="primary" htmlType="submit"> */}
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
