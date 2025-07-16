import React, { useContext, useState } from "react";
import { Table, Button, Row, Col, Space, Select, Modal, Form, Input, Divider, message, InputNumber, Tag } from "antd";
import type { TableProps, FormProps } from "antd";
import dayjs from "dayjs";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { MaCarBookServices } from "../../../../services/ma-car-book.service";
import { MaCarType, MaCarBookType } from "../../common/index";
import { checkApprovedStatus, checkStatusReturn, CheckStatusMaCarBookType, showStatus } from "@/app/utils/validatefield";
import { dateFormatTime } from "@/app/utils";
import { CarReturnForm } from "./car-return-form";
import { UserContectType, UserContext } from "@/app/config/userContext";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
export interface props {
  maCarBookData: MaCarBookType[];
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const MaCarReturn: React.FC<props> = ({ maCarBookData, setLoading, loading }: any): React.ReactElement => {
  const { user } = (useContext(UserContext) as UserContectType) || { user: null };
  const { id24Axios } = useId24();
  const baseUrIntranet = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_INTRANET);
  const [formBookData] = Form.useForm();
  const [formReturn] = Form.useForm();
  const [currentMaId, setCurrentMaId] = useState<string | null>(null);
  const [currentMaBookId, setCurrentMaBookId] = useState<number | null>(null);
  const [modalEditReturn, setModalEditReturn] = useState(false);
  const [modalEditDetail, setModalEditDetail] = useState(false);
  const maCarBookServices = MaCarBookServices(baseUrIntranet);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [oldCarMile, setOldCarMile] = useState<number>(0);
  const [statusApprove, setStatusApprove] = useState("");
  const [messages, messageHeader] = message.useMessage();

  const showModalReturn = (record: MaCarBookType) => {
    checkStatusReturn(record);
    setCurrentMaId(record.carId);
    setCurrentMaBookId(record.id);
    setOldCarMile(record.maCar.carMile);
    formReturn.setFieldsValue({ ...record, carName: record.maCar.carName, status: record.maCar.status });
    record.carBookApprovedStatus === "Approve" ? setModalEditReturn(true) : null;
  };

  const handleModalReturn = () => {
    setModalEditReturn(false);
  };

