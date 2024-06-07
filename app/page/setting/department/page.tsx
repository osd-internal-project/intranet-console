"use client";
import { Breadcrumb, Card, Col, Row } from "antd";

export default function Page() {
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
                title: <span>Department</span>,
              },
            ]}
          />
        </Col>
      </Row>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <div className="title-page-font">Department</div>
        </Col>
      </Row>
      <br />
      <div className=" grid grid-cols-3 gap-4">
        <Card>
        </Card>
      </div>
    </>
  );
}
