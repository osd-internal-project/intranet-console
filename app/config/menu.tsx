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
import React, { Children } from "react";
import { signOut } from "next-auth/react";
import {
  buldingIcon,
  carlendarIcon,
  circleSqureIcon,
  colorSwatchIcon,
  cubeIcon,
  editTagIcon,
  gridIcon,
  groupLineIcon,
  IconPosition,
  mindMappingIcon,
  organizeChart,
  persentationChartLoneIcon,
  shieldExclamationIcon,
  starIcon,
  stockSetting,
  truckIcon,
  userGroupIcon,
  warningIcon,
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
    key: "internal-info",
    icon: organizeChart,
    label: `Internal Info`,
    children: [
      {
        key: `internal-info/organization-chart`,
        label: `Organization Chart`,
        // rule: "housekeeper",
      },
      {
        key: `internal-info/excutive-devision`,
        label: `Excutive Devision`,
        // rule: "housekeeper",
      },
      {
        key: `internal-info/finance-and-accounting-department`,
        label: `Finance and Accounting Department`,
        // rule: "housekeeper",
      },
      {
        key: `internal-info/business-support-department`,
        label: `Business Support Department`,
        // rule: "housekeeper",
      },
      {
        key: `internal-info/customer-relationship-management-department`,
        label: `Customer Relationship Management Department`,
        // rule: "housekeeper",
      },
      {
        key: `internal-info/business-solution-consulting-department`,
        label: `Business Solution Consulting Department`,
        // rule: "housekeeper",
      },
      {
        key: `internal-info/business-consulting-department`,
        label: `Business Consulting Department`,
        // rule: "housekeeper",
      },
      {
        key: `internal-info/marketing-department`,
        label: `Marketing Department`,
        // rule: "housekeeper",
      },
      {
        key: `internal-info/new-installation-department`,
        label: `New Installation Department`,
        // rule: "housekeeper",
      },
      {
        key: `internal-info/service-and-support-department`,
        label: `New Installation Department`,
        // rule: "housekeeper",
      },
      {
        key: `internal-info/voice-collaboration-department`,
        label: `Voice Collaboration Department`,
        // rule: "housekeeper",
      },
      {
        key: `internal-info/network-department`,
        label: `Network Department`,
        // rule: "housekeeper",
      },
      {
        key: `internal-info/research-and-development-department`,
        label: `Research and Development Department`,
        // rule: "housekeeper",
      },
    ],
  },
  {
    key: "stock",
    icon: <BankOutlined width={15} height={15} />,
    label: "Stock",
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
    key: "housekeeper",
    icon: <Icon icon="tabler:clipboard-list" width="15" height="15" />,
    label: "Housekeeper",
    // rule:'menu-housekeeper',
    children: [
      {
        key: `housekeeper/housekeepers`,
        icon: carlendarIcon,
        label: `Housekeeper`,
        // rule: "housekeeper",
      },
      {
        key: `housekeeper/housekeeper-management`,
        icon: editTagIcon,
        label: `Housekeeper Management`,
        // rule: "housekeeper",
      },
    ],
  },
  {
    key: "3",
    icon: <Icon icon="tabler:clipboard-list" width="20" height="20" />,
    label: "Booking Room",
    children: [
      {
        key: `bookingroom/booking-room`,
        icon: <Icon icon="tabler:clipboard-list" width="25" height="25" />,
        label: `Booking room`,
        // rule: "housekeeper",
      },
      {
        key: `bookingroom/booking-room-management`,
        icon: <Icon icon="tabler:clipboard-list" width="25" height="25" />,
        label: `Booking room Management`,
        // rule: "housekeeper",
      },
    ],
  },
  {
    key: "maintenance",
    icon: <Icon icon="tabler:clipboard-list" width="15" height="15" />,
    label: "Maintenance",
    // rule: "menu-ma",
    children: [
      {
        key: `maintenance-management`,
        icon: <Icon icon="tabler:clipboard-list" width="15" height="15" />,
        label: `Maintenance Management`,
        // rule: "ma-task-show",
      },
    ],
  },
  { key: `admin`, label: `Admin`, disabled: true },
  {
    key: `setting`,
    icon: <Icon icon="uil:setting" width="15" height="15" />,
    label: `Setting`,
    // rule: "setting-show",
    children: [
      {
        key: `setting/ma-type`,
        icon: colorSwatchIcon,
        label: `Ma Type`,
      },
      {
        key: `setting/organize-chart`,
        icon: organizeChart,
        label: `Organize Chart`,
        // rule: "user-position-show",
      },
      {
        key: `setting/department`,
        icon: buldingIcon,
        label: `Department`,
      },
      {
        key: `setting/typeleave`,
        icon: buldingIcon,
        label: `Type Leave`,
      },
      {
        key: `setting/master-holidays`,
        icon: buldingIcon,
        label: `Master Holidays`,
      },
    ],
  },
  {
    key: `users-management`,
    icon: gridIcon,
    label: `User Management`,
    // rule: "setting-show",
    children: [
      {
        key: `users-management/users`,
        icon: groupLineIcon,
        label: `Users`,
        rule: "user-management-show",
      },
      {
        key: `users-management/user-group`,
        icon: userGroupIcon,
        label: `Users Group`,
        rule: "user-group-show",
      },
      {
        key: `users-management/user-role`,
        icon: mindMappingIcon,
        label: `Users Role`,
        rule: "user-role-show",
      },
      {
        key: `users-management/user-rule`,
        icon: shieldExclamationIcon,
        label: `Users Rule`,
        rule: "user-rule-show",
      },
    ],
  },
  {
    key: `stock-management`,
    icon: stockSetting,
    label: `Stock Management`,
    // rule: "setting-show",
    children: [
      {
        key: `stock-management/department`,
        icon: buldingIcon,
        label: `Department`,
        rule: "department-show",
      },
      {
        key: `stock-management/inventory`,
        icon: cubeIcon,
        label: `Inventory`,
        rule: "inventory-show",
      },
      {
        key: `stock-management/objective`,
        icon: colorSwatchIcon,
        label: `Objective`,
        rule: "objective-show",
      },
      {
        key: `stock-management/master-product-management`,
        icon: cubeIcon,
        label: `Master Product Management`,
        rule: "m-product-show",
      },
      {
        key: `stock-management/cetagory-group-type`,
        icon: circleSqureIcon,
        label: `Set Category & Group`,
        rule: "mp-category-show",
      },
      {
        key: `stock-management/unit`,
        icon: gridIcon,
        label: `Set Unit`,
        rule: "mp-unit-show",
      },
      {
        key: `stock-management/master-hazard-type`,
        icon: colorSwatchIcon,
        label: `Set Hazard Type`,
        rule: "mp-hazard-type-show",
      },
      {
        key: `stock-management/ghs`,
        icon: warningIcon,
        label: `Set GHS`,
        rule: "mp-ghs-show",
      },
      {
        key: `stock-management/vender`,
        icon: truckIcon,
        label: `Vender`,
        rule: "vender-show",
      },
      {
        key: `stock-management/brand`,
        icon: starIcon,
        label: `Set Brand`,
        rule: "brand-show",
      },
    ],
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
              ...item,
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
