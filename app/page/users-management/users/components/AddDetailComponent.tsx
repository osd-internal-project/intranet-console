"use client";
import { Breadcrumb, Button, Card, Col, Form, Input, Row, Select, Switch, message } from "antd";
import React, { useState, useEffect } from "react";
import UserServices from "../services/user.service";
import { useForm } from "antd/es/form/Form";
import { useRouter } from "next/navigation";
import { useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
import MasterPositionServices from "../services/position.service";
import { ITypeOption } from "../common";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
interface detailType {
  username: string;
  password: string;
  firstNameTh: string;
  lastNameTh: string;
  email: string;
  phoneNumber: string;
  activeStatus: boolean;
  masterPositionId: number;
}

const AddDetailComponent: React.FC = (): React.ReactElement => {
  const router = useRouter();
  // const userAuth = useAxiosUser();

  const { id24Axios } = useId24();
  const baseUrlUser = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_USER);
  const userServices = UserServices(baseUrlUser);
  const masterPositionServices = MasterPositionServices(baseUrlUser);
  const [detailForm] = useForm();
  const [switchChecked, setSwitchChecked] = useState(true);
  const [positionOption, setPositionOption] = useState<ITypeOption[]>([]);
  const [buttonLoading, setbuttonLoading] = useState<boolean>(false);

  useEffect(() => {
    loadingConfig();
  }, []);
  const loadingConfig = async () => {
    const positions = await masterPositionServices.getMasterPositionAll();
    const positionOption: ITypeOption[] = positions.map((d: any) => ({
      label: d.nameTh,
      value: d.id,
    }));
    setPositionOption(positionOption);
  };
  const onClickFinishAdd = () => {
    detailForm.submit();
  };
  const onFinishAdd = async (value: detailType) => {
    setbuttonLoading(true);
    const dupilcateUser = await userServices.getUsersByCondition({
      where: { username: value.username.trim() },
    });

    if (dupilcateUser) {
      message.error("A user with that username already exists");
      setbuttonLoading(false);
      return false;
    } else {
      const form = {
        username: value.username,
        email: value.email,
        activeStatus: switchChecked,
        password: value.password,
        firstNameTh: value.firstNameTh,
        lastNameTh: value.lastNameTh,
        phoneNumber: value.phoneNumber,
        positionId: value.masterPositionId,
      };
      await userServices
        .addUser(form)
        .then((res) => {
          message.success("Add Success");
          router.push(`/page/users-management/users/${res.userId}`);
          setbuttonLoading(false);
        })
        .catch((err) => {
          const message = err.response?.data?.message;
          if (message) {
            message.error(message);
          } else {
            message.error("Error , Please try again");
          }
          setbuttonLoading(false);
        });
    }
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log(errorInfo);
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
  const validateConfirmPassword = (_: any, value: any) => {
    const firstPassword = detailForm.getFieldValue("password");
    if (value && value !== firstPassword) {
      return Promise.reject(new Error("Your password and confirm password must match"));
    }
    return Promise.resolve();
  };
  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Breadcrumb
          items={[
            {
              href: "/page/home",
              title: <span>หน้าหลัก</span>,
            },

            {
              href: "/page/users-management/users",
              title: <span>การจัดการบุคคล</span>,
            },
            {
              title: <span>เพิ่ม บุคลากร</span>,
            },
          ]}
        />
      </Col>
      <Col span={24}>
        <div className="title-page-font">{`ADD USER`}</div>
      </Col>
      <Col span={24}>
        <Card>
          <Form<detailType>
            form={detailForm}
            name="basic"
            wrapperCol={{ span: 20 }}
            onFinish={(values) => onFinishAdd(values as detailType)}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical">
            <div className="grid grid-cols-1 md:grid-cols-3 space-y-0">
              <div>
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[{ required: true, message: "Please enter username" }, { validator: validateNoSpaces }]}>
                  <Input />
                </Form.Item>
              </div>
              <div>
                <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please enter email" }]} style={{ marginBottom: "2px" }}>
                  <Input />
                </Form.Item>
              </div>
              <div>
                <Form.Item label="Status" name="activeStatus" style={{ marginBottom: "2px" }}>
                  <Switch
                    checkedChildren="Active"
                    unCheckedChildren="Inactive"
                    defaultChecked
                    checked={switchChecked}
                    onChange={() => {
                      setSwitchChecked(!switchChecked);
                    }}
                    className={switchChecked === true ? "active-switch" : "inactive-switch"}
                  />
                </Form.Item>
              </div>
              <div>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[{ required: true, message: "Please enter password" }, { validator: validatePassword }]}>
                  <Input.Password />
                </Form.Item>
              </div>
              <div>
                <Form.Item
                  label="Confirm Password"
                  name="cfpassword"
                  dependencies={["password"]}
                  rules={[
                    {
                      required: true,
                      message: "Please enter confirm password",
                    },
                    { validator: validateNoSpaces },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        return validateConfirmPassword(_, value);
                      },
                    }),
                  ]}
                  // style={{ marginBottom: "2px" }}
                >
                  <Input.Password />
                </Form.Item>
              </div>
              <div className=" col-span-3">
                <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-200" />
              </div>

              <div>
                <Form.Item label="First Name" name="firstNameTh" rules={[{ required: true, message: "Please enter first name" }]}>
                  <Input />
                </Form.Item>
              </div>
              <div>
                <Form.Item
                  label="Last Name"
                  name="lastNameTh"
                  rules={[{ required: true, message: "Please enter last Name" }]}
                  style={{ marginBottom: "2px" }}>
                  <Input />
                </Form.Item>
              </div>

              <div>
                <Form.Item
                  label="Phone Number"
                  name="phoneNumber"
                  rules={[{ required: true, message: "Please enter phone number" }, { validator: validateOnlyNumbers }]}
                  style={{ marginBottom: "2px" }}>
                  <Input />
                </Form.Item>
              </div>
              <div>
                <Form.Item label="Position" name="masterPositionId" rules={[{ required: true, message: "Please enter position" }]}>
                  <Select placeholder="Please Select" options={positionOption} />
                </Form.Item>
              </div>
              <div className="  col-span-3">
                <div className=" w-full text-right space-x-4">
                  <Button
                    onClick={() => {
                      router.push(`/page/users-management/users`);
                    }}>{`Cancel`}</Button>
                  <Button type={"primary"} onClick={onClickFinishAdd} loading={buttonLoading}>
                    {`Add User`}
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};
export default AddDetailComponent;
