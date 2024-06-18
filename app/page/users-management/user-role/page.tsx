import { Breadcrumb, Card, Col, Divider, Row, Table, Tabs } from "antd";
import RoleComponent from "./components/RoleComponent";
import GroupOfRulesComponent from "./components/GroupOfRulesComponent";
export default function RolePage() {
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
                title: <span>Users Management</span>,
              },
              {
                title: <span>Roles</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font">{`Roles`}</div>
        </Divider>
        <Col span={24}>
          <div className="grid grid-cols-1 md:grid-cols-1">
            <Card>
              <Tabs
                defaultActiveKey="1"
                destroyInactiveTabPane={true}
                items={[
                  {
                    label: "Role",
                    key: "1",
                    children: <RoleComponent />,
                  },
                  {
                    label: "Group of Rules",
                    key: "2",
                    children: <GroupOfRulesComponent />,
                  },
                ]}
              />
            </Card>
          </div>
        </Col>
      </Row>
    </>
  );
}
