"use client";

import React, { useState, useEffect, useContext } from "react";
import {
  Breadcrumb,
  Card,
  Col,
  Row,
  TabsProps,
  Tabs,
  Button,
  Modal,
  message,
  Form,
  Input,
  FormProps,
  Divider,
  Select,
  DatePicker,
  TablePaginationConfig,
} from "antd";
import { MinusCircleOutlined } from "@ant-design/icons";
import CalendarComponent from "./components/BookingCalendar";
import TableComponent from "./components/BookingTable";
import RoomStatusComponent from "./components/RoomStatus";
import { BookingRoomServices } from "./services/booking-room.service";
import { useForm } from "antd/es/form/Form";
import { UserContectType, UserContext } from "@/app/config/userContext";
import { loadAppConfig } from "@/app/config/app-config";
import { MasterDepartmentServices } from "@/app/services/department.service";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import dayjs, { Dayjs } from "dayjs";
import MasterHolidaysService from "../../setting/master-holidays/services/index.service";

import { notifyError, notifySuccess } from "@/app/utils/message";
type BookingType = {
  roomId: string;
  roomName: string;
  roomType: string;
  bookerName: string;
  bookerPhone: string;
  bookerDepartment: string;
  positionName: string;
  bookingStatus: string;
  startDate: string | Date | Dayjs;
  endDate: string | Date | Dayjs;
  approveDate: string;
  title: string;
  member: string;
  approver: string;
  outSider: string;
  note: string;
  guestname: string;
  guestlevel: string;
  guest?: any[];
  officer?: any[];
};

type MasterRoomType = {
  roomName: String;
  roomDescription: String;
  roomStatus: boolean;
  masterRoomTypeId: Number;
  value: string;
  label: string;
};

