"use client";
import { loadAppConfig } from "@/app/config/app-config";
import { UserContext, type UserContectType } from "@/app/config/userContext";
import { timeOptions } from "@/app/utils/time-convertor";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Card, DatePicker, Form, Input, Select, Typography, Upload } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import type { ISelect, ITypetypeleave } from "../../common";
import LeaveManagementServices from "@/app/services/leave-management.service";

const CreateLeaveAdminPage: React.FC = (): React.ReactElement => {
  const [createdataleaveForm] = Form.useForm();
  const router = useRouter();
  const { user } = (useContext(UserContext) as UserContectType) || { user: null };
  const { id24Axios } = useId24();
  const baseUrlIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const [getTypeLeaveOption, setTypeLeaveOption] = useState<ISelect[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (loading) loadDataTypeLeave();
  }, [loading, user]);

  const loadDataTypeLeave = async () => {
    if (user) {
      const res = await LeaveManagementServices(baseUrlIntranet).getdataAll();
      //   const resTableDeatilTypeLeave = await LeaveManagementServices(baseUrlIntranet).findDetailTypeLeaveByUserId(user?.userId);
      //   const resTableUserTypeLeave = await LeaveManagementServices(baseUrlIntranet).findUserByUserId(user?.userId);
      const options = res.map((event: ITypetypeleave) => {
        return { value: event.typeId, label: event.typeName };
      });
      setTypeLeaveOption(options);
      setLoading(false);
    }
  };
  return (
    <div>
      <Card className="w-full grid grid-cols-1">
        <div>
          <Form
            size="small"
            // onValuesChange={onChangeFormCreate}
            // form={createdataleaveForm}
            className=" grid grid-cols-1 p-0 no-label-padding"
            layout="vertical"
            autoComplete="off"
            // onFinish={onfinishCreate}
          >
            <div className="col-span-1 md:col-span-1  justify-end flex p-0">
              <Form.Item label={`วันที่ `} name={`createdAt`} layout="horizontal">
                <Typography.Text>{dayjs(new Date()).format("DD-MM-YYYY")}</Typography.Text>
              </Form.Item>
            </div>
            <div className=" col-span-3 md:col-span-1 " style={{ marginTop: "-10px" }}>
              <Form.Item label={`เรียนถึง `} name={`ownerName`} layout="horizontal" wrapperCol={{ span: 20 }}>
                <Input
                  readOnly
                  className="!bg-transparent !shadow-none !border-none hover:!bg-transparent focus:!bg-transparent cursor-default text-gray-900"
                />
              </Form.Item>
            </div>
            <div className=" col-span-3 md:col-span-1 ">
              <Form.Item label={`รหัสพนักงาน :`} name={`userId`} hidden>
                <Input disabled />
              </Form.Item>
            </div>
            <div className="w-full grid grid-cols-1 gap-2">
              <div className="md:col-span-1 ">
                <Form.Item label={`ชื่อ - สกุล`} name={`fullName`} layout="horizontal" wrapperCol={{ span: 20 }}>
                  <Input
                    readOnly
                    className="!bg-transparent !shadow-none !border-none hover:!bg-transparent focus:!bg-transparent cursor-default text-gray-900"
                  />
                </Form.Item>
              </div>
              <div className="md:col-span-1 " hidden>
                <Form.Item label={`ชื่อ `} name={`firstNameTh`} layout="horizontal">
                  <Input
                    readOnly
                    className="!bg-transparent !shadow-none !border-none hover:!bg-transparent focus:!bg-transparent cursor-default text-gray-900"
                  />
                </Form.Item>
              </div>
              <div className="md:col-span-1 " hidden>
                <Form.Item label={`นามสกุล `} name={`lastNameTh`} layout="horizontal">
                  <Input
                    readOnly
                    className="!bg-transparent !shadow-none !border-none hover:!bg-transparent focus:!bg-transparent cursor-default text-gray-900"
                  />
                </Form.Item>
              </div>
            </div>
            <div className=" col-span-3 md:col-span-1 " hidden>
              <Form.Item label={`แผนก `} name={`groupName`} layout="horizontal">
                <Input disabled />
              </Form.Item>
            </div>
            <div className=" col-span-3 md:col-span-1 ">
              <Form.Item label={`ตำแหน่ง `} name={`posId`} hidden layout="horizontal">
                <Input disabled />
              </Form.Item>
            </div>
            <div className=" col-span-1 md:col-span-1 ">
              <Form.Item label={`ตำแหน่ง `} name={`position`} layout="horizontal" wrapperCol={{ span: 20 }}>
                <Input
                  readOnly
                  className="!bg-transparent !shadow-none !border-none hover:!bg-transparent focus:!bg-transparent cursor-default text-gray-900"
                />
              </Form.Item>
            </div>
            <div className=" col-span-3 md:col-span-1 ">
              <Form.Item label={`ประเภทการลา :`} name={`type_id`} rules={[{ required: true, message: "กรุณาเลือกประเภทการลา" }]}>
                <Select placeholder={`ประเภทการลา`} options={getTypeLeaveOption} allowClear showSearch optionFilterProp="label" />
              </Form.Item>
            </div>
            <div className="w-full grid grid-cols-2 gap-2">
              <div className=" col-span-3 md:col-span-1 ">
                <Form.Item
                  label={`ตั้งแต่วันที่ :`}
                  name={`startDate`}
                  rules={[
                    { required: true, message: "" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const startDate = getFieldValue("startDate");
                        const type_id = getFieldValue("type_id");
                        // return validateCheckEndDate(startDate, value, type_id, dataHolidayDay);
                      },
                    }),
                  ]}
                >
                  <DatePicker
                    allowClear
                    className="w-full"
                    //    onChange={(e: any) => setStartDate(e)}
                    format={"DD-MM-YYYY"}
                  />
                </Form.Item>
              </div>
              <div className=" col-span-3 md:col-span-1 ">
                <Form.Item
                  label={`ถึงวันที่ :`}
                  name={`endDate`}
                  rules={[
                    { required: true, message: "" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const startDate = getFieldValue("startDate");
                        const type_id = getFieldValue("type_id");
                        // return validateCheckEndDate(startDate, value, type_id, dataHolidayDay);
                      },
                    }),
                  ]}
                >
                  <DatePicker
                    allowClear
                    className="w-full"
                    //   onChange={(e: any) => setEndDate(e)} format={"DD-MM-YYYY"}
                  />
                </Form.Item>
              </div>
            </div>
            <>
              {/* {dayjs(getStartDate).isSame(getEndDate, "day") && getEndDate && (
                <div className="w-full grid grid-cols-4 gap-2">
                  <div className="col-span-3 md:col-span-1">
                    <Form.Item label="ลา 1 วัน" name="time_start_check" valuePropName="checked">
                      <Switch unCheckedChildren="ไม่" checkedChildren="ใช่" onChange={setCheckSwitch} />
                    </Form.Item>
                  </div> */}
              {/* {!checkSwitch && ( */}
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
              {/* //   )} */}
              {/* </div> */}
              {/* )} */}
            </>
            <div className=" col-span-3 md:col-span-1 ">
              <Form.Item label={`วัตถุประสงค์การลา :`} name={`detail`} rules={[{ required: true, message: "กรุณากรอกวัตถุประสงค์การลา" }]}>
                <Input.TextArea placeholder="วัตถุประสงค์การลา" />
              </Form.Item>
            </div>
            <div className="w-full grid grid-cols-2 gap-2">
              <div className=" col-span-3 md:col-span-1 ">
                <Form.Item
                  label={`เบอร์โทรศัพท์ :`}
                  name={"phoneNumber"}
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกเบอร์โทรศัพท์",
                    },
                    {
                      pattern: /^[0-9]{10}$/,
                      message: "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง",
                    },
                  ]}
                >
                  <Input
                    maxLength={10}
                    placeholder="เบอร์โทรศัพท์"
                    onKeyDown={(event) => {
                      if (!/[0-9]/.test(event.key) && event.key !== "Backspace") {
                        event.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
              </div>
              <div className=" col-span-3 md:col-span-1 ">
                <Form.Item label={`แนบไฟล์ :`} name={"attrachFile"}>
                  <Upload
                    showUploadList={true}
                    // fileList={attendFiles}
                    // onChange={handleChangeAttendFiles}
                    // beforeUpload={beforeUploadAttendFiles}
                    multiple={false}
                    maxCount={1}
                  >
                    <Button icon={<UploadOutlined />}>{`อัปโหลดไฟล์`}</Button>
                  </Upload>
                </Form.Item>
              </div>
            </div>
            <div className=" col-span-12 md:col-span-1  justify-center flex w-full">
              <Button htmlType="submit" type="primary">{`ยื่นใบลา`}</Button>
            </div>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default CreateLeaveAdminPage;