  const showModalDetail = (record: MaCarBookType) => {
    setModalEditDetail(true);
    setCurrentMaBookId(record.id);
    setStatusApprove(record.carBookApprovedStatus);
    const approvedStatus = checkApprovedStatus(record);
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
      statusApprove: approvedStatus,
      phoneNumber: user?.phoneNumber,
    });
  };

  const handleModalDetail = () => {
    setModalEditDetail(false);
  };

  const updatedMaCarReturn: FormProps<MaCarType>["onFinish"] = async (values) => {
    const { createdById, carName, detail, carBookPlace, carBookStartDate, carBookEndDate } = formReturn.getFieldsValue(true);
    if (currentMaId && currentMaBookId) {
      try {
        const updatedMaCar = {
          ...values,
          carMile: values.carMile,
          carPetrol: values.carPetrol,
          updatedAt: dayjs().toISOString(),
          updatedById: user?.userId,
          updatedByName: `${user?.firstNameTh} ${user?.lastNameTh}`,
        };
        const maCarBook = {
          carName,
          detail,
          carBookPlace,
          carBookStartDate,
          carBookEndDate,
          createdById: user?.userId,
          carBookApprovedStatus: "Return",
          returnNotifAt: dayjs().toISOString(),
        };
        await maCarBookServices.updateMaCarBook(currentMaBookId, maCarBook);
        await maCarBookServices.updateMaCar(currentMaId, updatedMaCar);
        messages.success("คืนรถสำเร็จ");
        handleModalReturn();
        setSubmitLoading(false);
        formReturn.resetFields();
      } catch (error) {
        messages.error("คืนรถไม่สำเร็จ");
        setSubmitLoading(false);
      }
    }
    setModalEditReturn(false);
    setLoading(true);
  };

  const columns: TableProps<MaCarBookType>["columns"] = [
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
      title: "ชื่อ-นามสกุล",
      dataIndex: "createdByName",
      key: "createdByName",
      align: "center",
    },
    {
      key: "carBookStartDate",
      dataIndex: "carBookStartDate",
      title: "วันที่เริ่มจอง",
      align: "center",
      render: (value) => dateFormatTime(value),
    },
    {
      key: "carBookEndDate",
      dataIndex: "carBookEndDate",
      title: "วันที่สิ้นสุดการจอง",
      align: "center",
      render: (value) => dateFormatTime(value),
    },
    {
      title: "ผู้อนุมัติ",
      dataIndex: "carBookApprovedByName",
      key: "carBookApprovedByName",
      align: "center",
    },
    {
      title: "สถานะการใช้งาน",
      dataIndex: "carBookApprovedStatus",
      key: "carBookApprovedStatus",
      align: "center",
      render: (status: string) => CheckStatusMaCarBookType(status),
    },
    {
      title: "รายละเอียด",
      align: "center",
      render: (_: string, record: MaCarBookType) => {
        return (
          <Space>
            <Button
              type="link"
              onClick={() => {
                showModalDetail(record);
              }}>
              รายละเอียด
            </Button>
          </Space>
        );
      },
    },
    {
      title: "จัดการ",
      align: "center",
      render: (record: MaCarBookType) => (
        <Space>
          {record.carBookApprovedStatus === "Approve" ? (
            <Button type="link" onClick={() => showModalReturn(record)}>
              แจ้งคืนรถ
            </Button>
          ) : record.carBookApprovedStatus === "Completed" ? (
            <Tag color="gold">{`ดำเนินการเสร็จสิ้น`}</Tag>
          ) : (
            <span style={{ color: "grey" }}>{`ไม่สามารถแจ้งคืนรถได้`}</span>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      {messageHeader}
      <Modal title="การคืนรถ" open={modalEditReturn} onCancel={handleModalReturn} footer={null} width={500}>
        <Form form={formReturn} layout="vertical" onFinish={updatedMaCarReturn} autoComplete="off" size="small">
          <Divider orientation="left">ข้อมูลการคืนรถ</Divider>
          <Col span={24}>
            <Form.Item name="carName" label="ชื่อรถ">
              <Input disabled placeholder="กรอกชื่อรถ" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="carMile"
              label="เลขไมล์รถ"
              rules={[
                {
                  required: true,
                  message: "กรุณากรอกเลขไมล์รถ!",
                  validator: (_, value) => {
                    if (value >= oldCarMile) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("กรุณากรอกเลขไมล์รถ"));
                  },
                },
              ]}>
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
            <Form.Item label="ระดับน้ำมันรถ" name="carPetrol" rules={[{ required: true, message: "กรุณาเลือกระดับน้ำมัน!" }]}>
              <Select>
                <Select.Option value="high">มาก</Select.Option>
                <Select.Option value="medium">ปานกลาง</Select.Option>
                <Select.Option value="low">น้อย</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          {/* <Col span={24}>
            <Form.Item label="สถานะของรถ" name="status" rules={[{ required: true, message: "กรุณาเลือกสถานะรถ!" }]}>
              <Select>
                <Select.Option value={true}>ใช้งานได้ปกติ</Select.Option>
                <Select.Option value={false}>ไม่สามารถใช้งานได้</Select.Option>
              </Select>
            </Form.Item>
          </Col> */}
          <Row justify="end" gutter={16}>
            <Button type="default" onClick={handleModalReturn} style={{ marginRight: "16px" }}>
              ยกเลิก
            </Button>
            <Button type="primary" htmlType="submit" loading={submitLoading}>
              คืนรถ
            </Button>
          </Row>
        </Form>
      </Modal>

      <Modal style={{ top: 10 }} title="รายละเอียด" open={modalEditDetail} onCancel={handleModalDetail} footer={null} width={1200}>
        <CarReturnForm formBookData={formBookData} statusApprove={statusApprove} />
      </Modal>

      <div>{showStatus()}</div>
      <Table
        scroll={{ x: "max-content" }}
        columns={columns}
        dataSource={maCarBookData}
        loading={loading}
        size="small"
        style={{ marginTop: "5px" }}
        rowKey={(e: any) => e.id}
      />
    </>
  );
};

export default MaCarReturn;
