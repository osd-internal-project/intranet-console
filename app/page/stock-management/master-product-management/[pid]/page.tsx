"use client";
import { Row, Col, Breadcrumb } from "antd";
import EditMasterProduct from "../components/EditmasterProduct";
import { useParams } from "next/navigation";
export default function EditMasterProducts() {
  const params = useParams();
  const pid = params.pid as string;
  return (
    <Row>
      <Col span={24}>
        <Breadcrumb
          items={[
            {
              href: "/page",
              title: <span>หน้าหลัก</span>,
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
              title: <span>Edit Master Product</span>,
            },
          ]}
        />
      </Col>
      <Col span={24}>
        <div className="title-page-font">{`EDIT MASTER PRODUCT`}</div>
      </Col>
      <Col span={24}>
        <EditMasterProduct pid={pid} />
      </Col>
    </Row>
  );
}
