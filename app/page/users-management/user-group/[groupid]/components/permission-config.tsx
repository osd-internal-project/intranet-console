import { ITUserPermissionType } from "@/app/common/user-permission-type";
import { Card, Button, Skeleton, Tabs, Form, Select, Input } from "antd";
import { FormInstance } from "antd/lib";
interface props {
  userPermissionTypes: ITUserPermissionType[];
  permissionForm: FormInstance<ITUserGroupMapPermissionType>;
  onChangePermissionTab: (activeKey: string) => void;
}
export const PemissionCongigComponent: React.FC<props> = ({
  userPermissionTypes,
  permissionForm,
  onChangePermissionTab,
}) => {
  return (
    <Card>
      <div className=" text-xl text-default">Permission</div>
      <Tabs
        onChange={onChangePermissionTab}
        items={userPermissionTypes.map((permissionType) => ({
          key: String(permissionType.code),
          label: permissionType.name,
          children: (
            <div>
              <div className=" mb-2">{permissionType.name}</div>
              <Form form={permissionForm} layout="vertical">
                <Form.Item name={"permissionGroupId"} label={"User Group"}>
                  <Select />
                </Form.Item>
                <Form.Item name={"permissionUserId"} label={"User"}>
                  <Select />
                </Form.Item>
              </Form>
            </div>
          ),
        }))}
      />
    </Card>
  );
};
