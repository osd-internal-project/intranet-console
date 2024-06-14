"use client";
import { UploadOutlined } from "@ant-design/icons";
import React, { useEffect } from "react";
import { Button, Card, DatePicker, Form, Input, Select, Switch, Upload, UploadFile } from "antd";
import dayjs from "dayjs";
import { IDataUser, ISelect, ITypeDataLeaveCreate } from "../../common";
import { RcFile } from "antd/es/upload";
export interface props {
  getUser?: IDataUser | null;
  getTypeLeaveOption: ISelect[];
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
}): React.ReactElement => {
  useEffect(() => {
    const getdatauser = () => {
      createdataleaveForm.setFieldsValue({
        userId: getUser?.userId,
        posId: getUser?.position?.posId,
        position: getUser?.position?.nameEn,
        firstNameTh: getUser?.firstNameTh,
        lastNameTh: getUser?.lastNameTh,
      });
    };
    getdatauser();
  }, []);

  return (
    <div>
      <Card className="w-full grid grid-cols-1 gap-y-2 mt-2">
        <Form form={createdataleaveForm} className="space-y-4 grid grid-cols-1" layout="vertical" autoComplete="off" onFinish={onfinishCreate}>
          <div className=" col-span-1 md:col-span-1 ml-5 justify-end flex">
            <Form.Item label={`วันที่ :`} name={`createdAt`}>
              <DatePicker defaultValue={dayjs(new Date())} disabled />
            </Form.Item>
          </div>
          <div className=" col-span-3 md:col-span-1 ml-5">
            <Form.Item label={`เรียนถึง :`}>
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
            <Form.Item label={`ประเภทการลา :`} name={`type_id`} required>
              <Select placeholder={`ประเภทการลา`} options={getTypeLeaveOption} allowClear />
            </Form.Item>
          </div>
          <div className="w-full grid grid-cols-2 gap-y-2 mt-2">
            <div className=" col-span-3 md:col-span-1 ml-5">
              <Form.Item label={`ตั้งแต่วันที่ :`} name={`startDate`} required>
                <DatePicker className="w-full" onChange={(e: any) => setStartDate(e)} />
              </Form.Item>
            </div>
            <div className=" col-span-3 md:col-span-1 ml-5">
              <Form.Item label={`ถึงวันที่ :`} name={`endDate`} required>
                <DatePicker className="w-full" onChange={(e: any) => setEndDate(e)} />
              </Form.Item>
            </div>
          </div>
          {dayjs(getStartDate).format("YYYY-MM-DD") === dayjs(getEndDate).format("YYYY-MM-DD") && getEndDate ? (
            <>
              <div className="w-full grid grid-cols-3 gap-y-2 mt-2">
                <div className=" col-span-3 md:col-span-1 ml-5">
                  <Form.Item label={`1 วัน`} name={`time_start_check`}>
                    <Switch checkedChildren="ใช่" unCheckedChildren="ไม่" defaultChecked={false} onChange={(e: any) => setCheckSwitch(e)} />
                  </Form.Item>
                </div>
                {!checkSwitch ? (
                  <>
                    <div className=" col-span-3 md:col-span-1 ml-5">
                      <Form.Item label={`เวลาเริ่มต้น :`} name={"startTime"} required>
                        <DatePicker picker="time" className="w-full" />
                      </Form.Item>
                    </div>
                    <div className=" col-span-3 md:col-span-1 ml-5">
                      <Form.Item label={`เวลาสิ้นสุด :`} name={"endTime"} required>
                        <DatePicker picker="time" className="w-full" />
                      </Form.Item>
                    </div>
                  </>
                ) : null}
              </div>
            </>
          ) : null}

          <div className=" col-span-3 md:col-span-1 ml-5">
            <Form.Item label={`วัตถุประสงค์การลา :`} name={`detail`} required>
              <Input placeholder="วัตถุประสงค์การลา" />
            </Form.Item>
          </div>
          <div className="w-full grid grid-cols-2 gap-y-2 mt-2">
            <div className=" col-span-3 md:col-span-1 ml-5">
              <Form.Item label={`เบอร์โทรศัพท์ :`} name={"phoneNumber"} required>
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
