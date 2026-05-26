import type { ITMasterTypeEvents } from "@/app/common/master-type-events";
import { Button, Form, Input, Modal, type FormInstance } from "antd";
import React from "react";

export interface props {
  handleModal: { open: boolean; type: "create" | "edit" | "delete" | "close"; data: any };
  handleModalOpen: (status: boolean, type: "create" | "edit" | "delete" | "close", data: ITMasterTypeEvents | null) => void;
  formmanage: FormInstance;
  onFinish: (type: "create" | "edit" | "delete" | "close", values: any) => void;
}

const ManageMasterTypeEvents: React.FC<props> = ({ handleModal, handleModalOpen, formmanage, onFinish }): React.ReactElement => {
  return (
    <div>
      <Modal
        title={handleModal.type}
        open={handleModal.open}
        closable={{ "aria-label": "Custom Close Button" }}
        onCancel={() => handleModalOpen(false, "close", null)}
        footer={null}
        width={800}
        style={{ top: 10 }}
      >
        <Form<ITMasterTypeEvents> form={formmanage} layout="vertical" autoComplete="off" onFinish={(e) => onFinish(handleModal.type, e)}>
          <Form.Item<ITMasterTypeEvents> name={"name"} label={`ชื่อประเภทการจัด`}>
            <Input />
          </Form.Item>
          <Form.Item name={`remark`} label={`รายละเอียด`}>
            <Input.TextArea showCount maxLength={250} />
          </Form.Item>
          <Button htmlType="submit" type="primary">{`ยืนยัน`}</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageMasterTypeEvents;
