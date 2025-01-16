import { ITUserModule } from "@/app/common/user-module";
import {
  Button,
  Card,
  Form,
  SelectProps,
  Switch,
  Table,
  TableProps,
  Tag,
  TreeSelect,
  TreeSelectProps,
} from "antd";
import { FormInstance } from "antd/lib";

interface Props {
  userModuleSelected: string;
  groupOption: TreeSelectProps["treeData"];
  onSelectGroups: (value: string) => void;
  form: FormInstance;
  onSubmitPermission: (vale: {
    groupId: string;
    permissionGroupId: string[];
  }) => void;
}
export const PermissionConfig: React.FC<Props> = ({
  userModuleSelected,
  groupOption,
  onSelectGroups,
  form,
  onSubmitPermission,
}) => {
  return (
    <>
      <Card>
        <Form layout="vertical" form={form} onFinish={onSubmitPermission}>
          <Form.Item name={"groupId"} label={"Group"}>
            <TreeSelect
              allowClear
              showSearch={false}
              style={{ width: "100%" }}
              treeDefaultExpandAll
              placeholder="Please select"
              treeData={groupOption}
              onChange={onSelectGroups}
            />
          </Form.Item>
          <Form.Item name={"permissionGroupId"} label={"Permission Group"}>
            <TreeSelect
              multiple
              allowClear
              showSearch={false}
              style={{ width: "100%" }}
              treeDefaultExpandAll
              placeholder="Please select"
              treeData={groupOption}
            />
          </Form.Item>
          <div>
            <Button htmlType="submit" type="primary">
              {"Submit"}
            </Button>
          </div>
        </Form>
      </Card>
    </>
  );
};
