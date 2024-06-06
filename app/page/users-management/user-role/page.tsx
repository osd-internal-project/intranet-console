import { Breadcrumb, Card, Col, Row, Table, Tabs } from "antd";
import RoleComponent from "./components/RoleComponent";
import GroupOfRulesComponent from "./components/GroupOfRulesComponent";
export default function RolePage() {
  return (
    <>
      {/* <div className="grid grid-cols-1 ">
          <h3 className=" text-2xl  font-semibold ">
            User Role
          </h3>
        </div> */}
      <Row gutter={[8, 8]}>
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
                title: <span>User Role </span>,
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <div className="title-page-font">{`USER ROLE`}</div>
        </Col>
        <Col span={24}>
          <div className="grid grid-cols-1 md:grid-cols-1">
            <div>
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
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}
