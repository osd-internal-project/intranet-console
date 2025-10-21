import React from "react";
import { Card, DatePicker, Form, Input, Modal, Select, Upload, Image, Row, Col, Tabs, Space, Button } from "antd";
import { FormInstance } from "antd/lib";
import type { GetProp, TabsProps, UploadFile, UploadProps } from "antd";
// import { PlusOutlined, StarOutlined } from "@ant-design/icons";
import FormManageBasicInformation from "./From/form-manage-basic-infomation";
import FormManagePersonalInformation from "./From/form-manage-personal-infomation";
import FormManageEmergencyContact from "./From/form-manage-emergency-contact";
import FormMangeEducationInformation from "./From/form-manage-education-information";
import FormManageExperienceInformation from "./From/form-manage-experience-information";
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export interface props {
  openModal: boolean;
  form: FormInstance;
  typeManageUser: string;
  handleClose: () => void;
  setPreviewOpen: (value: boolean) => void;
  setPreviewImage: (value: string) => void;
  setFileList: (value: any[]) => void;
  previewOpen: boolean;
  previewImage: string;
  fileList: UploadFile[];
  onFinish: (values: any, type: string) => void;
  masterPosition: { key: number; value: number; label: string }[];
  masterDepartments: { key: number; value: number; label: string }[];
}

const EmployeeProfileManageUser: React.FC<props> = ({
  openModal,
  form,
  typeManageUser,
  handleClose,
  setPreviewOpen,
  setPreviewImage,
  setFileList,
  previewOpen,
  previewImage,
  fileList,
  onFinish,
  masterPosition,
  masterDepartments,
}): React.ReactElement => {
  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => setFileList(newFileList);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Basic Information",
      children: (
        <FormManageBasicInformation
          fileList={fileList}
          handlePreview={handlePreview}
          handleChange={handleChange}
          masterPosition={masterPosition}
          masterDepartments={masterDepartments}
        />
      ),
    },
    {
      key: "2",
      label: "Personal Information",
      children: <FormManagePersonalInformation />,
    },
    {
      key: "3",
      label: "Emergency Contact",
      children: <FormManageEmergencyContact />,
    },
    {
      key: "4",
      label: "Education Information",
      children: <FormMangeEducationInformation />,
    },
    {
      key: "5",
      label: "Experience Informations",
      children: <FormManageExperienceInformation />,
    },
  ];

  return (
    <div>
      <Modal open={openModal} onCancel={handleClose} title={`${typeManageUser} Employee Profile`} footer={false} width={800}>
        <Form
          onFinish={(e) => onFinish(e, typeManageUser)}
          name="manage-user"
          form={form}
          layout="vertical"
          autoComplete="off"
          initialValues={{ personalInformation: [{}], emergencyContact: [{}], educationInformation: [{}], experienceInformations: [{}] }}>
          <Tabs defaultActiveKey="1" items={items} />
          <div>
            <Space>
              <Button>{`ยกเลิก`}</Button>
              <Button htmlType="submit" type="primary">{`ยืนยัน`}</Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default EmployeeProfileManageUser;
