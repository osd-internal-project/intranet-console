import { CarOutlined, ClockCircleOutlined, PhoneOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import { Card, Col, Row, Tag, Typography } from "antd";
import dayjs from "dayjs";
import React from "react";

const { Text } = Typography;

const emptyText = "-";

export interface calculateItem {
  date: string;
  rate: number;
  timeRate: number;
  typeRate: string;
}

export interface detailItemProps {
  label: string;
  value?: React.ReactNode;
  icon?: React.ReactNode;
  multiline?: boolean;
}

/** Read-only replacement for a disabled Form.Item: label above, plain text below. */
export const DetailItem: React.FC<detailItemProps> = ({ label, value, icon, multiline }) => {
  const isEmpty = value === null || value === undefined || value === "";
  return (
    <div className="mb-4">
      <Text type="secondary" className="text-xs block mb-1">
        {label}
      </Text>
      <div className="flex items-start space-x-2">
        {icon ? <span className="text-gray-400 mt-0.5">{icon}</span> : null}
        <Text className={`text-gray-800 ${multiline ? "whitespace-pre-wrap" : ""}`}>{isEmpty ? emptyText : value}</Text>
      </div>
    </div>
  );
};

export const formatDate = (value?: string | Date | dayjs.Dayjs | null, withTime = false) =>
  value ? dayjs(value).format(withTime ? "DD/MM/YYYY HH:mm" : "DD/MM/YYYY") : "";

export const formatNumber = (value?: number | null) => (value === null || value === undefined ? "" : `${value}`);

export const statusText = (status: string) => {
  switch (status) {
    case "approved":
      return "อนุมัติแล้ว";
    case "waiting":
      return "รออนุมัติ";
    case "reject":
      return "ไม่อนุมัติ";
    case "cancel":
      return "ยกเลิก";
    default:
      return status;
  }
};

export const statusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "success";
    case "waiting":
      return "warning";
    case "reject":
    case "cancel":
      return "error";
    default:
      return "default";
  }
};

const partTimeTypeText: Record<string, string> = {
  working: "ทำงาน",
  driving: "ขับรถ",
};

const typeDateText: Record<string, string> = {
  "day-off": "วันหยุด",
  working: "วันทำการ",
};

const booleanTag = (value?: boolean) => <Tag color={value ? "green" : "default"}>{value ? "ใช่" : "ไม่"}</Tag>;

export interface sectionProps {
  /** Raw form values of the overtime record (dates already converted to dayjs). */
  data: Record<string, any>;
}

export const PersonalDetailCard: React.FC<sectionProps> = ({ data }) => (
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
        <DetailItem label="ชื่อ-นามสกุล" value={data.fullname} icon={<UserOutlined />} />
      </Col>
    </Row>
  </Card>
);

export const WorkDetailCard: React.FC<sectionProps> = ({ data }) => (
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
        <DetailItem label="วันที่เริ่ม" value={formatDate(data.dateStart)} />
      </Col>
      <Col span={8}>
        <DetailItem label="เวลาเริ่ม" value={data.startTime} />
      </Col>
      <Col span={8}>
        <DetailItem label="เวลาสิ้นสุด" value={data.endTime} />
      </Col>
    </Row>

    <Row gutter={16}>
      <Col span={8}>
        <DetailItem label="เวลาพัก (ชั่วโมง)" value={formatNumber(data.breakTime)} />
      </Col>
      <Col span={8}>
        <DetailItem label="เวลาทำงาน (ชั่วโมง)" value={formatNumber(data.workingTime)} />
      </Col>
      <Col span={8}>
        <DetailItem label="เวลารวม (ชั่วโมง)" value={formatNumber(data.totalTime)} />
      </Col>
    </Row>

    <Row gutter={16}>
      <Col span={8}>
        <DetailItem label="ประเภทการทำงาน" value={partTimeTypeText[data.partTimeType] ?? data.partTimeType} />
      </Col>
      <Col span={8}>
        <DetailItem label="ประเภทวัน" value={typeDateText[data.typeDate] ?? data.typeDate} />
      </Col>
      <Col span={8}>
        <DetailItem label="ลูกค้า" value={data.customerName} icon={<TeamOutlined />} />
      </Col>
    </Row>

    <DetailItem label="รายละเอียดงาน" value={data.detailWork} multiline />
  </Card>
);

export const TravelDetailCard: React.FC<sectionProps> = ({ data }) => (
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
        <DetailItem label="เดินทางต่างจังหวัด" value={booleanTag(data.checkTravelUpCountry)} />
      </Col>
      <Col span={8}>
        <DetailItem label="ค้างคืน" value={booleanTag(data.checkOvernight)} />
      </Col>
      <Col span={8}>
        <DetailItem label="ใช้รถบริษัท" value={booleanTag(data.checkTravelByCompanyCar)} />
      </Col>
    </Row>

    <Row gutter={16}>
      <Col span={8}>
        <DetailItem label="ชื่อรถ" value={data.carName} />
      </Col>
      <Col span={8}>
        <DetailItem label="รหัสรถ" value={data.carId} />
      </Col>
      <Col span={8}>
        <DetailItem label="เบอร์โทรติดต่อ" value={data.phoneNumber} icon={<PhoneOutlined />} />
      </Col>
    </Row>

    <Row gutter={16}>
      <Col span={12}>
        <DetailItem label="ระยะทาง (กม.)" value={formatNumber(data.checkDistance)} />
      </Col>
      <Col span={12}>
        <DetailItem label="หมายเหตุ" value={data.other} multiline />
      </Col>
    </Row>
  </Card>
);

export const CalculationDetailCard: React.FC<sectionProps> = ({ data }) => {
  const calculate: calculateItem[] = data.calculate ?? [];
  return (
    <Card
      title="การคำนวณค่าตอบแทน"
      className="shadow-sm hover:shadow-md transition-shadow duration-300"
      headStyle={{ background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)", color: "#374151" }}>
      <div className="space-y-4">
        {calculate.map((calc, index) => (
          <div key={index} className="p-4 bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-lg border border-gray-100">
            <Row gutter={16}>
              <Col span={6}>
                <div className="text-center">
                  <Text type="secondary" className="text-xs block">
                    ประเภทวัน
                  </Text>
                  <Tag color="blue" className="mt-1">
                    {calc.date === "normal" ? "วันปกติ" : "วันหยุด"}
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
  );
};
