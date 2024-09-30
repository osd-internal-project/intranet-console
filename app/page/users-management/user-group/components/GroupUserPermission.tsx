import React, { useState } from "react";
import type { SelectProps } from "antd";
import { Button, Form, Modal, Select, TreeSelect } from "antd";

import { ITSelectUsers } from "./GroupManage";
import { FormInstance } from "antd/lib";
export interface props {
  groupOption: SelectProps["options"];
  expenseUsersFormGroup: ITSelectUsers[];
  leaveUsersFormGroup: ITSelectUsers[];
  showModalUserPermission: boolean;
  setShowModalUserPermission: (e: boolean) => void;
  setUserPermission: (form: {
    leaveGroupId: string[];
    leaveUserId: string[];
    expenseGroupId: string[];
    expenseUserId: string[];
  }) => void;
  userpermissionform: FormInstance;
  onChangeLeaveGroupSelect: (group: string[]) => void;
  onChangeExpenseGroupSelect: (group: string[]) => void;
}

const GroupUserPermission: React.FC<props> = ({
  groupOption,
  expenseUsersFormGroup,
  showModalUserPermission,
  setShowModalUserPermission,
  setUserPermission,
  userpermissionform,
  onChangeLeaveGroupSelect,
  leaveUsersFormGroup,
  onChangeExpenseGroupSelect,
}): React.ReactElement => {
  return (
    <Modal
      open={showModalUserPermission}
      title={"Approve Permission"}
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
            onChange={onChangeLeaveGroupSelect}
          />
        </Form.Item>

        <Form.Item name={"leaveUserId"} label={<b>Leave User</b>}>
          <Select
            allowClear
            mode="multiple"
            placeholder="Please select"
            showSearch={true}
            options={leaveUsersFormGroup.map((user) => ({
              label: `${user.firstNameTh} ${user.lastNameTh}`,
              value: user.userId,
            }))}
          />
        </Form.Item>

        <Form.Item name={"expenseGroupId"} label={<b>Expense Group</b>}>
          <TreeSelect
            multiple
            allowClear
            showSearch={false}
            style={{ width: "100%" }}
            treeDefaultExpandAll
            placeholder="Please select"
            treeData={groupOption}
            onChange={onChangeExpenseGroupSelect}
          />
        </Form.Item>

        <Form.Item name={"expenseUserId"} label={<b>Expense User</b>}>
          <Select
            allowClear
            mode="multiple"
            placeholder="Please select"
            showSearch={true}
            options={expenseUsersFormGroup.map((user) => ({
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
