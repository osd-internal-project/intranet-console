import React, { useEffect } from "react";
import { Button, Form, Input, Space, Tooltip, Row, Col, Card, Tag, Divider, FormInstance, DatePicker, Select, Switch } from "antd";
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
import { HourAmountToDateHourString } from "@/app/utils/format";
import type { ISelect } from "../../common";
import { timeOptions } from "@/app/utils/time-convertor";
import dayjs from "dayjs";

interface props {
  formdetail: FormInstance;
  downloadFile: (id: number, filename: string) => void;
  statusById: string;
  sideMenuGroups: any;
  onFinishUpdate: (values: string, type: string, Id: number) => void;
  onFinishDelete: (type: string, Id: number) => void;
  setSubmitAction: (value: "approved" | "cancel") => void;
  submitAction: string;
  typeLeavebyTypeId?: any;
  onFinishEdit: (type: string, data: any) => void;
  optionsTypeleave: ISelect[];
}

export const LeaveDetailFormEdit: React.FC<props> = ({
  formdetail,
  downloadFile,
  statusById,
  sideMenuGroups,
  onFinishUpdate,
  submitAction,
  onFinishEdit,
  optionsTypeleave,
}) => {
  const details = Form.useWatch([], formdetail) || {};
  const startDate = Form.useWatch("startDate", formdetail);
  const endDate = Form.useWatch("endDate", formdetail);
  const startTime = Form.useWatch("startTime", formdetail);
  const endTime = Form.useWatch("endTime", formdetail);
  const isFullDay = Form.useWatch("time_start_check", formdetail);
  const initialLeaveHour = Form.useWatch("leaveHour", formdetail);

  useEffect(() => {
    if (startDate && endDate && !dayjs(startDate).isSame(endDate, "day")) {
      formdetail.setFieldsValue({
        time_start_check: true,
        startTime: undefined,
        endTime: undefined,
      });
    }
  }, [startDate, endDate]);

  const formatLeave = (hour?: number) => {
    if (hour == null) return "ไม่มีข้อมูล";
    return hour % 8 === 0 ? `${hour / 8} วัน` : `${hour} ชม.`;
  };

  const HOURS_PER_DAY = 8;

  const calculateHours = () => {
    if (!startDate || !endDate) return initialLeaveHour;

    const sameDay = dayjs(startDate).isSame(endDate, "day");

    // ✅ วันเดียว
    if (sameDay) {
      if (isFullDay) return HOURS_PER_DAY;

      // ❗ ยังไม่เลือกเวลา → ใช้ค่าเดิม
      if (!startTime || !endTime) return initialLeaveHour;

      const start = dayjs(`${dayjs(startDate).format("YYYY-MM-DD")} ${startTime}`);
      const end = dayjs(`${dayjs(endDate).format("YYYY-MM-DD")} ${endTime}`);

      const diff = end.diff(start, "hour", true);
      return diff > 0 ? diff : initialLeaveHour;
    }

    // ✅ หลายวัน
    const days = dayjs(endDate).diff(dayjs(startDate), "day") + 1;
    return days * HOURS_PER_DAY;
  };

  const calculatedHour = calculateHours();

  const finalLeaveHour = calculatedHour !== undefined ? calculatedHour : initialLeaveHour;

  useEffect(() => {
    const newHour = calculateHours();

    if (newHour !== undefined && Number(newHour) !== Number(initialLeaveHour)) {
      formdetail.setFieldsValue({ leaveHour: newHour });
    }
  }, [startDate, endDate, startTime, endTime, isFullDay]);

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

      <Form autoComplete="off" form={formdetail} layout="vertical" onFinish={(e) => onFinishUpdate(e, submitAction, details.id ? details.id : 0)}>
        <Card
          className="mb-4 shadow-sm"
          title={
            <div className="flex items-center">
              <UserOutlined className="mr-2 text-blue-500" />
              <span className="font-medium text-gray-700">ข้อมูลทั่วไป</span>
            </div>
          }
        >
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
            <Input.TextArea rows={2} className=" focus:shadow-none" placeholder="รายละเอียดเหตุผลการลา" />
          </Form.Item>
        </Card>

        {/* Leave Details Card */}
        <Card
          className="mb-4 shadow-sm hover:shadow-md transition-shadow duration-200"
          title={
            <div className="flex items-center">
              <CalendarOutlined className="mr-2 text-green-500" />
              <span className="font-semibold text-gray-800">รายละเอียดการลา</span>
              <div className="ml-auto">{getStatusTag()}</div>
            </div>
          }
          bordered={false}
        >
          <Row gutter={[16, 0]}>
            {/* ประเภทการลา */}
            <Col xs={24} md={12}>
              <Form.Item label={<span className="font-medium text-gray-700">ประเภทการลา</span>} name="typeId">
                <Select options={optionsTypeleave} allowClear optionFilterProp="label" />
              </Form.Item>
            </Col>
            {/* เป็นเวลา */}
            <Col xs={24} md={12}>
              <Form.Item label={<span className="font-medium text-gray-700">เป็นเวลา</span>}>{formatLeave(finalLeaveHour)}</Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            {/* ตั้งแต่วันที่ */}
            <Col xs={24} md={12}>
              <Form.Item label={<span className="font-medium text-gray-700">ตั้งแต่วันที่</span>} name="startDate">
                <DatePicker format="DD/MM/YYYY" className="w-full" />
              </Form.Item>
            </Col>
            {/* ถึงวันที่ */}
            <Col xs={24} md={12}>
              <Form.Item label={<span className="font-medium text-gray-700">ถึงวันที่</span>} name="endDate">
                <DatePicker format="DD/MM/YYYY" className="w-full" />
              </Form.Item>
            </Col>
            <>
              {startDate && endDate && dayjs(startDate).isSame(endDate, "day") && (
                <div className="w-full grid grid-cols-4 gap-2">
                  <div className="col-span-3 md:col-span-1">
                    <Form.Item label="ลา 1 วัน" name="time_start_check" valuePropName="checked">
                      <Switch unCheckedChildren="ไม่" checkedChildren="ใช่" />
                    </Form.Item>
                  </div>
                  {!isFullDay && (
                    <>
                      <div className="col-span-3 md:col-span-1">
                        <Form.Item label="เวลาเริ่มต้น :" name="startTime" rules={[{ required: true, message: "กรุณาเลือกเวลาที่เริ่มลา" }]}>
                          <Select
                            showSearch={false}
                            virtual
                            allowClear
                            className="w-full"
                            placeholder="เลือกช่วงเวลา"
                            options={timeOptions.map((time) => ({
                              value: time,
                              label: time,
                            }))}
                          />
                        </Form.Item>
                      </div>

                      <div className="col-span-3 md:col-span-1">
                        <Form.Item label="เวลาสิ้นสุด :" name="endTime" rules={[{ required: true, message: "กรุณาเลือกเวลาที่สิ้นสุดการลา" }]}>
                          <Select
                            showSearch={false}
                            virtual
                            allowClear
                            className="w-full"
                            placeholder="เลือกช่วงเวลา"
                            options={timeOptions.map((time) => ({
                              value: time,
                              label: time,
                            }))}
                          />
                        </Form.Item>
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          </Row>
        </Card>
        {/* Files Section */}
        {Array.isArray(details?.dataLeaveFiles) && details?.dataLeaveFiles.length > 0 && (
          <Card
            className="mb-4 shadow-sm"
            title={
              <div className="flex items-center">
                <PaperClipOutlined className="mr-2 text-purple-500" />
                <span className="font-medium text-gray-700">ไฟล์แนบ</span>
              </div>
            }
          >
            <div className="grid grid-cols-1 gap-2">
              {details?.dataLeaveFiles.map((file: any, index: number) => (
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
        {details.userApproved && (
          <Card
            className="mb-4 shadow-sm border-green-200"
            title={
              <div className="flex items-center">
                <CheckCircleOutlined className="mr-2 text-green-500" />
                <span className="text-green-600 font-medium">การอนุมัติ</span>
              </div>
            }
          >
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

        <Card>
          <Form.Item
            label="สาเหตุที่ทำการอัพเดต"
            name="commentUpdated"
            className="mb-2"
            rules={[{ required: true, message: "กรุณากรอกสาเหตุที่ทำการอัพเดต" }]}
          >
            <Input.TextArea rows={2} showCount maxLength={250} />
          </Form.Item>
        </Card>

        <Space className="flex justify-center">
          {intersection(sideMenuGroups, ["hr", "admin"]).length > 0 && (
            <Tooltip title="แก้ไขข้อมูล">
              <Button
                type="primary"
                className="flex items-center justify-center  transition-all duration-300 hover:-translate-y-[1px] hover:shadow-lg"
                onClick={() => {
                  onFinishEdit("edit", details);
                }}
              >
                {`แก้ไขข้อมูล`}
              </Button>
            </Tooltip>
          )}
        </Space>
        <Form.Item hidden name="id">
          <Input />
        </Form.Item>
        <Form.Item hidden name="userId">
          <Input />
        </Form.Item>
        <Form.Item hidden name="reqLeaveHour">
          <Input />
        </Form.Item>
        <Form.Item hidden name="yearLeaveHour">
          <Input />
        </Form.Item>
        <Form.Item hidden name="usedLeaveHour">
          <Input />
        </Form.Item>
        <Form.Item hidden name="beforeLeaveHour">
          <Input />
        </Form.Item>
        <Form.Item hidden name="afterLeaveHour">
          <Input />
        </Form.Item>
        <Form.Item hidden name="dataLeaveFiles">
          <Input />
        </Form.Item>
      </Form>
    </div>
  );
};
