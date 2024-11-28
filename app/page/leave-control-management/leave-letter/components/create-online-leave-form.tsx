import React from "react";
import { Button, DatePicker, Form, FormInstance, Input, message, Select, Switch, Typography, Upload, UploadFile } from "antd";
import dayjs from "dayjs";
import { UploadOutlined } from "@ant-design/icons";
import { ISelect, ITypeDataLeaveCreate } from "../../common";
import { timeOptions } from "../../until/function-data-leave";
import { validateCheckEndDate } from "@/app/utils/validatefield";

interface props {
  createdataleaveForm: FormInstance<ITypeDataLeaveCreate>;
  onfinishCreate: (values: ITypeDataLeaveCreate) => void;
  getTypeLeaveOption: ISelect[];
  setStartDate: (values: Date) => void;
  setEndDate: (values: Date) => void;
  getStartDate: Date | undefined;
  getEndDate: Date | undefined;
  attendFiles: UploadFile[];
  setCheckSwitch: (values: boolean) => void;
  checkSwitch: boolean | undefined;
  handleChangeAttendFiles: (e: any) => void;
  beforeUploadAttendFiles: (e: any) => void;
}

export const CreateLeaveForm: React.FC<props> = ({
  createdataleaveForm,
  onfinishCreate,
  getTypeLeaveOption,
  setStartDate,
  setEndDate,
  getStartDate,
  getEndDate,
  attendFiles,
  setCheckSwitch,
  checkSwitch,
  handleChangeAttendFiles,
  beforeUploadAttendFiles,
}) => {
  return (
    <div>
      <Form size="small" form={createdataleaveForm} className=" grid grid-cols-1" layout="vertical" autoComplete="off" onFinish={onfinishCreate}>
        <div className="col-span-1 md:col-span-1 ml-5 justify-end flex">
          <Form.Item label={`วันที่ `} name={`createdAt`} layout="horizontal">
            <Typography.Text>{dayjs(new Date()).format("DD-MM-YYYY")}</Typography.Text>
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
          <Form.Item label={`แผนก :`} name={`groupName`}>
            <Input disabled />
          </Form.Item>
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
          <Form.Item label={`ประเภทการลา :`} name={`type_id`} rules={[{ required: true, message: "กรุณาเลือกประเภทการลา" }]}>
            <Select placeholder={`ประเภทการลา`} options={getTypeLeaveOption} allowClear showSearch optionFilterProp="label" />
          </Form.Item>
        </div>
        <div className="w-full grid grid-cols-2 gap-y-2 mt-2">
          <div className=" col-span-3 md:col-span-1 ml-5">
            <Form.Item
              label={`ตั้งแต่วันที่ :`}
              name={`startDate`}
              rules={[
                { required: true, message: "" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const startDate = getFieldValue("startDate");
                    const type_id = getFieldValue("type_id");
                    return validateCheckEndDate(startDate, value, type_id);
                  },
                }),
              ]}>
              <DatePicker allowClear className="w-full" onChange={(e: any) => setStartDate(e)} />
            </Form.Item>
          </div>
          <div className=" col-span-3 md:col-span-1 ml-5">
            <Form.Item
              label={`ถึงวันที่ :`}
              name={`endDate`}
              rules={[
                { required: true, message: "" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const startDate = getFieldValue("startDate");
                    const type_id = getFieldValue("type_id");
                    return validateCheckEndDate(startDate, value, type_id);
                  },
                }),
              ]}>
              <DatePicker allowClear className="w-full" onChange={(e: any) => setEndDate(e)} />
            </Form.Item>
          </div>
        </div>
        <>
          {dayjs(getStartDate).format("YYYY-MM-DD") === dayjs(getEndDate).format("YYYY-MM-DD") && getEndDate ? (
            <div className="w-full grid grid-cols-4 gap-y-0.5 mt-0.5">
              <div className="col-span-3 md:col-span-1 ml-5 mt-4">
                <Form.Item label="ลา 1 วัน" name="time_start_check">
                  <Switch
                    unCheckedChildren="ไม่"
                    checkedChildren="ใช่"
                    defaultChecked={false}
                    onChange={(e: any) => {
                      setCheckSwitch(e);
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
                      rules={[
                        {
                          required: true,
                          message: "กรุณาเลือกเวลาที่เริ่มลา",
                        },
                      ]}>
                      <Select
                        allowClear
                        className="w-full"
                        placeholder="เลือกช่วงเวลา"
                        options={timeOptions.map((time) => ({ key: time, value: time, label: time }))}
                      />
                    </Form.Item>
                  </div>
                  <div className="col-span-3 md:col-span-1 ml-5 mt-4">
                    <Form.Item
                      label="เวลาสิ้นสุด :"
                      name="endTime"
                      rules={[
                        {
                          required: true,
                          message: "กรุณาเลือกเวลาที่สิ้นสุดการลา",
                        },
                      ]}>
                      <Select
                        allowClear
                        className="w-full"
                        placeholder="เลือกช่วงเวลา"
                        options={timeOptions.map((time) => ({ key: time, value: time, label: time }))}
                      />
                    </Form.Item>
                  </div>
                </>
              )}
            </div>
          ) : null}
        </>
        <div className=" col-span-3 md:col-span-1 ml-5">
          <Form.Item label={`วัตถุประสงค์การลา :`} name={`detail`} rules={[{ required: true, message: "กรุณากรอกวัตถุประสงค์การลา" }]}>
            <Input.TextArea placeholder="วัตถุประสงค์การลา" />
          </Form.Item>
        </div>
        <div className="w-full grid grid-cols-2 gap-y-2 mt-2">
          <div className=" col-span-3 md:col-span-1 ml-5">
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
              ]}>
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
          <div className=" col-span-3 md:col-span-1 ml-5">
            <Form.Item label={`แนบไฟล์ :`} name={"attrachFile"}>
              <Upload fileList={attendFiles} onChange={handleChangeAttendFiles} beforeUpload={beforeUploadAttendFiles} multiple={false} maxCount={1}>
                <Button icon={<UploadOutlined />}>{`อัพโหลดไฟล์`}</Button>
              </Upload>
            </Form.Item>
          </div>
        </div>
        <div className=" col-span-12 md:col-span-1 ml-5 justify-center flex w-full">
          <Button htmlType="submit" size="small" type="primary" style={{ padding: "10px 10px 10px" }}>{`ยื่นใบลา`}</Button>
        </div>
      </Form>
    </div>
  );
};
