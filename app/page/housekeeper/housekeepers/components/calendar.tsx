import React, { useEffect, useState } from "react";
import type { BadgeProps, CalendarProps } from "antd";
import {
  Badge,
  Button,
  Calendar,
  Card,
  Col,
  ConfigProvider,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Popover,
  Radio,
  Rate,
  Row,
  Select,
  Space,
  Tooltip,
  Typography,
} from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { useForm } from "antd/es/form/Form";
import { HouseKeeperStockServices } from "../services/housekeeper.service";
import data from "@iconify/icons-icon-park-outline/setting-two";
import Loading from "@/components/Loading";

type FieldTypeCreate = {
  wrapupDate: string;
  floor: string;
  housekeeper: string;
  duration: string;
  result: string;
  remark?: string;
};
type FieldTypeUpdate = {
  id: number;
} & FieldTypeCreate;

const { Text } = Typography;
const { TextArea } = Input;
const CalendarComponent: React.FC = () => {
  const intranetAuth = useAxiosIntranet();
  const houseKeeperStockServices = HouseKeeperStockServices(intranetAuth);
  const [formCreate] = useForm();
  const [formEdit] = useForm();
  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [listEventDate, setListEventDate] = useState([]);
  const [floor, setFloor] = useState([]);
  const [housekeeper, setHousekeeper] = useState([]);
  const [validRange, setValidRange] = useState<[Dayjs, Dayjs]>([
    dayjs(new Date(dayjs().year(), dayjs().month(), 1)),
    dayjs(new Date(dayjs().year(), dayjs().month() + 1, 0)),
  ]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    featchData();
  }, []);

  useEffect(() => {
    if (loading) listEvent(dayjs().year(), dayjs().month());
  }, [loading]);

  const listEvent = async (year: number, month: number) => {
    setValidRange([dayjs(new Date(year, month, 1)), dayjs(new Date(year, month + 1, 0))]);
    const result = await houseKeeperStockServices.getEventByMonth({ year: year, month: month });
    setListEventDate(result);
    setLoading(false);
  };

  const featchData = async () => {
    const resultFloor = await houseKeeperStockServices.getFloor();
    const resultHousekeeper = await houseKeeperStockServices.getHousekeeper();
    setFloor(resultFloor);
    setHousekeeper(resultHousekeeper);
  };

  const dateCellRender = (value: Dayjs) => {
    return (
      <ul className="events text-xs p-0">
        {listEventDate
          .filter((filter: any) => dayjs(filter.wrapupDate).date() === value.date() && dayjs(filter.wrapupDate).month() === value.month())
          .map(
            (
              item: {
                id: number;
                floors: {
                  floorName: string;
                  floorId: number;
                };
                houseKeepers: {
                  houseKeepName: string;
                  houseKeeperId: number;
                };
                result: number;
                duration: string;
                wrapupDate: string;
                remark: string;
              },
              index,
            ) => {
              return (
                <div key={index} className="flex justify-start">
                  <Popover
                    placement="top"
                    title={`[${item.floors.floorName}-${item.duration === "morning" ? "เช้า" : "บ่าย"}]`}
                    content={
                      <>
                        <div className="grid grid-cols-1 gap-4">คนรับผิดชอบ: {item.houseKeepers.houseKeepName}</div>
                        <div className="grid grid-cols-1 gap-4 text-red-700">หมายเหตุ: {item.remark ? item.remark : `-`}</div>
                        <div className="grid grid-cols-1 gap-4">
                          <Rate allowHalf defaultValue={item.result} disabled />
                        </div>
                      </>
                    }>
                    <Button size="small" type="link" onClick={() => onClickEdit(item)}>
                      <Text ellipsis={true}>
                        {`[${item.floors.floorName}-${item.duration === "morning" ? "เช้า" : "บ่าย"}]` + item.houseKeepers.houseKeepName}
                      </Text>
                    </Button>
                  </Popover>
                </div>
              );
            },
          )}
      </ul>
    );
  };

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    return info.originNode;
  };

  const onSelect = (date: Dayjs, info: { source: "year" | "month" | "date" | "customize" }) => {
    const checkDate = listEventDate.filter(
      (filter: any) => dayjs(filter.wrapupDate).date() === date.date() && dayjs(filter.wrapupDate).month() === date.month(),
    );
    if (checkDate.length >= 8) return message.warning("ขออภัยไม่สามารถลงเวรเพิ่มได้ เนื่องจากมีการลงเวรครบตามกำหนดแล้ว !!");
    if (info.source === "date") {
      formCreate.setFieldsValue({ wrapupDate: date });
      setOpenModalCreate(true);
    }
  };

  const handleCancelModalCreate = () => {
    formCreate.resetFields();
    setOpenModalCreate(false);
  };

  const handleCancelModalEdit = () => {
    formEdit.resetFields();
    setOpenModalCreate(false);
    setOpenModalEdit(false);
  };

  const onPanelChange = (event: Dayjs) => {
    listEvent(dayjs(event).year(), dayjs(event).month());
  };

  const onClickEdit = (item: {
    id: number;
    floors: {
      floorName: string;
      floorId: number;
    };
    houseKeepers: {
      houseKeepName: string;
      houseKeeperId: number;
    };
    result: number;
    duration: string;
    wrapupDate: string;
    remark: string;
  }) => {
    formEdit.setFieldsValue({
      id: item.id,
      wrapupDate: item.wrapupDate,
      housekeeper: item.houseKeepers.houseKeeperId,
      floor: [item.floors.floorId],
      duration: item.duration,
      result: item.result,
      remark: item.remark,
    });
    setOpenModalEdit(true);
  };

  const onFinishCreate = async () => {
    const value = formCreate.getFieldsValue();
    const resultCreate = await houseKeeperStockServices.createEvent(value);
    if (resultCreate === 501) {
      message.warning(`มีการทำความสะอาดในชั้น ${value.floor} ช่วง ${value.duration} ไปแล้ว !!`);
      return;
    }
    if (resultCreate === 500) {
      message.error("Fault !!");
      setOpenModalCreate(false);
      return;
    } else {
      formCreate.resetFields();
      message.success("Success !!");
      listEvent(dayjs().year(), dayjs().month());
      setOpenModalCreate(false);
    }
  };

  const onFinishEdit = async () => {
    const value = formEdit.getFieldsValue();
    const resultUpdate = await houseKeeperStockServices.updateEvent(value.id, value);
    if (resultUpdate === 501) {
      message.warning(`มีการทำความสะอาดในชั้น ${value.floor} ช่วง ${value.duration} ไปแล้ว !!`);
      return;
    }
    if (resultUpdate === 500) {
      message.error("Fault !!");
      setOpenModalEdit(false);
      setOpenModalCreate(false);
      return;
    } else {
      formCreate.resetFields();
      message.success("Success !!");
      listEvent(dayjs().year(), dayjs().month());
      setOpenModalEdit(false);
      setOpenModalCreate(false);
      setLoading(true);
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Card>
          <ConfigProvider
            theme={{
              components: {},
            }}>
            <Calendar
              validRange={validRange}
              mode="month"
              headerRender={({ value, type, onChange, onTypeChange }: any) => {
                const start = 0;
                const end = 12;
                const monthOptions = [];
                let current = value.clone();
                const localeData = value.localeData();
                const months = [];
                for (let i = 0; i < 12; i++) {
                  current = current.month(i);
                  months.push(localeData.monthsShort(current));
                }

                for (let i = start; i < end; i++) {
                  monthOptions.push(
                    <Select.Option key={i} value={i} className="month-item">
                      {months[i]}
                    </Select.Option>,
                  );
                }
                const year = value.year();
                const month = value.month();
                const options = [];
                for (let i = year - 10; i < year + 10; i += 1) {
                  options.push(
                    <Select.Option key={i} value={i} className="year-item">
                      {i}
                    </Select.Option>,
                  );
                }
                return (
                  <div className="flex justify-end p-3">
                    <Space>
                      <div>
                        <Select
                          className="w-full"
                          value={month}
                          onChange={(newMonth) => {
                            const now = value.clone().month(newMonth);
                            onChange(now);
                          }}>
                          {monthOptions}
                        </Select>
                      </div>
                      <div>
                        <Select
                          className="my-year-select"
                          value={year}
                          onChange={(newYear) => {
                            const now = value.clone().year(newYear);
                            onChange(now);
                          }}>
                          {options}
                        </Select>
                      </div>
                    </Space>
                  </div>
                );
              }}
              onPanelChange={onPanelChange}
              cellRender={cellRender}
              onSelect={onSelect}
              fullscreen={true}
              disabledDate={(date: any) => {
                return new Date(date) > new Date();
              }}
            />
          </ConfigProvider>
          <Modal title={"ลงสถานะการทำความสะอาด"} open={openModalCreate} onCancel={handleCancelModalCreate} footer={[]}>
            <Form
              form={formCreate}
              name="create"
              initialValues={{ remember: true }}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              onFinish={onFinishCreate}
              //   onFinishFailed={onFinishFailed}
              autoComplete="off">
              <Form.Item<FieldTypeCreate> name="wrapupDate" hidden>
                <Input />
              </Form.Item>
              <Form.Item<FieldTypeCreate>
                label="ชื่อแม่บ้าน"
                name="housekeeper"
                rules={[{ required: true, message: "กรุณากรอกข้อมูล ชื่อแม่บ้าน!" }]}>
                <Select
                  options={housekeeper.map((item: { houseKeeperId: number; houseKeepName: string }) => {
                    return {
                      value: item.houseKeeperId,
                      label: item.houseKeepName,
                    };
                  })}
                />
              </Form.Item>
              <Form.Item<FieldTypeCreate> label="ชั้น" name="floor" rules={[{ required: true, message: "กรุณากรอกข้อมูล ชั้น!" }]}>
                <Select
                  mode={"multiple"}
                  allowClear
                  options={floor.map((item: { floorId: number; floorName: string }) => {
                    return {
                      value: item.floorId,
                      label: item.floorName,
                    };
                  })}
                />
              </Form.Item>

              <Form.Item<FieldTypeCreate> label="ช่วงเวลา" name="duration" rules={[{ required: true, message: "กรุณากรอกข้อมูล ช่วงเวลา!" }]}>
                <Select
                  options={[
                    { value: "morning", label: "ช่วงเช้า" },
                    { value: "afternoon", label: "ช่วงบ่าย" },
                  ]}
                />
              </Form.Item>

              <Form.Item<FieldTypeCreate> label="ผลลัพท์" name="result" rules={[{ required: true, message: "กรุณากรอกข้อมูล ผลลัพท์!" }]}>
                <Select
                  options={[
                    { value: 5, label: "ดีมาก" },
                    { value: 4, label: "ดี" },
                    { value: 3, label: "ปานกลาง" },
                    { value: 2, label: "แย่" },
                    { value: 1, label: "แย่มาก" },
                  ]}
                />
              </Form.Item>
              <Form.Item<FieldTypeCreate> label="หมายเหตุ" name="remark">
                <TextArea />
              </Form.Item>
              <div className="flex justify-end">
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </Modal>
          <Modal title={"แก้ใขการลงสถานะการทำความสะอาด"} open={openModalEdit} onCancel={handleCancelModalEdit} footer={[]}>
            <Form
              form={formEdit}
              name="edit"
              initialValues={{ remember: true }}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              onFinish={onFinishEdit}
              //   onFinishFailed={onFinishFailed}
              autoComplete="off">
              <Form.Item<FieldTypeUpdate> name="id" hidden>
                <Input />
              </Form.Item>
              <Form.Item<FieldTypeUpdate> name="wrapupDate" hidden>
                <Input />
              </Form.Item>
              <Form.Item<FieldTypeUpdate>
                label="ชื่อแม่บ้าน"
                name="housekeeper"
                rules={[{ required: true, message: "กรุณากรอกข้อมูล ชื่อแม่บ้าน!" }]}>
                <Select
                  options={housekeeper.map((item: { houseKeeperId: number; houseKeepName: string }) => {
                    return {
                      value: item.houseKeeperId,
                      label: item.houseKeepName,
                    };
                  })}
                />
              </Form.Item>
              <Form.Item<FieldTypeCreate> label="ชั้น" name="floor" rules={[{ required: true, message: "กรุณากรอกข้อมูล ชั้น!" }]}>
                <Select
                  allowClear
                  disabled
                  options={floor.map((item: { floorId: number; floorName: string }) => {
                    return {
                      value: item.floorId,
                      label: item.floorName,
                    };
                  })}
                />
              </Form.Item>

              <Form.Item<FieldTypeUpdate> label="ช่วงเวลา" name="duration" rules={[{ required: true, message: "กรุณากรอกข้อมูล ช่วงเวลา!" }]}>
                <Select
                  disabled
                  options={[
                    { value: "morning", label: "ช่วงเช้า" },
                    { value: "afternoon", label: "ช่วงบ่าย" },
                  ]}
                />
              </Form.Item>

              <Form.Item<FieldTypeUpdate> label="ผลลัพท์" name="result" rules={[{ required: true, message: "กรุณากรอกข้อมูล ผลลัพท์!" }]}>
                <Select
                  options={[
                    { value: 5, label: "ดีมาก" },
                    { value: 4, label: "ดี" },
                    { value: 3, label: "ปานกลาง" },
                    { value: 2, label: "แย่" },
                    { value: 1, label: "แย่มาก" },
                  ]}
                />
              </Form.Item>
              <Form.Item<FieldTypeUpdate> label="หมายเหตุ" name="remark">
                <TextArea />
              </Form.Item>
              <div className="flex justify-end">
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </Modal>
        </Card>
      )}
    </>
  );
};

export default CalendarComponent;
