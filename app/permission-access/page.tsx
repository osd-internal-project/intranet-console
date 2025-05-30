"use client";
import React from "react";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { Button, Result } from "antd";
export default function NoProfileUserPage() {
  const { login, logout } = useId24();

  const onFinish = async () => {
    const defaultPath = `${window.location.origin}/page/home`;
    logout().then(() => login(defaultPath, false));
  };
  return (
    <div>
      <Result
        status="403"
        title="ไม่มีสิทธ์เข้าใช้งาน"
        subTitle="โปรดติดต่อ Admin ในการจัดการสิทธ์เข้าใช้งาน"
        extra={
          <Button type="primary" onClick={() => onFinish()}>
            กลับไปหน้า Login
          </Button>
        }
      />
    </div>
  );
}
