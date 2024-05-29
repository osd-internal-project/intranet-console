import { CreditCardOutlined, DashboardOutlined, FileTextOutlined, LogoutOutlined, UserOutlined, CloseOutlined, FallOutlined, FileExclamationOutlined } from "@ant-design/icons";
import { Icon } from "@iconify/react";
import { MenuProps } from "antd";
import Link from "next/link";
import React from "react";
import { signOut } from "next-auth/react";
import { persentationChartLoneIcon } from "@/components/icon";

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

export const MenuSider: MenuProps["items"] = [
  {
    key: `mainmenu`,
    label: `MAIN MENU`,
    disabled: true,
  },
  // {
  //   key: `dashboard`,
  //   icon: <Icon icon="tabler:smart-home" width="25" height="25" />,
  //   label: `Dashboard`,
  // },
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
    key: `products`,
    label: `PRODUCTS`,
    disabled: true,
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
  {
    key: `report`,
    label: `REPORT`,
    disabled: true,
  },

  {
    key: `report-withdraw-ranking`,
    icon: persentationChartLoneIcon,
    label: `10 อันดับการเบิกจ่ายที่มากที่สุด`,
    rule: "report-withdraw-ranking-show",
  },
  {
    key: `report-transaction`,
    icon: <Icon icon="bx:file" width="25" height="25" />,
    label: `การรับเข้าเบิกจ่ายสารเคมี`,
    rule: "report-transaction-show",
  },
  {
    key: `report-expired`,
    icon: <Icon icon="bx:bell" width="25" height="25" />,
    label: `รายงานการหมดอายุของสารเคมี`,
    rule: "report-expired",
  },
  // {
  //   key: `new-chemical-list`,
  //   icon: <Icon icon="tabler:file-plus" width="25" height="25" />,
  //   label: `รายชื่อสารใหม่ในระบบ`,
  // },
  // {
  //   key: `chemical-prices-list`,
  //   icon: <Icon icon="formkit:dollar" width="25" height="25" />,
  //   label: `รายการราคาสารเคมี`,
  // },
  { key: `admin`, label: `ADMIN`, disabled: true },
  // {
  //   key: `employee`,
  //   icon: <Icon icon="tabler:users" width="25" height="25" />,
  //   label: `Employee`,
  // },
  // {
  //   key: `manage-admin`,
  //   icon: <Icon icon="mingcute:user-4-line" width="25" height="25" />,
  //   label: `Manage Admin`,
  // },
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
    label: (
      <>
        <Link href={`/page/${item.key}`}>{item.label}</Link>
      </>
    ),
  };
});

export const MenuSiderWithModule = (modules: string[]) => {
  if (modules) {
    const menu = MenuSider.filter((item: any) => {
      return !item.rule || modules.includes(item.rule);
    });
    return menu;
  } else {
    return [];
  }
};
