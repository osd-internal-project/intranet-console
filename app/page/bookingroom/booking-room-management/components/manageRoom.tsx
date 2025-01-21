import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  Tag,
  Button,
  Row,
  Col,
  Space,
  Modal,
  Form,
  Input,
  Divider,
  message,
  Select,
  Collapse,
  DatePicker,
  Popconfirm,
  TablePaginationConfig,
} from "antd";
import dayjs from "dayjs";
import { useForm } from "antd/es/form/Form";
import isBetween from "dayjs/plugin/isBetween";
import type { TableProps, FormProps } from "antd";
import { CaretRightOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { BookingType, MasterRoomType } from "../common";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManageRoomServices } from "../services/manage-room.service";
import { UserContectType, UserContext } from "@/app/config/userContext";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";

dayjs.extend(isBetween);

const ManageRoom: React.FC = () => {
  const [form] = useForm();
  const { user } = (useContext(UserContext) as UserContectType) || {
    user: null,
  };
  const { id24Axios } = useId24();
  const baseUrIntranet = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_INTRANET);
  const [modalEditBooking, setModalEditBooking] = useState(false);
  const [modalApproveBooking, setModalApproveBooking] = useState(false);
  const [bookingStatus, setBookingStatus] = useState("");
  const [bookingData, setBookingData] = useState<BookingType[]>([]);
  const [masterRoomData, setMasterRoomData] = useState<MasterRoomType[]>([]);
  const [currentBookingId, setCurrentBookingId] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [loading, setloading] = useState<boolean>(true);
  const [modalBookingDetails, setModalBookingDetails] = useState(false);
  const [currentBookingDetails, setCurrentBookingDetails] = useState<BookingType | null>(null);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    if (loading === true) fetchData();
  }, [loading]);

  const fetchData = async () => {
    const skip: number = (Number(pagination.current) - 1) * Number(pagination.pageSize);
    const take: number = Number(pagination.pageSize);
    try {
      const masterRoom = await ManageRoomServices(baseUrIntranet).getMasterRoomQuery();
      const masterRoomActive = masterRoom.filter((room: any) => room.roomsStatus === true);
      setMasterRoomData(masterRoomActive);
      const bookings = await ManageRoomServices(baseUrIntranet).findBookingRoom(skip, take);
      setPagination({ ...pagination, total: bookings.count });
      setBookingData(
        bookings.data.map((item: any, index: number) => ({
          ...item,
          key: index.toString(),
          id: item.id,
        })),
      );
      setloading(false);
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  const changePagination = (page: TablePaginationConfig) => {
    setPagination({ ...page });
    setloading(true);
  };

  const columns: TableProps<BookingType>["columns"] = [
    {
      title: "ลำดับ",
      dataIndex: "no",
      key: "no",
      render: (id: number, record: any, index: number) =>
        pagination.current && pagination.pageSize ? (pagination.current - 1) * pagination.pageSize + (index + 1) : "",
    },
    {
      title: "ชื่อห้องประชุม",
      dataIndex: "roomName",
      key: "roomName",
    },
    {
      title: "ประเภทการจอง",
      dataIndex: "roomType",
      key: "roomType",
    },
    {
      title: "วันที่จอง",
      key: "bookingDate",
      render: (_, record) => (
        <span>
          {dayjs(record.startDate).format("DD-MM-YYYY")} - {dayjs(record.endDate).format("DD-MM-YYYY")}
        </span>
      ),
    },
    {
      title: "เวลาจอง",
      key: "bookingTime",
      render: (_, record) => (
        <span>
          {dayjs(record.startDate).format("HH:mm")} - {dayjs(record.endDate).format("HH:mm")}
        </span>
      ),
    },
    {
      title: "ชื่อผู้จอง",
      dataIndex: "bookerName",
      key: "bookerName",
    },
    {
      title: "สถานะ",
      key: "bookingStatus",
      dataIndex: "bookingStatus",
      render: (status: string) => (
        <Tag
          color={
            status === "process" ? "blue" : status === "Approve" ? "green" : status === "cancel" ? "red" : status === "Reject" ? "red" : undefined
          }>
          {status === "process"
            ? "กำลังรออนุมัติ"
            : status === "Approve"
            ? "อนุมัติสำเร็จ"
            : status === "Reject"
            ? "ไม่อนุมัติ"
            : status === "cancel"
            ? "ยกเลิกการจอง"
            : ""}
        </Tag>
      ),
    },
    {
      title: "จัดการ",
      key: "note",
      dataIndex: "note",
      render: (_, record) => {
        return (
          <Space>
            {record.bookingStatus === "process" && <a onClick={() => showModalEditBooking(record)}>แก้ไข</a>}
            <Popconfirm title="คุณแน่ใจหรือไม่ว่าต้องการลบการจองนี้?" onConfirm={() => handleDeleteBooking(record.id)} okText="ใช่" cancelText="ไม่">
              <a>ลบ</a>
            </Popconfirm>
            {record.bookingStatus === "process" && <a onClick={() => showModalApproveBooking(record)}>อนุมัติ</a>}
            {record.bookingStatus === "Approve" && <a onClick={() => showModalApproveBooking(record)}>ยกเลิกอนุมัติ</a>}
            <a type="link" onClick={() => showModalBookingDetails(record)}>
              รายละเอียด
            </a>
          </Space>
        );
      },
    },
  ];

  const renderStatusTag = (status: any) => {
    switch (status) {
      case "Approve":
        return <Tag color={"green"}>อนุมัติสำเร็จ</Tag>;
      case "Reject":
        return <Tag color="red">ไม่อนุมัติ</Tag>;
      case "process":
        return <Tag color={"blue"}>กำลังรออนุมัติ</Tag>;
      case "cancel":
        return <Tag color="red">ยกเลิกการจอง</Tag>;
      default:
        return "Unknown Status";
    }
  };

  const showModalBookingDetails = (record: BookingType) => {
    setCurrentBookingDetails(record);
    setModalBookingDetails(true);
  };

  const handleBookingDetailsCancel = () => {
    setModalBookingDetails(false);
    setCurrentBookingDetails(null);
  };

  const showModalEditBooking = (record: BookingType) => {
    if (record.bookingStatus === "Approve") {
      message.warning("ไม่สามารถแก้ไขการจองที่อนุมัติแล้วได้");
      return;
    }
    setCurrentBookingId(record.id);
    form.setFieldsValue({
      ...record,
      startDate: dayjs(record.startDate),
      endDate: dayjs(record.endDate),
    });
    setModalEditBooking(true);
  };

  const handleEditBookingCancel = () => {
    setModalEditBooking(false);
  };

  const showModalApproveBooking = (record: BookingType) => {
    setBookingStatus(record.bookingStatus);
    setCurrentBookingId(record.id);
    setModalApproveBooking(true);
  };

  const handleApproveBookingCancel = () => {
    setModalApproveBooking(false);
  };

  const handleDeleteBooking = async (id: string) => {
    setSubmitLoading(true);
    try {
      await ManageRoomServices(baseUrIntranet).deleteBooking(id);
      setBookingData(bookingData.filter((item) => item.id !== id));
      message.success("ลบข้อมูลการจองสำเร็จ");
      setSubmitLoading(false);
    } catch (error) {
      message.error("ลบข้อมูลการจองไม่สำเร็จ");
    }
  };

  const updatedBooking: FormProps<BookingType>["onFinish"] = async (values) => {
    setSubmitLoading(true);

    if (currentBookingId === null) {
      message.error("No booking selected for update");
      return;
    }

    try {
      const { startDate, endDate, roomName, ...restValues } = values;
      const updatedStartDate = startDate.toISOString();
      const updatedEndDate = endDate.toISOString();

      const today = new Date();
      if (new Date(updatedStartDate) < today) {
        message.error("ไม่สามารถจองในวันที่ผ่านมาได้");
        setSubmitLoading(false);
        return;
      }

      if (new Date(updatedEndDate) < new Date(updatedStartDate)) {
        message.error("วันที่สิ้นสุดการจองต้องหลังวันที่เริ่มการจอง");
        setSubmitLoading(false);
        return;
      }

      const existingBookings = await ManageRoomServices(baseUrIntranet).getBookingRoomQuery();

      const hasOverlap = existingBookings.some((booking: BookingType) => {
        if (booking.roomName === roomName && booking.id !== currentBookingId) {
          const existingStart = dayjs(booking.startDate);
          const existingEnd = dayjs(booking.endDate);
          const newStart = dayjs(updatedStartDate);
          const newEnd = dayjs(updatedEndDate);

          return (
            newStart.isBetween(existingStart, existingEnd, null, "[)") ||
            newEnd.isBetween(existingStart, existingEnd, null, "(]") ||
            existingStart.isBetween(newStart, newEnd, null, "[)") ||
            existingEnd.isBetween(newStart, newEnd, null, "(]")
          );
        }
        return false;
      });

      if (hasOverlap) {
        message.error("ไม่สามารถแก้ไขการจองนี้ได้เนื่องจากมีการจองห้องนี้ในช่วงเวลานี้แล้ว");
        setSubmitLoading(false);
        return;
      }

      const updatedBooking = {
        ...restValues,
        id: currentBookingId,
        roomName,
        startDate: updatedStartDate,
        endDate: updatedEndDate,
      };

      await ManageRoomServices(baseUrIntranet).updateBooking(updatedBooking);
      fetchData();
      message.success("แก้ไขการจองสำเร็จ");
      setSubmitLoading(false);
      setModalEditBooking(false);
    } catch (error) {
      message.error("แก้ไขการจองไม่สำเร็จ");
      setSubmitLoading(false);
    }
  };

  const onFinishApprove = async (status: "Approve" | "Reject" | "process") => {
    setSubmitLoading(true);
    try {
      const updatedApproveBooking = {
        id: currentBookingId,
        approverId: user?.userId,
        approver: `${user?.firstNameTh} ${user?.lastNameTh}`,
        bookingStatus: status,
        approveDate: dayjs(),
      };
      await ManageRoomServices(baseUrIntranet).updateBooking(updatedApproveBooking);
      setModalApproveBooking(false);
      fetchData();
      message.success(status === "Approve" ? "อนุมัติการจองสำเร็จ" : status === "Reject" ? "ปฏิเสธการจองสำเร็จ" : "ยกเลิกการอนุมัติสำเร็จ");
      setSubmitLoading(false);
    } catch (error) {
      message.error(status === "Approve" ? "อนุมัติการจองไม่สำเร็จ" : status === "Reject" ? "ปฏิเสธการจองไม่สำเร็จ" : "ยกเลิกการอนุมัติไม่สำเร็จ");
    }
  };

  return (
    <>
      <Modal title="จองห้องประชุม" open={modalEditBooking} onCancel={handleEditBookingCancel} footer={null} width={1000}>
        <Form form={form} layout="vertical" name="edit_booking" initialValues={{ remember: true }} onFinish={updatedBooking} autoComplete="off">
          <Form.Item<BookingType> name="bookingId" hidden>
            <Input />
          </Form.Item>
          <Divider orientation="left">ข้อมูลผู้จอง</Divider>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item<BookingType> label="ชื่อผู้จอง" name="bookerName" rules={[{ required: true, message: "กรุณากรอกชื่อผู้จอง!" }]}>
                <Input disabled placeholder="กรอกชื่อผู้จอง" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<BookingType>
                label="เบอร์โทรศัพท์ผู้จอง"
                name="bookerPhone"
                rules={[{ required: true, message: "กรุณากรอกเบอร์โทรศัพท์ผู้จอง!" }]}>
                <Input disabled placeholder="กรอกเบอร์โทรศัพท์ผู้จอง" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<BookingType> label="ชื่อแผนก" name="bookerDepartment" rules={[{ required: true, message: "กรุณากรอกกรอกชื่อแผนก!" }]}>
                <Select
                  placeholder="โปรดเลือกเเผนกผู้จอง"
                  options={[
                    { value: "HR", label: "HR" },
                    { value: "IT", label: "IT" },
                    { value: "Marketing", label: "Marketing" },
                    { value: "Finance", label: "Finance" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Divider orientation="left">ข้อมูลการจอง</Divider>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item<BookingType> label="ชื่อห้อง" name="roomName" rules={[{ required: true, message: "กรุณาเลือกห้องประชุม!" }]}>
                <Select placeholder="โปรดเลือกห้องประชุม">
                  {masterRoomData.map((room) => (
                    <Select.Option key={room.roomName} value={room.roomName}>
                      {room.roomName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<BookingType> label="วันที่เริ่มการจอง" name="startDate" rules={[{ required: true, message: "กรุณากรอกวันที่เริ่มการจอง!" }]}>
                <DatePicker showTime style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<BookingType>
                label="วันที่สิ้นสุดการจอง"
                name="endDate"
                rules={[{ required: true, message: "กรุณากรอกวันที่สิ้นสุดการจอง!" }]}>
                <DatePicker showTime style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<BookingType> label="หัวข้อการประชุม" name="title" rules={[{ required: true, message: "กรุณากรอกหัวข้อการประชุม!" }]}>
                <Input placeholder="กรอกหัวข้อการประชุม" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<BookingType> label="ประเภทการจอง" name="roomType" rules={[{ required: true, message: "กรุณาเลือกประเภทการประชุม!" }]}>
                <Select placeholder="โปรดเลือกประเภทการประชุม">
                  <Select.Option value="Meeting">ประชุม (Meeting)</Select.Option>
                  <Select.Option value="Train">อบรม (Train)</Select.Option>
                  <Select.Option value="Seminar">สัมมนา (Seminar)</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<BookingType> label="จำนวนสมาชิก" name="member">
                <Input placeholder="กรอกจำนวนผู้เข้าใช้งาน" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<BookingType> label="บุคคลภายนอก" name="outSider">
                <Select placeholder="บุคคลภายนอก">
                  <Select.Option value="มี">มี</Select.Option>
                  <Select.Option value="ไม่มี">ไม่มี</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<BookingType> label="หมายเหตุ" name="note">
                <Input placeholder="หมายเหตุ" />
              </Form.Item>
            </Col>
          </Row>
          {form.getFieldValue("outSider") && (
            <>
              <Divider orientation="left">ข้อมูลบุคคลภายใน</Divider>
              <Form.List name="officer">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Row gutter={16} key={key}>
                        <Col span={8}>
                          <Form.Item {...restField} label="ชื่อ-นามสกุล" name={[name, "guestname"]}>
                            <Input placeholder="ชื่อ-นามสกุล" />
                          </Form.Item>
                        </Col>
                        <Col span={7}>
                          <Form.Item {...restField} label="ลำดับความสำคัญ" name={[name, "guestpriority"]}>
                            <Select placeholder="เลือกความสำคัญ">
                              <Select.Option value="1">สูง</Select.Option>
                              <Select.Option value="2">กลาง</Select.Option>
                              <Select.Option value="3">ต่ำ</Select.Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item {...restField} label="อาหารว่าง" name={[name, "refreshment"]}>
                            <Select placeholder="เลือกอาหารว่าง" mode="multiple">
                              {/* {refreshmentData.map((item: any) => (
                                <Select.Option key={item.refreshmentId} value={item.refreshmentName}>
                                  {item.refreshmentName}
                                </Select.Option>
                              ))} */}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={1}>
                          <MinusCircleOutlined onClick={() => remove(name)} />
                        </Col>
                      </Row>
                    ))}
                    <Form.Item>
                      <Button type="dashed" onClick={() => add()} block>
                        เพิ่มบุคคลภายใน
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </>
          )}
          {form.getFieldValue("outSider") === "มี" && (
            <>
              <Divider orientation="left">ข้อมูลบุคคลภายนอก</Divider>
              <Form.List name="guest">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Row gutter={16} key={key}>
                        <Col span={5}>
                          <Form.Item {...restField} label="ชื่อ-นามสกุล" name={[name, "guestname"]}>
                            <Input placeholder="ชื่อ-นามสกุล" />
                          </Form.Item>
                        </Col>
                        <Col span={5}>
                          <Form.Item {...restField} label="ตำแหน่ง" name={[name, "guestlevel"]}>
                            <Input placeholder="ตำแหน่ง" />
                          </Form.Item>
                        </Col>
                        <Col span={5}>
                          <Form.Item {...restField} label="ลำดับความสำคัญ" name={[name, "guestpriority"]}>
                            <Select placeholder="เลือกความสำคัญ">
                              <Select.Option value="1">สูง</Select.Option>
                              <Select.Option value="2">กลาง</Select.Option>
                              <Select.Option value="3">ต่ำ</Select.Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item {...restField} label="อาหารว่าง" name={[name, "refreshment"]}>
                            {/* <Select placeholder="เลือกอาหารว่าง" mode="multiple">
                              {refreshmentData.map((item: any) => (
                                <Select.Option key={item.refreshmentId} value={item.refreshmentName}>
                                  {item.refreshmentName}
                                </Select.Option>
                              ))}
                            </Select> */}
                          </Form.Item>
                        </Col>
                        <Col span={1}>
                          <MinusCircleOutlined onClick={() => remove(name)} />
                        </Col>
                      </Row>
                    ))}
                    <Form.Item>
                      <Button type="dashed" onClick={() => add()} block>
                        เพิ่มบุคคลภายนอก
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </>
          )}
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Row justify="end">
              <Button type="default" onClick={handleEditBookingCancel} style={{ marginRight: 8 }}>
                ยกเลิก
              </Button>
              <Button type="primary" htmlType="submit" loading={submitLoading}>
                ตกลง
              </Button>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        width={400}
        title={bookingStatus === "Approve" ? "ยกเลิกอนุมัติจองห้อง" : "อนุมัติจองห้อง"}
        open={modalApproveBooking}
        onCancel={handleApproveBookingCancel}
        footer={null}>
        <p>{bookingStatus === "Approve" ? "ยืนยันยกเลิกอนุมัติจองห้อง" : "ยืนยันอนุมัติจองห้อง"}</p>
        <Form form={form} layout="vertical" name="edit_booking" initialValues={{ remember: true }} autoComplete="off">
          <Row justify="end">
            {bookingStatus === "Approve" ? (
              <Button type="primary" danger loading={submitLoading} style={{ marginRight: 8 }} onClick={() => onFinishApprove("process")}>
                ยกเลิกการอนุมัติ
              </Button>
            ) : (
              <>
                <Button type="primary" danger loading={submitLoading} style={{ marginRight: 8 }} onClick={() => onFinishApprove("Reject")}>
                  ไม่อนุมัติ
                </Button>
                <Button type="primary" loading={submitLoading} onClick={() => onFinishApprove("Approve")}>
                  อนุมัติ
                </Button>
              </>
            )}
          </Row>
        </Form>
      </Modal>
      <Modal
        title="รายละเอียดการจอง"
        open={modalBookingDetails}
        onCancel={handleBookingDetailsCancel}
        footer={null}
        centered
        width={600}
        style={{ top: 20 }}>
        {currentBookingDetails && (
          <>
            <Divider />
            <p>
              <strong>ชื่อห้องประชุม : </strong> <span className="modal-content">{currentBookingDetails.roomName}</span>
            </p>
            <p>
              <strong>ประเภทการจอง : </strong> <span className="modal-content">{currentBookingDetails.roomType}</span>
            </p>
            <p>
              <strong>วันที่จอง : </strong>{" "}
              <span className="modal-content">
                {dayjs(currentBookingDetails.startDate).format("DD-MM-YYYY")} - {dayjs(currentBookingDetails.endDate).format("DD-MM-YYYY")}
              </span>
            </p>
            <p>
              <strong>เวลาจอง : </strong>{" "}
              <span className="modal-content">
                {dayjs(currentBookingDetails.startDate).format("HH:mm")} - {dayjs(currentBookingDetails.endDate).format("HH:mm")}
              </span>
            </p>
            <p>
              <strong>สถานะ : </strong>
              <span className="modal-content">
                {currentBookingDetails.bookingStatus ? renderStatusTag(currentBookingDetails.bookingStatus) : "ไม่มีสถานะ"}
              </span>
            </p>
            <Divider />
            <p>
              <strong>ชื่อผู้จอง : </strong> <span className="modal-content">{currentBookingDetails.bookerName}</span>
            </p>
            {currentBookingDetails.officer && currentBookingDetails.officer.length > 0 && (
              <>
                <Collapse bordered={false} defaultActiveKey={[]} expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}>
                  <Collapse.Panel header="ข้อมูลบุคคลภายใน" key="1">
                    {Object.values(currentBookingDetails.officer).map((officer: any, index: number) => (
                      <div key={index}>
                        <p>
                          <strong>ลำดับที่ {index + 1}</strong>
                        </p>
                        <p>
                          <strong>ชื่อ-นามสกุล : </strong>
                          <span className="modal-content">{officer.guestname}</span>
                        </p>
                        <p>
                          <strong>ลำดับความสำคัญ : </strong>
                          <span className="modal-content">
                            {officer.guestpriority === "1" ? "สูง" : officer.guestpriority === "2" ? "กลาง" : "ต่ำ"}
                          </span>
                        </p>
                        {officer.refreshment && officer.refreshment.length > 0 && (
                          <p>
                            <strong>อาหารว่าง : </strong>
                            <span className="modal-content">{officer.refreshment.join(", ")}</span>
                          </p>
                        )}
                        {index !== Object.values(currentBookingDetails.officer).length - 1 && <Divider dashed />}
                      </div>
                    ))}
                  </Collapse.Panel>
                </Collapse>
              </>
            )}
            {currentBookingDetails.outSider === "มี" && currentBookingDetails.guest && (
              <>
                <Collapse bordered={false} defaultActiveKey={[]} expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}>
                  <Collapse.Panel header="ข้อมูลบุคคลภายนอก" key="1">
                    {JSON.parse(currentBookingDetails.guest).map((guest: any, index: number) => (
                      <div key={index}>
                        <p>
                          <strong>ลำดับที่ {index + 1}</strong>
                        </p>
                        <p>
                          <strong>ชื่อ-นามสกุล : </strong>
                          <span className="modal-content">{guest.guestname}</span>
                        </p>
                        <p>
                          <strong>ตำแหน่ง : </strong>
                          <span className="modal-content">{guest.guestlevel}</span>
                        </p>
                        <p>
                          <strong>ลำดับความสำคัญ : </strong>
                          <span className="modal-content">{guest.guestpriority === "1" ? "สูง" : guest.guestpriority === "2" ? "กลาง" : "ต่ำ"}</span>
                        </p>
                        {guest.refreshment && guest.refreshment.length > 0 && (
                          <p>
                            <strong>อาหารว่าง : </strong>
                            <span className="modal-content">{guest.refreshment.join(", ")}</span>
                          </p>
                        )}
                        {index !== JSON.parse(currentBookingDetails.guest).length - 1 && <Divider dashed />}
                      </div>
                    ))}
                  </Collapse.Panel>
                </Collapse>
              </>
            )}
          </>
        )}
      </Modal>
      <Table
        columns={columns}
        dataSource={bookingData}
        rowKey="id"
        pagination={pagination}
        onChange={changePagination}
        scroll={{ x: "max-content" }}
      />
    </>
  );
};

export default ManageRoom;
