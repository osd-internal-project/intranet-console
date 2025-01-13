"use client";
import { useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
import {
  Row,
  Col,
  Breadcrumb,
  Input,
  Divider,
  Card,
  Form,
  ConfigProvider,
} from "antd";
import { useEffect, useState } from "react";

import { useParams, useSearchParams } from "next/navigation";
import UserPermissionTypeServices from "@/app/services/user-permission-type.service";
import UserGroupServices from "@/app/services/usergroup.service";
import { useForm } from "antd/es/form/Form";
import { ITUserPermissionType } from "@/app/common/user-permission-type";
import { PemissionCongigComponent } from "./components/permission-config";
export default function AddOrder() {
  const params = useParams();
  const groupid = params.groupid as string;
  const searchParams = useSearchParams();
  const userAuth = useAxiosUser();
  const userGroupServices = UserGroupServices(userAuth);
  const userPermissionTypeServices = UserPermissionTypeServices(userAuth);
  const [detailForm] = useForm<ITUserGroup>();
  const [permissionForm] = useForm<ITUserGroupMapPermissionType>();
  const [loading, setLoading] = useState<boolean>(true);
  const [userPermissionTypes, setUserPermissionTypes] = useState<
    ITUserPermissionType[]
  >([]);
  useEffect(() => {
    if (loading === true) fetchData();
  }, [loading]);
  const fetchData = async () => {
    const resUserPermissionTypes = await userPermissionTypeServices.findMany(
      {}
    );
    setUserPermissionTypes(resUserPermissionTypes);
    const userGroup = await userGroupServices.getUserGroupByGroupId(groupid);
    detailForm.setFieldsValue(userGroup);
    if (userGroup.userGroupId) {
      const userPermissionMaps =
        await userGroupServices.getUserGroupMapPermission({
          userGroupId: userGroup.userGroupId,
        });
    }
  };
  const propData = (e: { loading: boolean }) => {
    setLoading(e.loading);
  };

  async function onChangePermissionTab(activeKey: string): Promise<void> {
    permissionForm.resetFields();
    const userPermissionMaps =
      await userGroupServices.getUserGroupMapPermission({
        userGroupId: groupid,
        type: activeKey,
      });
    if (userPermissionMaps) {
      permissionForm.setFieldsValue(userPermissionMaps);
    }
  }

  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Breadcrumb
          items={[
            {
              href: "/page",
              title: <span>หน้าหลัก</span>,
            },
            {
              href: "/page/user-group",
              title: <span>User Group</span>,
            },
            {
              title: <span>`${groupid}`</span>,
            },
          ]}
        />
      </Col>

      <Divider orientation="left" orientationMargin="0">
        <div className="title-page-font">{`User Group Detail`}</div>
      </Divider>

      <Col span={24}>
        <Card>
          <ConfigProvider
            theme={{
              components: {
                Input: {
                  colorTextDisabled: "#111",
                  colorBgContainerDisabled: "#fff",
                },
              },
            }}
          >
            <Form layout="vertical" form={detailForm} disabled>
              <Form.Item<ITUserGroup> name="groupId" label="Group ID">
                <Input />
              </Form.Item>
              <Form.Item<ITUserGroup> name="groupName" label="Group Name">
                <Input />
              </Form.Item>
              <Form.Item<ITUserGroup> name="description" label="Description">
                <Input />
              </Form.Item>
            </Form>
          </ConfigProvider>
        </Card>
        <PemissionCongigComponent
          userPermissionTypes={userPermissionTypes}
          permissionForm={permissionForm}
          onChangePermissionTab={onChangePermissionTab}
        />
      </Col>
    </Row>
  );
}
