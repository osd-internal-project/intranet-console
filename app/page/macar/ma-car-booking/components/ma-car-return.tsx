import React, { useContext, useState } from "react";
import {
  Table,
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
  InputNumber,
  Tag,
  Upload,
  Image,
} from "antd";
import type { TableProps, FormProps, UploadProps, UploadFile } from "antd";
import dayjs from "dayjs";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { MaCarBookServices } from "../../../../services/ma-car-book.service";
import { MaCarType, MaCarBookType } from "../../common/index";
import {
  checkApprovedStatus,
  checkStatusReturn,
  CheckStatusMaCarBookType,
  showStatus,
} from "@/app/utils/validatefield";
import { dateFormatTime, handleCompress } from "@/app/utils";
import { CarReturnForm } from "./car-return-form";
import { UserContectType, UserContext } from "@/app/config/userContext";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import imageCompression from "browser-image-compression";
import {
  CameraOutlined,
  CarOutlined,
  CheckOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import { MaCarServices } from "@/app/services/ma-car.service";
import { MaCarFuelTransactionServices } from "@/app/services/ma-car-fuel-transaction.service";
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
  const baseImageUrl = process.env.NEXT_PUBLIC_API_BASE_URL_INTRANET;
  const { user } = (useContext(UserContext) as UserContectType) || {
    user: null,
  };
  const { id24Axios } = useId24();
  const baseUrIntranet = id24Axios(
    loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET,
  );
  const maCarBookServices = MaCarBookServices(baseUrIntranet);
  const maCarServices = MaCarServices(baseUrIntranet);
  const maCarFuelTransactionServices = MaCarFuelTransactionServices(baseUrIntranet);

  const [formBookData] = Form.useForm();
  const [formReturn] = Form.useForm();
  const [currentMaId, setCurrentMaId] = useState<string | null>(null);
  const [currentMaBookId, setCurrentMaBookId] = useState<number | null>(null);
  const [modalEditReturn, setModalEditReturn] = useState(false);
  const [modalEditDetail, setModalEditDetail] = useState(false);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [statusApprove, setStatusApprove] = useState("");
  const [attendFiles, setAttendFiles] = useState<UploadFile[]>([]);
  const [messages, messageHeader] = message.useMessage();
  const [selectedCar, setSelectedCar] = useState<MaCarType | undefined>(
    undefined,
  );

  const values = formReturn.getFieldsValue(true);

  const showModalReturn = async (record: MaCarBookType) => {
    checkStatusReturn(record);
    setCurrentMaId(record.carId);
    setCurrentMaBookId(record.id);
    const car = await maCarServices.getMaCarById(record.carId);
    setSelectedCar(car);
    formReturn.setFieldsValue({
      ...record,
      carName: record.maCar.carName,
      status: record.maCar.status,
      carMile: record.maCar.carMile,
    });
    record.carBookApprovedStatus === "Approve"
      ? setModalEditReturn(true)
      : null;
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
      returnNotifAt: record.returnNotifAt ? dayjs(record.returnNotifAt) : null,
      carBookApprovedStatus: record.carBookApprovedStatus,
      recipientName: record.recipientName,
      returnAt: record.returnAt ? dayjs(record.returnAt) : null,
      carName1: record.carName,
      statusApprove: approvedStatus,
      phoneNumber: user?.phoneNumber,
    });
  };

  const handleModalDetail = () => {
    setModalEditDetail(false);
  };

  const updatedMaCarReturn: FormProps<MaCarType>["onFinish"] = async (
    values,
  ) => {
    const { carName, detail, carBookPlace, carBookStartDate, carBookEndDate, amount } =
      formReturn.getFieldsValue(true);

    const isFuelCardActive =
      selectedCar?.fuelCardStatus === "active" &&
      !!selectedCar?.fuelCardExpiredDate &&
      dayjs(selectedCar.fuelCardExpiredDate).isAfter(dayjs());
    const fuelAmount = typeof amount === "number" && amount > 0 ? amount : null;

    if (currentMaId && currentMaBookId) {
      try {
        const updatedMaCar: Record<string, unknown> = {
          carName: values.carName,
          carMile: values.carMile,
          carPetrol: values.carPetrol,
          updatedAt: dayjs().toISOString(),
          updatedById: user?.userId,
          updatedByName: `${user?.firstNameTh} ${user?.lastNameTh}`,
        };

        if (isFuelCardActive && fuelAmount !== null) {
          const remaining = (selectedCar?.fuelMonthlyRemaining ?? 0) - fuelAmount;
          updatedMaCar.fuelMonthlyRemaining = remaining;
        }

        const maCarBook = {
          remark: values.remark,
          carName,
          detail,
          carBookPlace,
          carBookStartDate: dayjs(carBookStartDate)
            .startOf("date")
            .toISOString(),
          carBookEndDate: dayjs(carBookEndDate).endOf("date").toISOString(),
          createdById: user?.userId,
          carBookApprovedStatus: "Return",
          returnNotifAt: dayjs().toISOString(),
        };
        const updateCarBooikng = await maCarBookServices.updateMaCarBook(
          currentMaBookId,
          maCarBook,
        );
        if (updateCarBooikng) {
          if (attendFiles.length > 0) {
            attendFiles.forEach(async (file) => {
              const formData: any = new FormData();
              formData.append("type", "create-attend");
              formData.append("files", file.originFileObj);
              await maCarBookServices.updateMaCarBookingImages(
                updateCarBooikng.id,
                formData,
              );
            });
          }
        }
        await maCarBookServices.updateMaCar(currentMaId, updatedMaCar);

        if (isFuelCardActive && fuelAmount !== null) {
          const remaining = (selectedCar?.fuelMonthlyRemaining ?? 0) - fuelAmount;
          await maCarFuelTransactionServices.create({
            carId: currentMaId,
            action: "use",
            amount: fuelAmount,
            remaining,
          });
        }

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
              }}
            >
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
          ) : record.carBookApprovedStatus === "Return" ? (
            <Tag color="orange">{`ดำเนินการแจ้งคืนแล้ว`}</Tag>
          ) : (
            <span style={{ color: "grey" }}>{`ไม่สามารถแจ้งคืนรถได้`}</span>
          )}
        </Space>
      ),
    },
  ];

  const beforeUploadAttendFiles = async (file: RcFile) => {
    if (attendFiles.find((oneFile) => oneFile.name === file.name)) {
      message.warning(`ชื่อไฟล์ ${file.name} ซ้ำ`);
      return false;
    }
    const compressed = await handleCompress(file);
    return compressed;
  };
  const handleChangeAttendFiles: UploadProps["onChange"] = async ({
    fileList: newFileList,
  }) => {
    return setAttendFiles(newFileList);
  };

  return (
    <>
      {messageHeader}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <CarOutlined style={{ color: "#1890ff" }} />
            <span>การคืนรถ</span>
          </div>
        }
        open={modalEditReturn}
        onCancel={handleModalReturn}
        footer={null}
        width={600}
        style={{ top: 20 }}
      >
        <Form
          form={formReturn}
          layout="vertical"
          onFinish={updatedMaCarReturn}
          autoComplete="off"
          size="middle"
        >
          <div
            style={{
              background: "#f8f9fa",
              padding: "16px",
              borderRadius: "8px",
              marginBottom: "24px",
              border: "1px solid #e8e8e8",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "16px",
                color: "#1890ff",
                fontWeight: 500,
              }}
            >
              <InfoCircleOutlined />
              <span>ข้อมูลการคืนรถ</span>
            </div>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="carName" label="ชื่อรถ">
                  <Input
                    disabled
                    placeholder="กรอกชื่อรถ"
                    style={{
                      backgroundColor: "#f5f5f5",
                      border: "1px solid #d9d9d9",
                    }}
                    prefix={<CarOutlined style={{ color: "#8c8c8c" }} />}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="carMile" label="เลขไมล์รถ">
                  <InputNumber
                    placeholder="กรอกเลขไมล์รถ"
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value: any) => value.replace(/\$\s?|(,*)/g, "")}
                    onKeyDown={(event) => {
                      if (
                        !/[0-9]/.test(event.key) &&
                        event.key !== "Backspace"
                      ) {
                        event.preventDefault();
                      }
                    }}
                    addonAfter="กิโลเมตร"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="ระดับน้ำมันรถ"
                  name="carPetrol"
                  rules={[
                    { required: true, message: "กรุณาเลือกระดับน้ำมัน!" },
                  ]}
                >
                  <Select placeholder="เลือกระดับน้ำมัน">
                    <Select.Option value="high">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            width: "12px",
                            height: "12px",
                            backgroundColor: "#52c41a",
                            borderRadius: "50%",
                          }}
                        />
                        มาก (เต็มถัง)
                      </div>
                    </Select.Option>
                    <Select.Option value="medium">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            width: "12px",
                            height: "12px",
                            backgroundColor: "#faad14",
                            borderRadius: "50%",
                          }}
                        />
                        ปานกลาง (ครึ่งถัง)
                      </div>
                    </Select.Option>
                    <Select.Option value="low">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            width: "12px",
                            height: "12px",
                            backgroundColor: "#ff4d4f",
                            borderRadius: "50%",
                          }}
                        />
                        น้อย (ต่ำกว่าครึ่งถัง)
                      </div>
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {selectedCar?.fuelCardStatus &&
              selectedCar?.fuelCardStatus === "active" &&
              selectedCar?.fuelCardExpiredDate && (
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="amount" label="ราคาน้ำมันรถ">
                      <InputNumber
                        min={0}
                        max={selectedCar?.fuelMonthlyRemaining || 0}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    คงเหลือ: {selectedCar?.fuelMonthlyRemaining || 0} จาก{" "}
                    {selectedCar?.fuelMonthlyLimit || 0} บาท
                  </Col>
                </Row>
              )}
          </div>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="หมายเหตุ" name="remark">
                <Input.TextArea
                  placeholder="แจ้งเรื่องอื่นๆ เช่น ปัญหาหรือข้อสังเกต"
                  showCount
                  maxLength={250}
                  rows={4}
                  style={{ resize: "none" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              {values.maCarBookImage && values.maCarBookImage.length > 0 ? (
                <>
                  {formReturn
                    .getFieldsValue(true)
                    .maCarBookImage.map((e: any, index: number) => {
                      <Image
                        alt="news"
                        preview={true}
                        crossOrigin="anonymous"
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL_INTRANET}/get-image/${e.idCarBookImage}`}
                        style={{
                          width: "100%",
                          height: "150px",
                          objectFit: "cover",
                        }}
                      />;
                    })}
                </>
              ) : (
                <Form.Item
                  label={
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <CameraOutlined />
                      <span>อัปโหลดรูปภาพ</span>
                    </div>
                  }
                  valuePropName="fileList"
                  extra={
                    <div
                      style={{
                        color: "#8c8c8c",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      เฉพาะไฟล์ PNG และ JPEG
                    </div>
                  }
                >
                  <Upload
                    fileList={attendFiles}
                    onChange={handleChangeAttendFiles}
                    beforeUpload={beforeUploadAttendFiles}
                    multiple={false}
                    // maxCount={10}
                    onPreview={() => {}}
                    listType="picture-card"
                    style={{ width: "100%" }}
                  >
                    {attendFiles.length >= 10 ? null : (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          padding: "8px",
                        }}
                      >
                        <PlusOutlined
                          style={{ fontSize: "16px", marginBottom: "8px" }}
                        />
                        <div style={{ fontSize: "12px" }}>อัปโหลด</div>
                      </div>
                    )}
                  </Upload>
                </Form.Item>
              )}
            </Col>
          </Row>

          <Divider style={{ margin: "24px 0 16px 0" }} />

          <Row justify="end" gutter={16}>
            <Col>
              <Button
                type="default"
                onClick={handleModalReturn}
                size="large"
                style={{
                  minWidth: "100px",
                  borderRadius: "6px",
                }}
              >
                ยกเลิก
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitLoading}
                size="large"
                style={{
                  minWidth: "100px",
                  borderRadius: "6px",
                  background: "#1890ff",
                }}
                icon={<CheckOutlined />}
              >
                คืนรถ
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        style={{ top: 10 }}
        open={modalEditDetail}
        onCancel={handleModalDetail}
        footer={null}
        width={1200}
      >
        <CarReturnForm
          formBookData={formBookData}
          statusApprove={statusApprove}
        />
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
