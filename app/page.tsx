"use client";
import { Spin } from "antd";
import { signIn } from "next-auth/react";
import { useEffect } from "react";
export default function Main() {
  useEffect(() => {
    signIn();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <Spin />
      
    </div>
  );
}
