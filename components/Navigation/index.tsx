"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Drawer,
  Dropdown,
  Menu,
  MenuProps,
  Space,
} from "antd";
import { Header } from "antd/es/layout/layout";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  BellTwoTone,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Image from "next/image";

interface Prop {
  collapsed: boolean;
  profileDetail: any;
  setCollapsed: (setCollapsed: boolean) => void;
  currentPath: string;
  menulist: MenuProps["items"];
  logOut: () => void;
}

const Navigation: React.FC<Prop> = ({
  profileDetail,
  collapsed,
  setCollapsed,
  currentPath,
  menulist,
  logOut,
}) => {
  const [open, setOpen] = useState(false);
  const MenuNav: MenuProps["items"] = [
    {
      key: "1",
      label: <Link href={`/page/user-profile`}>Profile</Link>,
      icon: <UserOutlined />,
    },
    {
      key: "2",
      label: (
        <Link
          href={"#"}
          onClick={async () => {
            logOut();
          }}
        >
          {`Sign Out`}
        </Link>
      ),
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <>
      <Header
        className="flex justify-between w-full bg-white text-black shadow p-0"
        style={{ height: 56, lineHeight: "56px" }}
      >
        <OsdHeaderLogo />

        {/* <div className="flex ">
          <div className="block md:hidden ">
            <Button
              type="text"
              icon={open ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setOpen(!open)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
          </div>
        </div> */}
        <div className="pr-6 space-x-4 items-center flex">
          <Dropdown
            menu={{ items: MenuNav }}
            className="text-black hover:text-zinc-300 items-center flex"
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space className="text-sm leading-tight">
                <div className="gird grid-cols-1 justify-items-end text-end mr-2">
                  <div className="col col-span-1">
                    <span>
                      {profileDetail?.firstNameTh ? (
                        <div className="font-bold">{`${profileDetail?.firstNameTh} ${profileDetail?.lastNameTh && profileDetail.lastNameTh}`}</div>
                      ) : (
                        profileDetail?.username
                      )}
                    </span>
                  </div>
                  <div className="col col-span-1">
                    <span className="text-gray-400 text-xs">
                      {profileDetail?.masterPosition?.nameTh}
                    </span>
                  </div>
                </div>
                <Avatar
                  style={{ width: "36px", height: "36px" }}
                  src={
                    profileDetail?.imageId
                      ? `${process.env.NEXT_PUBLIC_API_BASE_URL_USER}/id24users/get-image-user/${profileDetail?.imageId}`
                      : ""
                  }
                />
              </Space>
            </a>
          </Dropdown>
        </div>
      </Header>
      <Drawer
        title={
          <div className="flex justify-center bg-white ">
            <Image
              src="/images/logo-osd-mini-v2.png"
              alt="logo-page"
              className={`w-20 h-auto`}
            />
          </div>
        }
        placement="left"
        onClose={() => setOpen(!open)}
        open={open}
        width={250}
      >
        <Menu
          className="app-side-menu"
          mode="inline"
          selectedKeys={[currentPath]}
          style={{ height: 100, borderRight: 0 }}
          items={menulist}
          onClick={() => setOpen(!open)}
        />
      </Drawer>
    </>
  );
};

function OsdHeaderLogo() {
  return (
    // Note: 'pl-4' keeps the logo off the screen edge; height comes from the 56px Header
    <div className="flex h-full items-center gap-2.5 select-none font-sans pl-4">

      {/* Icon: Perfect squircle shape with corrected blue gradient */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-b from-[#4A8BF5] to-[#2A66D6] shadow-sm">
        <span className="text-[11px] font-black tracking-wide text-white">OSD</span>
      </div>

      {/* Brand & Subtitle */}
      <div className="flex flex-col justify-center leading-tight">
        <span className="text-[16px] font-bold text-[#1E293B] tracking-tight">
          OSD Intranet
        </span>
        <span className="text-[11px] font-medium text-[#94A3B8]">
          Employee Portal
        </span>
      </div>

    </div>
  );
}

export default Navigation;
