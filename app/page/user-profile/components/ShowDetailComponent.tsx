"use client";
// import "../style.css";
import { Button, Card, Form, Input, Modal, Select, Switch, message } from "antd";
import React, { useState, useEffect } from "react";
import UserServices from "../services/index.service";
import { useForm } from "antd/es/form/Form";
import { dateToStringTh, dateToStringThNoTime } from "@/app/utils/format";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(duration);
dayjs.extend(relativeTime);
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
  const baseUrlUser = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_USER);
  const userServices = UserServices(baseUrlUser);
  const [detailForm] = useForm();
  const [repasswordForm] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [checkedActiveStatus, setCheckedActiveStatus] = useState<boolean>(false);
  const [dateWork, setDateWork] = useState<string>("");
  const [positionOption, setPositionOption] = useState<option[]>([]);
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
      <Card>
        <div className="flex justify-end ">
          <div className="text-red-500">*</div>
          <div className="text-lg font-bold">{`อายุงาน ${dateWork}`}</div>
        </div>
        <Form form={detailForm} name="basic" wrapperCol={{ span: 16 }} autoComplete="off" layout="vertical">
          <div className="grid grid-cols-1 md:grid-cols-3 space-y-0">
            <div>
              <Form.Item label="User Id :" name="userId" style={{ marginBottom: "2px" }}>
                <Input disabled className="read-only-input" />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                label="Username"
                name="username"
                style={{ marginBottom: "2px" }}
                rules={[{ required: true, message: "กรุณากรอก  Username" }, { validator: validateNoSpaces }]}>
                <Input disabled className="read-only-input" />
              </Form.Item>
            </div>
            <div>
              <Form.Item label="Email :" name="email" rules={[{ required: true, message: "กรุณากรอก Email" }]} style={{ marginBottom: "2px" }}>
                <Input disabled className="read-only-input" />
              </Form.Item>
            </div>
            <div>
              <Form.Item label="Status :" name="activeStatus" style={{ marginBottom: "2px" }}>
                <Switch
                  disabled={true}
                  checkedChildren="Active"
                  unCheckedChildren="Inactive"
                  checked={checkedActiveStatus}
                  onChange={() => setCheckedActiveStatus(!checkedActiveStatus)}
                  className={checkedActiveStatus === true ? "active-switch" : "inactive-switch"}
                />
              </Form.Item>
            </div>
            <Form.Item label="Change Password :">
              <div className=" flex w-full space-x-2">
                <div className=" w-2/3">
                  <Input.Password disabled value={"1234"} className="read-only-input2" />
                </div>
                <div>
                  <Button
                    onClick={() => {
                      setOpenChangePassword(true);
                      repasswordForm.resetFields();
                    }}>
                    Change Password
                  </Button>
                </div>
              </div>
            </Form.Item>
            <div></div>

            <div className=" col-span-3">
              <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-200" />
            </div>

            <div>
              <Form.Item label="First Name :" name="firstNameTh" rules={[{ required: true, message: "กรุณากรอก  Username" }]}>
                <Input disabled className="read-only-input" />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                label="Last Name :"
                name="lastNameTh"
                rules={[{ required: true, message: "กรุณากรอก Last Name" }]}
                style={{ marginBottom: "2px" }}>
                <Input disabled className="read-only-input" />
              </Form.Item>
            </div>
            <div>
              <Form.Item label="EMP ID :" name="empId" style={{ marginBottom: "2px" }}>
                <Input disabled className="read-only-input" />
              </Form.Item>
            </div>
            <div>
              <Form.Item label="Phone Number :" name="phoneNumber" rules={[{ validator: validateOnlyNumbers }]} style={{ marginBottom: "2px" }}>
                <Input disabled className="read-only-input" />
              </Form.Item>
            </div>
            <div>
              <Form.Item label="Position :" name="masterPositionId" style={{ marginBottom: "2px" }}>
                <Select options={positionOption} disabled className="read-only-input" />
              </Form.Item>
            </div>
            <div>
              <Form.Item label="Created Date :" name="createdAt" style={{ marginBottom: "2px" }}>
                <Input disabled className="read-only-input" />
              </Form.Item>
            </div>
            <div>
              <Form.Item label="Updated Date :" name="updatedAt">
                <Input disabled className="read-only-input" />
              </Form.Item>
            </div>
            <div>
              <Form.Item label="Start Date :" name="startWork">
                <Input disabled className="read-only-input" />
              </Form.Item>
            </div>
          </div>
        </Form>
      </Card>

      <Modal open={openChangePassword} onCancel={() => setOpenChangePassword(false)} footer={null} title="Change Password">
        <Form form={repasswordForm} wrapperCol={{ span: 16 }} labelCol={{ span: 8 }} onFinish={changeUserPassword} autoComplete="off">
          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[{ required: true, message: "กรุณากรอกรหัสผ่านใหม่" }, { validator: validatePassword }]}>
            <Input.Password type="password" />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="rePassword"
            rules={[
              { required: true, message: "กรุณากรอกรหัสผ่านใหม่อีกครั้ง" },
              { validator: validateNoSpaces },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  return validateConfirmPassword(_, value);
                },
              }),
            ]}>
            <Input.Password type="password" />
          </Form.Item>
          <div className="flex justify-end">
            <Form.Item style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  );
};
export default ShowDetailComponent;
