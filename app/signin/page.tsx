"use client";
import { Form, Checkbox, Button, Input, Alert, Card, Spin, message, Image } from "antd";
import { redirect, useRouter } from "next/navigation";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { createCookieLocal, getCookieLocal } from "../utils/cookies";

type Props = {
  searchParams: Record<"callbackUrl" | "error", string>;
};
type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
  type?: string;
};
export default function Login(props: Props) {
  const router = useRouter();
  const [form] = useForm();
  const [loading, setLoading] = useState<boolean>(true);
  // console.log(props.searchParams.error);
  const onFinish = () => {
    setLoading(true);
    form.validateFields().then(async (values) => {
      // values.remember
      const type = values.type === true ? "local" : "ldap";
      const res = await signIn("username-login", {
        username: values.username,
        password: values.password,
        type: type,
        // remember: values.remember,
        redirect: false,
        callbackUrl: "/page/",
      });
      if (res?.ok === true) {
        message.success(`เข้าสู่ระบบสำเร็จ`);
        if (values.remember) {
          createCookieLocal("osd-user-remember", values.username);
        }
        router.push("/page/home");
      } else {
        setLoading(false);
        message.error(`เข้าสู่ระบบไม่สำเร็จ: ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง`);
      }
    });
  };
  useEffect(() => {
    setLoading(false);
  }, []);
  const rememberMe = getCookieLocal("osd-user-remember");
  return (
    <Spin spinning={loading}>
      <div className="grid grid-cols-1 md:grid-cols-2 " style={{ backgroundColor: "#f5f5f5" }}>
        <div className=" justify-center  items-center h-screen w-full hidden  md:flex">
          <div className="flex justify-center m-4">
            <Image preview={false} src="/images/osd-logo.png" alt="logo-page" className={` w-96 md:w-96 h-auto`} />
          </div>
        </div>
        <div className="grid grid-cols-6 gap-4 grid-rows-4 h-screen">
          <div className="col-start-2 col-span-4 row-start-2 row-span-2">
            <Form form={form} initialValues={{ remember: false }} onFinish={onFinish} autoComplete="off" layout="vertical">
              <div className="columns-1 m-4">
                <div className="flex justify-center text-3xl font-extrabold mb-3 ">
                  <p className=" text-3xl tracking-wide bg-gradient-to-r from-blue-800 via-cyan-500 to-cyan-300 text-transparent bg-clip-text">
                    INTRANET
                  </p>
                </div>
              </div>
              <Form.Item<FieldType>
                label="Username"
                name="username"
                initialValue={rememberMe}
                rules={[{ required: true, message: "กรุณากรอก Username" }]}>
                <Input className="w-full" />
              </Form.Item>

              <Form.Item<FieldType> label="Password" name="password" rules={[{ required: true, message: "กรุณากรอก Password!" }]}>
                <Input.Password />
              </Form.Item>
              <div className="flex justify-between ">
                <Form.Item<FieldType> name="remember" valuePropName="checked">
                  <Checkbox>Remember for 30 day</Checkbox>
                </Form.Item>
                <Form.Item<FieldType> name="type" valuePropName="checked">
                  <Checkbox>Login using local</Checkbox>
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
