"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar, Badge, Button, Drawer, Dropdown, Menu, MenuProps, Space } from "antd";
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

const Navigation: React.FC<Prop> = ({ profileDetail, collapsed, setCollapsed, currentPath, menulist, logOut }) => {
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
          }}>
          {`Sign Out`}
        </Link>
      ),
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <>
      <Header className="flex justify-between w-full bg-white text-black shadow p-0">
        <div className="flex ">
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
        </div>
        <div className="pr-8 space-x-4">
          <Dropdown menu={{ items: MenuNav }} className="text-black hover:text-zinc-300">
            <a onClick={(e) => e.preventDefault()}>
              <Space className="text-base">
                {profileDetail?.firstNameTh
                  ? `คุณ ${profileDetail?.firstNameTh} ${profileDetail?.lastNameTh && profileDetail.lastNameTh}`
                  : profileDetail?.username}
                <Avatar
                  src={profileDetail?.imageId ? `${process.env.NEXT_PUBLIC_API_BASE_URL_USER}/id24users/get-image-user/${profileDetail?.imageId}` : ""}
                />
              </Space>
            </a>
          </Dropdown>
        </div>
      </Header>
      <Drawer
        title={
          <div className="flex justify-center bg-white ">
            <Image src="/images/logo-osd-mini-v2.png" alt="logo-page" className={`w-20 h-auto`} />
          </div>
        }
        placement="left"
        onClose={() => setOpen(!open)}
        open={open}
        width={250}>
        <Menu mode="inline" selectedKeys={[currentPath]} style={{ height: 100, borderRight: 0 }} items={menulist} onClick={() => setOpen(!open)} />
      </Drawer>
    </>
  );
};

export default Navigation;
