import {
  CreditCardOutlined,
  DashboardOutlined,
  FileTextOutlined,
  LogoutOutlined,
  UserOutlined,
  CloseOutlined,
  FallOutlined,
  FileExclamationOutlined,
  MailOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { Icon } from "@iconify/react";
import { MenuProps } from "antd";
import Link from "next/link";
import React from "react";
import { signOut } from "next-auth/react";
import { persentationChartLoneIcon } from "@/components/icon";

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
          signOut();
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
    key: "stock",
    icon: <BankOutlined />,
    label: "STOCK",
    // rule: "menu-stock",
    children: [
      {
        key: `order-management`,
        icon: <Icon icon="tabler:clipboard-list" width="25" height="25" />,
        label: `Order Management`,
        rule: "order-show",
      },
      {
        key: `inventory`,
        icon: <Icon icon="ep:office-building" width="25" height="25" />,
        label: `Inventory`,
        rule: "inventory-stock-show",
      },

      {
        key: `product-list`,
        icon: <Icon icon="humbleicons:box" width="25" height="25" />,
        label: `Product List`,
        rule: "product-list-show",
      },
      // {
      //   key: `suppliers`,
      //   icon: <Icon icon="lucide:truck" width="25" height="25" />,
      //   label: `Suppliers`,
      // },
      // {
      //   key: `report`,
      //   label: `REPORT`,
      //   disabled: true,
      // },
      // {
      //   key: `dashboard`,
      //   icon: <Icon icon="tabler:clipboard-list" width="25" height="25" />,
      //   label: `Dashboard`,
      //   // rule: "dashboard",
      // },
      {
        key: `report-withdraw-ranking`,
        icon: persentationChartLoneIcon,
        label: `10 อันดับการเบิกจ่ายที่มากที่สุด`,
        rule: "report-withdraw-ranking-show",
      },
      {
        key: `report-transaction`,
        icon: <Icon icon="bx:file" width="25" height="25" />,
        label: `การรับเข้าเบิกจ่าย`,
        rule: "report-transaction-show",
      },
      {
        key: `report-expired`,
        icon: <Icon icon="bx:bell" width="25" height="25" />,
        label: `รายงานการหมดอายุ`,
        rule: "report-expired",
      },
    ],
  },
  {
    key: "housekeeper-menu",
    icon: <Icon icon="tabler:clipboard-list" width="20" height="20" />,
    label: "HOUSEKEEPER",
    // rule:'menu-housekeeper',
    children: [
      {
        key: `housekeeper`,
        icon: <Icon icon="tabler:clipboard-list" width="25" height="25" />,
        label: `Housekeeper`,
        // rule: "housekeeper",
      },
      {
        key: `housekeeper-management`,
        icon: <Icon icon="tabler:clipboard-list" width="25" height="25" />,
        label: `Housekeeper Management`,
        // rule: "housekeeper",
      },
    ],
  },
  {
    key: "ma",
    icon: <Icon icon="tabler:clipboard-list" width="20" height="20" />,
    label: "MA",
    // rule: "menu-ma",
    children: [
      {
        key: `ma-management`,
        icon: <Icon icon="tabler:clipboard-list" width="25" height="25" />,
        label: `MA Management`,
        // rule: "ma-task-show",
      },
    ],
  },
  { key: `admin`, label: `ADMIN`, disabled: true },
  {
    key: `setting`,
    icon: <Icon icon="uil:setting" width="25" height="25" />,
    label: `Setting`,
    rule: "setting-show",
  },
].map((item) => {
  // if (item?.children) {
  //   return {
  //     ...item,
  //     children: item.children.map((itemChild) => ({
  //       ...itemChild,
  //       label: (
  //         <>
  //           <Link href={`/page/${itemChild.key}`}>{itemChild.label}</Link>
  //         </>
  //       ),
  //     })),
  //   };
  // }
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
              label: (
                <>
                  <Link href={`/page/${item.key}`}>{item.label}</Link>
                </>
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
