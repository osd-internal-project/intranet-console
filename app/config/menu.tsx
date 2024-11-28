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
    label: "Home",
    rule: "h-s",
    icon: <HomeOutlined />,
  },
  {
    key: "internal-info",
    icon: organizeChart,
    label: `Internal Info`,
    // rule: "ii-s",
    children: [
      {
        key: `internal-info/organization-chart`,
        label: "Organization Chart",
      },
      {
        key: `internal-info/organization-chart-team`,
        label: `Team Chart `,
      },
    ],
  },
  {
    key: "stock",
    icon: stockIcon,
    label: "Stock",
    // rule: "s-s",
    children: [
      {
        key: `order-management`,
        label: `Order Management`,
        // rule: "sm-order-s",
      },
      {
        key: `inventory`,
        label: `Inventory`,
        // rule: "sm-inventory-s",
      },

      {
        key: `product-list`,
        label: `Product List`,
        // rule: "sm-productlist-s",
      },
      {
        key: `report-withdraw-ranking`,
        label: `10 อันดับการเบิกจ่ายที่มากที่สุด`,
        // rule: "sm-re-wr-h",
      },
      {
        key: `report-transaction`,
        label: `การรับเข้าเบิกจ่าย`,
        // rule: "sm-re-tr-h",
      },
      {
        key: `report-expired`,
        label: `รายงานการหมดอายุ`,
        // rule: "sm-re-ex-h",
      },
      {
        key: `stock-management`,
        label: `Stock Management`,
        // rule: "sm-s",
      },
    ],
  },
  {
    key: "housekeeper",
    icon: <Icon icon="tabler:clipboard-list" width="15" height="15" />,
    label: "Housekeeper",
    // rule: "hk-s",
    children: [
      {
        key: `housekeeper/housekeepers`,
        label: `Housekeeper`,
        // rule: "hk-h",
      },
      {
        key: `housekeeper/housekeeper-management`,
        label: `Housekeeper Management`,
        // rule: "hk-m",
      },
    ],
  },
  {
    key: "data-leave",
    icon: IconDataLeave,
    label: `Data Leave`,
    // rule: "dl-s",
    children: [
      {
        key: `data-leave/online-leave`,
        label: `Create Data Leave`,
        // rule: "dl-a",
      },
      {
        key: `data-leave/detail-online-leave`,
        label: `Detail Data Leave User`,
        // rule: "dl-dt-u",
      },
      {
        key: `data-leave/detail-online-leave-admin`,
        label: `Detail Data Leave Admin`,
        // rule: "dl-dt-a",
      },
      {
        key: `data-leave/leave-management`,
        label: `Leave Management`,
        // rule: "dl-dis",
      },
    ],
  },
  {
    key: "3",
    icon: bookingIcon,
    label: "Booking Room",
    // rule: "br-s",
    children: [
      {
        key: `bookingroom/booking-room`,
        label: `Booking room`,
      },
      {
        key: `bookingroom/booking-room-management`,
        label: `Booking room Management`,
      },
    ],
  },
  {
    key: "maintenance",
    icon: maintenanceIcon,
    label: "Maintenance",
    // rule: "ma-s",
    children: [
      {
        key: `maintenance-management`,
        label: `Maintenance Management`,
        // rule: "ma-m-s",
      },
    ],
  },
  {
    key: `users-management`,
    icon: gridIcon,
    label: `User Management`,
    // rule: "um-s",
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
        // rule: "um-ro-s",
      },
      {
        key: `users-management/user-rule`,
        label: `Rules`,
        // rule: "um-ru-s",
      },
    ],
  },
  {
    key: "crm",
    icon: contactListIcon,
    label: `CRM`,
    // rule: "crm-s",
    children: [
      {
        key: `crm/customer-group`,
        label: `Customer Group`,
        // rule: "crm-c-s",
      },
      {
        key: `crm/project`,
        label: `Project`,
        // rule: "crm-p-s",
      },
      {
        key: `crm/ticket`,
        label: `Ticket`,
        // rule: "crm-t-s",
      },
      {
        key: `crm/products`,
        label: `Products`,
        // rule: "crm-ex",
      },
      {
        key: `crm/expense`,
        label: `Expense`,
        // rule: "crm-ex",
      },
    ],
  },
  {
    key: "macar",
    icon: macarIcon,
    label: `Ma Car`,
    // rule: "mac-s",
    children: [
      {
        key: `macar/ma-car`,
        label: `Ma car`,
        // rule: "mac-c-s",
      },
      {
        key: `macar/ma-car-booking`,
        label: `Ma car Booking`,
        // rule: "mac-b-s",
      },
      {
        key: `macar/ma-car-management`,
        label: `Ma car Management`,
        // rule: "mac-m-s",
      },
    ],
  },
  {
    key: `setting`,
    icon: <Icon icon="uil:setting" width="15" height="15" />,
    label: `Setting`,
    // rule: "st-s",
    children: [
      {
        key: `setting/maintenance-type`,
        label: `MA Type`,
        // rule: "ma-t-s",
      },
      {
        key: `setting/organize-chart`,
        label: `Organize Chart`,
        // rule: "st-p-s",
      },
      {
        key: `setting/typeleave`,
        label: `Type Leave`,
        // rule: "st-tl-s",
      },
      {
        key: `setting/master-holidays`,
        label: `Master Holidays`,
        // rule: "st-mth-s",
      },
      {
        key: `setting/masterdata-position`,
        label: `Master Position`,
        // rule: "st-p-s",
      },
      {
        key: `setting/manage-home`,
        label: `Manage Home`,
        // rule: "ma-h-s",
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
