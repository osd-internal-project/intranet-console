import React from "react";
import { MenuProps, Tooltip } from "antd";
import Link from "next/link";
import { Icon } from "@iconify/react";
import {
  gridIcon,
  IconDataLeave,
  bookingIcon,
  maintenanceIcon,
  macarIcon,
  hrIcon,
  stockIcon,
  IconProperty,
  IconParty,
} from "@/components/icon";
import { FieldTimeOutlined, HomeOutlined } from "@ant-design/icons";
import { hasRoleCode, RoleCode } from "./user-roles";

type MenuItem = Required<MenuProps>["items"][number];

/**
 * รายการเมนูก่อนแปลงเป็นรูปแบบของ antd
 * ฟิลด์ rule รับได้เฉพาะ code ที่นิยามไว้ใน ROLES เท่านั้น (พิมพ์ผิดจะ build ไม่ผ่าน)
 */
interface AppMenuItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  rule: RoleCode | RoleCode[];
  children?: AppMenuItem[];
}

const menuItems: AppMenuItem[] = [
  {
    key: "home",
    label: "หน้าหลัก",
    rule: ["user", "admin"],
    icon: <HomeOutlined />,
  },
  // {
  //   key: "internal-info",
  //   icon: organizeChart,
  //   label: `ข้อมูลภายใน`,
  //   rule: "user",
  //   children: [
  //     {
  //       key: `internal-info/organization-chart`,
  //       label: "แผนผังองค์กร",
  //     },
  //     {
  //       key: `internal-info/organization-chart-team`,
  //       label: `แผนผังทีม`,
  //     },
  //   ],
  // },
  // {
  //   key: "hr-management",
  //   label: "ระบบบริหารงานบุคคล",
  //   rule: ["hr", "admin"],
  //   icon: hrIcon,
  //   children: [
  //     {
  //       key: `hr-management/employee-profile`,
  //       label: "ข้อมูลพนักงาน",
  //       rule: ["hr", "admin"],
  //     },
  //   ],
  // },
  // {
  //   key: "housekeeper",
  //   icon: <Icon icon="tabler:clipboard-list" width="15" height="15" />,
  //   label: "งานแม่บ้าน",
  //   rule: ["admin"],
  //   children: [
  //     {
  //       key: `housekeeper/housekeepers`,
  //       label: `ข้อมูลการการทำงานของแม่บ้าน`,
  //       rule: ["ma-user", "admin"],
  //     },
  //     {
  //       key: `housekeeper/housekeeper-management`,
  //       label: `จัดการข้อมูลแม่บ้าน`,
  //       rule: ["ma-user", "admin"],
  //     },
  //   ],
  // },
  {
    key: "leave-control-management",
    icon: IconDataLeave,
    label: `ระบบลางาน`,
    rule: ["user", "admin", "header", "hr"],
    children: [
      {
        key: `leave-control-management/leave-letter`,
        label: `ใบลาออนไลน์`,
        rule: ["user", "admin"],
      },
      {
        key: `leave-control-management/leave-history`,
        label: `ประวัติการลา`,
        rule: ["user", "admin"],
      },
      {
        key: `leave-control-management/leave-history-admin`,
        label: `จัดการการลา`,
        rule: ["admin", "header", "hr"],
      },
      {
        key: `leave-control-management/leave-disabled-management`,
        label: `จัดการสิทธิ์การลา`,
        rule: ["admin", "hr"],
      },
    ],
  },
  {
    key: `overtime`,
    icon: <FieldTimeOutlined />,
    label: `ทำงานล่วงเวลา`,
    rule: ["user", "admin", "hr"],
    children: [
      {
        key: `overtime/overtime-calendar`,
        label: `ตารางการเบิก OT`,
        rule: ["user", "admin"],
      },
      {
        key: `overtime/overtime-form`,
        label: `แบบฟอร์มขอเบิกค่าทำงานล่วงเวลา`,
        rule: ["user", "admin"],
      },
      {
        key: `overtime/overtime-history`,
        label: `ตารางรายละเอียดการทำงานล่วงเวลา`,
        rule: ["header", "admin", "hr"],
      },
    ],
  },
  {
    key: "macar",
    icon: macarIcon,
    label: `ระบบรถ`,
    rule: ["user", "admin", "ma-user", "account"],
    children: [
      {
        key: `macar/dashboard`,
        label: `Dashboard`,
        rule: ["admin", "ma-user", "account"],
      },
      {
        key: `macar/report`,
        label: `รายงานค่าใช้จ่าย`,
        rule: ["admin", "account", "ma-user", "account"],
      },
      {
        key: `macar/ma-car`,
        label: `การจองรถยนต์`,
        rule: ["user", "admin", "ma-user", "account"],
      },
      {
        key: `macar/management-car-wrapup`,
        label: `เช็คสภาพรถยนต์`,
        rule: ["admin", "ma-user"],
      },
      {
        key: `macar/ma-car-insurance`,
        label: `เอกสารรถยนต์`,
        rule: ["admin", "ma-user"],
      },
      {
        key: `macar/ma-car-management`,
        label: `การจัดการรถยนต์`,
        rule: ["admin", "ma-user", "account"],
      },
      {
        key: `macar/ma-car-config`,
        label: `ตั้งค่าระบบรถ`,
        rule: ["admin", "ma-user"],
      },
    ],
  },
  {
    key: "bookingroom",
    icon: bookingIcon,
    label: "ห้องประชุม",
    rule: ["user", "admin", "ma-user"],
    children: [
      {
        key: `bookingroom/booking-room`,
        label: `จองห้องประชุม`,
        rule: "user",
      },
      {
        key: `bookingroom/booking-room-management`,
        label: `จัดการข้อมูลห้องประชุม`,
        rule: ["admin", "hr", "ma-user"],
      },
      {
        key: `bookingroom/booking-room-refreshment`,
        label: `จัดการอาหารว่าง`,
        rule: ["admin", "hr", "ma-user"],
      },
    ],
  },
  // {
  //   key: "stock",
  //   icon: stockIcon,
  //   label: "การจัดการสินค้า",
  //   rule: ["admin"],
  //   children: [
  //     {
  //       key: `stock/stock-request`,
  //       label: `ขอเบิกสินค้า`,
  //       rule: ["user", "admin", "ma-user"],
  //     },
  //     {
  //       key: `stock/order`,
  //       label: `นำเข้าสินค้า`,
  //       rule: ["user", "admin", "ma-user"],
  //     },
  //     {
  //       key: `stock/stock-management`,
  //       label: `รายการสินค้า`,
  //       rule: ["user", "admin", "ma-user"],
  //     },
  //   ],
  // },
  {
    key: "maintenance",
    icon: maintenanceIcon,
    label: "บำรุงรักษาทรัพย์สิน",
    rule: ["ma-user", "admin"],
    children: [
      {
        key: `maintenance-management`,
        label: `การจัดการการบำรุงรักษา`,
        rule: ["ma-user", "admin"],
      },
    ],
  },
  {
    key: `employee-property`,
    icon: IconProperty,
    label: `ทรัพย์สินพนักงาน`,
    rule: ["admin", "hr", "user"],
  },
  {
    key: `events-management`,
    icon: IconParty,
    label: `การจัดงานกิจกรรม`,
    rule: ["admin", "hr", "user"],
    children: [
      {
        key: `events-management/managements`,
        label: `งานกิจกรรม`,
        rule: ["admin", "hr", "user"],
      },
      {
        key: `events-management/restaurants`,
        label: `ผู้ให้บริการ(Vendors)`,
        rule: ["admin", "hr", "user"],
      },
      {
        key: `events-management/master-type-events`,
        label: `ประเภทของการจัดงาน`,
        rule: ["admin", "hr", "user"],
      },
    ],
  },
  {
    key: `users-management`,
    icon: gridIcon,
    label: `การจัดการบุคคล`,
    rule: ["admin", "hr", "user"],
    children: [
      {
        key: `users-management/users`,
        label: `บุคลากร`,
        rule: ["admin", "hr", "user"],
      },
      {
        key: `users-management/user-organization`,
        label: `Organizations`,
        rule: "admin",
      },
      {
        key: `users-management/user-group`,
        label: `Groups`,
        rule: "admin",
      }, 
      {
        key: `users-management/user-rule`,
        label: `สิทธิ์การใช้งาน (Roles)`,
        rule: "admin",
      }, 
      {
        key: `users-management/user-role-access`,
        label: `สิทธิ์การเข้าถึง`,
        rule: "admin",
      },
      {
        key: `users-management/user-group-permission`,
        label: `Group Permission`,
        rule: "admin",
      },
    ],
  },
  // {
  //   key: `complain`,
  //   icon: gridIcon,
  //   label: `ร้องเรียนปัญหา`,
  //   rule: ["admin", "user"],
  //   children: [
  //     {
  //       key: `complain/complain-problem`,
  //       label: `ร้องเรียนปัญหา`,
  //       rule: ["admin", "user"],
  //     },
  //     {
  //       key: `complain/complain-problem-hr`,
  //       label: `ร้องเรียนปัญหา`,
  //       rule: ["admin", "hr"],
  //     },
  //   ],
  // },
  {
    key: `setting`,
    icon: <Icon icon="uil:setting" width="15" height="15" />,
    label: `ตั้งค่า`,
    rule: ["admin", "hr", "ma-user"],
    children: [
      {
        key: `setting/maintenance-type`,
        label: `การบำรุงรักษา`,
        rule: ["admin", "ma-user"],
      },
      // {
      //   key: `setting/organize-chart`,
      //   label: `Organize Chart`,
      //   rule: "admin",
      // },
      {
        key: `setting/typeleave`,
        label: `ประเภทการลา`,
        rule: ["admin", "hr"],
      },
      {
        key: `setting/master-holidays`,
        label: `วันหยุดประจำปี`,
        rule: ["admin", "hr"],
      },
      {
        key: `setting/masterdata-position`,
        label: `ตำแหน่งงาน`,
        rule: ["admin", "hr"],
      },
      {
        key: `setting/manage-home`,
        label: `การจัดการหน้าหลัก`,
        rule: ["admin", "hr"],
      },
      {
        key: `setting/master-overtime-config`,
        label: `การตั้งค่า OT`,
        rule: "admin",
      },
      {
        key: `setting/notification`,
        label: `การแจ้งเตือน`,
        rule: "admin",
      },
      // {
      //   key: `setting/unit`,
      //   label: `ประเภทยูนิตสินค้า`,
      //   rule: ["admin", "ma-user"],
      // },
    ],
  },
];

export const MenuSider: MenuItem[] = menuItems.map((item) => {
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
            .filter((item: any) => hasRoleCode(modules, item.rule))
            .map((item: any) => {
              return {
                ...item,
                label: (
                  <Tooltip placement="right" title={item.label}>
                    <div
                      style={{
                        width: 168,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Link href={`/page/${item.key}`}>{item.label}</Link>
                    </div>
                  </Tooltip>
                ),
              };
            })
        : null,
    }));

    const menu = menuFilterChildren.filter((item: any) =>
      hasRoleCode(modules, item.rule),
    );

    return menu;
  } else {
    return [];
  }
};
