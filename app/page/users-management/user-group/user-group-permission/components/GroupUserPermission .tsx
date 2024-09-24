import React, { useState } from "react";
import type {
  BadgeProps,
  CalendarProps,
  SelectProps,
  TableColumnsType,
  TableColumnType,
} from "antd";
import {
  Badge,
  Button,
  Calendar,
  Card,
  Collapse,
  DatePicker,
  Form,
  Input,
  Modal,
  Popover,
  Select,
  Switch,
  Table,
  Tag,
  TreeSelect,
} from "antd";
import type { Dayjs } from "dayjs";
import { dateToStringThNoTime } from "@/app/utils/format";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { ITSelectUsers } from "../../components/GroupManage";
import { FormInstance } from "antd/lib";
const { RangePicker } = DatePicker;
export interface props {
  groupOption: SelectProps["options"];
  onChangeSaleGroupSelect: (group: string[]) => void;
  onChangeEngineerGroupSelect: (group: string[]) => void;
  saleUsersFormGroup: ITSelectUsers[];
  engineerUsersFormGroup: ITSelectUsers[];
  showModalPermission: boolean;
  onShowModalPermission: (status: boolean) => void;
  onSetPermission: (form: {
    exceptionalSatatus: boolean;
    saleUserGroupId: string[];
    saleUsersId: string[];
    engineerUserGroupId: string[];
    engineerUsersId: string[];
  }) => void;
  permissionform: FormInstance;
}

const GroupPermissionComponent: React.FC<props> = ({
  groupOption,
  onChangeSaleGroupSelect,
  onChangeEngineerGroupSelect,
  saleUsersFormGroup,
  engineerUsersFormGroup,
  showModalPermission,
  onShowModalPermission,
  onSetPermission,
  permissionform,
}): React.ReactElement => {
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  };
  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 20, offset: 4 },
    },
  };
  return (
    <Modal
      open={showModalPermission}
      title={"CRM Permission"}
      onCancel={() => onShowModalPermission(false)}
      footer={[]}
      // width={1000}
    >
      <Form form={permissionform} layout="vertical" onFinish={onSetPermission}>
        <Form.Item
          name={"exceptionalSatatus"}
          label={<b>Exceptional Status</b>}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item name={"saleUserGroupId"} label={<b>Sale Group</b>}>
          <TreeSelect
            multiple
            allowClear
            showSearch={false}
            style={{ width: "100%" }}
            treeDefaultExpandAll
            placeholder="Please select"
            treeData={groupOption}
            onChange={onChangeSaleGroupSelect}
          />
        </Form.Item>
        <Form.Item name={"saleUsersId"} label={<b>Sale</b>}>
          <Select
            allowClear
            mode="multiple"
            showSearch={true}
            options={saleUsersFormGroup.map((user) => ({
              label: `${user.firstNameTh} ${user.lastNameTh}`,
              value: user.userId,
            }))}
          />
        </Form.Item>
        <Form.Item name={"engineerUserGroupId"} label={<b>Engineer Group</b>}>
          <TreeSelect
            multiple
            allowClear
            showSearch={false}
            style={{ width: "100%" }}
            treeDefaultExpandAll
            placeholder="Please select"
            treeData={groupOption}
            onChange={onChangeEngineerGroupSelect}
          />
        </Form.Item>
        <Form.Item name={"engineerUsersId"} label={<b>Engineer</b>}>
          <Select
            allowClear
            mode="multiple"
            showSearch={true}
            options={engineerUsersFormGroup.map((user) => ({
              label: `${user.firstNameTh} ${user.lastNameTh}`,
              value: user.userId,
            }))}
          />
        </Form.Item>
        <Form.Item>
          <div className=" text-right space-x-4 mt-5">
            <Button onClick={() => onShowModalPermission(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default GroupPermissionComponent;
