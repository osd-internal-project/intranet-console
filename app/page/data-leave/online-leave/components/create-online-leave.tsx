"use client";
import { UploadOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Select,
  Switch,
  TimePicker,
  Typography,
  Upload,
  UploadFile,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { IDataUser, ISelect, ITypeDataLeaveCreate } from "../../common";
import { RcFile } from "antd/es/upload";
import { FormInstance } from "antd/lib";

export interface props {
  getUser?: IDataUser | null;
  getTypeLeaveOption: ISelect[];
  onfinishCreate: (values: ITypeDataLeaveCreate) => void;
  createdataleaveForm: FormInstance;
  setStartDate: (values: Date) => void;
  setEndDate: (values: Date) => void;
  setCheckSwitch: (values: boolean) => void;
  getStartDate: Date | undefined;
  getEndDate: Date | undefined;
  checkSwitch: boolean | undefined;
  beforeUploadAttendFiles: (e: RcFile) => void;
  handleChangeAttendFiles: (e: any) => void;
  attendFiles: UploadFile[];
  getUserOwner: IDataUser | null;
  onChangeParams: (value: Dayjs, type: string) => void;
  groupDetail: any;
}
export const CreateOnlineLeave: React.FC<props> = ({
  getUser,
  getTypeLeaveOption,
  onfinishCreate,
  createdataleaveForm,
  setStartDate,
  setEndDate,
  setCheckSwitch,
  getStartDate,
  getEndDate,
  checkSwitch,
  beforeUploadAttendFiles,
  handleChangeAttendFiles,
  attendFiles,
  getUserOwner,
  onChangeParams,
  groupDetail,
}): React.ReactElement => {
  useEffect(() => {
    const getdatauser = () => {
      createdataleaveForm.setFieldsValue({
        userId: getUser?.userId,
        posId: getUser?.position?.posId,
        position: getUser?.position?.nameEn,
        firstNameTh: getUser?.firstNameTh,
        lastNameTh: getUser?.lastNameTh,
        ownerName: `${getUserOwner?.firstNameTh} ${getUserOwner?.lastNameTh}`,
        ownerId: getUserOwner?.userId,
        groupName: groupDetail.groupName,
      });
    };
    getdatauser();
  }, [getUserOwner, checkSwitch]);

  const { Option } = Select;
  const [timeSlot, setTimeSlot] = useState("morning");

  const disabledTime = () => ({
    disabledHours: () => [0, 1, 2, 3, 4, 5, 6, 7, 18, 19, 20, 21, 22, 23, 24],
    disabledMinutes: () => [],
  });

  // const disabledTime = () => {
  //   return {
  //     disabledHours: () => {
  //       // กำหนดให้เลือกได้เฉพาะชั่วโมง 8, 12, 16
  //       const allowedHours = [8, 12, 16];
  //       const hours = Array.from({ length: 24 }, (_, index) => index);
  //       return hours.filter((hour) => !allowedHours.includes(hour));
  //     },
  //     disabledMinutes: () => {
  //       // ทุกชั่วโมงสามารถเลือกนาที 0 และ 30 ได้เท่านั้น
  //       return [0, 30];
  //     },
  //   };
  // };

  // const disabledTime = () => {
  //   return {
  //     disabledHours: () => {
  //       const hours = Array.from({ length: 24 }, (_, index) => index);
  //       return hours.filter((hour) => hour < 8 || hour > 17);
  //     },
  //     disabledMinutes: (selectedHour: number) => {
  //       if (selectedHour === 8) {
  //         return Array.from({ length: 30 }, (_, index) => index);
  //       }
  //       if (selectedHour === 17) {
  //         return Array.from({ length: 30 }, (_, index) => index).filter(
  //           (min) => min > 30
  //         );
  //       }
  //       return [];
  //     },
  //   };
  // };

  const timeOptions = [
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
  ];

  return (
    <div>
      <Card className="w-full grid grid-cols-1 gap-y-2 mt-2">
        <Form
          size="small"
          form={createdataleaveForm}
          className=" grid grid-cols-1"
          layout="vertical"
          autoComplete="off"
          onFinish={onfinishCreate}
        >
          <div className="col-span-1 md:col-span-1 ml-5 justify-end flex">
            <Form.Item label={`วันที่ `} name={`createdAt`} layout="horizontal">
              <Typography.Text>
                {dayjs(new Date()).format("DD-MM-YYYY")}
              </Typography.Text>
            </Form.Item>
          </div>
          <div className=" col-span-3 md:col-span-1 ml-5" hidden>
            <Form.Item label={`เรียนถึง :`} name={`ownerId`}>
              <Input disabled />
            </Form.Item>
          </div>
          <div className=" col-span-3 md:col-span-1 ml-5">
            <Form.Item label={`เรียนถึง :`} name={`ownerName`}>
              <Input disabled />
            </Form.Item>
          </div>
          <div className=" col-span-3 md:col-span-1 ml-5">
            <Form.Item label={`รหัสพนักงาน :`} name={`userId`} hidden>
              <Input disabled />
            </Form.Item>
          </div>
          <div className="w-full grid grid-cols-2 gap-y-2 mt-2">
            <div className=" col-span-3 md:col-span-1 ml-5">
              <Form.Item label={`ชื่อ :`} name={`firstNameTh`}>
                <Input disabled />
              </Form.Item>
            </div>
            <div className=" col-span-3 md:col-span-1 ml-5">
              <Form.Item label={`นามสกุล :`} name={`lastNameTh`}>
                <Input disabled />
              </Form.Item>
            </div>
          </div>
          <div className=" col-span-3 md:col-span-1 ml-5">
            <Form.Item label={`ตำแหน่ง :`} name={`posId`} hidden>
              <Input disabled />
            </Form.Item>
          </div>
          <div className=" col-span-3 md:col-span-1 ml-5">
            <Form.Item label={`ตำแหน่ง :`} name={`position`}>
              <Input disabled />
            </Form.Item>
          </div>
          <div className=" col-span-3 md:col-span-1 ml-5">
            <Form.Item label={`แผนก :`} name={`groupName`}>
              <Input disabled />
            </Form.Item>
          </div>
          <div className=" col-span-3 md:col-span-1 ml-5">
            <Form.Item
              label={`ประเภทการลา :`}
              name={`type_id`}
              required
              rules={[{ required: true, message: "กรุณาเลือกประเภทการลา" }]}
            >
              <Select
                placeholder={`ประเภทการลา`}
                options={getTypeLeaveOption}
                onChange={(e) => onChangeParams(e, "type")}
                allowClear
                showSearch
                optionFilterProp="label"
              />
            </Form.Item>
          </div>
          <div className="w-full grid grid-cols-2 gap-y-2 mt-2">
            <div className=" col-span-3 md:col-span-1 ml-5">
              <Form.Item
                label={`ตั้งแต่วันที่ :`}
                name={`startDate`}
                required
                rules={[{ required: true, message: "กรุณาเลือกวันที่เริ่มลา" }]}
              >
                <DatePicker
                  className="w-full"
                  onChange={(e: any) => {
                    setStartDate(e), onChangeParams(e, "startDate");
                  }}
                />
              </Form.Item>
            </div>
            <div className=" col-span-3 md:col-span-1 ml-5">
              <Form.Item
                label={`ถึงวันที่ :`}
                name={`endDate`}
                required
                rules={[
                  { required: true, message: "กรุณาเลือกวันที่สิ้นสุดการลา" },
                ]}
              >
                <DatePicker
                  className="w-full"
                  onChange={(e: any) => {
                    setEndDate(e), onChangeParams(e, "endDate");
                  }}
                />
              </Form.Item>
            </div>
          </div>
          <>
            {dayjs(getStartDate).format("YYYY-MM-DD") ===
              dayjs(getEndDate).format("YYYY-MM-DD") && getEndDate ? (
              <div className="w-full grid grid-cols-4 gap-y-0.5 mt-0.5">
                <div className="col-span-3 md:col-span-1 ml-5 mt-4">
                  <Form.Item label="ลา 1 วัน" name="time_start_check">
                    <Switch
                      unCheckedChildren="ไม่"
                      checkedChildren="ใช่"
                      defaultChecked={false}
                      onChange={(e: any) => {
                        setCheckSwitch(e);
                        onChangeParams(e, "endDate");
                      }}
                    />
                  </Form.Item>
                </div>
                {!checkSwitch && (
                  <>
                    <div className="col-span-3 md:col-span-1 ml-5 mt-4">
                      <Form.Item
                        label="เวลาเริ่มต้น :"
                        name="startTime"
                        required
                        rules={[
                          {
                            required: true,
                            message: "กรุณาเลือกเวลาที่เริ่มลา",
                          },
                        ]}
                      >
                        {/* <TimePicker
                          className="w-full"
                          disabledTime={disabledTime}
                          format="HH:mm"
                          hourStep={1}
                          minuteStep={30}
                          showNow={false}
                          onChange={(e: any) => onChangeParams(e, "startTime")}
                        /> */}
                        <Select
                          className="w-full"
                          placeholder="เลือกช่วงเวลา"
                          onChange={(e) => onChangeParams(e, "selectStartTime")}
                        >
                          {timeOptions.map((time) => (
                            <Option key={time} value={time}>
                              {time}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </div>
                    <div className="col-span-3 md:col-span-1 ml-5 mt-4">
                      <Form.Item
                        label="เวลาสิ้นสุด :"
                        name="endTime"
                        required
                        rules={[
                          {
                            required: true,
                            message: "กรุณาเลือกเวลาที่สิ้นสุดการลา",
                          },
                        ]}
                      >
                        {/* <TimePicker
                          className="w-full"
                          onChange={(e: any) => onChangeParams(e, "endTime")}
                          disabledTime={disabledTime}
                          format="HH:mm"
                          hourStep={1}
                          minuteStep={30}
                          showNow={false}
                        /> */}
                        <Select
                          className="w-full"
                          placeholder="เลือกช่วงเวลา"
                          onChange={(e) => onChangeParams(e, "selectEndTime")}
                        >
                          {timeOptions.map((time) => (
                            <Option key={time} value={time}>
                              {time}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </div>
                  </>
                )}
              </div>
            ) : null}
          </>

          {/* <>
            {dayjs(getStartDate).format("YYYY-MM-DD") ===
              dayjs(getEndDate).format("YYYY-MM-DD") && getEndDate ? (
              <div className="w-full grid grid-cols-4 gap-y-0.5 mt-0.5">
                <div className="col-span-3 md:col-span-1 ml-5 mt-4">
                  <Form.Item label="ลา 1 วัน" name="time_start_check">
                    <Switch
                      unCheckedChildren="ไม่"
                      checkedChildren="ใช่"
                      defaultChecked={false}
                      onChange={(e: any) => {
                        setCheckSwitch(e);
                        onChangeParams(e, "endDate");
                      }}
                    />
                  </Form.Item>
                </div>
                {!checkSwitch ? (
                  <>
                    <div className="col-span-3 md:col-span-1 ml-5 mt-4">
                      <Form.Item label="ช่วงเวลา" name="timeSlot">
                        <Select
                          defaultValue="morning"
                          onChange={(value) => setTimeSlot(value)}
                        >
                          <Option value="morning">ลาช่วงเช้า</Option>
                          <Option value="afternoon">ลาช่วงบ่าย</Option>
                        </Select>
                      </Form.Item>
                    </div>

                    {timeSlot === "morning" && (
                      <>
                        <div className="col-span-3 md:col-span-1 ml-5 mt-4">
                          <Form.Item
                            label="เวลาเริ่มต้น :"
                            name="startTime"
                            required
                            rules={[
                              {
                                required: true,
                                message: "กรุณาเลือกเวลาที่เริ่มลา",
                              },
                            ]}
                          >
                            <TimePicker
                              className="w-full"
                              disabledTime={disabledTime}
                              format="HH:mm"
                              hourStep={8}
                              minuteStep={30}
                              showNow={false}
                              onChange={(e: any) =>
                                onChangeParams(e, "startTime")
                              }
                            />
                          </Form.Item>
                        </div>
                        <div className="col-span-3 md:col-span-1 ml-5 mt-4">
                          <Form.Item
                            label="เวลาสิ้นสุด :"
                            name="endTime"
                            required
                            rules={[
                              {
                                required: true,
                                message: "กรุณาเลือกเวลาที่สิ้นสุดการลา",
                              },
                            ]}
                          >
                            <TimePicker
                              className="w-full"
                              onChange={(e: any) =>
                                onChangeParams(e, "endTime")
                              }
                              disabledTime={disabledTime}
                              format="HH:mm"
                              hourStep={12}
                              minuteStep={30}
                              showNow={false}
                            />
                          </Form.Item>
                        </div>
                      </>
                    )}
                    {timeSlot === "afternoon" && (
                      <>
                        <div className="col-span-3 md:col-span-1 ml-5 mt-4">
                          <Form.Item
                            label="เวลาเริ่มต้น :"
                            name="startTime"
                            required
                            rules={[
                              {
                                required: true,
                                message: "กรุณาเลือกเวลาที่เริ่มลา",
                              },
                            ]}
                          >
                            <TimePicker
                              className="w-full"
                              disabledTime={disabledTime}
                              format="HH:mm"
                              hourStep={13}
                              minuteStep={30}
                              showNow={false}
                              onChange={(e: any) =>
                                onChangeParams(e, "startTime")
                              }
                            />
                          </Form.Item>
                        </div>
                        <div className="col-span-3 md:col-span-1 ml-5 mt-4">
                          <Form.Item
                            label="เวลาสิ้นสุด :"
                            name="endTime"
                            required
                            rules={[
                              {
                                required: true,
                                message: "กรุณาเลือกเวลาที่สิ้นสุดการลา",
                              },
                            ]}
                          >
                            <TimePicker
                              className="w-full"
                              onChange={(e: any) =>
                                onChangeParams(e, "endTime")
                              }
                              disabledTime={disabledTime}
                              format="HH:mm"
                              hourStep={17}
                              minuteStep={30}
                              showNow={false}
                            />
                          </Form.Item>
                        </div>
                      </>
                    )}
                  </>
                ) : null}
              </div>
            ) : null}
          </> */}
          <div className=" col-span-3 md:col-span-1 ml-5">
            <Form.Item
              label={`วัตถุประสงค์การลา :`}
              name={`detail`}
              // rules={[
              //   { required: true, message: "กรุณากรอกวัตถุประสงค์การลา" },
              // ]}
            >
              <Input.TextArea placeholder="วัตถุประสงค์การลา" />
            </Form.Item>
          </div>
          <div className="w-full grid grid-cols-2 gap-y-2 mt-2">
            <div className=" col-span-3 md:col-span-1 ml-5">
              <Form.Item
                label={`เบอร์โทรศัพท์ :`}
                name={"phoneNumber"}
                // rules={[
                //   {
                //     required: true,
                //     message: "กรุณากรอกเบอร์โทรศัพท์",
                //   },
                //   {
                //     pattern: /^[0-9]{10}$/,
                //     message: "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง",
                //   },
                // ]}
              >
                <Input
                  placeholder="เบอร์โทรศัพท์"
                  maxLength={10}
                  onKeyDown={(event) => {
                    if (!/[0-9]/.test(event.key) && event.key !== "Backspace") {
                      event.preventDefault();
                    }
                  }}
                />
              </Form.Item>
            </div>
            <div className=" col-span-3 md:col-span-1 ml-5">
              <Form.Item label={`แนบไฟล์ :`} name={"attrachFile"}>
                <Upload
                  fileList={attendFiles}
                  onChange={handleChangeAttendFiles}
                  beforeUpload={beforeUploadAttendFiles}
                  multiple={false}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>{`Click to Upload`}</Button>
                </Upload>
              </Form.Item>
            </div>
          </div>
          <div className=" col-span-12 md:col-span-1 ml-5 justify-center flex w-full">
            <Button
              htmlType="submit"
              type="primary"
              style={{ fontSize: "16px", padding: "18px 15px 15px" }}
            >{`ยื่นใบลา`}</Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};
