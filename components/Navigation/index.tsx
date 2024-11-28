"use client";

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
import MenuNav from "@/app/config/menu";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  BellOutlined,
  BellTwoTone,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useRefreshToken } from "@/app/lib/axios/hooks/useRefreshToken";
import { useAxiosRefreshToken } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ItemType } from "antd/es/menu/interface";
import { ITNotiLogsMessage } from "@/app/common/noti-logs";

type Profile = {
  userId: string;
  username: string;
  firstNameTh: string;
  lastNameTh: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  groupList?: string[];
  rulelist: string[];
  ownerGroup?: string;
} | null;
interface Prop {
  collapsed: boolean;
  setCollapsed: (setCollapsed: boolean) => void;
  currentPath: string;
  menulist: MenuProps["items"];
  countNoti: number;
  // session: any;
  avatar: any;
}

const Navigation: React.FC<Prop> = ({
  // session,
  collapsed,
  setCollapsed,
  currentPath,
  menulist,
  notiLogMessages,
  avatar,
}) => {
  const [open, setOpen] = useState(false);
  const [notiDetails, setNotiDetils] = useState<{
    count: number;
    list: ItemType[];
  }>({ count: 0, list: [] });
  const navigate = useRouter();
  // useAxiosRefreshToken(session);
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
          <div>
            <Button
              type="text"
              disabled={!currentPath ? true : false}
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate.back()}
              style={{
                fontSize: "16px",
              }}
            />
            <Button
              type="text"
              icon={<ArrowRightOutlined />}
              onClick={() => navigate.forward()}
              style={{
                fontSize: "16px",
              }}
            />
          </div>
        </div>
        <div className="pr-8 space-x-4">
          {/* notification */}
          {/* <Link href={`/page/notification-before-expired`}>
            <Badge size="small" count={countNoti}>
              <BellOutlined />
            </Badge>
          </Link> */}
          <Dropdown
            menu={{ items: notiDetails.list }}
            className="text-black hover:text-zinc-300"
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space className=" text-base">
                <Badge count={notiDetails.count} size="small">
                  <BellTwoTone className=" text-lg" />
                </Badge>
              </Space>
            </a>
          </Dropdown>
          <Dropdown
            menu={{ items: MenuNav }}
            className="text-black hover:text-zinc-300"
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space className=" text-base">
                {/* {`คุณ ${session.user.firstNameTh} ${session.user.lastNameTh} `}
                {avatar && avatar instanceof Blob ? (
                  <Avatar
                    size={40}
                    src={
                      avatar instanceof Blob ? URL.createObjectURL(avatar) : ""
                    }
                  />
                ) : (
                  <UserOutlined />
                )} */}
              </Space>
            </a>
          </Dropdown>
        </div>
      </Header>
      <Drawer
        title={
          <div className="flex justify-center bg-white ">
            <img
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

export default Navigation;
