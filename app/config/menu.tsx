import { FieldTimeOutlined, HomeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Icon } from "@iconify/react";
import { MenuProps, Tooltip } from "antd";
import Link from "next/link";
import React from "react";
import { gridIcon, IconDataLeave, bookingIcon, maintenanceIcon, organizeChart, contactListIcon, macarIcon, hrIcon } from "@/components/icon";
import { UserRoles } from "./user-roles";

type MenuItem = Required<MenuProps>["items"][number];

export const MenuSider: MenuItem[] = [
  {
    key: "home",
    label: "หน้าหลัก",
    rule: "user",
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
  {
    key: "hr-management",
    label: "ระบบบริหารงานบุคคล",
    rule: "hr",
    icon: hrIcon,
    children: [
      {
        key: `hr-management/employee-profile`,
        label: "ข้อมูลพนักงาน",
        rule: "hr",
      },
    ],
  },
  {
    key: "housekeeper",
    icon: <Icon icon="tabler:clipboard-list" width="15" height="15" />,
    label: "งานแม่บ้าน",
    rule: "ma-user",
    children: [
      {
        key: `housekeeper/housekeepers`,
        label: `ข้อมูลการการทำงานของแม่บ้าน`,
        rule: "ma-user",
      },
      {
        key: `housekeeper/housekeeper-management`,
        label: `จัดการข้อมูลแม่บ้าน`,
        rule: "ma-user",
      },
    ],
  },
  {
    key: "leave-control-management",
    icon: IconDataLeave,
    label: `ข้อมูลการลา`,
    rule: ["user", "admin", "header"],
    children: [
      {
        key: `leave-control-management/leave-letter`,
        label: `ใบลาออนไลน์`,
        rule: "user",
      },
      {
        key: `leave-control-management/leave-history`,
        label: `ประวัติการลา`,
        rule: "user",
      },
      {
        key: `leave-control-management/leave-history-admin`,
        label: `จัดการการลา`,
        rule: ["admin", "header"],
      },
      {
        key: `leave-control-management/leave-disabled-management`,
        label: `จัดการสิทธิ์การลา`,
        rule: "admin",
      },
    ],
  },
  {
    key: "bookingroom",
    icon: bookingIcon,
    label: "ห้องประชุม",
    rule: ["user", "admin"],
    children: [
      {
        key: `bookingroom/booking-room`,
        label: `จองห้องประชุม`,
        rule: "user",
      },
      {
        key: `bookingroom/booking-room-management`,
        label: `จัดการข้อมูลห้องประชุม`,
        rule: "admin",
      },
      {
        key: `bookingroom/booking-room-refreshment`,
        label: `จัดการอาหารว่าง`,
        rule: "admin",
      },
    ],
  },
  {
    key: "maintenance",
    icon: maintenanceIcon,
    label: "Maintenance",
    rule: "ma-user",
    children: [
      {
        key: `maintenance-management`,
        label: `Maintenance Management`,
        rule: "ma-user",
      },
    ],
  },
  {
    key: "macar",
    icon: macarIcon,
    label: `ข้อมูลการจองรถยนต์`,
    rule: ["user", "admin"],
    children: [
      {
        key: `macar/ma-car`,
        label: `ข้อมูลการจองรถยนต์`,
        rule: "user",
      },
      {
        key: `macar/ma-car-booking`,
        label: `Ma car Booking`,
        rule: "user",
      },
      {
        key: `macar/ma-car-management`,
        label: `ข้อมูลการจองรถยนต์ (แอดมิน)`,
        rule: "admin",
      },
    ],
  },
  {
    key: `overtime`,
    icon: <FieldTimeOutlined />,
    label: `Overtime`,
    rule: ["user", "admin"],
    children: [
      {
        key: `overtime/overtime-calendar`,
        label: `ตารางการเบิก OT`,
        rule: "user",
      },
      {
        key: `overtime/overtime-form`,
        label: `แบบฟอร์มขอเบิกค่าทำงานล่วงเวลา`,
        rule: "user",
      },
    ],
  },
  {
    key: `users-management`,
    icon: gridIcon,
    label: `User Management`,
    rule: "admin",
    children: [
      {
        key: `users-management/users`,
        label: `Users`,
        rule: "admin",
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
        key: `users-management/user-role`,
        label: `Roles`,
        rule: "admin",
      },
      {
        key: `users-management/user-rule`,
        label: `Rules`,
        rule: "admin",
      },
      {
        key: `users-management/user-module`,
        label: `Module`,
        rule: "admin",
      },
      {
        key: `users-management/user-group-permission`,
        label: `Group Permission`,
        rule: "admin",
      },
    ],
  },
  {
    key: `setting`,
    icon: <Icon icon="uil:setting" width="15" height="15" />,
    label: `ตั้งค่า`,
    rule: "admin",
    children: [
      {
        key: `setting/maintenance-type`,
        label: `การบำรุงรักษา`,
        rule: "admin",
      },
      {
        key: `setting/organize-chart`,
        label: `Organize Chart`,
        rule: "admin",
      },
      {
        key: `setting/typeleave`,
        label: `Type Leave`,
        rule: "admin",
      },
      {
        key: `setting/master-holidays`,
        label: `Master Holidays`,
        rule: "admin",
      },
      {
        key: `setting/masterdata-position`,
        label: `Master Position`,
        rule: "admin",
      },
      {
        key: `setting/manage-home`,
        label: `Manage Home`,
        rule: "admin",
      },
      // {
      //   key: `setting/email-template`,
      //   label: `Email Template`,
      //   rule: "st-et-s",
      // },
      {
        key: `setting/master-overtime-config`,
        label: `Master Overtime Config`,
        rule: "admin",
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
              const rule = item.rule;
              // return !item.rule || modules.includes(item.rule);
              if (Array.isArray(rule)) {
                return rule.some((r) => modules.includes(r));
              }
              return modules.includes(rule);
            })
            .map((item: any) => {
              return {
                ...item,
                label: (
                  <Tooltip placement="right" title={item.label}>
                    <div style={{ width: 140 }}>
                      <Link href={`/page/${item.key}`}>{item.label}</Link>
                    </div>
                  </Tooltip>
                ),
              };
            })
        : null,
    }));

    // original code
    //  const menu = menuFilterChildren.filter((item: any) => {
    //   console.log(item.rule);

    //   return !item.rule || modules.includes(item.rule);
    // });

    const menu = menuFilterChildren.filter((item: any) => {
      const rule = item.rule;
      if (Array.isArray(rule)) {
        return rule.some((r) => modules.includes(r));
      }
      return modules.includes(rule);
    });

    return menu;
  } else {
    return [];
  }
};
