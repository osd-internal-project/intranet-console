import { Card, Col, Row, Table, Typography } from "antd";
import React from "react";

export interface props {
  mostOrder: any[];
}

export const MostOrderOfProducts: React.FC<props> = ({ mostOrder }): React.ReactElement => {
  console.log(mostOrder);

  const columns = [
    { key: "id", title: "CASS NO.", dataIndex: "cassno" },
    { key: "id", title: "PRODUCT NAME", dataIndex: "prductname" },
    { key: "id", title: "TOTAL ORDERS", dataIndex: "count_order" },
  ];
  return (
    <div>
      <Card style={{ width: "100%" }}>
        <Row gutter={[8, 8]} style={{ justifyContent: "space-between", display: "flex", alignItems: "center" }}>
          <Col>
            <Typography style={{ marginBottom: "20px", fontSize: "20px", fontWeight: "bold" }}>{`อันดับสินค้าที่ถูกเบิกจ่ายมากที่สุด 5 อันดับ`}</Typography>
          </Col>
        </Row>
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <Table size="small" columns={columns} dataSource={mostOrder} rowKey={(e: any) => e.id} pagination={false} />
          </Col>
        </Row>
      </Card>
    </div>
  );
};
