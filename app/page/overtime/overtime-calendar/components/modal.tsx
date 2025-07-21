import { IOverTimeForm } from "@/app/common/overtime";
import {
  FormInstance,
  Modal,
  Input,
  DatePicker,
  TimePicker,
  Select,
  InputNumber,
  Switch,
  Badge,
  Divider,
  Row,
  Col,
  Card,
  Space,
  Typography,
  Tag,
  Form,
} from "antd";
import React from "react";
import {
  UserOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  CarOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
const { Option } = Select;
const { TextArea } = Input;
const { Text, Title } = Typography;

export interface props {
  formDetail: FormInstance;
  openModal: boolean;
  handleOpenModal: (status: boolean, data: IOverTimeForm | null) => void;
}

export const ModalOvertimeHistory: React.FC<props> = ({ formDetail, openModal, handleOpenModal }): React.ReactElement => {
  const dataDetail = formDetail.getFieldsValue(true);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "success";
      case "waiting":
        return "warning";
      case "cancel":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "อนุมัติแล้ว";
      case "waiting":
        return "รออนุมัติ";
      case "cancel":
        return "ไม่อนุมัติ";
      default:
        return status;
    }
  };
  return (
    <div className="p-8">
      <Modal
        title={
          <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FileTextOutlined className="text-white text-lg" />
            </div>
            <div>
              <Title level={4} className="!mb-0 text-gray-800">
                รายละเอียดการทำงานล่วงเวลา
              </Title>
              <Text type="secondary" className="text-sm">
                Overtime Detail Information
              </Text>
            </div>
          </div>
        }
        open={openModal}
        onCancel={() => handleOpenModal(false, null)}
        width={900}
        footer={null}
        className="top-4"
        styles={{
          body: { padding: 0 },
          header: { padding: "24px 24px 0" },
        }}>
        <div className="max-h-[80vh] overflow-y-auto">
          <Form form={formDetail} layout="vertical" className="p-6 bg-gradient-to-br from-gray-50 to-blue-50/30">
            {/* Status Header */}
            <div className="mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge status={getStatusColor(dataDetail.status)} />
                  <Text strong className="text-lg">
                    สถานะ:
                  </Text>
                  <Tag color={getStatusColor(dataDetail.status)} className="px-3 py-1 rounded-full">
                    {getStatusText(dataDetail.status)}
                  </Tag>
                </div>
                <Text type="secondary" className="text-sm">
                  ID: {dataDetail.overTimeID?.slice(-8)}
                </Text>
              </div>
            </div>

            <Row gutter={24}>
              {/* Personal Information */}
              <Col span={24}>
                <Card
                  title={
                    <div className="flex items-center space-x-2">
                      <UserOutlined className="text-blue-500" />
                      <span>ข้อมูลส่วนตัว</span>
                    </div>
                  }
                  className="mb-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                  headStyle={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="ชื่อ-นามสกุล" name="fullname">
                        <Input
                          prefix={<UserOutlined className="text-gray-400" />}
                          className="rounded-lg border-gray-200 focus:border-blue-400"
                          disabled
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="รหัสพนักงาน" name="userId">
                        <Input className="rounded-lg border-gray-200 focus:border-blue-400" disabled />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Col>

              {/* Work Schedule Information */}
              <Col span={24}>
                <Card
                  title={
                    <div className="flex items-center space-x-2">
                      <ClockCircleOutlined className="text-green-500" />
                      <span>ข้อมูลการทำงาน</span>
                    </div>
                  }
                  className="mb-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                  headStyle={{ background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)", color: "white" }}>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item label="วันที่เริ่ม" name="dateStart">
                        <DatePicker className="w-full rounded-lg border-gray-200 focus:border-green-400" format="DD/MM/YYYY" disabled />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="เวลาเริ่ม" name="startTime">
                        <Input className="w-full rounded-lg border-gray-200 focus:border-green-400" disabled />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="เวลาสิ้นสุด" name="endTime">
                        <Input className="w-full rounded-lg border-gray-200 focus:border-green-400" disabled />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item label="เวลาพัก (ชั่วโมง)" name="breakTime">
                        <InputNumber className="w-full rounded-lg" step={0.5} min={0} placeholder="1.5" disabled />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="เวลาทำงาน (ชั่วโมง)" name="workingTime">
                        <InputNumber className="w-full rounded-lg" step={0.5} min={0} placeholder="10.5" disabled />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="เวลารวม (ชั่วโมง)" name="totalTime">
                        <InputNumber className="w-full rounded-lg" step={0.5} min={0} placeholder="12" disabled />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item label="ประเภทการทำงาน" name="partTimeType">
                        <Select className="rounded-lg" placeholder="เลือกประเภท" disabled>
                          <Option value="working">ทำงาน</Option>
                          <Option value="driving">ขับรถ</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="ประเภทวัน" name="typeDate">
                        <Select className="rounded-lg" placeholder="เลือกประเภทวัน" disabled>
                          <Option value="day-off">วันหยุด</Option>
                          <Option value="working">วันทำการ</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="ลูกค้า" name="customerName">
                        <Input
                          prefix={<TeamOutlined className="text-gray-400" />}
                          className="rounded-lg border-gray-200 focus:border-green-400"
                          placeholder="ชื่อลูกค้า"
                          disabled
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item label="รายละเอียดงาน" name="detailWork">
                    <TextArea
                      rows={3}
                      className="rounded-lg border-gray-200 focus:border-green-400"
                      placeholder="อธิบายรายละเอียดการทำงาน..."
                      disabled
                    />
                  </Form.Item>
                </Card>
              </Col>

              {/* Travel & Additional Information */}
              <Col span={24}>
                <Card
                  title={
                    <div className="flex items-center space-x-2">
                      <CarOutlined className="text-orange-500" />
                      <span>ข้อมูลการเดินทางและอื่นๆ</span>
                    </div>
                  }
                  className="mb-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                  headStyle={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", color: "white" }}>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item label="เดินทางต่างจังหวัด" name="checkTravelUpCountry">
                        <Switch checkedChildren="ใช่" unCheckedChildren="ไม่" disabled />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="ค้างคืน" name="checkOvernight">
                        <Switch checkedChildren="ใช่" unCheckedChildren="ไม่" disabled />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="ใช้รถบริษัท" name="checkTravelByCompanyCar">
                        <Switch checkedChildren="ใช่" unCheckedChildren="ไม่" disabled />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item label="ชื่อรถ" name="carName">
                        <Input className="rounded-lg border-gray-200 focus:border-orange-400" placeholder="ชื่อรถ" disabled />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="รหัสรถ" name="carId">
                        <Input className="rounded-lg border-gray-200 focus:border-orange-400" placeholder="รหัสรถ" disabled />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="เบอร์โทรติดต่อ" name="phoneNumber">
                        <Input
                          prefix={<PhoneOutlined className="text-gray-400" />}
                          className="rounded-lg border-gray-200 focus:border-orange-400"
                          placeholder="เบอร์โทรศัพท์"
                          disabled
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="ระยะทาง" name="checkDistance">
                        <InputNumber className="w-full rounded-lg" placeholder="ระยะทาง (กม.)" min={0} disabled />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="หมายเหตุ" name="other">
                        <TextArea
                          rows={2}
                          className="rounded-lg border-gray-200 focus:border-orange-400"
                          placeholder="หมายเหตุเพิ่มเติม..."
                          disabled
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Col>

              {/* Approval Information */}
              <Col span={24}>
                <Card
                  title={
                    <div className="flex items-center space-x-2">
                      <CheckCircleOutlined className="text-purple-500" />
                      <span>ข้อมูลการอนุมัติ</span>
                    </div>
                  }
                  className="mb-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                  headStyle={{ background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)", color: "#374151" }}>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item label="ผู้อนุมัติ" name="approvedUser">
                        <Input
                          prefix={<UserOutlined className="text-gray-400" />}
                          className="rounded-lg border-gray-200 focus:border-purple-400"
                          disabled
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="วันที่อนุมัติ" name="approvedDate">
                        <DatePicker
                          showTime
                          className="w-full rounded-lg border-gray-200 focus:border-purple-400"
                          format="DD/MM/YYYY HH:mm"
                          disabled
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="สถานะ" name="status">
                        <Select className="rounded-lg" placeholder="เลือกสถานะ" disabled>
                          <Option value="waiting">รออนุมัติ</Option>
                          <Option value="approved">อนุมัติแล้ว</Option>
                          <Option value="reject">ไม่อนุมัติ</Option>
                          <Option value="cancel">ยกเลิก</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item label="หมายเหตุการอนุมัติ" name="approvedDetail">
                    <TextArea
                      rows={3}
                      className="rounded-lg border-gray-200 focus:border-purple-400"
                      placeholder="หมายเหตุจากผู้อนุมัติ..."
                      disabled
                    />
                  </Form.Item>
                </Card>
              </Col>

              {/* Calculation Details */}
              <Col span={24}>
                <Card
                  title="การคำนวณค่าตอบแทน"
                  className="shadow-sm hover:shadow-md transition-shadow duration-300"
                  headStyle={{ background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)", color: "#374151" }}>
                  <div className="space-y-4">
                    {dataDetail.calculate.map((calc: { date: string; rate: number; timeRate: number; typeRate: string }, index: number) => (
                      <div key={index} className="p-4 bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-lg border border-gray-100">
                        <Row gutter={16}>
                          <Col span={6}>
                            <div className="text-center">
                              <Text type="secondary" className="text-xs block">
                                ประเภทวัน
                              </Text>
                              <Tag color="blue" className="mt-1">
                                {calc.date === "normall" ? "วันปกติ" : "วันหยุด"}
                              </Tag>
                            </div>
                          </Col>
                          <Col span={6}>
                            <div className="text-center">
                              <Text type="secondary" className="text-xs block">
                                อัตราคูณ
                              </Text>
                              <Text strong className="text-lg text-orange-600">
                                ×{calc.rate}
                              </Text>
                            </div>
                          </Col>
                          <Col span={6}>
                            <div className="text-center">
                              <Text type="secondary" className="text-xs block">
                                ชั่วโมง
                              </Text>
                              <Text strong className="text-lg text-green-600">
                                {calc.timeRate}
                              </Text>
                            </div>
                          </Col>
                          <Col span={6}>
                            <div className="text-center">
                              <Text type="secondary" className="text-xs block">
                                ประเภท
                              </Text>
                              <Tag color={calc.typeRate === "overtime" ? "red" : "green"} className="mt-1">
                                {calc.typeRate === "overtime" ? "ล่วงเวลา" : "เวลาปกติ"}
                              </Tag>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>
            </Row>
            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
              <button
                type="button"
                onClick={() => handleOpenModal(false, null)}
                className="px-6 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200">
                ปิด
              </button>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
};
