"use client";
import { Button, Card, Form, Input, Modal, Select, Switch, message, Image } from "antd";
import React, { useState, useEffect } from "react";
import UserServices from "../services/index.service";
import { useForm } from "antd/es/form/Form";
import { dateToStringThNoTime } from "@/app/utils/format";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(duration);
dayjs.extend(relativeTime);

const customInputStyle = {
  border: "none",
  borderRadius: "0",
  boxShadow: "none",
  background: "transparent",
  padding: "4px 0",
  borderBottom: "1px solid #e5e7eb",
  fontSize: "14px",
};

export interface props {
  userid: string;
}

type detailType = {
  userId: string | null;
  username: string | null;
  firstNameTh: string | null;
  lastNameTh: string | null;
  firstNameEn: string | null;
  lastNameEn: string | null;
  email: string | null;
  phoneNumber: string | null;
  activeStatus: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
  masterPosition: any | null;
  empId: string | null;
  startWork: Date | null;
};

type option = {
  label: number;
  value: string;
};

const ShowDetailComponent: React.FC<props> = ({ userid }): React.ReactElement => {
  const { id24Axios } = useId24();
  const baseUrlUser = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_USER);
  const userServices = UserServices(baseUrlUser);
  const [detailForm] = useForm();
  const [repasswordForm] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [checkedActiveStatus, setCheckedActiveStatus] = useState<boolean>(false);
  const [dateWork, setDateWork] = useState<string>("");
  const [positionOption, setPositionOption] = useState<option[]>([]);
  const image = detailForm.getFieldsValue(true);
  const [clickUpdate, setClickUpdate] = React.useState(false);

  const handleUpdate = async (values: { extension: string; phoneNumber: string }) => {
    console.log(values);
  };

  useEffect(() => {
    if (loading) {
      loadingDetail();
    }
  }, [loading]);

  const loadingDetail = async () => {
    if (userid) {
      const data = (await userServices.getUsersByUserId(userid)) as detailType;
      const start = dayjs(data.startWork);
      const end = dayjs();
      const years = end.diff(start, "year");
      const months = end.diff(start.add(years, "year"), "month");
      const days = end.diff(start.add(years, "year").add(months, "month"), "day");
      const formattedDuration = `${years} ปี ${months} เดือน ${days} วัน`;
      setDateWork(formattedDuration);
      const formdata = {
        ...data,
        empId: data.empId,
        startWork: data.startWork ? dateToStringThNoTime(data.startWork) : "",
        userId: data.userId,
        username: data.username,
        firstNameTh: data.firstNameTh,
        lastNameTh: data.lastNameTh,
        email: data.email,
        phoneNumber: data.phoneNumber,
        createdAt: data.createdAt ? dateToStringThNoTime(data.createdAt) : "",
        updatedAt: data.updatedAt ? dateToStringThNoTime(data.updatedAt) : "",
        masterPositionId: data.masterPosition.posId,
      };
      setCheckedActiveStatus(data.activeStatus);
      detailForm.setFieldsValue(formdata);
      const positions = await userServices.getMasterPositionAll();
      const positionOption: option[] = positions.map((d: any) => ({ label: d.nameTh, value: d.id }));
      setPositionOption(positionOption);
    }
    setLoading(false);
  };

  const validateNoSpaces = (rule: any, value: string, callback: any) => {
    if (/\s/.test(value)) {
      callback("ห้ามใช้เว้นวรรค");
    } else {
      callback();
    }
  };

  const validatePassword = (rule: any, value: string, callback: any) => {
    const lowerCaseMatches = value.match(/[a-z]/g);
    const upperCaseMatches = value.match(/[A-Z]/g);
    if (/\s/.test(value)) {
      callback("ห้ามใช้เว้นวรรค");
    } else if (!lowerCaseMatches) {
      callback("รหัสต้องมีตัวพิมพ์เล็ก");
    } else if (!upperCaseMatches) {
      callback("รหัสต้องมีตัวพิมพ์ใหญ่");
    } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
      callback("รหัสต้องมีเฉพาะตัวอักษรภาษาอังกฤษและตัวเลข");
    }
    callback();
  };

  const validateConfirmPassword = (_: any, value: any) => {
    const firstPassword = repasswordForm.getFieldValue("newPassword");
    if (value && value !== firstPassword) {
      return Promise.reject(new Error("กรุณากรอก Password ทั้ง 2 ช่องให้ตรงกัน"));
    }
    return Promise.resolve();
  };

  const validateOnlyNumbers = (rule: any, value: any, callback: any) => {
    if (value === undefined) {
      callback();
    } else {
      if (/\s/.test(value)) {
        callback("ห้ามใช้เว้นวรรค");
      } else if (isNaN(value)) {
        callback("กรุณากรอกเฉพาะตัวเลข");
      } else {
        callback();
      }
    }
  };

  const changeUserPassword = async (value: any) => {
    if (value.newPassword !== value.rePassword) {
      message.error("กรุณากรอกรหัสผ่านให้ถูกต้อง");
    } else {
      if (confirm("ยืนยันการรีเซ็ตรหัสผ่าน ?")) {
        await userServices
          .changeUserPassword(userid, value.newPassword)
          .then(() => {
            message.success("Success");
            repasswordForm.resetFields();
            setOpenChangePassword(false);
          })
          .catch((err) => {
            message.error("ผิดพลาด");
            console.log(err);
          });
      }
    }
    setOpenChangePassword(false);
  };

  return (
    <>
      <Form form={detailForm} name="basic" autoComplete="off" layout="vertical">
        <div className="p-4">
          <Card
            className="shadow-sm border border-gray-200"
            bodyStyle={{ padding: "20px" }}
            title={`🫵 ข้อมูลส่วนตัว`}
            extra={
              <Button size="small" type="primary" onClick={() => (clickUpdate ? setClickUpdate(false) : setClickUpdate(true))}>
                {clickUpdate ? `ยกเลิก` : `แก้ไข`}
              </Button>
            }>
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                  {clickUpdate ? (
                    <> </>
                  ) : (
                    <Image
                      className="w-full h-full object-cover"
                      src={image.imageId ? `${process.env.NEXT_PUBLIC_API_BASE_URL_USER}/id24users/get-image-user/${image.imageId}` : ""}
                      fallback="/api/placeholder/64/64"
                      preview={true}
                    />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {detailForm.getFieldValue("firstNameTh")} {detailForm.getFieldValue("lastNameTh")}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {detailForm.getFieldValue("firstNameEn")} {detailForm.getFieldValue("lastNameEn")}
                  </p>
                  <p className="text-sm text-gray-500">@{detailForm.getFieldValue("username")}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1">
                  <span className="text-red-500 text-xs">*</span>
                  <span className="text-sm font-medium text-gray-700">อายุงาน {dateWork}</span>
                </div>
              </div>
            </div>

            {/* Account Information Section */}
            <div className="mb-6">
              <h3 className="text-base font-medium text-gray-800 mb-3 pb-1 border-b border-blue-200">ข้อมูลบัญชีผู้ใช้</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Form.Item label="รหัสพนักงาน" name="empId" className="mb-2">
                  <Input disabled style={customInputStyle} className="text-sm text-gray-700 bg-transparent border-0 shadow-none focus:shadow-none" />
                </Form.Item>
                <Form.Item label="Username" name="username" className="mb-2">
                  <Input disabled style={customInputStyle} className="text-sm text-gray-700 bg-transparent border-0 shadow-none focus:shadow-none" />
                </Form.Item>
                <Form.Item label="Email" name="email" className="mb-2">
                  <Input disabled style={customInputStyle} className="text-sm text-gray-700 bg-transparent border-0 shadow-none focus:shadow-none" />
                </Form.Item>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="mb-6">
              <h3 className="text-base font-medium text-gray-800 mb-3 pb-1 border-b border-green-200">ข้อมูลส่วนตัว</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Form.Item label="ชื่อจริง" name="firstNameTh" className="mb-2">
                  <Input disabled style={customInputStyle} className="text-sm text-gray-700 bg-transparent border-0 shadow-none focus:shadow-none" />
                </Form.Item>

                <Form.Item label="นามสกุล" name="lastNameTh" className="mb-2">
                  <Input disabled style={customInputStyle} className="text-sm text-gray-700 bg-transparent border-0 shadow-none focus:shadow-none" />
                </Form.Item>
                <Form.Item label="ตำแหน่ง" name="masterPositionId" className="mb-2">
                  <Select
                    options={positionOption}
                    disabled
                    className="text-sm text-gray-700"
                    style={{
                      ...customInputStyle,
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  />
                </Form.Item>
                <Form.Item label="เบอร์โต๊ะทำงาน" name="extension" className="mb-2" rules={[{ required: clickUpdate }]}>
                  <Input
                    disabled={clickUpdate ? false : true}
                    style={clickUpdate ? {} : customInputStyle}
                    className={clickUpdate ? "" : "text-sm text-gray-700 bg-transparent border-0 shadow-none focus:shadow-none"}
                  />
                </Form.Item>

                <Form.Item
                  label="เบอร์โทรศัพท์"
                  name="phoneNumber"
                  className="mb-2"
                  rules={[{ required: clickUpdate, validator: validateOnlyNumbers }]}>
                  <Input
                    disabled={clickUpdate ? false : true}
                    style={clickUpdate ? {} : customInputStyle}
                    className={clickUpdate ? "" : "text-sm text-gray-700 bg-transparent border-0 shadow-none focus:shadow-none"}
                  />
                </Form.Item>
              </div>
            </div>

            {/* System Information Section */}
            <div>
              <h3 className="text-base font-medium text-gray-800 mb-3 pb-1 border-b border-purple-200">ข้อมูลระบบ</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Form.Item label="วันที่สร้างบัญชี" name="createdAt" className="mb-2">
                  <Input disabled style={customInputStyle} className="text-sm text-gray-700 bg-transparent border-0 shadow-none focus:shadow-none" />
                </Form.Item>
                <Form.Item label="วันที่เริ่มงาน" name="startWork" className="mb-2">
                  <Input disabled style={customInputStyle} className="text-sm text-gray-700 bg-transparent border-0 shadow-none focus:shadow-none" />
                </Form.Item>
              </div>
            </div>
          </Card>
        </div>

        {/* Change Password Modal */}
        {/* <Modal
        open={openChangePassword}
        onCancel={() => setOpenChangePassword(false)}
        footer={null}
        title={<div className="text-base font-medium text-gray-800">เปลี่ยนรหัสผ่าน</div>}
        width={400}>
        <Form form={repasswordForm} layout="vertical" onFinish={changeUserPassword} autoComplete="off" className="pt-2">
          <Form.Item
            label="รหัสผ่านใหม่"
            name="newPassword"
            rules={[{ required: true, message: "กรุณากรอกรหัสผ่านใหม่" }, { validator: validatePassword }]}
            className="mb-3">
            <Input.Password placeholder="กรุณากรอกรหัสผ่านใหม่" className="h-9" />
          </Form.Item>

          <Form.Item
            label="ยืนยันรหัสผ่าน"
            name="rePassword"
            rules={[
              { required: true, message: "กรุณากรอกรหัสผ่านใหม่อีกครั้ง" },
              { validator: validateNoSpaces },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  return validateConfirmPassword(_, value);
                },
              }),
            ]}
            className="mb-4">
            <Input.Password placeholder="กรุณายืนยันรหัสผ่านใหม่" className="h-9" />
          </Form.Item>

          <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200">
            <Button onClick={() => setOpenChangePassword(false)} className="px-4 h-9 text-sm">
              ยกเลิก
            </Button>
            <Button type="primary" htmlType="submit" className="px-4 h-9 text-sm">
              บันทึก
            </Button>
          </div>
        </Form>
      </Modal> */}
      </Form>
    </>
  );
};

export default ShowDetailComponent;
