"use client";
import { Breadcrumb, Button, Col, Row, Space, Typography } from "antd";
import Link from "next/link";
import {
  buldingIcon,
  cubeIcon,
  groupLineIcon,
  truckIcon,
  circleSqureIcon,
  starIcon,
  gridIcon,
  mindMappingIcon,
  userGroupIcon,
  vectorIcon,
  shieldExclamationIcon,
  colorSwatchIcon,
  warningIcon,
  moveRightIcon,
  IconPosition,
} from "@/components/icon";
import { checkRule } from "@/app/utils/rules";
import { useEffect, useState } from "react";
export interface TypeButton {
  name_header: string;
  name_path: string;
  icon: any;
  rule: string;
  test?: boolean;
}
type TypeButtonData = TypeButton[];

export default function StockMangementPage() {
  const [submenu, setSubmenu] = useState<TypeButtonData[]>([]);
  const categories: string[] = [
    "VALUES",
    "INVENTORY MANAGEMENT",
    "PRODUCT MANAGEMENT",
  ];
  const buttonsData: TypeButtonData[] = [
    [
      {
        name_header: "Set Objective",
        name_path: "stock-management/objective",
        icon: colorSwatchIcon,
        rule: "sm-objective-show",
      },
    ],
    [
      {
        name_header: "Location",
        name_path: "stock-management/location",
        icon: buldingIcon,
        rule: "sm-location-s",
      },
      {
        name_header: "Inventory Store",
        name_path: "stock-management/inventory",
        icon: cubeIcon,
        rule: "sm-inventory-s",
      },
    ],
    [
      {
        name_header: "Master Product Management ",
        name_path: "stock-management/master-product-management",
        icon: cubeIcon,
        rule: "sm-mp-s",
      },
      {
        name_header: "Set Category & Group ",
        name_path: "stock-management/cetagory-group-type",
        icon: circleSqureIcon,
        rule: "sm-c-s",
      },
      {
        name_header: "Set Unit",
        name_path: "stock-management/unit",
        icon: gridIcon,
        rule: "sm-unit-s",
      },
      {
        name_header: "Set Hazard Type",
        name_path: "stock-management/master-hazard-type",
        icon: colorSwatchIcon,
        rule: "sm-hz-h",
      },
      {
        name_header: "Set GHS",
        name_path: "stock-management/ghs",
        icon: warningIcon,
        rule: "sm-ghs-s",
      },
      {
        name_header: "Vender",
        name_path: "stock-management/vender",
        icon: truckIcon,
        rule: "sm-vender-s",
      },
      {
        name_header: "Set Brand",
        name_path: "stock-management/brand",
        icon: starIcon,
        rule: "sm-brand-s",
      },
      {
        name_header: "Master Type Leave",
        name_path: "stock-management/type-leave",
        icon: starIcon,
        rule: "m-type-leave",
      },
    ],
  ];

  return (
    <>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page",
                title: <span>Home</span>,
              },
              {
                title: <span>Stock Management</span>,
              },
            ]}
          />
        </Col>
      </Row>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <div className="title-page-font">STOCK MANAGEMENT</div>
        </Col>
      </Row>
      <br />
      <div className=" grid grid-cols-3 gap-4">
        {categories?.map((category: string, index: number) => {
          return (
            <div
              key={index}
              className=" col-span-3 md:col-span-1"
              style={{ width: "100%" }}
            >
              <Col span={24}>
                <Typography className="text-name-header">{category}</Typography>
              </Col>
              <br />
              {buttonsData[index].map(
                (buttonText: TypeButton, buttonIndex: number) => {
                  return checkRule(buttonText.rule) ? (
                    <Col
                      key={buttonIndex}
                      span={24}
                      style={{ marginBottom: "10px" }}
                    >
                      <Link href={`/page/${buttonText.name_path}`}>
                        <Button className="button_stock-management w-5/6">
                          <div
                            style={{
                              height: "100%",
                              // justifyContent: "start",
                              display: "flex",
                              alignItems: "center",
                            }}
                            className=" w-full justify-between"
                          >
                            <Space className=" w-full">
                              <Typography className="text-name-menu">
                                {buttonText.icon}
                              </Typography>
                              <Typography className="text-name-menu">
                                {buttonText.name_header}
                              </Typography>
                            </Space>
                            <Typography>{moveRightIcon}</Typography>
                          </div>
                        </Button>
                      </Link>
                    </Col>
                  ) : (
                    <></>
                  );
                }
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
