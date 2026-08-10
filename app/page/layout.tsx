"use client";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import Navigation from "@/components/Navigation";
import { useRouter } from "next/navigation";
import { Button, Image, Layout, Menu, Spin } from "antd";
import { MenuSiderWithModule } from "@/app/config/menu";
import { Footer } from "antd/es/layout/layout";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "../config/app-config";
import { UsersServices } from "../services/users.service";
import UserMapRoleGroupServices from "../services/user-map-role-group.service";
import { UserContectType, UserContext } from "../config/userContext";

import Script from "next/script";
const { Content, Sider } = Layout;

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useRouter();
  const { tokenAccess, authenticated, login, logout, id24Axios } = useId24();
  const { saveUser, saveRoles } = useContext(UserContext) as UserContectType;
  const baseUrlUser = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_USER);
  const [loading, setLoading] = useState<boolean>(true);
  const [collapsed, setCollapsed] = useState(false);
  const [profileDetail, setProfileDetail] = useState<any>();
  const [isCheckingProfile, setIsCheckingProfile] = useState(false);
  const [userRequestedLogout, setUserRequestedLogout] = useState(false);
  const pathname = usePathname();
  const defaultPath = `${window.location.origin}/page/home`;

  /** code สิทธิ์ที่ได้จาก token ของ ID24 */
  const tokenRoleCodes = useMemo(
    () =>
      tokenAccess && tokenAccess.userAccess.length > 0
        ? Array.from(
            new Set(tokenAccess?.userAccess.map((item) => item.roles).flat()),
          )
        : [],
    [tokenAccess?.userAccess],
  );

  /** code สิทธิ์ที่ได้จากกลุ่มต้นสังกัดของผู้ใช้ (ตั้งค่าที่หน้า "สิทธิ์การเข้าถึง") */
  const [groupRoleCodes, setGroupRoleCodes] = useState<string[]>([]);

  useEffect(() => {
    const ownerGroupId = profileDetail?.ownerGroupId;
    if (!ownerGroupId) {
      setGroupRoleCodes([]);
      return;
    }
    // service ดัก error ไว้แล้วและคืน [] จึงถอยไปใช้สิทธิ์จาก token เมื่อเรียกไม่สำเร็จ
    UserMapRoleGroupServices(baseUrlUser)
      .findRoleCodesByGroupId(ownerGroupId)
      .then(setGroupRoleCodes);
    // baseUrlUser ถูกสร้างใหม่ทุก render จึงไม่ใส่ใน deps เพื่อไม่ให้เรียกวน
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileDetail?.ownerGroupId]);

  // สิทธิ์ที่ใช้จริง = สิทธิ์จาก token รวมกับสิทธิ์ของกลุ่ม (union — กลุ่มเพิ่มสิทธิ์ได้ แต่ตัดของ token ไม่ได้)
  const mergedRoleCodes = useMemo(
    () => Array.from(new Set(tokenRoleCodes.concat(groupRoleCodes))),
    [tokenRoleCodes, groupRoleCodes],
  );

  useEffect(() => {
    saveRoles(mergedRoleCodes);
  }, [mergedRoleCodes]);

  const fetchData = useCallback(async () => {
    try {
      setIsCheckingProfile(true);
      const profileUser =
        await UsersServices(baseUrlUser).processAfterLoginAuth();

      if (profileUser) {
        setProfileDetail(profileUser);
        saveUser(profileUser);
      } else {
        // ถ้าไม่มีข้อมูล redirect ทันที
        navigate.push("/permission-access");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // อาจจะ redirect ไปหน้า error หรือ permission-access
      navigate.push("/permission-access");
    } finally {
      setLoading(false);
      setIsCheckingProfile(false);
    }
  }, [baseUrlUser, navigate, saveUser]);

  useEffect(() => {
    if (authenticated && loading && !isCheckingProfile) {
      fetchData();
    }
  }, [authenticated, loading, isCheckingProfile, fetchData]);

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

  const menulist = MenuSiderWithModule(mergedRoleCodes);
  const currentPath = pathname.split("/")[2];
  const currentPathSub = pathname.split("/")[3];

  return (
    <Spin percent={"auto"} size="large" spinning={loading}>
      <Layout className=" min-h-screen  overflow-auto ">
        <div className="w-full">
          <Navigation
            logOut={logOut}
            profileDetail={profileDetail}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            currentPath={currentPath}
            menulist={menulist}
          />
        </div>
        <Layout>
          <Sider
            width={230}
            trigger={null}
            collapsible
            collapsed={collapsed}
            style={{ backgroundColor: "#ffff" }}
            className=" min-h-screen  hidden  md:block bg "
          >
            {/* <div className="flex justify-center py-4 ">
              {!collapsed ? (
                <div
                  onClick={() =>
                    navigate.push(`${window.location.origin}/page/home`)
                  }
                  className="cursor-pointer"
                >
                  <img
                    src="/images/logo_osd.png"
                    alt="logo-page"
                    className={`${collapsed ? "w-14 " : " w-32"}`}
                  />
                </div>
              ) : (
                <div
                  onClick={() =>
                    navigate.push(`${window.location.origin}/page/home`)
                  }
                  className="cursor-pointer"
                >
                  <img
                    src="/images/logo_osd.png"
                    alt="logo-page"
                    className={`${collapsed ? "w-14 " : "w-28 "}`}
                  />
                </div>
              )}
            </div> */}
            <Menu
              className="app-side-menu"
              mode="inline"
              selectedKeys={[currentPath, `${currentPath}/${currentPathSub}`]}
              defaultSelectedKeys={[
                currentPath,
                `${currentPath}/${currentPathSub}`,
              ]}
              items={menulist}
            />
          </Sider>
          <Layout>
            <Content
              className=" mb-10"
              style={{
                padding: 10,
                margin: 0,
                marginBottom: 20,
              }}
            >
              {children}
            </Content>
            <Footer style={{ textAlign: "center" }}>
              Intranet ©{new Date().getFullYear()} Created by OSD
            </Footer>
          </Layout>
        </Layout>
        <Script
          src="https://agenza.osd.co.th/resources/product/llm/public/sdk/embedLite.js"
          onLoad={() => {
            const HiagentWebSDK = (window as any).HiagentWebSDK;
            if (HiagentWebSDK) {
              new HiagentWebSDK.WebLiteClient({
                appKey: "d5djgcqkjaps72qt4g7g",
                baseUrl: "https://agenza.osd.co.th",
              });
            }
          }}
        />
        <style>
          {`.hiagent-conversation {
          z-index: 3;
          }`}
        </style>
      </Layout>
    </Spin>
  );
}
