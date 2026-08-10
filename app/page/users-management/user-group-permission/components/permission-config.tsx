import { Button, Divider, Form, TreeSelect, TreeSelectProps } from "antd";
import { FormInstance } from "antd/lib";
import { PermissionGroupTree } from "./permission-group-tree";

interface Props {
  readonly userModuleSelected: string;
  readonly groupOption: TreeSelectProps["treeData"];
  readonly onSelectGroups: (value: string) => void;
  readonly form: FormInstance;
  readonly onSubmitPermission: (value: {
    groupId: string;
    permissionGroupId: string[];
  }) => void;
}

/**
 * ฟอร์มกำหนดกลุ่มสิทธิ์ให้กับกลุ่มผู้ใช้งาน ภายใต้ module ที่เลือกอยู่
 * @param props ตัวเลือกกลุ่ม, form instance และ callback สำหรับเลือก/บันทึก
 * @returns element ฟอร์มกำหนดสิทธิ์
 */
export const PermissionConfig: React.FC<Props> = ({
  userModuleSelected,
  groupOption,
  onSelectGroups,
  form,
  onSubmitPermission,
}) => {
  return (
    <Form layout="vertical" form={form} onFinish={onSubmitPermission}>
      <Form.Item
        name={"groupId"}
        label={"กลุ่มผู้ใช้งาน"}
        rules={[{ required: true, message: "กรุณาเลือกกลุ่มผู้ใช้งาน" }]}
      >
        <TreeSelect
          allowClear
          showSearch
          // value ของ node เป็น groupId (UUID) จึงต้องให้ค้นหาจาก title แทน
          treeNodeFilterProp="title"
          style={{ width: "100%" }}
          dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
          treeDefaultExpandAll
          placeholder="ค้นหาหรือเลือกกลุ่ม"
          treeData={groupOption}
          onChange={onSelectGroups}
        />
      </Form.Item>

      <Divider className="!my-4" />

      <Form.Item
        name={"permissionGroupId"}
        label={"กลุ่มสิทธิ์การใช้งาน"}
        extra="การเลือกกลุ่มแม่ ไม่ได้หมายถึงการให้สิทธิ์ของกลุ่มลูกด้วย กรุณาเลือกทีละกลุ่มตามต้องการ"
      >
        <PermissionGroupTree treeData={groupOption} />
      </Form.Item>

      <Form.Item shouldUpdate noStyle>
        {({ getFieldValue }) => (
          <div className="flex justify-end">
            <Button
              htmlType="submit"
              type="primary"
              disabled={!getFieldValue("groupId")}
            >
              {"บันทึก"}
            </Button>
          </div>
        )}
      </Form.Item>
    </Form>
  );
};
