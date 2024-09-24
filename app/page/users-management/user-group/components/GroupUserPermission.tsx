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
  Col,
  Collapse,
  DatePicker,
  Form,
  Input,
  Modal,
  Popover,
  Row,
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
import { ITSelectUsers } from "./GroupManage";
import { FormInstance } from "antd/lib";
const { RangePicker } = DatePicker;
export interface props {
  groupOption: SelectProps["options"];
  onChangeSaleGroupSelect: (group: string[]) => void;
  onChangeEngineerGroupSelect: (group: string[]) => void;
  // saleUsersFormGroup: ITSelectUsers[];
  engineerUsersFormGroup: ITSelectUsers[];
  showModalUserPermission: boolean;
  setShowModalUserPermission: (e: boolean) => void;
  // onShowModalPermission: (status: boolean) => void;
  setUserPermission: (form: {
    leaveGroupId: string[];
    leaveUserId: string[];

  }) => void;
  userpermissionform: FormInstance;
}

const GroupUserPermission: React.FC<props> = ({
  groupOption,
  onChangeSaleGroupSelect,
  onChangeEngineerGroupSelect,
  // saleUsersFormGroup,
  engineerUsersFormGroup,
  showModalUserPermission,
  setShowModalUserPermission,
  setUserPermission,
  userpermissionform,
}): React.ReactElement => {
  return (
    <Modal
      open={showModalUserPermission}
      title={"Permission"}
      onCancel={() => setShowModalUserPermission(false)}
      footer={[]}
      width={800}
    >
      <Form
        form={userpermissionform}
        layout="vertical"
        onFinish={setUserPermission}
      >
        <Form.Item name={"leaveGroupId"} label={<b>Leave Group</b>}>
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

        <Form.Item name={"leaveUserId"} label={<b>Leave User</b>}>
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
            <Button onClick={() => setShowModalUserPermission(false)}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default GroupUserPermission;
