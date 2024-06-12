"use client";
import { UploadOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Button, Card, Checkbox, DatePicker, Form, Input, Select, Switch, Upload, UploadProps, message } from "antd";
import dayjs from "dayjs";
import { useForm } from "antd/es/form/Form";
import { IDataUser, ISelect, ITypetypeleave } from "../../common";
export interface props {
  getUser?: IDataUser | null;
  getTypeLeaveOption: ISelect[];
}
export const CreateOnlineLeave: React.FC<props> = ({ getUser, getTypeLeaveOption }): React.ReactElement => {
  const [createdataleaveForm] = useForm();
  const [getStartDate, setStartDate] = useState<Date>();
  const [getEndDate, setEndDate] = useState<Date>();
  const [checkSwitch, setCheckSwitch] = useState<boolean>(false);

  const props: UploadProps = {
    name: "file",
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  useEffect(() => {
    const getdatauser = () => {
      createdataleaveForm.setFieldsValue({
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
        <Form form={createdataleaveForm} className="space-y-4 grid grid-cols-1" layout="vertical" autoComplete="off">
          <div className=" col-span-1 md:col-span-1 ml-5 justify-end flex">
            <Form.Item label={`วันที่ :`} name={`created_date`}>
              <DatePicker defaultValue={dayjs(new Date())} value={dayjs(new Date())} disabled />
            </Form.Item>
          </div>
          <div className=" col-span-3 md:col-span-1 ml-5">
            <Form.Item label={`เรียนถึง :`}>
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
              <Form.Item label={`ตั้งแต่วันที่ :`} name={`start_date`} required>
                <DatePicker className="w-full" onChange={(e: any) => setStartDate(e)} />
              </Form.Item>
            </div>
            <div className=" col-span-3 md:col-span-1 ml-5">
              <Form.Item label={`ถึงวันที่ :`} name={`end_date`} required>
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
            <Form.Item label={`วัตถุประสงค์การลา :`} name={`remark`} required>
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
              <Form.Item label={`แนบไฟล์ :`}>
                <Upload {...props}>
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
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
