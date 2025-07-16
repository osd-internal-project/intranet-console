"use client";
import { PaperClipOutlined, CalendarOutlined, UserOutlined, PhoneOutlined, FileTextOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Button, Form, FormInstance, Input, Modal, Space, Tooltip, Card, Divider, Tag, Row, Col } from "antd";
import React from "react";

export interface props {
  modalDataLeaveDetail: boolean;
  onCancelModalDetail: () => void;
  formDetail: FormInstance;
  downloadFile: (fileId: number, fileName: string) => void;
}

export const LeaveHistoryCalendarDetail: React.FC<props> = ({
  modalDataLeaveDetail,
  onCancelModalDetail,
  formDetail,
  downloadFile,
}): React.ReactElement => {
  const userApproved = formDetail.getFieldValue("userApproved");
  const dataLeaveFiles = formDetail.getFieldValue("dataLeaveFiles");

  return (
    <div>
      <Modal
        forceRender
        title={null}
        open={modalDataLeaveDetail}
        footer={null}
        onCancel={() => onCancelModalDetail()}
        width={700}
        bodyStyle={{ padding: 0 }}
        className="[&_.ant-modal-content]:!p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-center">
            <FileTextOutlined className="text-2xl mr-3" />
            <h2 className="text-xl font-bold mb-0">รายละเอียดการลา</h2>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <Form autoComplete="off" form={formDetail} layout="vertical">
            {/* Basic Information Card */}
            <Card
              className="mb-4 shadow-sm [&_.ant-card-head]:bg-gradient-to-r [&_.ant-card-head]:from-gray-50 [&_.ant-card-head]:to-gray-100 [&_.ant-card-head]:border-b-2 [&_.ant-card-head]:border-gray-200 [&_.ant-card-head-title]:font-semibold [&_.ant-card-head-title]:text-gray-700"
              title={
                <div className="flex items-center">
                  <UserOutlined className="mr-2 text-blue-500" />
                  <span>ข้อมูลทั่วไป</span>
                </div>
              }>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="วันที่สร้าง" name="createAt">
                    <Input
                      disabled
                      className="bg-gray-50 cursor-default hover:border-gray-300 focus:border-gray-300 focus:shadow-none"
                      prefix={<CalendarOutlined className="text-gray-400" />}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="เรียนถึง" name="ownerName">
                    <Input
                      disabled
                      className="bg-gray-50 cursor-default hover:border-gray-300 focus:border-gray-300 focus:shadow-none"
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
                      className="bg-gray-50 cursor-default hover:border-gray-300 focus:border-gray-300 focus:shadow-none"
                      prefix={<UserOutlined className="text-gray-400" />}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="เบอร์ติดต่อระหว่างลา" name="phoneNumber">
                    <Input
                      disabled
                      className="bg-gray-50 cursor-default hover:border-gray-300 focus:border-gray-300 focus:shadow-none"
                      prefix={<PhoneOutlined className="text-gray-400" />}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="เนื่องจาก" name="detail">
                <Input.TextArea
                  disabled
                  className="bg-gray-50 cursor-default hover:border-gray-300 focus:border-gray-300 focus:shadow-none"
                  rows={2}
                  placeholder="รายละเอียดเหตุผลการลา"
                />
              </Form.Item>
            </Card>

            {/* Leave Details Card */}
            <Card
              className="mb-4 shadow-sm [&_.ant-card-head]:bg-gradient-to-r [&_.ant-card-head]:from-gray-50 [&_.ant-card-head]:to-gray-100 [&_.ant-card-head]:border-b-2 [&_.ant-card-head]:border-gray-200 [&_.ant-card-head-title]:font-semibold [&_.ant-card-head-title]:text-gray-700"
              title={
                <div className="flex items-center">
                  <CalendarOutlined className="mr-2 text-green-500" />
                  <span>รายละเอียดการลา</span>
                </div>
              }>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="ประเภทการลา" name="typeLeave">
                    <Input disabled className="bg-gray-50 cursor-default hover:border-gray-300 focus:border-gray-300 focus:shadow-none" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="เป็นเวลา" name="leaveHour">
                    <Input
                      disabled
                      className="bg-gray-50 cursor-default hover:border-gray-300 focus:border-gray-300 focus:shadow-none"
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
                      className="bg-gray-50 cursor-default hover:border-gray-300 focus:border-gray-300 focus:shadow-none"
                      prefix={<CalendarOutlined className="text-gray-400" />}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="ถึงวันที่" name="endDate">
                    <Input
                      disabled
                      className="bg-gray-50 cursor-default hover:border-gray-300 focus:border-gray-300 focus:shadow-none"
                      prefix={<CalendarOutlined className="text-gray-400" />}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* Files Section */}
            {Array.isArray(dataLeaveFiles) && dataLeaveFiles.length > 0 && (
              <Card
                className="mb-4 shadow-sm [&_.ant-card-head]:bg-gradient-to-r [&_.ant-card-head]:from-gray-50 [&_.ant-card-head]:to-gray-100 [&_.ant-card-head]:border-b-2 [&_.ant-card-head]:border-gray-200 [&_.ant-card-head-title]:font-semibold [&_.ant-card-head-title]:text-gray-700"
                title={
                  <div className="flex items-center">
                    <PaperClipOutlined className="mr-2 text-purple-500" />
                    <span>ไฟล์แนบ</span>
                  </div>
                }>
                <div className="grid grid-cols-1 gap-2">
                  {dataLeaveFiles.map((file: any, index: number) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
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
                className="shadow-sm border-green-200 [&_.ant-card-head]:bg-gradient-to-r [&_.ant-card-head]:from-gray-50 [&_.ant-card-head]:to-gray-100 [&_.ant-card-head]:border-b-2 [&_.ant-card-head]:border-gray-200 [&_.ant-card-head-title]:font-semibold [&_.ant-card-head-title]:text-gray-700"
                title={
                  <div className="flex items-center">
                    <CheckCircleOutlined className="mr-2 text-green-500" />
                    <span className="text-green-600">การอนุมัติ</span>
                  </div>
                }>
                <div className="bg-green-50 p-4 rounded-lg">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="ผู้อนุมัติ" name="userApproved" className="mb-2">
                        <Input
                          disabled
                          className="bg-gray-50 cursor-default hover:border-green-300 focus:border-green-300 focus:shadow-none border-green-300"
                          prefix={<UserOutlined className="text-green-500" />}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="วันที่อนุมัติ" name="approvedDate" className="mb-2">
                        <Input
                          disabled
                          className="bg-gray-50 cursor-default hover:border-green-300 focus:border-green-300 focus:shadow-none border-green-300"
                          prefix={<CalendarOutlined className="text-green-500" />}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <div className="text-center mt-2">
                    <Tag color="success" className="px-4 py-1 font-medium rounded-full">
                      <CheckCircleOutlined className="mr-1" />
                      อนุมัติแล้ว
                    </Tag>
                  </div>
                </div>
              </Card>
            )}
          </Form>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 rounded-b-lg text-center">
          <Button
            type="primary"
            size="large"
            onClick={() => onCancelModalDetail()}
            className="px-8 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
            ปิด
          </Button>
        </div>
      </Modal>
    </div>
  );
};
