"use client";
import { Breadcrumb, Button, Col, Row, Space, Typography } from "antd";
import Link from "next/link";
import { cubeIcon, truckIcon, circleSqureIcon, starIcon, gridIcon, colorSwatchIcon, warningIcon, moveRightIcon } from "@/components/icon";
import { checkRule } from "@/app/utils/rules";
export interface TypeButton {
  name_header: string;
  name_path: string;
  icon: any;
  rule: string;
  test?: boolean;
}
type TypeButtonData = TypeButton[];

export default function Setting() {
  // const [submenu, setSubmenu] = useState<TypeButtonData[]>([]);
  const categories: string[] = ["PRODUCT MANAGEMENT"];
  const buttonsData: TypeButtonData[] = [
    [
      {
        name_header: "Master Product Management ",
        name_path: "setting/master-product-management",
        icon: cubeIcon,
        rule: "sm-mp-s",
      },
      {
        name_header: "Set Category & Group ",
        name_path: "setting/category-group-type",
        icon: circleSqureIcon,
        rule: "sm-c-s",
      },
      {
        name_header: "Set Unit",
        name_path: "setting/unit",
        icon: gridIcon,
        rule: "sm-unit-s",
      },
      {
        name_header: "Set Hazard Type",
        name_path: "setting/master-hazard-type",
        icon: colorSwatchIcon,
        rule: "sm-hz-h",
      },
      {
        name_header: "Set GHS",
        name_path: "setting/ghs",
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
        name_path: "setting/brand",
        icon: starIcon,
        rule: "sm-brand-s",
      },
      {
        name_header: "Master Type Leave",
        name_path: "setting/type-leave",
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
                title: <span>หน้าหลัก</span>,
              },
              {
                title: <span>Setting</span>,
              },
            ]}
          />
        </Col>
      </Row>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <div className="title-page-font">SETTING</div>
        </Col>
      </Row>
      <br />
      <div className=" grid grid-cols-3 gap-4">
        {categories?.map((category: string, index: number) => {
          return (
            <div key={index} className=" col-span-3 md:col-span-1" style={{ width: "100%" }}>
              <Col span={24}>
                <Typography className="text-name-header">{category}</Typography>
              </Col>
              <br />
              {buttonsData[index].map((buttonText: TypeButton, buttonIndex: number) => {
                return checkRule(buttonText.rule) ? (
                  <Col key={buttonIndex} span={24} style={{ marginBottom: "10px" }}>
                    <Link href={`/page/${buttonText.name_path}`}>
                      <Button className="button_setting">
                        <div
                          style={{
                            height: "100%",
                            justifyContent: "start",
                            display: "flex",
                            alignItems: "center",
                          }}>
                          <Space>
                            <Typography className="text-name-menu">{buttonText.icon}</Typography>
                            <Typography className="text-name-menu">{buttonText.name_header} </Typography>
                          </Space>
                        </div>
                        <div
                          style={{
                            alignItems: "center",
                            justifyContent: "center",
                            display: "flex",
                            height: "100%",
                          }}>
                          {moveRightIcon}
                        </div>
                      </Button>
                    </Link>
                  </Col>
                ) : (
                  <></>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}
