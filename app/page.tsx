"use client";
import { Spin } from "antd";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
export default function Main() {
  // useEffect(() => {
  //   signIn();
  // }, []);

  return redirect("/page");
}
