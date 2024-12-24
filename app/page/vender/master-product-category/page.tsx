"use client";
import { Breadcrumb, Card, Col, Divider, Row, Tabs } from "antd";
import Link from "next/link";

import { useEffect, useState } from "react";
import { CategoryTable } from "./components/category-table";
import { TypeTable } from "./components/type-table";
import { ITMasterProductCategory } from "@/app/common/master-product-category";
import { useForm } from "antd/es/form/Form";
export default function VenderCategory() {
  const [categoryForm] = useForm();
  const [categories, setCategories] = useState<ITMasterProductCategory[]>([]);
  const fetchDataCategory = async () => {};
  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Breadcrumb
          items={[
            {
              title: <Link href={"/page"}>Home</Link>,
            },
            {
              title: <span>Vender</span>,
            },
            {
              title: <span>Product Category</span>,
            },
          ]}
        />
      </Col>
      <Col span={24}>
        <div className="title-page-font">{`Product Category`}</div>
      </Col>

      <Col span={24}>
        <div className="grid grid-cols-1 ">
          <Card>
            <Tabs
              destroyInactiveTabPane={true}
              items={[
                {
                  key: "category",
                  label: "Category",
                  children: (
                    <CategoryTable
                      categories={categories}
                      fetchDataCategory={fetchDataCategory}
                    />
                  ),
                },
                { key: "type", label: "Type", children: <TypeTable /> },
              ]}
            />
          </Card>
        </div>
      </Col>
    </Row>
  );
}
