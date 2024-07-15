"use client";
import { Breadcrumb, Card, Col, Divider, Row, Tabs } from "antd";
import CategoriesComponent from "./components/CategoriesComponent";
import GroupComponent from "./components/GroupComponent";
import TypeComponent from "./components/TypeComponent";
import { useEffect, useState } from "react";
export default function SetCatogoryGroupType() {
  const [categoryCode, setCategoryCode] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [checkcreatetypeChem, setCheckcreatetypeChem] = useState<boolean>(true);

  const propCategory = (categoryCode: string | null, categoryId: number | null, checkBoolean: boolean) => {
    setCategoryCode(categoryCode);
    setCategoryId(categoryId);
    setCheckcreatetypeChem(checkBoolean);
  };
  const propType = (categoryCode: boolean) => {
    setCheckcreatetypeChem(categoryCode);
  };

  return (
    <Row gutter={[8, 8]}>
      <Col>
        <Breadcrumb
          items={[
            {
              href: "/page",
              title: <span>Home</span>,
            },
            {
              href: "/page/stock-management",
              title: <span>Stock Management</span>,
            },
            {
              title: <span>Set Category & Group</span>,
            },
          ]}
        />
      </Col>

      <Divider orientation="left" orientationMargin="0">
        <div className="title-page-font">{`Set Category & Group`}</div>
      </Divider>

      <Col span={24}>
        <div className=" grid grid-cols-5 gap-4">
          <div className=" col-span-5 md:col-span-2">
            <CategoriesComponent propCategory={propCategory} />
          </div>
          <div className="col-span-5 md:col-span-3 ">
            {categoryId && categoryCode && checkcreatetypeChem ? (
              <GroupComponent categoryCode={categoryCode} categoryId={categoryId} checkcreatetypeChem={checkcreatetypeChem} />
            ) : (
              <></>
            )}
          </div>
        </div>
        {/* <Tabs
          defaultActiveKey="1"
          destroyInactiveTabPane={true}
          items={[
            {
              label: "Category & Group",
              key: "1",
              forceRender: true,
              children: (
                <div className=" grid grid-cols-5 gap-4">
                  <div className=" col-span-5 md:col-span-2">
                    <CategoriesComponent propCategory={propCategory} />
                  </div>
                  <div className="col-span-5 md:col-span-3 ">
                    {categoryId && categoryCode && checkcreatetypeChem ? (
                      <GroupComponent categoryCode={categoryCode} categoryId={categoryId} checkcreatetypeChem={checkcreatetypeChem} />
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              ),
            },
            {
              label: "Type of Chemical",
              key: "2",
              forceRender: true,
              children: <TypeComponent propType={propType} />,
            },
          ]}
        /> */}
      </Col>
    </Row>
  );
}
