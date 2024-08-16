"use client";
import { UploadOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Radio,
  Select,
  Switch,
  Upload,
  UploadFile,
} from "antd";
import dayjs from "dayjs";
import {
  IDataUser,
  ISelect,
  ISelectDepartment,
  ITypeDataLeaveCreate,
} from "../../common";
import { RcFile } from "antd/es/upload";
export interface props {
  getUser?: IDataUser | null;
  getTypeLeaveOption: ISelect[];
  getDepartmentById: ISelectDepartment[];
  onfinishCreate: (values: ITypeDataLeaveCreate) => void;
  createdataleaveForm: any;
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
  onChangeParams: (value: string, type: string) => void;
}
export const CreateOnlineLeave: React.FC<props> = ({
  getUser,
  getTypeLeaveOption,
  getDepartmentById,
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
      });
      // console.log("ownerId:", getUserOwner);
      // console.log("ownerId:", getUserOwner?.userId);
    };
    getdatauser();
  }, [getUserOwner]);

  const [leaveTimeSlot, setLeaveTimeSlot] = useState<
    "morning" | "afternoon" | undefined
  >();

  // Handle radio button change
  const handleLeaveTimeSlotChange = (e: any) => {
    setLeaveTimeSlot(e.target.value);
  };

  // function handleLeaveTimeSlotChange(e: RadioChangeEvent): void {
  //   throw new Error("Function not implemented.");
  // }

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
          <div className=" col-span-1 md:col-span-1 ml-5 justify-end flex">
            <Form.Item label={`วันที่ `} name={`createdAt`} layout="horizontal">
              <DatePicker defaultValue={dayjs(new Date())} disabled />
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
            <Form.Item
              label={`แผนก :`}
              name={`depart_id`}
              required
              rules={[{ required: true, message: "กรุณาเลือกแผนก" }]}
            >
              <Select
                placeholder={`แผนก`}
                options={getDepartmentById}
                onChange={(e) => onChangeParams(e, "depart")}
                allowClear
              />
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
          {/* {dayjs(getStartDate).format("YYYY-MM-DD") ===
            dayjs(getEndDate).format("YYYY-MM-DD") && getEndDate ? (
            <>
              <div className="w-full grid grid-cols-3 gap-y-2 mt-2">
                <div className=" col-span-3 md:col-span-1 ml-5">
                  <Form.Item label={`1 วัน`} name={`time_start_check`}>
                    <Switch
                      checkedChildren="ใช่"
                      unCheckedChildren="ไม่"
                      defaultChecked={false}
                      onChange={(e: any) => {
                        setCheckSwitch(e);
                      }}
                    />
                  </Form.Item>
                </div>
                {!checkSwitch ? (
                  <>
                    <div className=" col-span-3 md:col-span-1 ml-5">
                      <Form.Item
                        label={`เวลาเริ่มต้น :`}
                        name={"startTime"}
                        required
                      >
                        <DatePicker
                          picker="time"
                          className="w-full"
                          onChange={(e: any) => onChangeParams(e, "startTime")}
                        />
                      </Form.Item>
                    </div>
                    <div className=" col-span-3 md:col-span-1 ml-5">
                      <Form.Item
                        label={`เวลาสิ้นสุด :`}
                        name={"endTime"}
                        required
                      >
                        <DatePicker
                          picker="time"
                          className="w-full"
                          onChange={(e: any) => onChangeParams(e, "endTime")}
                        />
                      </Form.Item>
                    </div>
                  </>
                ) : null}
              </div>
            </>
          ) : null} */}

          {dayjs(getStartDate).format("YYYY-MM-DD") ===
            dayjs(getEndDate).format("YYYY-MM-DD") && getEndDate ? (
            <div className="w-full grid grid-cols-3 gap-y-2 mt-2">
              <div className="col-span-3 md:col-span-1 ml-5">
                <Form.Item label="ช่วงเวลา" name="leaveTimeSlot">
                  <Radio.Group
                    onChange={handleLeaveTimeSlotChange}
                    value={leaveTimeSlot}
                  >
                    <Radio value="morning">ลาช่วงเช้า (8:30 - 12:30)</Radio>
                    <Radio value="afternoon">ลาช่วงบ่าย (13:30 - 17:30)</Radio>
                  </Radio.Group>
                </Form.Item>
              </div>
            </div>
          ) : null}

          <div className=" col-span-3 md:col-span-1 ml-5">
            <Form.Item
              label={`วัตถุประสงค์การลา :`}
              name={`detail`}
              required
              rules={[
                { required: true, message: "กรุณากรอกวัตถุประสงค์การลา" },
              ]}
            >
              <Input.TextArea placeholder="วัตถุประสงค์การลา" />
            </Form.Item>
          </div>
          <div className="w-full grid grid-cols-2 gap-y-2 mt-2">
            <div className=" col-span-3 md:col-span-1 ml-5">
              <Form.Item
                label={`เบอร์โทรศัพท์ :`}
                name={"phoneNumber"}
                required
              >
                <Input placeholder="เบอร์โทรศัพท์" />
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
            <Button htmlType="submit" type="primary">{`ยื่นใบลา`}</Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};
