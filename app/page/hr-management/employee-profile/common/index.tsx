import { IconUserActive, IconUserPause, IconUserPlus, IconUsers } from "@/components/icon";
import { Avatar, Col, Row, Tag, Typography } from "antd";

export const cardTableHrDashboard = (type: string, count: number) => {
  return (
    <Row gutter={[8, 8]}>
      <Col span={8} className="flex justify-center items-center">
        <Avatar
          icon={type === "total" ? IconUsers : type === "active" ? IconUserActive : type === "inactive" ? IconUserPause : IconUserPlus}
          style={{ backgroundColor: type === "total" ? "#212529" : type === "active" ? "#03C95A" : type === "inactive" ? "#E70D0D" : "#1B84FF" }}
          size={64}
        />
      </Col>
      <Col span={10}>
        <div>
          <Typography className="text-gray-600 font-bold">
            {type === "total" ? "Total Employee" : type === "active" ? "Active" : type === "inactive" ? "InActive" : "New Joiners"}
          </Typography>
        </div>
        <div className="text-2xl">{count}</div>
      </Col>
      <Col span={6} className="flex justify-center items-center">
        <Tag>???</Tag>
      </Col>
    </Row>
  );
};
