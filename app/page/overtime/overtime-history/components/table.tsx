import { IOverTimeForm } from "@/app/common/overtime";
import { dateFormatTimeNoTIme } from "@/app/utils";
import { CarOutlined, ClockCircleOutlined, PhoneOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Switch,
  Table,
  TablePaginationConfig,
  TableProps,
  Tag,
  Typography,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { intersection } from "lodash";
import React, { useState } from "react";

export interface Props {
  dataResource: { data: IOverTimeForm[]; total: number };
  pagination: TablePaginationConfig;
  changePagination: (page: TablePaginationConfig) => void;
  onFinishUpdate: (values: IOverTimeForm, type: string) => void;
  onFinishDelete: (id: string) => void;
  sideMenuGroups: any;
  handleOpenModal: (status: boolean, data: IOverTimeForm) => void;
}

const TableOvertimeHistory: React.FC<Props> = ({
  dataResource,
  pagination,
  changePagination,
  onFinishUpdate,
  onFinishDelete,
  sideMenuGroups,
  handleOpenModal,
}): React.ReactElement => {
  const { Option } = Select;
  const { Text } = Typography;
  const [formUpdate] = Form.useForm();
  const dataDetail = formUpdate.getFieldsValue(true);
  const [openModal, setOpenModal] = useState<{ status: boolean; type: string }>({ status: false, type: "create" });
  const handleUpdateApproved = (status: boolean, data: IOverTimeForm | null, type: string) => {
    // onFinishUpdate(data, type);
    setOpenModal({ status, type });
    formUpdate.setFieldsValue({
      ...data,
      dateStart: data?.dateStart ? dayjs(data?.dateStart) : null,
      startTime: data?.startTime,
      endTime: data?.endTime,
      approvedDate: data?.approvedDate ? dayjs(data?.approvedDate) : null,
      createdAt: data?.createdAt ? dayjs(data?.createdAt) : null,
      updatedAt: data?.updatedAt ? dayjs(data?.updatedAt) : null,
    });
  };

  const columns: TableProps<IOverTimeForm>["columns"] = [
    {
      key: "no",
      title: "ลำดับ",
      dataIndex: "no",
      render: (id, record, index) => (pagination.current && pagination.pageSize ? (pagination.current - 1) * pagination.pageSize + (index + 1) : ""),
    },
    {
      key: "fullname",
      title: "ชื่อ - สกุล",
      dataIndex: "fullname",
    },
    {
      key: "dateStart",
      title: "วันที่ทำ OT",
      dataIndex: "dateStart",
      render: (_) => dateFormatTimeNoTIme(_),
    },
    {
      key: "detailWork",
      title: "รายละเอียดการทำ OT",
      dataIndex: "detailWork",
    },
    {
      key: "partTimeType",
      title: "ประเภทการทำ OT",
      dataIndex: "partTimeType",
      align: "center",
      render: (status: string) => {
        return <Tag>{status === "working" ? "ทำงาน" : "ขับรถ"}</Tag>;
      },
    },
    {
      key: "id",
      title: "เวลาเริ่ม - เวลาสิ้นสุด",
      dataIndex: "id",
      render: (_, record) => (
        <span>
          {record.startTime} - {record.endTime}
        </span>
      ),
    },
    {
      key: "typeDate",
      title: "วันที่ทำการ",
      dataIndex: "typeDate",
      render: (_) => <span>{_ === "normall" ? "วันปกติ" : "วันหยุด"}</span>,
    },

    {
      key: "totalTime",
      title: "ระยะเวลารวม",
      dataIndex: "totalTime",
    },
    {
      key: "workingTime",
      title: "ระยะเวลาทำงาน",
      dataIndex: "workingTime",
    },
    {
      key: "breakTime",
      title: "พัก",
      dataIndex: "breakTime",
    },
    {
      key: "id",
      title: "รายละเอียด",
      dataIndex: "id",
      render: (status, record) => {
        return <Button type="primary" size="small" onClick={() => handleOpenModal(true, record)}>{`รายละเอียด`}</Button>;
      },
    },
    {
      key: "status",
      title: "สถานะ",
      dataIndex: "status",
      render: (status: string) => {
        let color = "";
        let text = "";
        switch (status) {
          case "waiting":
            color = "blue";
            text = "กำลังรออนุมัติ";
            break;
          case "approved":
            color = "green";
            text = "อนุมัติสำเร็จ";
            break;
          case "reject":
            color = "red";
            text = "ไม่อนุมัติ";
            break;
          case "cancel":
            color = "red";
            text = "ยกเลิก";
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
      fixed: "right",
      key: "id",
      title: "...",
      dataIndex: "id",
      render: (_, record) => {
        return (
          <div className="flex justify-center gap-2">
            <div>
              <Button
                size="small"
                type="link"
                onClick={() =>
                  //  onFinishUpdate(record, "approved")
                  handleUpdateApproved(true, record, "approved")
                }
                disabled={record.status !== "waiting"}>
                อนุมัติ
              </Button>
            </div>
            <div>
              <Button
                size="small"
                type="link"
                danger
                onClick={() =>
                  // onFinishUpdate(record, "reject")
                  handleUpdateApproved(true, record, "reject")
                }
                // disabled={record.status !== "waiting"}
              >
                ไม่อนุมัติ
              </Button>
            </div>
            <div>
              <Button
                size="small"
                type="link"
                danger
                onClick={() =>
                  // onFinishUpdate(record, "cancel")
                  handleUpdateApproved(true, record, "cancel")
                }
                disabled={record.status !== "waiting"}>
                ยกเลิก
              </Button>
            </div>
            {intersection(sideMenuGroups, ["hr"]).length ? (
              <div>
                <Button size="small" type="link" danger onClick={() => onFinishDelete(record.overTimeID ? record.overTimeID : "")}>
                  ลบ
                </Button>
              </div>
            ) : null}
          </div>
        );
      },
      width: 150,
      align: "center",
    },
  ];
  return (
    <div>
      <Table
        columns={columns}
        size="small"
        dataSource={dataResource.data}
        rowKey="id"
        onChange={changePagination}
        pagination={{ ...pagination, total: dataResource.total, showSizeChanger: true }}
        scroll={{ x: "max-content" }}
      />
      {openModal.status ? (
        <>
          <Modal
            width={900}
            title={`${openModal.type === "cancel" ? "ยกเลิก" : openModal.type === "reject" ? "ไม่อนุมัติ" : "อนุมัติ"}`}
            closable={{ "aria-label": "Custom Close Button" }}
            open={openModal.status}
            footer={false}
            onCancel={() => handleUpdateApproved(false, null, "close")}>
            <Form form={formUpdate} layout="vertical" onFinish={(record) => onFinishUpdate(record, openModal.type)} className="space-y-4">
              <Form.Item name="overTimeID" label="Overtime ID" hidden>
                <Input readOnly />
              </Form.Item>
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

              <Form.Item name="approvedDetail" label="รายละเอียดการดำเนินการ">
                <Input.TextArea rows={3} placeholder="เช่น งานเรียบร้อยดี / มีปัญหา..." />
              </Form.Item>
              <div className="flex justify-center gap-2">
                <Button
                  htmlType="submit"
                  type="primary"
                  style={{
                    backgroundColor: openModal.type === "reject" || openModal.type === "cancel" ? "#ff4d4f" : "#228B22",
                    borderColor: openModal.type === "reject" || openModal.type === "cancel" ? "#ff4d4f" : "#228B22",
                  }}>
                  {`${openModal.type === "cancel" ? "ยกเลิก" : openModal.type === "reject" ? "ไม่อนุมัติ" : "อนุมัติ"}`}
                </Button>
              </div>
            </Form>
          </Modal>
        </>
      ) : null}
    </div>
  );
};

export default TableOvertimeHistory;
