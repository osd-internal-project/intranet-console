"use client";
import React, { useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navigation from "@/components/Navigation";
import { useRouter, useSearchParams } from "next/navigation";
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
  const navigate = useRouter();
  const { tokenAccess, authenticated, login, logout, id24Axios } = useId24();
  const { saveUser, saveRoles } = useContext(UserContext) as UserContectType;
  // const baseUrlIntra = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_INTRANET);
  const baseUrlUser = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_USER);
  const [loading, setLoading] = useState<boolean>(true);
  const [collapsed, setCollapsed] = useState(false);
  // const [notiLogMessages, setNotiLogMessages] = useState<ITNotiLogsMessage[]>([]);
  const [countNoti, setCountNoti] = useState<any>();
  const [avatar, setAvatar] = useState<any>();
  const [profileDetail, setProfileDetail] = useState<any>();

  const [userRequestedLogout, setUserRequestedLogout] = useState(false);
  const pathname = usePathname();
  const defaultPath = `${window.location.origin}/page/home`;

  useEffect(() => {
    const sideMenuGroups =
      tokenAccess && tokenAccess.userAccess.length > 0 ? Array.from(new Set(tokenAccess?.userAccess.map((item) => item.roles).flat())) : [];

    saveRoles(sideMenuGroups);
  }, [tokenAccess?.userAccess]);

  const fetchData = async () => {
    try {
      const profileUser = await UsersServices(baseUrlUser).processAfterLoginAuth();
      if (profileUser) {
        setProfileDetail(profileUser);
        saveUser(profileUser);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (authenticated && loading) {
      fetchData();
    }
  }, [authenticated, loading]);

  useEffect(() => {
    if (authenticated && !loading) {
      if (profileDetail === undefined) {
        const pathLocation = `${window.location.origin}/permission-access`;
        navigate.push(pathLocation);
      }
    }
  }, [authenticated, loading, profileDetail, navigate]);

  if (!authenticated) {
    if (userRequestedLogout) {
      login(defaultPath, false);
    } else {
      login(defaultPath, false);
    }
    return <Button onClick={() => login(defaultPath, false)}>Login</Button>;
  }

  // if (authenticated) {
  //   console.log(profileDetail);
  //   if (profileDetail === undefined) {
  //     const pathLocation = `${window.location.origin}/permission-access`;
  //     navigate.push(pathLocation);
  //   }
  // }

  const logOut = async () => {
    setUserRequestedLogout(true);
    logout().then(() => login(defaultPath, false));
  };

  const sideMenuGroups =
    tokenAccess && tokenAccess.userAccess.length > 0 ? Array.from(new Set(tokenAccess?.userAccess.map((item) => item.roles).flat())) : [];

  const menulist = MenuSiderWithModule(sideMenuGroups);
  const currentPath = pathname.split("/")[2];
  const currentPathSub = pathname.split("/")[3];

  return (
    <Spin percent={"auto"} size="large" spinning={loading}>
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
    </Spin>
  );

  // }
}
