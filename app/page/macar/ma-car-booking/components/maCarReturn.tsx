import React, { useState } from "react";
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
import { useSession } from "next-auth/react";
import { MaCarType, MaCarBookType, MaCarWrapupType } from "../../common/index";
export interface props {
  maCarBookData: any[];
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const MaCarReturn: React.FC<props> = ({
  maCarBookData,
  setLoading,
  loading,
}: any): React.ReactElement => {
  const intraAuth = useAxiosIntranet();
  const [formBookData] = Form.useForm();
  const [formReturn] = Form.useForm();
  const { data: session } = useSession();
  const [currentMaId, setCurrentMaId] = useState<string | null>(null);
  const [currentMaBookId, setCurrentMaBookId] = useState<number | null>(null);
  const [modalEditReturn, setModalEditReturn] = useState(false);
  const [modalEditDetail, setModalEditDetail] = useState(false);
  const maCarBookServices = MaCarBookServices(intraAuth);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [oldCarMile, setOldCarMile] = useState<number>(0);

  const columns: TableProps<MaCarBookType>["columns"] = [
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
      width: "200px",
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
      title: "รายละเอียด",
      width: "150px",
      align: "center",
      render: (_: any, record: MaCarBookType) => (
        <Space size="middle">
          <a onClick={() => showModalDetail(record)}>รายละเอียดการจองรถ</a>
        </Space>
      ),
    },
    {
      title: "จัดการ",
      width: "110px",
      align: "center",
      render: (_: any, record: MaCarBookType) => (
        <Space size="middle">
          {record.carBookApprovedStatus === "Approve" ? (
            <a onClick={() => showModalReturn(record)}>คืนรถ</a>
          ) : // <a onClick={() => showModalReturn(record)}>
          //   <MaCarReturnIcon
          //     style={{ cursor: "pointer" }}
          //     aria-label="Return Car"
          //   />
          // </a>
          record.carBookApprovedStatus === "Return" ? (
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

  const showModalReturn = (record: MaCarBookType) => {
    setModalEditReturn(true);
    setCurrentMaId(record.carId);
    setCurrentMaBookId(record.id);
    formReturn.setFieldsValue({
      carName: record.maCar.carName,
      carMile: record.maCar.carMile,
      carPetrol: record.maCar.carPetrol,
      status: record.maCar.status,
      // typeName: record.maCar.maCarWrapup[0]?.typeName,
      // vender: record.maCar.maCarWrapup[0]?.vender,
      // detail: record.maCar.maCarWrapup[0]?.detail,
      // wrapupMiles: record.maCar.maCarWrapup[0]?.wrapupMiles,
      // dateStart: record.maCar.maCarWrapup[0]?.dateStart
      //   ? dayjs(record.maCar.maCarWrapup[0]?.dateStart)
      //   : null,
    });

    setOldCarMile(record.maCar.carMile);
  };

  const handleModalReturn = () => {
    setModalEditReturn(false);
  };

  const showModalDetail = (record: MaCarBookType) => {
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
        };

        const maCarBook = {
          carBookApprovedStatus: "Return",
        };

        await maCarBookServices.updateMaCar(currentMaId, updatedMaCar);
        message.success("คืนรถสำเร็จ");

        await maCarBookServices.updateMaCarBook(currentMaBookId, maCarBook);
        handleModalReturn();
        setSubmitLoading(false);
        formReturn.resetFields();
      } catch (error) {
        message.error("คืนรถไม่สำเร็จ");
        setSubmitLoading(false);
      }
    }
    setModalEditReturn(false);
    setLoading(true);
  };

  return (
    <>
      <Modal
        title="การคืนรถ"
        open={modalEditReturn}
        onCancel={handleModalReturn}
        footer={null}
        width={500}
      >
        <Form
          form={formReturn}
          layout="vertical"
          name="edit_ma"
          onFinish={updatedMaCarReturn}
          autoComplete="off"
        >
          <Divider orientation="left">ข้อมูลการคืนรถ</Divider>
          {/* <Row gutter={8}> */}
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
            <Form.Item
              name="carMile"
              label="เลขไมล์รถ"
              rules={[
                {
                  validator: (_, value) => {
                    if (value >= oldCarMile) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("กรุณากรอกเลขไมล์รถ"));
                  },
                },
              ]}
            >
              <InputNumber
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
              <Select placeholder="เลือกระดับน้ำมัน">
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
              <Select placeholder="เลือกสถานะรถ">
                <Select.Option value={true}>ใช้งานได้ปกติ</Select.Option>
                <Select.Option value={false}>ไม่สามารถใช้งานได้</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          {/* </Row> */}

          {/* <Divider orientation="left">ข้อมูลการตรวจสภาพรถ</Divider>
          <Row gutter={8}>
            <Col span={6}>
              <Form.Item name="typeName" label="ชื่อประเภทของรถ">
                <Input disabled placeholder="กรอกชื่อประเภทของรถ" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="dateStart" label="วันที่ตรวจสภาพรถ">
                <DatePicker
                  disabled
                  placeholder="กรอกวันที่ตรวจสภาพรถ"
                  showTime
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="vender" label="ผู้จำหน่ายรถ">
                <Input disabled placeholder="กรอกวัตถุประสงค์การใช้งาน" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="wrapupMiles" label="จำนวนไมล์ตรวจสภาพรถ">
                <Input disabled placeholder="กรอกจำนวนไมล์ตรวจสภาพรถ" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="detail" label="รายละเอียด">
                <Input.TextArea
                  rows={2}
                  disabled
                  placeholder="กรอกรายละเอียด"
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
                คืนรถ
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
              <Form.Item<MaCarBookType>
                name="carName"
                label="ชื่อรถ"
                rules={[{ required: true, message: "กรุณาเลือกรถ" }]}
              >
                <Input disabled placeholder="กรุณาเลือกรถ" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item<MaCarBookType>
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
              <Form.Item<MaCarBookType>
                name="carBookPlace"
                label="สถานที่ไป"
                rules={[{ required: true, message: "กรุณากรอกสถานที่ไป" }]}
              >
                <Input disabled placeholder="กรอกสถานที่ไป" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item<MaCarBookType>
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
              <Form.Item<MaCarBookType>
                name="carBookUsers"
                label="จำนวนผู้ใช้"
                rules={[{ required: true, message: "กรุณากรอกจำนวนผู้ใช้" }]}
              >
                <Input disabled placeholder="กรอกจำนวนผู้ใช้" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<MaCarBookType>
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
            <Col span={8}>
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
      <Table columns={columns} dataSource={maCarBookData} loading={loading} />
    </>
  );
};

export default MaCarReturn;
