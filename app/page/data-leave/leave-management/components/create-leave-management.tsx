import { Button, Col, Form, Input, Modal, Row, Select } from "antd";
import React from "react";
import { ISelect } from "../../common";

export interface props {
  onFinishCreate: (event: any) => void;
  TypeId: number;
  getdataUser: ISelect[];
  setOpenModal: (event: boolean) => void;
  openModal: boolean;
  formcreate: any;
}

export const CreateLeaveManagement: React.FC<props> = ({
  onFinishCreate,
  TypeId,
  getdataUser,
  setOpenModal,
  openModal,
  formcreate,
}): React.ReactElement => {
  return (
    <div>
      <Modal
        title="Add"
        open={openModal}
        onOk={() => setOpenModal(false)}
        onCancel={() => setOpenModal(false)}
        footer={false}
      >
        <Form
          layout="vertical"
          form={formcreate}
          autoComplete="off"
          onFinish={onFinishCreate}
        >
          <Row gutter={[8, 8]}>
            <Col span={24}>
              <Form.Item name="masterTypeleaveId" hidden>
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="รายชื่อพนักงาน :"
                name="userId"
                rules={[
                  {
                    required: true,
                    message: "กรุณาเลือกชื่อพนักงาน",
                  },
                ]}
              >
                <Select
                  options={getdataUser}
                  placeholder={`Please Select`}
                  showSearch
                  optionFilterProp="label"
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <div className=" flex justify-end space-x-4">
              <Button onClick={() => setOpenModal(false)}>{`Cancel`}</Button>
              <Button type="primary" htmlType="submit">
                {`Add`}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      <div className="flex justify-end">
        <Button
          type="primary"
          onClick={() => {
            formcreate.resetFields();
            setOpenModal(true);
            formcreate.setFieldsValue({ masterTypeleaveId: TypeId });
          }}
        >{`Add User Disabled`}</Button>
      </div>
    </div>
  );
};
