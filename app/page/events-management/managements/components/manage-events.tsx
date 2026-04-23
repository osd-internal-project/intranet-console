import { Modal, FormInstance, Form } from "antd";
import React from "react";

export interface props {
  handleModalOpen: (open: boolean, type: "create" | "edit" | "delete" | "close", data: any) => void;
  handleModal: { open: boolean; type: "create" | "edit" | "delete" | "close"; data: any };
  ManageForm: FormInstance;
  onfinish: (type: "create" | "edit" | "delete" | "close", values: any) => void;
}

const ManageEvents: React.FC<props> = ({ handleModalOpen, handleModal, ManageForm, onfinish }): React.ReactElement => {
  return (
    <div>
      <Modal
        title="จัดการกิจกรรม"
        closable={{ "aria-label": "Custom Close Button" }}
        open={handleModal.open}
        onCancel={() => handleModalOpen(false, "close", null)}
        footer={null}
        width={1500}
        style={{ top: 10 }}
      >
        <Form form={ManageForm} autoComplete="off" layout={"vertical"} onFinish={(e) => onfinish(handleModal.type, e)}></Form>
      </Modal>
    </div>
  );
};

export default ManageEvents;
