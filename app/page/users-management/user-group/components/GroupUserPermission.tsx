import React, { useState } from "react";
// import type { SelectProps } from "antd";
import type { DataNode } from "antd/es/tree";
import { Button, Form, Modal, Select, TreeSelect } from "antd";

import { ITSelectUsers } from "./GroupManage";
import { FormInstance } from "antd/lib";
export interface props {
  groupOption: DataNode[];
  showModalUserPermission: boolean;
  setShowModalUserPermission: (e: boolean) => void;
  setUserPermission: (form: any) => void;
  userpermissionform: FormInstance;
}

const GroupUserPermission: React.FC<props> = ({
  groupOption,
  showModalUserPermission,
  setShowModalUserPermission,
  setUserPermission,
  userpermissionform,
}): React.ReactElement => {
  return (
    <Modal
      open={showModalUserPermission}
      title={"Approve Permission"}
      onCancel={() => setShowModalUserPermission(false)}
      footer={[]}
      width={800}
      maskClosable={false}>
      <Form form={userpermissionform} layout="vertical" onFinish={setUserPermission}>
        <Form.Item name={["leave", "headerGroupId"]} label={<b>Leave Group</b>}>
          <TreeSelect
            multiple
            allowClear
            showSearch={false}
            style={{ width: "100%" }}
            treeDefaultExpandAll
            placeholder="Please select"
            treeData={groupOption ? groupOption : []}
            // onChange={onChangeLeaveGroupSelect}
          />
        </Form.Item>

        {/* <Form.Item name={["leave", "headerUserId"]} label={<b>Leave User</b>}>
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
        </Form.Item> */}

        <Form.Item name={["expense", "headerGroupId"]} label={<b>Expense Group</b>}>
          <TreeSelect
            multiple
            allowClear
            showSearch={false}
            style={{ width: "100%" }}
            treeDefaultExpandAll
            placeholder="Please select"
            treeData={groupOption}
            // onChange={onChangeExpenseGroupSelect}
          />
        </Form.Item>

        {/* <Form.Item
          name={["expense", "haederUserId"]}
          label={<b>Expense User</b>}
        >
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
        </Form.Item> */}

        <Form.Item>
          <div className=" text-right space-x-4 mt-5">
            <Button onClick={() => setShowModalUserPermission(false)}>Cancel</Button>

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
