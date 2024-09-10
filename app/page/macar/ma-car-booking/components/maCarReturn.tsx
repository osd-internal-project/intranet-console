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
  TimePicker,
} from "antd";
import type { TableProps, FormProps } from "antd";
import dayjs from "dayjs";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { MaCarBookServices } from "../services/ma-car-book.service";
import { useSession } from "next-auth/react";
import { MaCarType, MaCarBookType } from "../../common/index";
import TextArea from "antd/es/input/TextArea";
export interface props {
  maCarBookData: MaCarBookType[];
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
  const [statusApprove, setStatusApprove] = useState("");

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
      key: "carBookStartDate",
      title: "วันที่เริ่มจอง",
      width: "200px",
      align: "center",
      render: (_, record) => (
        <span>
          {dayjs(record.carBookStartDate).format("DD-MM-YYYY HH:mm:ss")}
        </span>
      ),
    },
    {
      key: "carBookEndDate",
      title: "วันที่สิ้นสุดการจอง",
      width: "200px",
      align: "center",
      render: (_, record) => (
        <span>
          {dayjs(record.carBookEndDate).format("DD-MM-YYYY HH:mm:ss")}
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
      title: "สถานะการใช้งาน",
      dataIndex: "carBookApprovedStatus",
      key: "carBookApprovedStatus",
      width: "130px",
      align: "center",
      render: (status: string) => {
        let color = "";
        let text = "";
        switch (status) {
          case "Process":
            color = "DodgerBlue";
            text = "กำลังรออนุมัติ";
            break;
          case "Approve":
            color = "LimeGreen";
            text = "อนุมัติแล้ว";
            break;
          case "Cancel":
            color = "silver";
            text = "ยกเลิกการจอง";
            break;
          case "Return":
            color = "Gold";
            text = "แจ้งคืนรถแล้ว";
            break;
          case "Completed":
            color = "MediumPurple";
            text = "คืนรถสำเร็จ";
            break;
          case "DisapProved":
            color = "OrangeRed";
            text = "ไม่อนุมัติ";
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
      width: "120px",
      align: "center",
      render: (_: any, record: MaCarBookType) => {
        return (
          <Space size="middle">
            <a
              onClick={() => {
                showModalDetail(record);
              }}
            >
              รายละเอียด
            </a>
          </Space>
        );
      },
    },
    {
      title: "จัดการ",
      width: "150px",
      align: "center",
      render: (_: any, record: MaCarBookType) => {
        const { carBookApprovedStatus } = record;
        let statusDisplay;
        switch (carBookApprovedStatus) {
          case "Approve":
            statusDisplay = (
              <a onClick={() => showModalReturn(record)}>แจ้งคืนรถ</a>
            );
            break;
          case "Return":
            statusDisplay = (
              <span style={{ color: "grey" }}>แจ้งคืนรถแล้ว</span>
            );
            break;
          case "Completed":
            statusDisplay = <span style={{ color: "grey" }}>คืนรถสำเร็จ</span>;
            break;
          case "Cancel":
            statusDisplay = <span style={{ color: "grey" }}>ยกเลิกการจอง</span>;
            break;
          case "DisapProved":
            statusDisplay = (
              <span style={{ color: "grey" }}>ไม่อนุมัติการจองรถ</span>
            );
            break;
          case "Process":
            statusDisplay = (
              <span style={{ color: "grey" }}>ไม่สามารถแจ้งคืนรถได้</span>
            );
            break;
          default:
            statusDisplay = (
              <span style={{ color: "grey" }}>ไม่สามารถแจ้งคืนรถได้</span>
            );
            break;
        }

        return <Space size="middle">{statusDisplay}</Space>;
      },
    },
  ];

  const showModalReturn = (record: MaCarBookType) => {
    setModalEditReturn(true);
    setCurrentMaId(record.carId);
    setCurrentMaBookId(record.id);
    setOldCarMile(record.maCar.carMile);

    formReturn.setFieldsValue({
      carName: record.maCar.carName,
      carMile: record.maCar.carMile,
      carPetrol: record.maCar.carPetrol,
      status: record.maCar.status,
    });
  };

  const handleModalReturn = () => {
    setModalEditReturn(false);
  };

  const showModalDetail = (record: MaCarBookType) => {
    setModalEditDetail(true);
    setCurrentMaBookId(record.id);
    setStatusApprove(record.carBookApprovedStatus);
    let displayText = "";

    switch (record.carBookApprovedStatus) {
      case "statusApprove":
        displayText = "แจ้งคืนรถ";
        break;
      case "Return":
        displayText = "แจ้งคืนรถแล้ว";
        break;
      case "Completed":
        displayText = "คืนรถสำเร็จ";
        break;
      case "Cancel":
        displayText = "ยกเลิกการจองนี้ไปแล้ว";
        break;
      case "DisapProved":
        displayText = "ไม่อนุมัติการจองรถ";
        break;
      case "Process":
        displayText = "ไม่สามารถแจ้งคืนรถได้";
        break;
      case "Approve":
        displayText = "อนุมัติแล้ว";
        break;
      default:
        displayText = "ไม่สามารถแจ้งคืนรถได้";
        break;
    }

    formBookData.setFieldsValue({
      ...record,
      carBookStartDate: dayjs(record.carBookStartDate),
      carBookEndDate: dayjs(record.carBookEndDate),
      maCarName: record.maCar.carName,
      carName: record.maCar.carName,
      status: record.maCar.status,
      carMile: record.maCar.carMile,
      carPetrol: record.maCar.carPetrol,
      returnNotifAt: dayjs(record.returnNotifAt),
      carBookApprovedStatus: record.carBookApprovedStatus,
      recipientName: record.recipientName,
      returnAt: dayjs(record.returnAt),
      carName1: record.carName,
      statusApprove: displayText,
    });

    // setStatusText(displayText);
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
          returnNotifAt: dayjs().toISOString(),
        };
        await maCarBookServices.updateMaCarBook(currentMaBookId, maCarBook);
        await maCarBookServices.updateMaCar(currentMaId, updatedMaCar);
        message.success("คืนรถสำเร็จ");
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
          onFinish={updatedMaCarReturn}
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
              <Input
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
        title="รายละเอียด"
        open={modalEditDetail}
        onCancel={handleModalDetail}
        footer={null}
        width={800}
      >
        <Form
          form={formBookData}
          layout="vertical"
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
              <Form.Item name="carName1" label="ชื่อรถ">
                <Input disabled placeholder="กรุณาเลือกรถ" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item<MaCarBookType>
                name="carBookTitle"
                label="วัตถุประสงค์การใช้งาน"
              >
                <Input disabled placeholder="กรอกวัตถุประสงค์การใช้งาน" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item<MaCarBookType> name="carBookPlace" label="สถานที่ไป">
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
            <Col span={9}>
              <Form.Item name="detail" label="รายละเอียด">
                <TextArea disabled placeholder="กรอกรายละเอียด" rows={1} />
              </Form.Item>
            </Col>
            <Col span={9}>
              <Form.Item name="remark" label="หมายเหตุ">
                <TextArea disabled rows={1} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item name="carBookStartDate" label="วันที่เริ่มการจอง">
                <DatePicker
                  disabled
                  format="DD-MM-YYYY"
                  placeholder="กรอกวันที่เริ่มการจอง"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="carBookStartDate" label="เวลาเริ่มการจอง">
                <TimePicker
                  disabled
                  format="HH:mm"
                  placeholder="กรอกเวลาเริ่มการจอง"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="carBookEndDate" label="วันที่สิ้นสุดการจอง">
                <DatePicker
                  disabled
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
                  {
                    required: true,
                    message: "กรุณาเลือกเวลาสิ้นสุดการจอง!",
                  },
                ]}
              >
                <TimePicker
                  disabled
                  format="HH:mm"
                  placeholder="กรอกเวลาสิ้นสุดการจอง"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Divider orientation="left">ข้อมูลสถานะการจองรถ</Divider>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item name="statusApprove" label="สถานะการจองรถ">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={9}>
              <Form.Item name="remarkApproved" label="หมายเหตุ">
                <TextArea disabled rows={1} />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">ข้อมูลการคืนรถ</Divider>

          {(statusApprove === "Return" || statusApprove === "Completed") && (
            <>
              <Row gutter={24}>
                <Col span={8}>
                  <Form.Item<MaCarType>
                    name="status"
                    label="สถานนะรถ"
                    rules={[{ required: true, message: "สถานนะรถ" }]}
                  >
                    <Select disabled placeholder="รออนุมัติรับคืนรถ">
                      <Select.Option value={true}>ใช้งานได้ปกติ</Select.Option>
                      <Select.Option value={false}>
                        ไม่สามารถใช้งานได้
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="carMile" label="เลขไมล์รถ">
                    <InputNumber
                      disabled
                      style={{ width: "100%" }}
                      placeholder="รออนุมัติรับคืนรถ"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="carPetrol" label="ระดับนํ้ามันรถ">
                    <Select disabled placeholder="รออนุมัติรับคืนรถ">
                      <Select.Option value="high">มาก</Select.Option>
                      <Select.Option value="medium">ปานกลาง</Select.Option>
                      <Select.Option value="low">น้อย</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={8}>
                  <Form.Item
                    name="returnNotifAt"
                    label="วันที่แจ้งคืน"
                    rules={[
                      { required: true, message: "กรุณาเลือกวันที่เริ่มจอง!" },
                    ]}
                  >
                    <DatePicker
                      disabled
                      format="DD-MM-YYYY"
                      placeholder="รออนุมัติรับคืนรถ"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="returnNotifAt"
                    label="เวลาแจ้งคืน"
                    rules={[
                      { required: true, message: "กรุณาเลือกเวลาเริ่มจอง!" },
                    ]}
                  >
                    <TimePicker
                      disabled
                      format="HH:mm"
                      placeholder="รออนุมัติรับคืนรถ"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="carBookApprovedStatus"
                    label="สถานนะการคืนรถ"
                  >
                    <Select disabled placeholder="รออนุมัติรับคืนรถ">
                      <Select.Option value="Process">
                        กำลังรออนุมัติ
                      </Select.Option>
                      <Select.Option value="Approve">อนุมัติแล้ว</Select.Option>
                      <Select.Option value="Cancel">ยกเลิกการจอง</Select.Option>
                      <Select.Option value="Return">
                        แจ้งคืนรถแล้ว
                      </Select.Option>
                      <Select.Option value="Completed">
                        คืนรถสำเร็จ
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={8}>
                  <Form.Item name="recipientName" label="ผู้รับคืนรถ">
                    <Input disabled placeholder="รออนุมัติรับคืนรถ" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="returnAt"
                    label="วันที่รับคืน"
                    rules={[
                      { required: true, message: "กรุณาเลือกวันที่เริ่มจอง!" },
                    ]}
                  >
                    <DatePicker
                      disabled
                      format="DD-MM-YYYY"
                      placeholder="กรอกวันที่เริ่มการจอง"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="returnAt"
                    label="เวลารับคืน"
                    rules={[
                      { required: true, message: "กรุณาเลือกเวลาเริ่มจอง!" },
                    ]}
                  >
                    <TimePicker
                      disabled
                      format="HH:mm"
                      placeholder="กรอกเวลาเริ่มการจอง"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}
        </Form>
      </Modal>

      <Table columns={columns} dataSource={maCarBookData} loading={loading} />
    </>
  );
};

export default MaCarReturn;
