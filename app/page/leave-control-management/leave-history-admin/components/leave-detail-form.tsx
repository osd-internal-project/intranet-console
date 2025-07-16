import React from "react";
import { Button, Form, Input, Space, Tooltip, Row, Col, Card, Tag, Divider } from "antd";
import {
  PaperClipOutlined,
  CalendarOutlined,
  UserOutlined,
  PhoneOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { intersection } from "lodash";

interface props {
  formdetail: any;
  downloadFile: (id: number, filename: string) => void;
  statusById: string;
  sideMenuGroups: any;
  onFinishUpdate: (values: any, type: string, Id: number) => void;
  onFinishDelete: (type: string, Id: number) => void;
  setSubmitAction: (value: "approved" | "cancel") => void;
  submitAction: string;
}

export const LeaveDetailForm: React.FC<props> = ({
  formdetail,
  downloadFile,
  statusById,
  sideMenuGroups,
  onFinishUpdate,
  onFinishDelete,
  setSubmitAction,
  submitAction,
}) => {
  const userApproved = formdetail.getFieldValue("userApproved");
  const dataLeaveFiles = formdetail.getFieldValue("dataLeaveFiles");

  const getStatusTag = () => {
    if (statusById === "approved") {
      return (
        <Tag color="success" className="px-3 py-1 font-medium rounded-full">
          <CheckCircleOutlined className="mr-1" /> อนุมัติแล้ว
        </Tag>
      );
    } else if (statusById === "cancel") {
      return (
        <Tag color="error" className="px-3 py-1 font-medium rounded-full">
          <CloseCircleOutlined className="mr-1" /> ยกเลิกแล้ว
        </Tag>
      );
    } else {
      return (
        <Tag color="processing" className="px-3 py-1 font-medium rounded-full">
          <EditOutlined className="mr-1" /> รอการอนุมัติ
        </Tag>
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-lg mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileTextOutlined className="text-2xl mr-3" />
            <h2 className="text-xl font-bold mb-0">รายละเอียดการลา</h2>
          </div>
          <div>{getStatusTag()}</div>
        </div>
      </div>

      <Form
        autoComplete="off"
        form={formdetail}
        layout="vertical"
        onFinish={(e) => onFinishUpdate(e, submitAction, formdetail.getFieldValue("id") ? formdetail.getFieldValue("id") : 0)}>
        {/* Basic Information Card */}
        <Card
          className="mb-4 shadow-sm"
          title={
            <div className="flex items-center">
              <UserOutlined className="mr-2 text-blue-500" />
              <span className="font-medium text-gray-700">ข้อมูลทั่วไป</span>
            </div>
          }>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="วันที่สร้าง" name="createAt">
                <Input
                  disabled
                  className="bg-gray-100 cursor-default hover:border-gray-300 focus:border-gray-300 focus:shadow-none"
                  prefix={<CalendarOutlined className="text-gray-400" />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="เรียนถึง" name="ownerName">
                <Input
                  disabled
                  className="bg-gray-100 cursor-default hover:border-gray-300 focus:border-gray-300 focus:shadow-none"
                  prefix={<UserOutlined className="text-gray-400" />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="ผู้ขอลา" name="name">
                <Input
                  disabled
                  className="bg-gray-100 cursor-default hover:border-gray-300 focus:border-gray-300 focus:shadow-none"
                  prefix={<UserOutlined className="text-gray-400" />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="เบอร์ติดต่อระหว่างลา" name="phoneNumber">
                <Input
                  disabled
                  className="bg-gray-100 cursor-default hover:border-gray-300 focus:border-gray-300 focus:shadow-none"
                  prefix={<PhoneOutlined className="text-gray-400" />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="เนื่องจาก" name="detail">
            <Input.TextArea
              disabled
              rows={2}
              className="bg-gray-100 cursor-default hover:border-gray-300 focus:border-gray-300 focus:shadow-none"
              placeholder="รายละเอียดเหตุผลการลา"
            />
          </Form.Item>
        </Card>

        {/* Leave Details Card */}
        <Card
          className="mb-4 shadow-sm"
          title={
            <div className="flex items-center">
              <CalendarOutlined className="mr-2 text-green-500" />
              <span className="font-medium text-gray-700">รายละเอียดการลา</span>
            </div>
          }>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="ประเภทการลา" name="typeLeave">
                <Input disabled className="bg-gray-100 cursor-default hover:border-gray-300 focus:border-gray-300 focus:shadow-none" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="เป็นเวลา" name="leaveHour">
                <Input
                  disabled
                  className="bg-gray-100 cursor-default hover:border-gray-300 focus:border-gray-300 focus:shadow-none"
                  suffix={<span className="text-gray-400">ชั่วโมง</span>}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="ตั้งแต่วันที่" name="startDate">
                <Input
                  disabled
                  className="bg-gray-100 cursor-default hover:border-gray-300 focus:border-gray-300 focus:shadow-none"
                  prefix={<CalendarOutlined className="text-gray-400" />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="ถึงวันที่" name="endDate">
                <Input
                  disabled
                  className="bg-gray-100 cursor-default hover:border-gray-300 focus:border-gray-300 focus:shadow-none"
                  prefix={<CalendarOutlined className="text-gray-400" />}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Files Section */}
        {Array.isArray(dataLeaveFiles) && dataLeaveFiles.length > 0 && (
          <Card
            className="mb-4 shadow-sm"
            title={
              <div className="flex items-center">
                <PaperClipOutlined className="mr-2 text-purple-500" />
                <span className="font-medium text-gray-700">ไฟล์แนบ</span>
              </div>
            }>
            <div className="grid grid-cols-1 gap-2">
              {dataLeaveFiles.map((file: any, index: number) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <PaperClipOutlined className="text-blue-500 mr-3" />
                  <div className="flex-1">
                    <Tooltip title="คลิกเพื่อดาวน์โหลด">
                      <Button type="link" onClick={() => downloadFile(file.id, file.fileName)} className="p-0 h-auto text-left">
                        <span className="text-blue-600 hover:text-blue-800 font-medium">{file.fileName}</span>
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Approval Section */}
        {userApproved && (
          <Card
            className="mb-4 shadow-sm border-green-200"
            title={
              <div className="flex items-center">
                <CheckCircleOutlined className="mr-2 text-green-500" />
                <span className="text-green-600 font-medium">การอนุมัติ</span>
              </div>
            }>
            <div className="bg-green-50 p-4 rounded-lg">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="ผู้อนุมัติ" name="userApproved" className="mb-2">
                    <Input disabled className="bg-green-50 border-green-300 cursor-default" prefix={<UserOutlined className="text-green-500" />} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="วันที่อนุมัติ" name="approvedDate" className="mb-2">
                    <Input
                      disabled
                      className="bg-green-50 border-green-300 cursor-default"
                      prefix={<CalendarOutlined className="text-green-500" />}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Card>
        )}

        {/* Action Section */}
        <Card
          className="mb-4 shadow-sm border-orange-200"
          title={
            <div className="flex items-center">
              <EditOutlined className="mr-2 text-orange-500" />
              <span className="text-orange-600 font-medium">การดำเนินการ</span>
            </div>
          }>
          <div className="bg-orange-50 p-4 rounded-lg">
            <Form.Item label="เหตุผล/หมายเหตุ" name="detailApproved">
              <Input.TextArea rows={3} placeholder="กรอกเหตุผลหรือหมายเหตุสำหรับการอนุมัติ/ยกเลิก" />
            </Form.Item>

            <Divider className="my-4" />

            <div className="flex justify-center">
              <Space size="middle">
                <Tooltip title="อนุมัติ">
                  <Button
                    htmlType="submit"
                    type="primary"
                    size="large"
                    className="flex items-center justify-center px-6 transition-all duration-300 hover:-translate-y-[1px] hover:shadow-lg"
                    onClick={() => setSubmitAction("approved")}
                    disabled={statusById === "cancel" || statusById === "approved"}
                    icon={<CheckCircleOutlined />}>
                    อนุมัติ
                  </Button>
                </Tooltip>

                <Tooltip title="ยกเลิก">
                  <Button
                    htmlType="submit"
                    type="primary"
                    size="large"
                    danger
                    className="flex items-center justify-center px-6 transition-all duration-300 hover:-translate-y-[1px] hover:shadow-lg"
                    onClick={() => setSubmitAction("cancel")}
                    disabled={statusById === "cancel"}
                    icon={<CloseCircleOutlined />}>
                    ยกเลิก
                  </Button>
                </Tooltip>

                {intersection(sideMenuGroups, ["admin"]).length > 0 && (
                  <Tooltip title="ลบ">
                    <Button
                      type="primary"
                      size="large"
                      danger
                      className="flex items-center justify-center px-6 transition-all duration-300 hover:-translate-y-[1px] hover:shadow-lg"
                      onClick={() => {
                        onFinishDelete("delete", formdetail.getFieldValue("id") ? formdetail.getFieldValue("id") : 0);
                      }}
                      icon={<DeleteOutlined />}>
                      ลบ
                    </Button>
                  </Tooltip>
                )}
              </Space>
            </div>
          </div>
        </Card>

        <Form.Item hidden name="id">
          <Input />
        </Form.Item>
      </Form>
    </div>
  );
};
