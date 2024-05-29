"use client";
import { Row, Col, Breadcrumb } from "antd";
import AddMasterProduct from "../components/AddmasterProduct";
export default function AddMasterProducts() {
  return (
    <Row>
      <Col span={24}>
        <Breadcrumb
          items={[
            {
              href: "/page",
              title: <span>Home</span>,
            },
            {
              href: "/page/setting",
              title: <span>Setting</span>,
            },
            {
              href: "/page/setting/master-product-management",
              title: <span>Master Product Management</span>,
            },
            {
              title: <span>Add Master Product</span>,
            },
          ]}
        />
      </Col>
      <Col span={24}>
        <div className="title-page-font">{`ADD MASTER PRODUCT`}</div>
      </Col>
      <Col span={24}>
        <AddMasterProduct />
      </Col>
    </Row>
  );
}
