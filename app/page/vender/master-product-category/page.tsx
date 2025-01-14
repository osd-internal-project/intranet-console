"use client";
import { Breadcrumb, Card, Col, Divider, message, Row, Spin, Tabs } from "antd";
import Link from "next/link";

import { useEffect, useState } from "react";
import { CategoryTable } from "./components/category-table";
import { TypeTable } from "./components/type-table";
import {
  ITMasterProductCategory,
  ITMasterProductCategoryForm,
} from "@/app/common/master-product-category";
import { useForm } from "antd/es/form/Form";
import { useAxiosVender } from "@/app/lib/axios/hooks/userAxiosAuth";
import MasterProductCategoryServices from "@/app/services/master-product-category.service";
import { ITActionStatus } from "@/app/common";

export default function MasterProductCategory() {
  const venderAuth = useAxiosVender();
  const masterProductCategoryServices =
    MasterProductCategoryServices(venderAuth);
  const [categoryForm] = useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<ITMasterProductCategory[]>([]);
  const [openModalCategory, setOpenModalCategory] =
    useState<ITActionStatus>(undefined);
  const fetchDataCategory = async (search: any) => {
    setLoading(true);
    const datas = await masterProductCategoryServices.findMany(search);
    const dataTables = datas.map((data, index) => ({ no: index + 1, ...data }));
    setCategories(dataTables);
    setLoading(false);
  };

  async function onSubmitCategory(
    value: ITMasterProductCategoryForm | ITMasterProductCategory
  ): Promise<void> {
    setLoading(true);
    if (openModalCategory === "create") {
      const form = { ...value } as ITMasterProductCategoryForm;
      await masterProductCategoryServices
        .create(form)
        .then((data) => {
          message.success("สำเร็จ");
          setOpenModalCategory(undefined);
          categoryForm.resetFields();
          fetchDataCategory({});
        })
        .catch((err) => message.error("ผิดพลาด"));
    } else if (openModalCategory === "update") {
      const form = { ...value } as ITMasterProductCategory;
      const id = form.id;
      const data = form as ITMasterProductCategoryForm;
      await masterProductCategoryServices
        .update(id, data)
        .then((data) => {
          message.success("สำเร็จ");
          setOpenModalCategory(undefined);
          categoryForm.resetFields();
          fetchDataCategory({});
        })
        .catch((err) => message.error("ผิดพลาด"));
    }

    setLoading(false);
  }

  return (
    <Spin spinning={loading}>
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
                        categoryForm={categoryForm}
                        onSubmitCategory={onSubmitCategory}
                        openModalCategory={openModalCategory}
                        setOpenModalCategory={setOpenModalCategory}
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
    </Spin>
  );
}
