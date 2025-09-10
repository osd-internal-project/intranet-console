import React from "react";
import {
  Row,
  Col,
  Form,
  Input,
  Divider,
  ConfigProvider,
  Select,
  InputNumber,
  DatePicker,
  FormInstance,
  Card,
  Typography,
  Badge,
  Space,
  Image,
} from "antd";
import {
  UserOutlined,
  CarOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  ToolOutlined,
  DashboardOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import { MaCarBookType, MaCarType } from "../../common/index";
import TextArea from "antd/es/input/TextArea";
import { dateFormatTime } from "@/app/utils";

const { Title, Text } = Typography;

interface Props {
  formBookData: FormInstance<MaCarBookType>;
  statusApprove: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Process":
      return "processing";
    case "Approve":
      return "success";
    case "Cancel":
      return "error";
    case "Return":
      return "warning";
    case "Completed":
      return "success";
    default:
      return "default";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Process":
      return <SyncOutlined spin />;
    case "Approve":
      return <CheckCircleOutlined />;
    case "Cancel":
      return <CloseCircleOutlined />;
    case "Return":
      return <ToolOutlined />;
    case "Completed":
      return <CheckCircleOutlined />;
    default:
      return null;
  }
};

export const CarReturnForm: React.FC<Props> = ({ formBookData, statusApprove }) => {
  const values = formBookData.getFieldsValue(true);
  const customTheme = {
    token: {
      colorBgContainerDisabled: "#fafafa",
      colorTextDisabled: "#434343",
      colorBorder: "#e5e7eb",
      borderRadius: 8,
      fontSize: 14,
    },
    components: {
      Form: {
        labelColor: "#374151",
        labelFontSize: 14,
        labelFontWeight: 500,
      },
      Input: {
        colorBgContainer: "#fafafa",
        colorBorder: "#e5e7eb",
        borderRadius: 8,
      },
      Select: {
        colorBgContainer: "#fafafa",
        colorBorder: "#e5e7eb",
        borderRadius: 8,
      },
      DatePicker: {
        colorBgContainer: "#fafafa",
        colorBorder: "#e5e7eb",
        borderRadius: 8,
      },
      InputNumber: {
        colorBgContainer: "#fafafa",
        colorBorder: "#e5e7eb",
        borderRadius: 8,
      },
      Card: {
        borderRadius: 12,
        colorBorderSecondary: "#e5e7eb",
      },
      Divider: {
        colorSplit: "#e5e7eb",
        fontSize: 16,
        fontWeight: 600,
      },
    },
  };

  const FormSection = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <Card className="mb-6 shadow-sm border-0" bodyStyle={{ padding: "24px" }}>
      <div className="flex items-center mb-4">
        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mr-3">{icon}</div>
        <Title level={4} className="m-0 text-gray-800">
          {title}
        </Title>
      </div>
      {children}
    </Card>
  );

  return (
    <ConfigProvider theme={customTheme}>
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="mb-8">
          <Title level={2} className="text-gray-800 mb-2">
            รายละเอียดการจองรถ
          </Title>
          <Text type="secondary" className="text-base">
            ข้อมูลการจองและการคืนรถ
          </Text>
        </div>

        <Form form={formBookData} layout="vertical" initialValues={{ remember: true }} autoComplete="off" size="large" className="space-y-6">
          {/* ข้อมูลผู้จอง */}
          <FormSection title="ข้อมูลผู้จอง" icon={<UserOutlined className="text-blue-600" />}>
            <Row gutter={[24, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item<MaCarType> name="createdByName" label="ชื่อผู้จอง">
                  <Input disabled className="read-only-input" prefix={<UserOutlined className="text-gray-400" />} size="large" />
                </Form.Item>
              </Col>
            </Row>
          </FormSection>

          {/* ข้อมูลการจองรถ */}
          <FormSection title="ข้อมูลการจองรถ" icon={<CarOutlined className="text-green-600" />}>
            <Row gutter={[24, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item name="carName" label="ชื่อรถ">
                  <Input disabled className="read-only-input" prefix={<CarOutlined className="text-gray-400" />} size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item<MaCarBookType> name="carBookTitle" label="วัตถุประสงค์การใช้งาน">
                  <Input.TextArea disabled className="read-only-input" rows={3} size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item<MaCarBookType> name="carBookPlace" label="สถานที่ไป">
                  <Input.TextArea disabled className="read-only-input" rows={3} size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[24, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item<MaCarBookType> name="carBookProvince" label="จังหวัด">
                  <Input disabled className="read-only-input" prefix={<EnvironmentOutlined className="text-gray-400" />} size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item<MaCarBookType> name="carBookUsers" label="จำนวนผู้ใช้">
                  <Input disabled className="read-only-input" prefix={<TeamOutlined className="text-gray-400" />} size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[24, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item name="carBookStartDate" label="วันที่เริ่มการจอง">
                  <DatePicker
                    disabled
                    className="read-only-input w-full"
                    format={dateFormatTime(formBookData.getFieldValue("carBookStartDate"))}
                    suffixIcon={<CalendarOutlined className="text-gray-400" />}
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item name="carBookEndDate" label="วันที่สิ้นสุดการจอง">
                  <DatePicker
                    disabled
                    className="read-only-input w-full"
                    format={dateFormatTime(formBookData.getFieldValue("carBookEndDate"))}
                    suffixIcon={<CalendarOutlined className="text-gray-400" />}
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[24, 16]}>
              <Col xs={24} md={16}>
                <Form.Item name="detail" label="รายละเอียด">
                  <TextArea disabled rows={3} className="read-only-input" size="large" />
                </Form.Item>
              </Col>
            </Row>
          </FormSection>

          {/* ข้อมูลสถานะการจองรถ */}
          <FormSection title="ข้อมูลสถานะการจองรถ" icon={<FileTextOutlined className="text-orange-600" />}>
            <Row gutter={[24, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item name="carBookApprovedStatus" label="สถานะการจองรถ">
                  <Input
                    disabled
                    className="read-only-input"
                    prefix={getStatusIcon(formBookData.getFieldValue("carBookApprovedStatus"))}
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[24, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item name="remarkApproved" label="หมายเหตุการไม่อนุมัติการจองรถ">
                  <TextArea disabled rows={2} className="read-only-input" size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="remarkCancel" label="หมายเหตุการยกเลิก">
                  <TextArea disabled rows={2} className="read-only-input" size="large" />
                </Form.Item>
              </Col>
            </Row>
          </FormSection>

          {/* ข้อมูลการคืนรถ */}
          {(statusApprove === "Return" || statusApprove === "Completed") && (
            <FormSection title="ข้อมูลการคืนรถ" icon={<ToolOutlined className="text-purple-600" />}>
              <Row gutter={[24, 16]}>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item<MaCarType> name="status" label="สถานะรถ">
                    <Select disabled className="read-only-input" size="large">
                      <Select.Option value={true}>
                        <Space>
                          <CheckCircleOutlined className="text-green-500" />
                          ใช้งานได้ปกติ
                        </Space>
                      </Select.Option>
                      <Select.Option value={false}>
                        <Space>
                          <CloseCircleOutlined className="text-red-500" />
                          ไม่สามารถใช้งานได้
                        </Space>
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item name="carMile" label="เลขไมล์รถ">
                    <InputNumber
                      disabled
                      className="read-only-input w-full"
                      prefix={<DashboardOutlined className="text-gray-400" />}
                      size="large"
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item name="carPetrol" label="ระดับน้ำมันรถ">
                    <Select disabled className="read-only-input" size="large">
                      <Select.Option value="high">
                        <Space>
                          <Badge status="success" />
                          มาก
                        </Space>
                      </Select.Option>
                      <Select.Option value="medium">
                        <Space>
                          <Badge status="warning" />
                          ปานกลาง
                        </Space>
                      </Select.Option>
                      <Select.Option value="low">
                        <Space>
                          <Badge status="error" />
                          น้อย
                        </Space>
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[24, 16]}>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item name="returnNotifAt" label="วันที่แจ้งคืน">
                    <DatePicker
                      disabled
                      className="read-only-input w-full"
                      format={dateFormatTime(formBookData.getFieldValue("returnNotifAt"))}
                      placeholder="รออนุมัติรับคืนรถ"
                      suffixIcon={<CalendarOutlined className="text-gray-400" />}
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item name="carBookApprovedStatus" label="สถานะการคืนรถ">
                    <Select disabled placeholder="รออนุมัติรับคืนรถ" className="read-only-input" size="large">
                      <Select.Option value="Process">
                        <Space>
                          <SyncOutlined spin className="text-blue-500" />
                          กำลังรออนุมัติ
                        </Space>
                      </Select.Option>
                      <Select.Option value="Approve">
                        <Space>
                          <CheckCircleOutlined className="text-green-500" />
                          อนุมัติแล้ว
                        </Space>
                      </Select.Option>
                      <Select.Option value="Cancel">
                        <Space>
                          <CloseCircleOutlined className="text-red-500" />
                          ยกเลิกการจอง
                        </Space>
                      </Select.Option>
                      <Select.Option value="Return">
                        <Space>
                          <ToolOutlined className="text-orange-500" />
                          แจ้งคืนรถแล้ว
                        </Space>
                      </Select.Option>
                      <Select.Option value="Completed">
                        <Space>
                          <CheckCircleOutlined className="text-green-500" />
                          คืนรถสำเร็จ
                        </Space>
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              {values.maCarBookImage && values.maCarBookImage.length > 0 ? (
                <div className="flex justify-center gap-3 mt-2 mb-2">
                  {values.maCarBookImage.map((e: any, index: number) => {
                    return (
                      <Image
                        alt="news"
                        preview={true}
                        crossOrigin="anonymous"
                        src={`${process.env.REACT_APP_API_BASE_URL_INTRANET}/ma-car-booking-images/get-image/${e.idCarBookImage}`}
                        style={{
                          width: "100%",
                          height: "150px",
                          objectFit: "cover",
                        }}
                      />
                    );
                  })}
                </div>
              ) : null}
              <Row gutter={[24, 16]}>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item name="recipientName" label="ผู้รับคืนรถ">
                    <Input disabled className="read-only-input" prefix={<UserOutlined className="text-gray-400" />} size="large" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item name="returnAt" label="วันที่รับคืน">
                    {formBookData.getFieldValue("returnAt") ? (
                      <DatePicker
                        disabled
                        className="read-only-input w-full"
                        format={dateFormatTime(formBookData.getFieldValue("returnAt") ? formBookData.getFieldValue("returnAt") : null)}
                        suffixIcon={<CalendarOutlined className="text-gray-400" />}
                        size="large"
                      />
                    ) : (
                      <Input disabled placeholder="รอรับคืนรถ" className="read-only-input" size="large" />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </FormSection>
          )}
        </Form>
      </div>
    </ConfigProvider>
  );
};
