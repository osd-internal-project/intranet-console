import React from "react";
import { MenuProps, Tooltip } from "antd";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { gridIcon, IconDataLeave, bookingIcon, maintenanceIcon, macarIcon, hrIcon, stockIcon, IconProperty, IconParty } from "@/components/icon";
import { FieldTimeOutlined, HomeOutlined } from "@ant-design/icons";

type MenuItem = Required<MenuProps>["items"][number];

export const MenuSider: MenuItem[] = [
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
    label: `จองใช้งานรถยนต์`,
    rule: ["user", "admin", "ma-user"],
    children: [
      {
        key: `macar/ma-car`,
        label: `การจองรถยนต์`,
        rule: ["user", "admin"],
      },
      {
        key: `macar/ma-car-booking`,
        label: `แบบฟอร์มการจองรถ`,
        rule: ["admin"],
      },
      {
        key: `macar/management-car-wrapup`,
        label: `เช็คสภาพรถยนต์`,
        rule: ["admin", "ma-user"],
      },
      // {
      //   key: `macar/management-car-wrapup`,
      //   label: `ต่อประกันรถยนต์`,
      //   rule: ["admin", "ma-user"],
      // },
      {
        key: `macar/ma-car-management`,
        label: `การจัดการรถยนต์`,
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
        label: `ร้านอาหาร`,
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
      // {
      //   key: `users-management/user-role`,
      //   label: `Roles`,
      //   rule: "admin",
      // },
      // {
      //   key: `users-management/user-rule`,
      //   label: `Rules`,
      //   rule: "admin",
      // },
      // {
      //   key: `users-management/user-module`,
      //   label: `Module`,
      //   rule: "admin",
      // },
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
      // {
      //   key: `setting/unit`,
      //   label: `ประเภทยูนิตสินค้า`,
      //   rule: ["admin", "ma-user"],
      // },
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
