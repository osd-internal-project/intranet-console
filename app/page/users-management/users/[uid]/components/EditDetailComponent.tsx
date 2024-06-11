"use client";
import { Button, Card, Image, Form, Input, Modal, Select, Switch, message, Avatar } from "antd";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useAxiosIntranet, useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
import { useForm } from "antd/es/form/Form";
import { Icon } from "@iconify/react";
import "../../style.css";
import { useRouter } from "next/navigation";
import UserServices from "../../services/user.service";
import MasterPositionServices from "../../services/position.service";
import { dateToStringTh } from "@/app/utils/format";
import DepartmentServices from "@/app/page/setting/department/services/department.service";
import { TdepartmentFindMany } from "@/app/page/setting/department/common";
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
  positionId: any | null;
};
type option = {
  label: number;
  value: string;
};
const EditDetailComponent: React.FC<props> = ({ userid }): React.ReactElement => {
  const router = useRouter();
  const userAuth = useAxiosUser();
  const userServices = UserServices(userAuth);
  const masterPositionServices = MasterPositionServices(userAuth);
  const [detailForm] = useForm();
  const [repasswordForm] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [disabledEdit, setDisabledEdit] = useState(true);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [checkedActiveStatus, setCheckedActiveStatus] = useState<boolean>(false);
  const [positionOption, setPositionOption] = useState<option[]>([]);
  const [buttonLoading, setbuttonLoading] = useState<boolean>(false);

  useEffect(() => {
    if (loading) {
      loadingDetail();
    }
  }, [loading]);

  const loadingDetail = async () => {
    if (userid) {
      const data = (await userServices.getUsersByUserId(userid)) as detailType;
      const formdata = {
        userId: data.userId,
        username: data.username,
        firstNameTh: data.firstNameTh,
        lastNameTh: data.lastNameTh,
        email: data.email,
        phoneNumber: data.phoneNumber,
        createdAt: data.createdAt ? dateToStringTh(data.createdAt) : "",
        updatedAt: data.updatedAt ? dateToStringTh(data.updatedAt) : "",
        positionId: data.positionId,
      };
      setCheckedActiveStatus(data.activeStatus);
      detailForm.setFieldsValue(formdata);
      const positions = await masterPositionServices.getMasterPositionAll();
      const positionOption: option[] = positions.map((d: any) => ({ label: d.nameEn, value: d.posId }));
      setPositionOption(positionOption);
    }
    setLoading(false);
  };

  const onSubmitEdit = async (value: detailType) => {
    setbuttonLoading(true);
    const username = value.username;
    if (username) {
      const dupilcateUser = await userServices.getDuplicateUsername(userid, username);
      if (dupilcateUser) {
        message.error("A user with that username already exists");
        setbuttonLoading(false);
        return false;
      }

      const updatdata = {
        activeStatus: checkedActiveStatus,
        username: value.username,
        firstNameTh: value.firstNameTh,
        lastNameTh: value.lastNameTh,
        phoneNumber: value.phoneNumber,
        email: value.email,
        positionId: value.positionId,
      };
      await userServices
        .updateUser(userid, updatdata)
        .then(() => {
          message.success("Edit Success");
          setLoading(true);
          setDisabledEdit(false);
          setbuttonLoading(false);
          setDisabledEdit(true);
        })
        .catch((err: any) => {
          console.log(err);
          setbuttonLoading(false);
        });
    }
  };
  const validateNoSpaces = (rule: any, value: string, callback: any) => {
    if (value !== null || value !== undefined || value !== "") {
      if (/\s/.test(value)) {
        callback("Please do not enter space");
      } else {
        callback();
      }
    }
  };
  const validatePassword = (rule: any, value: string, callback: any) => {
    if (value) {
      const lowerCaseMatches = value.match(/[a-z]/g);
      const upperCaseMatches = value.match(/[A-Z]/g);
      if (/\s/.test(value)) {
        callback("Do not enter space");
      } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
        callback("Password may consist of A-Z, a-z and 0-9 in your password");
      } else if (!lowerCaseMatches) {
        callback("Please enter one lowercase letter in your password");
      } else if (!upperCaseMatches) {
        callback("Please enter one uppercase letter in your password");
      }
    }
    callback();
  };
  const validateConfirmPassword = (_: any, value: any) => {
    const firstPassword = repasswordForm.getFieldValue("newPassword");
    if (value && value !== firstPassword) {
      return Promise.reject(new Error("Your password and confirm password must match"));
    }
    return Promise.resolve();
  };
  const validateOnlyNumbers = (rule: any, value: any, callback: any) => {
    if (value === undefined) {
      callback();
    } else {
      if (/\s/.test(value)) {
        callback("Please do not enter space");
      } else if (isNaN(value)) {
        callback("Please enter numbers only");
      } else {
        callback();
      }
    }
  };

  const changeUserPassword = async (value: any) => {
    if (value.newPassword !== value.rePassword) {
      message.error("Your password and confirm password must match");
    } else {
      if (confirm("Are you sure you want to reset password ?")) {
        await userServices
          .changeUserPassword(userid, value.newPassword)
          .then(() => {
            message.success("Change password success");
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
        <Form form={detailForm} name="basic" onFinish={onSubmitEdit} autoComplete="off" layout="vertical">
          <div className=" flex justify-center">
            <Avatar size={128} src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
          </div>
          <div className=" col-span-3">
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-200" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div>
              <Form.Item label="User Id" name="userId">
                <Input disabled={true} className="read-only-input2" />
              </Form.Item>
            </div>
            <div>
              <Form.Item label="Username" name="username" rules={[{ required: true, message: "Please enter username" }, { validator: validateNoSpaces }]}>
                <Input disabled={disabledEdit} className={disabledEdit ? "read-only-input" : ""} />
              </Form.Item>
            </div>
            <div>
              <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please enter email" }]}>
                <Input disabled={disabledEdit} className={disabledEdit ? "read-only-input" : ""} />
              </Form.Item>
            </div>
            <div>
              <Form.Item label="Status" name="activeStatus">
                <Switch
                  disabled={disabledEdit}
                  checkedChildren="Active"
                  unCheckedChildren="Inactive"
                  checked={checkedActiveStatus}
                  onChange={() => setCheckedActiveStatus(!checkedActiveStatus)}
                  className={checkedActiveStatus === true ? "active-switch" : "inactive-switch"}
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item label="Change Password">
                <div className="w-full">
                  <Input.Password disabled value={"1234"} className="read-only-input2" />
                </div>
              </Form.Item>
            </div>
          </div>
          <div className=" col-span-3">
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-200" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div>
              <Form.Item label="First Name" name="firstNameTh" rules={[{ required: true, message: "Please enter first name" }]}>
                <Input disabled={disabledEdit} className={disabledEdit ? "read-only-input" : ""} />
              </Form.Item>
            </div>
            <div>
              <Form.Item label="Last Name" name="lastNameTh" rules={[{ required: true, message: "Please enter last Name" }]} style={{ marginBottom: "2px" }}>
                <Input disabled={disabledEdit} className={disabledEdit ? "read-only-input" : ""} />
              </Form.Item>
            </div>
            <div>
              <Form.Item label="Phone Number" name="phoneNumber" rules={[{ required: true, message: "Please enter phone number" }, { validator: validateOnlyNumbers }]}>
                <Input disabled={disabledEdit} className={disabledEdit ? "read-only-input" : ""} maxLength={12} />
              </Form.Item>
            </div>
            <div>
              <Form.Item label="Position" name="positionId" required>
                <Select options={positionOption} disabled={disabledEdit} className={disabledEdit ? "read-only-input" : ""} />
              </Form.Item>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div>
              <Form.Item label="Created Date" name="createdAt">
                <Input disabled className="read-only-input2" />
              </Form.Item>
            </div>
            <div>
              <Form.Item label="Updated Date" name="updatedAt">
                <Input disabled className="read-only-input2" />
              </Form.Item>
            </div>
          </div>
        </Form>
        <div className=" flex justify-end">
          {!disabledEdit ? (
            <div className=" flex  space-x-4">
              <Button
                onClick={() => {
                  setLoading(true);
                  setDisabledEdit(true);
                }}
              >{`Cancel`}</Button>
              <Button type={"primary"} onClick={() => detailForm.submit()} className="button-blue" loading={buttonLoading}>{`Save Change`}</Button>
            </div>
          ) : (
            <div className=" flex  space-x-4">
              <Button
                onClick={() => {
                  router.push(`/page/setting/usermanagement/`);
                }}
              >{`Back`}</Button>
              <Button type={"primary"} onClick={() => setDisabledEdit(!disabledEdit)} className="button-blue">
                Edit
              </Button>
            </div>
          )}
        </div>
      </Card>
      <Modal open={openChangePassword} onCancel={() => setOpenChangePassword(false)} footer={null} title="Change Password">
        <Form form={repasswordForm} wrapperCol={{ span: 16 }} labelCol={{ span: 8 }} onFinish={changeUserPassword} autoComplete="off" style={{ marginTop: "5%" }}>
          <Form.Item label="New Password" name="newPassword" rules={[{ required: true, message: "Please enter new password" }, { validator: validatePassword }]}>
            <Input.Password type="password" />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="rePassword"
            rules={[
              { required: true, message: "Please enter confirm password" },
              { validator: validateNoSpaces },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  return validateConfirmPassword(_, value);
                },
              }),
            ]}
          >
            <Input.Password type="password" />
          </Form.Item>
          <div className="flex justify-end">
            <Form.Item style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit" className="button-blue">
                Save
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  );
};
export default EditDetailComponent;
