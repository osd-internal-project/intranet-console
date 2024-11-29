"use client";
import React, { useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navigation from "@/components/Navigation";
import { Button, FloatButton, Layout, Menu, message, Spin } from "antd";
import { MenuSiderWithModule } from "@/app/config/menu";
import { pageWithoutMenu } from "@/app/config/data";
import { Footer } from "antd/es/layout/layout";
import { useAxiosIntranet, useAxiosUser } from "../lib/axios/hooks/userAxiosAuth";
import IndexServices from "./services/index.service";
import NotiLogsServices from "../services/noti-logs.service";
import { PhoneOutlined } from "@ant-design/icons";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { ITNotiLogsMessage } from "../common/noti-logs";
import { loadAppConfig } from "../config/app-config";
import UserServices from "../services/user.service";
import { UsersServices } from "../services/users.service";
import { UserContectType, UserContext } from "../config/userContext";

const { Content, Sider } = Layout;

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { tokenAccess, authenticated, login, logout, id24Axios } = useId24();
  const { saveUser } = useContext(UserContext) as UserContectType;
  const baseUrlIntra = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_INTRANET);
  const baseUrlUser = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_USER);
  const [loading, setLoading] = useState<boolean>(true);
  const [collapsed, setCollapsed] = useState(false);
  const [notiLogMessages, setNotiLogMessages] = useState<ITNotiLogsMessage[]>([]);
  const [countNoti, setCountNoti] = useState<any>();
  const [avatar, setAvatar] = useState<any>();
  const [profileDetail, setProfileDetail] = useState<any>();

  const [userRequestedLogout, setUserRequestedLogout] = useState(false);
  const pathname = usePathname();
  const defaultPath = `${window.location.origin}/page/home`;

  useEffect(() => {
    if (authenticated) {
      if (loading) featchData();
    }
  }, [authenticated, loading]);

  const featchData = async () => {
    await UsersServices(baseUrlUser)
      .findByToken()
      .then((profile) => {
        setProfileDetail(profile);
        saveUser(profile);
      });
    // const notiLogMessage = await NotiLogsServices(baseUrlIntra).findByUsers(session.user.userId);
    // setNotiLogMessages(notiLogMessage);
    // const image = await UserServices(baseUrlUser).getImage(session.user.userId);
    // setAvatar(image);
    setLoading(false);
  };

  if (!authenticated) {
    if (userRequestedLogout) {
      login(defaultPath, false);
    } else {
      login(defaultPath, false);
    }
    return <Button onClick={() => login(defaultPath, false)}>Login</Button>;
  }

  const logOut = async () => {
    setUserRequestedLogout(true);
    logout().then(() => login(defaultPath, false));
  };

  // const stockAuth = useAxiosStock();
  // const userAuth = useAxiosUser();
  // const indexServices = IndexServices(stockAuth);
  // const userServices = IndexServices(userAuth);
  // const { data: session, status } = useSession({
  //   required: true,
  // });

  // useEffect(() => {
  //   if (session?.error === "RefreshAccessTokenError") {
  //     message.error("หมดอายุการใช้งาน กรุณาเข้าสู่ระบบ");
  //     signOut();
  //   } else {
  //     fatchData();
  //   }
  // }, [session]);

  // async function fatchData() {
  //   if (session) {
  //     const image = await userServices.getImage(session.user.userId);
  //     setAvatar(image);
  //   }
  // }

  // if (status === "loading") {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <Spin />
  //     </div>
  //   );
  // }

  // const LoseToken = () => {
  //   message.error("ไม่มีสิทธิ์เข้าถึง");
  //   signOut();
  // };

  // if (!session) {
  //   LoseToken();
  // } else {
  //   const { Content, Sider } = Layout;
  //   const menulist = MenuSiderWithModule(session?.rulelist);
  //   const currentPath = pathname.split("/")[2];
  //   const currentPathSub = pathname.split("/")[3];

  //   if (currentPath) {
  //     if (!pageWithoutMenu.includes(currentPath)) {
  //       const checkAuth = MenuSiderWithModule(session?.rulelist).some((menu: any) => menu.key === currentPath);
  //       if (!checkAuth) {
  //       }
  //     }
  //   }

  const menulist = MenuSiderWithModule([]);
  const currentPath = pathname.split("/")[2];
  const currentPathSub = pathname.split("/")[3];

  // if (currentPath) {
  //   if (!pageWithoutMenu.includes(currentPath)) {
  //     const checkAuth = MenuSiderWithModule([]).some((menu: any) => menu.key === currentPath);
  //     if (!checkAuth) {
  //     }
  //   }

  return (
    <Layout className=" min-h-screen  overflow-auto ">
      <Sider
        width={200}
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ backgroundColor: "#ffff" }}
        className=" min-h-screen  hidden  md:block bg ">
        <div className="flex justify-center py-4 ">
          {!collapsed ? (
            <>
              <img src="/images/osd-logo.png" alt="logo-page" className={`${collapsed ? "w-14 " : " w-40"}`} />
            </>
          ) : (
            <img src="/images/osd-logo.png" alt="logo-page" className={`${collapsed ? "w-14 " : "w-28 "}`} />
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[currentPath, `${currentPath}/${currentPathSub}`]}
          defaultSelectedKeys={[currentPath, `${currentPath}/${currentPathSub}`]}
          items={menulist}
        />
      </Sider>
      <Layout>
        <div className="w-full">
          <Navigation
            logOut={logOut}
            profileDetail={profileDetail}
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
          }}>
          {children}
        </Content>
        <Footer style={{ textAlign: "center" }}>Intranet ©{new Date().getFullYear()} Created by OSD</Footer>
      </Layout>
    </Layout>
  );
  // }
}
