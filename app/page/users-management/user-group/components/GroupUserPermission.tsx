import React, { useState } from "react";
import type { SelectProps } from "antd";
import { Button, Form, Modal, Select, TreeSelect } from "antd";

import { ITSelectUsers } from "./GroupManage";
import { FormInstance } from "antd/lib";
export interface props {
  groupOption: SelectProps["options"];
  onChangeEngineerGroupSelect: (group: string[]) => void;
  engineerUsersFormGroup: ITSelectUsers[];
  showModalUserPermission: boolean;
  setShowModalUserPermission: (e: boolean) => void;
  setUserPermission: (form: {
    leaveGroupId: string[];
    leaveUserId: string[];
    expanseGroupId: string[];
    expanseUserId: string[];
  }) => void;
  userpermissionform: FormInstance;
}

const GroupUserPermission: React.FC<props> = ({
  groupOption,
  onChangeEngineerGroupSelect,
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
        <Form.Item name={"expanseGroupId"} label={<b>Expanse Group</b>}>
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

        <Form.Item name={"expanseUserId"} label={<b>Expanse User</b>}>
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
