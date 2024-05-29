"use client";
import { Form, Checkbox, Button, Input, Alert, Card, Spin, message } from "antd";
import { redirect, useRouter } from "next/navigation";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { createCookieLocal, getCookieLocal } from "../utils/cookies";
import config from "@/app/config";

type Props = {
  searchParams: Record<"callbackUrl" | "error", string>;
};
type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};
export default function Login(props: Props) {
  const router = useRouter();
  const [form] = useForm();
  const [loading, setLoading] = useState<boolean>(true);

  const onFinish = () => {
    setLoading(true);
    form.validateFields().then(async (values) => {
      // values.remember
      const res = await signIn("username-login", {
        username: values.username,
        password: values.password,
        // remember: values.remember,
        redirect: false,
        callbackUrl: "/page/",
      });
      if (res?.ok === true) {
        message.success(`LOGIN SUCCESS`);
        if (values.remember) {
          createCookieLocal("rememberMe", values.username);
        }
        router.push("/page/");

        // setLoading(false);
      } else {
        setLoading(false);
        message.error(`Invalid Login : username or password is incorrect`);
      }
    });
  };
  useEffect(() => {
    setLoading(false);
  }, []);
  const rememberMe = getCookieLocal("rememberMe");
  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <Spin />
  //     </div>
  //   );
  // } else {
  return (
    <Spin spinning={loading}>
      <div className="grid grid-cols-1 md:grid-cols-2 " style={{ backgroundColor: "#f5f5f5" }}>
        <div className=" justify-center  items-center h-screen w-full hidden  md:flex">
          <div className="flex justify-center m-4">
            <img src="/images/logo-dss-v2.png" alt="logo-page" className={` w-96 md:w-96 h-auto`} />
          </div>
        </div>
        <div className="flex justify-center items-center h-screen ">
          <div>
            <Form form={form} initialValues={{ remember: false }} onFinish={onFinish} autoComplete="off" layout="vertical">
              <div className=" columns-1 m-4">
                <div className="flex justify-center ">
                  <img src="/images/logo-dss-v1.png" alt="logo-page" className={`w-20 md:w-20 h-auto  mb-5`} />
                </div>
                <div className="flex justify-center text-3xl font-extrabold mb-3">ระบบการจัดการสารเคมี วศ.</div>
                {/* <p className="flex justify-center">ระบบการจัดการสารเคมี วศ.</p> */}
              </div>
              <Form.Item<FieldType> label="Username" name="username" initialValue={rememberMe} rules={[{ required: true, message: "กรุณากรอก Username" }]}>
                <Input style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item<FieldType> label="Password" name="password" rules={[{ required: true, message: "กรุณากรอก Password!" }]}>
                <Input.Password />
              </Form.Item>
              <div className="flex justify-between ">
                <Form.Item<FieldType> name="remember" valuePropName="checked">
                  <Checkbox>Remember for 30 day</Checkbox>
                </Form.Item>
                {/* <Button type="link">Forgot password</Button> */}
              </div>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="w-full ">
                  Sign In
                </Button>
              </Form.Item>
            </Form>
            {props.searchParams.error && (
              <div className="flex justify-center">
                <p className="text-red-500">Authentication Failed</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Spin>
  );
  // }
}
