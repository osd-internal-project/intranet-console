"use client";
import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Navigation from "@/components/Navigation";
import { FloatButton, Layout, Menu, message, Spin } from "antd";
import { MenuSiderWithModule } from "@/app/config/menu";
import { pageWithoutMenu } from "@/app/config/data";
import { Footer } from "antd/es/layout/layout";
import { useAxiosStock, useAxiosUser } from "../lib/axios/hooks/userAxiosAuth";
import IndexServices from "./services/index.service";
import { PhoneOutlined } from "@ant-design/icons";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const stockAuth = useAxiosStock();
  const userAuth = useAxiosUser();
  const indexServices = IndexServices(stockAuth);
  const userServices = IndexServices(userAuth);
  const [collapsed, setCollapsed] = useState(false);
  const [countNoti, setCountNoti] = useState(0);
  const [avatar, setAvatar] = useState<any>();
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
      // const count = await indexServices.countLotBeforeExpiredByLocation(
      //   session.grouplist
      // );

      // if (count === undefined || count === null || !count) {
      //   setCountNoti(0);
      // } else {
      //   setCountNoti(count);
      // }
      const image = await userServices.getImage(session.user.userId);
      setAvatar(image);
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
    const currentPathSub = pathname.split("/")[3];
    if (currentPath) {
      // console.log(currentPath, `${currentPath}/${currentPathSub}`)
      if (!pageWithoutMenu.includes(currentPath)) {
        const checkAuth = MenuSiderWithModule(session?.rulelist).some(
          (menu: any) => menu.key === currentPath
        );
        if (!checkAuth) {
          // redirect("/404");
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
                <img
                  src="/images/osd-logo.png"
                  alt="logo-page"
                  className={`${collapsed ? "w-14 " : " w-40"}`}
                />
              </>
            ) : (
              <img
                src="/images/osd-logo.png"
                alt="logo-page"
                className={`${collapsed ? "w-14 " : "w-28 "}`}
              />
            )}
          </div>
          <Menu
            mode="inline"
            defaultSelectedKeys={[
              currentPath,
              `${currentPath}/${currentPathSub}`,
            ]}
            items={menulist}
          />
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
              avatar={avatar}
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
          <Footer style={{ textAlign: "center" }}>
            <FloatButton
              shape="circle"
              type="primary"
              style={{ right: 10, bottom: 10 }}
              icon={<PhoneOutlined />}
            />
            Intranet ©{new Date().getFullYear()} Created by OSD
          </Footer>
        </Layout>
      </Layout>
    );
  }
}
