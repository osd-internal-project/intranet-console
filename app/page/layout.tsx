"use client";
import React, { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { redirect, usePathname } from "next/navigation";
import Navigation from "@/components/Navigation";
import { Layout, Menu, message, Spin } from "antd";
import { MenuSiderWithModule } from "@/app/config/menu";
import { pageWithoutMenu } from "@/app/config/data";
import { Footer } from "antd/es/layout/layout";

import axios from "axios";
import { useAxiosStock } from "../lib/axios/hooks/userAxiosAuth";
import IndexServices from "./services/index.service";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const stockAuth = useAxiosStock();
  const indexServices = IndexServices(stockAuth);
  const [collapsed, setCollapsed] = useState(false);
  const [countNoti, setCountNoti] = useState(0);
  const pathname = usePathname();
  const { data: session, status } = useSession({
    required: true,
  });

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      message.error("หมดอายุการใช้งาน กรุณาเข้าสู่ระบบ");
      signOut();
    } else {
      fatchData();
    }
  }, [session]);
  async function fatchData() {
    if (session) {
      const count = await indexServices.countLotBeforeExpiredByDepartment(session.grouplist);
      if (count === undefined || count === null || !count) {
        setCountNoti(0);
      } else {
        setCountNoti(count);
      }
    }
  }
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin />
      </div>
    );
  }
  const LoseToken = () => {
    message.error("ไม่มีสิทธิ์เข้าถึง");
    signOut();
  };
  if (!session) {
    LoseToken();
  } else {
    const { Content, Sider } = Layout;

    const menulist = MenuSiderWithModule(session?.rulelist);
    const currentPath = pathname.split("/")[2];

    if (currentPath) {
      if (!pageWithoutMenu.includes(currentPath)) {
        const checkAuth = MenuSiderWithModule(session?.rulelist).some((menu: any) => menu.key === currentPath);
        if (!checkAuth) {
          console.log(checkAuth);
          redirect("/404");
        }
      }
    }

    return (
      <Layout className=" min-h-screen  overflow-auto ">
        <Sider
          width={200}
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{ backgroundColor: "#ffff" }}
          className=" min-h-screen  hidden  md:block bg "
        >
          <div className="flex justify-center py-4 ">
            {!collapsed ? (
              <>
                <img src="/images/osd-logo.png" alt="logo-page" className={`${collapsed ? "w-14 " : " w-40"}`} />
              </>
            ) : (
              <img src="/images/osd-logo.png" alt="logo-page" className={`${collapsed ? "w-14 " : "w-28 "}`} />
            )}
          </div>
          <Menu mode="inline" defaultSelectedKeys={[currentPath]} items={menulist} />
        </Sider>
        <Layout>
          <div className="w-full">
            <Navigation
              session={session}
              countNoti={countNoti}
              collapsed={collapsed}
              setCollapsed={setCollapsed}
              currentPath={currentPath}
              menulist={menulist}
            />
          </div>

          <Content
            className=" mb-10"
            style={{
              padding: 20,
              margin: 0,
              marginBottom: 20,
            }}
          >
            {children}
          </Content>
          <Footer style={{ textAlign: "center" }}>Chemistry System DSS ©{new Date().getFullYear()} Created by OSD</Footer>
        </Layout>
      </Layout>
    );
  }
}
