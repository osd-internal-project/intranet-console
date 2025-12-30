import React from "react";
import {
  Button,
  Form,
  Input,
  Space,
  Tooltip,
  Row,
  Col,
  Card,
  Tag,
  Divider,
  FormInstance,
} from "antd";
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
import type { ITypetypeleave } from "../../common";
import { HourAmountToDateHourObj, HourAmountToDateHourString } from "@/app/utils/format";

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
  typeLeavebyTypeId,
}) => {
  // console.log("typeLeavebyTypeId: ", typeLeavebyTypeId);
  // console.log("formdetail: ", formdetail);
  // console.log("formdetail.getFieldsValue(): ", formdetail.getFieldsValue());
  // console.log("statusById: ", statusById);
  const details = Form.useWatch([], formdetail) || {};
  // console.log("details: ", details);

  // const userApproved = formdetail.getFieldValue("userApproved");
  // const dataLeaveFiles = formdetail.getFieldValue("dataLeaveFiles");

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
        onFinish={(e) =>
          onFinishUpdate(
            e,
            submitAction,
            formdetail.getFieldValue("id") ? formdetail.getFieldValue("id") : 0
          )
        }
      >
        {/* Basic Information Card */}
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
          className="mb-4 shadow-sm hover:shadow-md transition-shadow duration-200"
          title={
            <div className="flex items-center">
              <CalendarOutlined className="mr-2 text-green-500" />
              <span className="font-semibold text-gray-800">
                รายละเอียดการลา
              </span>
            </div>
          }
          bordered={false}
        >
          <Row gutter={[5, 5]} className="mb-8">
            {[
              { label: "สิทธิ์ทั้งหมด", value: details.yearLeaveHour ? HourAmountToDateHourString(details.yearLeaveHour) : "-", color: "text-gray-700", bg: "bg-gray-100", border: "border-gray-200" },
              { label: "ใช้ไปแล้ว", value: details.usedLeaveHour ? HourAmountToDateHourString(details.usedLeaveHour) : "-", color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
              { label: "ขอลาครั้งนี้", value: details.reqLeaveHour ? HourAmountToDateHourString(details.reqLeaveHour) : "-", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-100" },
              { label: "คงเหลือเดิม", value: details.beforeLeaveHour ? HourAmountToDateHourString(details.beforeLeaveHour) : "-", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" },
              { label: "คงเหลือใหม่", value: details.afterLeaveHour ? HourAmountToDateHourString(details.afterLeaveHour) : "-", color: "text-green-700", bg: "bg-green-50", border: "border-green-200" },
            ].map((item, idx) => (
            <Col key={idx} xs={12} style={{ flex: 1 }} className="flex-grow">
              <div className={`${item.bg} ${item.border} rounded-xl border shadow-sm h-full flex flex-col transition-all hover:shadow-md overflow-hidden`}>
                <div className="w-full py-2 text-center items-center border-b border-black/5">
                  <span className="text-[13px] text-gray-600 font-bold leading-tight block">
                    {item.label}
                  </span>
                </div>

                <div className="flex items-center justify-center flex-col flex-grow py-3">
                  <span className={`text-[13px] font-black ${item.color} mb-1`}>
                    {item.value}
                  </span>
                    {/* <span className={`text-[13px] font-medium ${item.color} opacity-80`}>
                      {item.unit}
                    </span> */}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
          <Row gutter={[16, 0]}>
            {/* ประเภทการลา */}
            <Col xs={24} md={12}>
              <Form.Item
                label={
                  <span className="font-medium text-gray-700">ประเภทการลา</span>
                }
                name="typeLeave"
              >
                <Input
                  disabled
                  className="bg-gray-50 cursor-default border-gray-200"
                  size="middle"
                />
              </Form.Item>
            </Col>

            {/* เป็นเวลา */}
            <Col xs={24} md={12}>
              <Form.Item
                label={
                  <div className="space-y-1">
                    <span className="font-medium text-gray-700">เป็นเวลา</span>
                  </div>
                }
                name="leaveHour"
              >
                <Input
                  disabled
                  className="bg-gray-50 cursor-default border-gray-200"
                  size="middle"
                // suffix={<span className="text-gray-500 font-medium">ชั่วโมง</span>}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            {/* ตั้งแต่วันที่ */}
            <Col xs={24} md={12}>
              <Form.Item
                label={
                  <span className="font-medium text-gray-700">
                    ตั้งแต่วันที่
                  </span>
                }
                name="startDate"
              >
                <Input
                  disabled
                  className="bg-gray-50 cursor-default border-gray-200"
                  size="middle"
                  prefix={<CalendarOutlined className="text-green-500" />}
                />
              </Form.Item>
            </Col>
            {/* ถึงวันที่ */}
            <Col xs={24} md={12}>
              <Form.Item
                label={
                  <span className="font-medium text-gray-700">ถึงวันที่</span>
                }
                name="endDate"
              >
                <Input
                  disabled
                  className="bg-gray-50 cursor-default border-gray-200"
                  size="middle"
                  prefix={<CalendarOutlined className="text-green-500" />}
                />
              </Form.Item>
            </Col>
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
                <div
                  key={index}
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <PaperClipOutlined className="text-blue-500 mr-3" />
                  <div className="flex-1">
                    <Tooltip title="คลิกเพื่อดาวน์โหลด">
                      <Button
                        type="link"
                        onClick={() => downloadFile(file.id, file.fileName)}
                        className="p-0 h-auto text-left"
                      >
                        <span className="text-blue-600 hover:text-blue-800 font-medium">
                          {file.fileName}
                        </span>
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
                  <Form.Item
                    label="ผู้อนุมัติ"
                    name="userApproved"
                    className="mb-2"
                  >
                    <Input
                      disabled
                      className="bg-green-50 border-green-300 cursor-default"
                      prefix={<UserOutlined className="text-green-500" />}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="วันที่อนุมัติ"
                    name="approvedDate"
                    className="mb-2"
                  >
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
          }
        >
          <div className="bg-orange-50 p-4 rounded-lg">
            <Form.Item label="เหตุผล/หมายเหตุ" name="detailApproved">
              <Input.TextArea
                rows={3}
                placeholder="กรอกเหตุผลหรือหมายเหตุสำหรับการอนุมัติ/ยกเลิก"
              />
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
                    disabled={
                      statusById === "cancel" || statusById === "approved"
                    }
                    icon={<CheckCircleOutlined />}
                  >
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
                    icon={<CloseCircleOutlined />}
                  >
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
                        onFinishDelete(
                          "delete",
                          formdetail.getFieldValue("id")
                            ? formdetail.getFieldValue("id")
                            : 0
                        );
                      }}
                      icon={<DeleteOutlined />}
                    >
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
