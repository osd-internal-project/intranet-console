import {
  LogoutOutlined,
  UserOutlined,
  HomeOutlined,
  BarChartOutlined,
  BookOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Icon } from "@iconify/react";
import { MenuProps, Tooltip } from "antd";
import Link from "next/link";
import React from "react";
import { signOut } from "next-auth/react";
import {
  gridIcon,
  IconDataLeave,
  bookingIcon,
  maintenanceIcon,
  organizeChart,
  stockIcon,
  contactListIcon,
  macarIcon,
} from "@/components/icon";

type MenuItem = Required<MenuProps>["items"][number];
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
          signOut({ callbackUrl: "/signin" });
        }}
      >
        Sign Out
      </Link>
    ),
    icon: <LogoutOutlined />,
  },
];

export default MenuNav;

export const MenuSider: MenuItem[] = [
  {
    key: "home",
    label: "หน้าหลัก",
    rule: "h-s",
    icon: <HomeOutlined />,
  },
  {
    key: "internal-info",
    icon: organizeChart,
    label: `ข้อมูลภายใน`,
    rule: "ii-s",
    children: [
      {
        key: `internal-info/organization-chart`,
        label: "แผนผังองค์กร",
      },
      {
        key: `internal-info/organization-chart-team`,
        label: `แผนผังทีม`,
      },
    ],
  },
  // {
  //   key: "stock",
  //   icon: stockIcon,
  //   label: "Stock",
  //   rule: "s-s",
  //   children: [
  //     {
  //       key: `order-management`,
  //       label: `Order Management`,
  //       rule: "sm-order-s",
  //     },
  //     {
  //       key: `inventory`,
  //       label: `Inventory`,
  //       rule: "sm-inventory-s",
  //     },

  //     {
  //       key: `product-list`,
  //       label: `Product List`,
  //       rule: "sm-productlist-s",
  //     },
  //     {
  //       key: `report-withdraw-ranking`,
  //       label: `10 อันดับการเบิกจ่ายที่มากที่สุด`,
  //       rule: "sm-re-wr-h",
  //     },
  //     {
  //       key: `report-transaction`,
  //       label: `การรับเข้าเบิกจ่าย`,
  //       rule: "sm-re-tr-h",
  //     },
  //     {
  //       key: `report-expired`,
  //       label: `รายงานการหมดอายุ`,
  //       rule: "sm-re-ex-h",
  //     },
  //     {
  //       key: `stock-management`,
  //       label: `Stock Management`,
  //       rule: "sm-s",
  //     },
  //   ],
  // },
  {
    key: "housekeeper",
    icon: <Icon icon="tabler:clipboard-list" width="15" height="15" />,
    label: "งานแม่บ้าน",
    rule: "hk-s",
    children: [
      {
        key: `housekeeper/housekeepers`,
        label: `ข้อมูลการการทำงานของแม่บ้าน`,
        rule: "hk-h",
      },
      {
        key: `housekeeper/housekeeper-management`,
        label: `จัดการข้อมูลแม่บ้าน`,
        rule: "hk-m",
      },
    ],
  },
  {
    key: "leave-control-management",
    icon: IconDataLeave,
    label: `ข้อมูลการลา`,
    rule: "dl-s",
    children: [
      {
        key: `leave-control-management/leave-letter`,
        label: `ใบลาออนไลน์`,
        rule: "dl-a",
      },
      {
        key: `leave-control-management/leave-history`,
        label: `ประวัติการลา`,
        rule: "dl-dt-u",
      },
      {
        key: `leave-control-management/leave-history-admin`,
        label: `ประวัติการลา (สำหรับ Admin)`,
        rule: "dl-dt-a",
      },
      {
        key: `leave-control-management/leave-disabled-management`,
        label: `จัดการสิทธิ์การลา`,
        rule: "dl-dis",
      },
    ],
  },
  {
    key: "3",
    icon: bookingIcon,
    label: "ห้องประชุม",
    rule: "br-s",
    children: [
      {
        key: `bookingroom/booking-room`,
        label: `จองห้องประชุม`,
      },
      {
        key: `bookingroom/booking-room-management`,
        label: `จัดการข้อมูลห้องประชุม`,
      },
    ],
  },
  {
    key: "maintenance",
    icon: maintenanceIcon,
    label: "Maintenance",
    rule: "ma-s",
    children: [
      {
        key: `maintenance-management`,
        label: `Maintenance Management`,
        rule: "ma-m-s",
      },
    ],
  },
  {
    key: `users-management`,
    icon: gridIcon,
    label: `User Management`,
    rule: "um-s",
    children: [
      {
        key: `users-management/users`,
        label: `Users`,
        // rule: "um-s",
      },
      {
        key: `users-management/user-organization`,
        label: `Organizations`,
        // rule: "user-organize-show",
      },
      {
        key: `users-management/user-group`,
        label: `Groups`,
        // rule: "um-ug-s",
      },
      {
        key: `users-management/user-role`,
        label: `Roles`,
        rule: "um-ro-s",
      },
      {
        key: `users-management/user-rule`,
        label: `Rules`,
        rule: "um-ru-s",
      },
    ],
  },
  {
    key: "crm",
    icon: contactListIcon,
    label: `CRM`,
    rule: "crm-s",
    children: [
      {
        key: `crm/customer-group`,
        label: `ข้อมูลลูกค้า`,
        rule: "crm-c-s",
      },
      {
        key: `crm/project`,
        label: `Project`,
        rule: "crm-p-s",
      },
      {
        key: `crm/ticket`,
        label: `Ticket`,
        rule: "crm-t-s",
      },
      {
        key: `crm/products`,
        label: `Products`,
        rule: "crm-ex",
      },
      {
        key: `crm/expense`,
        label: `ข้อมูลการเบิก`,
        rule: "crm-ex",
      },
    ],
  },
  {
    key: "macar",
    icon: macarIcon,
    label: `ข้อมูลการจองรถยนต์`,
    rule: "mac-s",
    children: [
      {
        key: `macar/ma-car`,
        label: `ข้อมูลการจองรถยนต์`,
        rule: "mac-c-s",
      },
      {
        key: `macar/ma-car-booking`,
        label: `Ma car Booking`,
        rule: "mac-b-s",
      },
      {
        key: `macar/ma-car-management`,
        label: `Ma car Management`,
        rule: "mac-m-s",
      },
    ],
  },
  {
    key: `setting`,
    icon: <Icon icon="uil:setting" width="15" height="15" />,
    label: `ตั้งค่า`,
    rule: "st-s",
    children: [
      {
        key: `setting/maintenance-type`,
        label: `การบำรุงรักษา`,
        rule: "ma-t-s",
      },
      {
        key: `setting/organize-chart`,
        label: `Organize Chart`,
        // rule: "st-p-s",
      },
      {
        key: `setting/typeleave`,
        label: `Type Leave`,
        rule: "st-tl-s",
      },
      {
        key: `setting/master-holidays`,
        label: `Master Holidays`,
        // rule: "st-mth-s",
      },
      {
        key: `setting/masterdata-position`,
        label: `Master Position`,
        rule: "st-p-s",
      },
      {
        key: `setting/manage-home`,
        label: `Manage Home`,
        rule: "ma-h-s",
      },
      {
        key: `setting/email-template`,
        label: `Email Template`,
      },
    ],
  },
].map((item) => {
  return {
    ...item,
    label: !item.children ? (
      <>
        <Link href={`/page/${item.key}`}>{item.label}</Link>
      </>
    ) : (
      item.label
    ),
  };
});

export const MenuSiderWithModule = (modules: string[]) => {
  if (modules) {
    const menuFilterChildren = MenuSider.map((menu: any) => ({
      ...menu,
      children: menu?.children
        ? menu.children
            .filter((item: any) => {
              return !item.rule || modules.includes(item.rule);
            })
            .map((item: any) => ({
              ...item,
              label: (
                <Tooltip placement="right" title={item.label}>
                  <div style={{ width: 140 }}>
                    <Link href={`/page/${item.key}`}>{item.label}</Link>
                  </div>
                </Tooltip>
              ),
            }))
        : null,
    }));
    const menu = menuFilterChildren.filter((item: any) => {
      return !item.rule || modules.includes(item.rule);
    });

    return menu;
  } else {
    return [];
  }
};