const BookingRoomPage: React.FC = () => {
  const [form] = useForm();
  const outSider = Form.useWatch("outSider", form);
  const { user } = (useContext(UserContext) as UserContectType) || {
    user: null,
  };
  const { id24Axios } = useId24();
  const baseUrIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const holidayService = MasterHolidaysService(baseUrIntranet);
  const [month, setMonth] = useState<Dayjs | string>(dayjs());
  const [isModalBooking, setIsModalBooking] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [masterRoomData, setMasterRoomData] = useState<MasterRoomType[]>([]);
  const [bookingFetchData, setBookingFetchData] = useState<{ data: any[]; count: number }>({ data: [], count: 0 });
  const [refreshmentData, setRefreshmentData] = useState([]);
  const [bookingFetchCalendar, setBookingFetchCalendar] = useState([]);
  // const [department, setDepartment] = useState<{ createdAt: string; departId: number; departName: string; id: number; updatedAt: string }[]>([]);
  const [loading, setloading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const changePagination = (page: TablePaginationConfig) => {
    setPagination({ ...page });
    setloading(true);
  };

  const handleChangeMonth = (month: Dayjs | string) => {
    setMonth(month);
    setloading(true);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "แสดงข้อมูลแบบปฎิทิน",
      children: <CalendarComponent bookingFetchCalendar={bookingFetchCalendar} handleChangeMonth={handleChangeMonth} />,
    },
    {
      key: "2",
      label: "แสดงข้อมูลแบบตาราง",
      children: (
        <TableComponent
          bookingFetchData={bookingFetchData}
          pagination={pagination}
          changePagination={changePagination}
          onCancelled={() => setloading(true)}
        />
      ),
    },
    {
      key: "4",
      label: "สถานะห้องประชุม",
      children: <RoomStatusComponent />,
    },
  ];

  const showModal = () => {
    form.setFieldsValue({
      bookerName: `${user?.firstNameTh} ${user?.lastNameTh}`,
      bookerPhone: user?.phoneNumber,
      bookerDepartment: user?.masterPosition?.nameEn,
    });
    setIsModalBooking(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalBooking(false);
  };

  const createBooking: FormProps<BookingType>["onFinish"] = async (values) => {
    setSubmitLoading(true);
    const startDate = values.startDate;
    const endDate = values.endDate;
    const selectedOption = masterRoomData.find((option) => option.value === values.roomId);
    const today = dayjs();
    if (startDate < today) {
      message.error("ไม่สามารถจองในเวลาที่ผ่านมาแล้วได้");
      setSubmitLoading(false);
      return;
    }
    if (endDate < startDate) {
      message.error("วันที่สิ้นสุดการจองต้องหลังวันที่เริ่มการจอง");
      setSubmitLoading(false);
      return;
    }
    const count = await BookingRoomServices(baseUrIntranet).countBookingRoomCountByRoomAndRange(values.roomId, startDate, endDate);
    if (count > 0) {
      message.error("ห้องนี้ถูกจองแล้วในช่วงเวลาที่คุณเลือก กรุณาเลือกช่วงเวลาใหม่.");
      setSubmitLoading(false);
      return;
    }
    const guestData = values.guest ? JSON.stringify(values.guest) : "";
    const data = {
      userId: user?.userId,
      token: user?.token,
      roomId: values.roomId,
      roomName: selectedOption ? selectedOption.label : undefined,
      roomType: values.roomType,
      bookerName: `${user?.firstNameTh} ${user?.lastNameTh}`,
      bookerPhone: user?.phoneNumber,
      title: values.title,
      bookerDepartment: values.bookerDepartment.toString(),
      bookingStatus: "process",
      approver: "",
      startDate: startDate,
      endDate: endDate,
      approveDate: null,
      member: values?.member,
      outSider: values?.outSider,
      note: values?.note,
      guest: values.guest ? guestData : undefined,
      officer: values?.officer,
    };
    try {
      const response = await BookingRoomServices(baseUrIntranet).createBookingRoom(data);
      if (response) {
        notifySuccess("booking.room.create");
        form.resetFields();
        setIsModalBooking(false);
      } else {
        notifyError(undefined, "booking.room.create");
      }

      setSubmitLoading(false);
      fetchData();
    } catch (error) {
      notifyError(error, "booking.room.create");
      setSubmitLoading(false);
    }
  };

  const fetchData = async () => {
    const skip: number = (Number(pagination.current) - 1) * Number(pagination.pageSize);
    const take: number = Number(pagination.pageSize);
    try {
      const bookings = await BookingRoomServices(baseUrIntranet).findBookingRoom(skip, take);
      setBookingFetchData(bookings);
      const yearNow = dayjs().format("YYYY");
      const holidayData = await holidayService.getHolidayByYear(yearNow);
      const holidayMappedData: any = holidayData.map((item: any) => ({
        id: item.id,
        roomName: item.holidaysName,
        lastName: "",
        startDate: item.holidaysDate,
        endDate: item.holidaysDate,
        description: "",
        bookerName: "วันหยุด",
        bookingStatus: "holiday",
      }));
      const bookingCalendar = await BookingRoomServices(baseUrIntranet).getBookingRoomCarlendar(month);
      const mapCalendar: any = [...bookingCalendar, ...holidayMappedData];
      setBookingFetchCalendar(mapCalendar);
      setPagination({ ...pagination, total: bookings.count });
      setloading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (loading === true) {
      fetchData();
    }
    fecthMasterData();
  }, [loading]);

  const fecthMasterData = async () => {
    const bookingRoom = await BookingRoomServices(baseUrIntranet).getMasterRoomQuery();
    const options = bookingRoom
      .filter((filtersroom: any) => filtersroom.roomsStatus === true)
      .map((event: any) => {
        return { value: event.roomId, label: event.roomName };
      });
    setMasterRoomData(options);
    const refreshment = await BookingRoomServices(baseUrIntranet).getMasterRefreshmentQuery();
    setRefreshmentData(refreshment);
  };

  return (
    <>
      <Modal title="จองห้องประชุม" open={isModalBooking} onCancel={handleCancel} footer={false} width={1000}>
        <Form form={form} layout="vertical" name="create" onFinish={createBooking} autoComplete="off">
          <Divider orientation="left">ข้อมูลผู้จอง</Divider>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item<BookingType> label="ชื่อผู้จอง" name="bookerName">
                <Input disabled placeholder="กรอกชื่อผู้จอง" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<BookingType> label="เบอร์โทรศัพท์ผู้จอง" name="bookerPhone">
                <Input disabled placeholder="กรอกเบอร์โทรศัพท์ผู้จอง" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<BookingType> label="ตำแหน่ง" name="bookerDepartment">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Divider orientation="left">ข้อมูลการจอง</Divider>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item<BookingType> label="ชื่อห้อง" name="roomId" rules={[{ required: true, message: "กรุณาเลือกห้องประชุม" }]}>
                <Select
                  allowClear
                  placeholder="โปรดเลือกห้องประชุม"
                  style={{ width: "100%" }}
                  options={masterRoomData}
                  showSearch
                  optionFilterProp="label"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<BookingType> label="วันที่เริ่มการจอง" name="startDate" rules={[{ required: true, message: "กรุณาเลือกวันที่เริ่มการจอง" }]}>
                <DatePicker allowClear placeholder="เลือกวันที่เริ่มการจอง" showTime style={{ width: "100%" }} format={"DD-MM-YYYY HH:mm"} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<BookingType>
                label="วันที่สิ้นสุดการจอง"
                name="endDate"
                rules={[{ required: true, message: "กรุณาเลือกวันที่สิ้นสุดการจอง" }]}
              >
                <DatePicker allowClear placeholder="เลือกวันที่สิ้นสุดการจอง" showTime style={{ width: "100%" }} format={"DD-MM-YYYY HH:mm"} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<BookingType> label="หัวข้อการประชุม" name="title" rules={[{ required: true, message: "กรุณากรอกหัวข้อการประชุม" }]}>
                <Input placeholder="กรอกหัวข้อการประชุม" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<BookingType> label="ประเภทการจอง" name="roomType" rules={[{ required: true, message: "กรุณาเลือกประภทการประชุม" }]}>
                <Select
                  allowClear
                  placeholder="โปรดเลือกประภทการประชุม"
                  style={{ width: "100%" }}
                  options={[
                    { value: "Meeting", label: "ประชุม (Meeting)" },
                    { value: "Train", label: "อบรม (Train)" },
                    { value: "seminar", label: "สัมมนา (Seminar)" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<BookingType> label="จำนวนสมาชิก" name="member">
                <Input
                  addonAfter={`คน`}
                  placeholder="กรอกจำนวนผู้เข้าใช้งาน"
                  max={100}
                  min={1}
                  onKeyDown={(event) => {
                    if (!/[0-9]/.test(event.key) && event.key !== "Backspace") {
                      event.preventDefault();
                    }
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<BookingType> label="บุคคลภายนอก" name="outSider" rules={[{ required: true, message: "กรุณาเลือกบุคคลภายนอก" }]}>
                <Select
                  placeholder="บุคคลภายนอก"
                  style={{ width: "100%" }}
                  options={[
                    { value: "มี", label: "มี" },
                    { value: "ไม่มี", label: "ไม่มี" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<BookingType> label="หมายเหตุ" name="note">
                <Input placeholder="หมายเหตุ" />
              </Form.Item>
            </Col>
          </Row>
          {outSider && (
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
                              {refreshmentData.map((item: any) => (
                                <Select.Option key={item.refreshmentId} value={item.refreshmentName}>
                                  {item.refreshmentName}
                                </Select.Option>
                              ))}
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
          {outSider === "มี" && (
            <>
              <Divider orientation="left">{`ข้อมูลบุคคลภายนอก`}</Divider>
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
                              <Select.Option value="1">{`สูง`}</Select.Option>
                              <Select.Option value="2">{`กลาง`}</Select.Option>
                              <Select.Option value="3">{`ต่ำ`}</Select.Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item {...restField} label="อาหารว่าง" name={[name, "refreshment"]}>
                            <Select placeholder="เลือกอาหารว่าง" mode="multiple">
                              {refreshmentData.map((item: any) => (
                                <Select.Option key={item.refreshmentId} value={item.refreshmentName}>
                                  {item.refreshmentName}
                                </Select.Option>
                              ))}
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
                        {`เพิ่มบุคคลภายนอก`}
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </>
          )}
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Row justify="end">
              <Button type="default" onClick={handleCancel} style={{ marginRight: 8 }}>
                {`ยกเลิก`}
              </Button>
              <Button type="primary" htmlType="submit" loading={submitLoading}>
                {`ตกลง`}
              </Button>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
      <Row>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page/home",
                title: <span>{`หน้าหลัก`}</span>,
              },
              {
                title: <span>{`Booking Room Details`}</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0" style={{ padding: "0px 0px 0px 0px", marginBottom: "0px", marginTop: "0px" }}>
          <div className="title-page-font">{`Booking Room Details`}</div>
        </Divider>
        <Col span={24}>
          <div className="grid-span-1 space-y-2">
            <Card styles={{ body: { padding: "10px" } }}>
              <div className="flex justify-end">
                <Button type="primary" onClick={showModal}>
                  {`จองห้องประชุม`}
                </Button>
              </div>
              <Tabs defaultActiveKey="1" items={items} type="card" />
            </Card>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default BookingRoomPage;
