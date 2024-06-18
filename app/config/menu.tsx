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
  HomeOutlined,
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
  IconDataLeave,
  bookingIcon,
  IconHolidays,
  IconPosition,
  IconTypeLeave,
  maintenanceIcon,
  mindMappingIcon,
  organizeChart,
  persentationChartLoneIcon,
  shieldExclamationIcon,
  starIcon,
  stockIcon,
  stockSetting,
  truckIcon,
  userGroupIcon,
  warningIcon,
  contactListIcon,
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
    key: "home",
    label: "Home",
    icon: <HomeOutlined />,
  },
  {
    key: "internal-info",
    icon: organizeChart,
    label: `Internal Info`,
    children: [
      {
        key: `internal-info/organization-chart`,
        label: `Organization Chart`,
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
    rule: "stock",
    children: [
      {
        key: `order-management`,
        // icon: <Icon icon="tabler:clipboard-list" width="25" height="25" />,
        label: `Order Management`,
        rule: "sm-order-s",
      },
      {
        key: `inventory`,
        // icon: <Icon icon="ep:office-building" width="25" height="25" />,
        label: `Inventory`,
        rule: "sm-inventory-s",
      },

      {
        key: `product-list`,
        // icon: <Icon icon="humbleicons:box" width="25" height="25" />,
        label: `Product List`,
        rule: "sm-productlist-s",
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
        // icon: persentationChartLoneIcon,
        label: `10 อันดับการเบิกจ่ายที่มากที่สุด`,
        rule: "sm-re-wr-h",
      },
      {
        key: `report-transaction`,
        // icon: <Icon icon="bx:file" width="25" height="25" />,
        label: `การรับเข้าเบิกจ่าย`,
        rule: "sm-re-tr-h",
      },
      {
        key: `report-expired`,
        // icon: <Icon icon="bx:bell" width="25" height="25" />,
        label: `รายงานการหมดอายุ`,
        rule: "sm-re-ex-h",
      },
      {
        key: `stock-management`,
        // icon: <Icon icon="tabler:clipboard-list" width="25" height="25" />,
        label: `Stock Management`,
        rule: "sm-s",
      },
    ],
  },
  {
    key: "housekeeper",
    icon: <Icon icon="tabler:clipboard-list" width="15" height="15" />,
    label: "Housekeeper",
    rule: "housekeeper",
    children: [
      {
        key: `housekeeper/housekeepers`,
        label: `Housekeeper`,
        rule: "hk-h",
      },
      {
        key: `housekeeper/housekeeper-management`,
        label: `Housekeeper Management`,
        rule: "hk-m",
      },
    ],
  },
  {
    key: "data-leave",
    icon: IconDataLeave,
    label: `Data Leave`,
    children: [
      {
        key: `data-leave/online-leave`,
        label: `Create Data Leave`,
      },
      {
        key: `data-leave/detail-online-leave`,
        label: `Detail Data Leave User`,
      },
      {
        key: `data-leave/detail-online-leave-admin`,
        label: `Detail Data Leave Admin`,
      },
      {
        key: `data-leave/leave-management`,
        label: `Leave Management`,
      },
    ],
  },
  {
    key: "3",
    icon: bookingIcon,
    label: "Booking Room",
    children: [
      {
        key: `bookingroom/booking-room`,
        // icon: <Icon icon="mdi:book-sync-outline" width="20" height="20" />,
        label: `Booking room`,
      },
      {
        key: `bookingroom/booking-room-management`,
        // icon: <Icon icon="mdi:book-plus-outline" width="20" height="20" />,
        label: `Booking room Management`,
      },
    ],
  },
  {
    key: "maintenance",
    icon: maintenanceIcon,
    label: "Maintenance",
    // rule: "menu-ma",
    children: [
      {
        key: `maintenance-management`,
        // icon: <Icon icon="tabler:clipboard-list" width="15" height="15" />,
        label: `Maintenance Management`,
        // rule: "ma-task-show",
      },
    ],
  },
  // { key: `admin`, label: `Admin`, disabled: true },
  {
    key: `setting`,
    icon: <Icon icon="uil:setting" width="15" height="15" />,
    label: `Setting`,
    // rule: "st-s",
    children: [
      {
        key: `setting/maintenance-type`,
        // icon: colorSwatchIcon,
        label: `Ma Type`,
      },
      {
        key: `setting/organize-chart`,
        // icon: organizeChart,
        label: `Organize Chart`,
        // rule: "st-p-s",
      },
      // {
      //   key: `setting/location`,
      //   // icon: buldingIcon,
      //   label: `Location`,
      // },
      {
        key: `setting/typeleave`,
        // icon: IconTypeLeave,
        label: `Type Leave`,
      },
      {
        key: `setting/master-holidays`,
        // icon: IconHolidays,
        label: `Master Holidays`,
      },
      {
        key: `setting/masterdata-position`,
        // icon: IconPosition,
        label: `Master Position`,
      },
    ],
  },
  {
    key: `users-management`,
    icon: gridIcon,
    label: `User Management`,
    // rule: "st-s",
    children: [
      {
        key: `users-management/users`,
        // icon: groupLineIcon,
        label: `Users`,
        rule: "um-s",
      },
      {
        key: `users-management/user-organization`,
        // icon: shieldExclamationIcon,
        label: `Organizations`,
        // rule: "user-organize-show",
      },
      {
        key: `users-management/user-group`,
        // icon: userGroupIcon,
        label: `Groups`,
        rule: "um-ug-s",
      },
      {
        key: `users-management/user-role`,
        // icon: mindMappingIcon,
        label: `Roles`,
        rule: "um-ro-s",
      },
      {
        key: `users-management/user-rule`,
        // icon: shieldExclamationIcon,
        label: `Rules`,
        rule: "um-ru-s",
      },
    ],
  },
  {
    key: "crm",
    icon: contactListIcon,
    label: `CRM`,
    children: [
      {
        key: `crm/customer`,
        label: `Customer`,
        // rule: "housekeeper",
      },
      {
        key: `crm/ticket`,
        label: `Ticket `,
        // rule: "housekeeper",
      },
    ],
  },
  // {
  //   key: `stock-management`,
  //   icon: stockSetting,
  //   label: `Stock Management`,
  //   // rule: "st-s",
  //   children: [
  //     {
  //       key: `stock-management/location`,
  //       // icon: buldingIcon,
  //       label: `Location`,
  //       rule: "sm-location-s",
  //     },
  //     {
  //       key: `stock-management/inventory`,
  //       // icon: cubeIcon,
  //       label: `Inventory`,
  //       rule: "inventory-show",
  //     },
  //     {
  //       key: `stock-management/objective`,
  //       // icon: colorSwatchIcon,
  //       label: `Objective`,
  //       rule: "objective-show",
  //     },
  //     {
  //       key: `stock-management/master-product-management`,
  //       // icon: cubeIcon,
  //       label: `Master Product Management`,
  //       rule: "sm-mp-s",
  //     },
  //     {
  //       key: `stock-management/cetagory-group-type`,
  //       // icon: circleSqureIcon,
  //       label: `Set Category & Group`,
  //       rule: "sm-c-s",
  //     },
  //     {
  //       key: `stock-management/unit`,
  //       // icon: gridIcon,
  //       label: `Set Unit`,
  //       rule: "sm-unit-s",
  //     },
  //     {
  //       key: `stock-management/master-hazard-type`,
  //       // icon: colorSwatchIcon,
  //       label: `Set Hazard Type`,
  //       rule: "sm-hz-h",
  //     },
  //     {
  //       key: `stock-management/ghs`,
  //       // icon: warningIcon,
  //       label: `Set GHS`,
  //       rule: "sm-ghs-s",
  //     },
  //     {
  //       key: `stock-management/vender`,
  //       // icon: truckIcon,
  //       label: `Vender`,
  //       rule: "vender-show",
  //     },
  //     {
  //       key: `stock-management/brand`,
  //       // icon: starIcon,
  //       label: `Set Brand`,
  //       rule: "sm-brand-s",
  //     },
  //   ],
  // },
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
