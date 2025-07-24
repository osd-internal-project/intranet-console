"use client";
import React from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, message, Modal, Upload } from "antd";
import { SlideImageType } from "../common";
import { RcFile, UploadProps } from "antd/es/upload";

export interface props {
  submitLoading: boolean;
  onfinishCreateSlide: (values: SlideImageType) => void;
  modalAddSlide: boolean;
  setModalAddSlide: (value: boolean) => void;
  createSlideImageForm: any;
  showModal: any;
  setImageFiles: any;
  imageFiles: any;
  slideImage: any;
  beforeUploadAddFiles: (file: RcFile) => void;
}

export const CreateSlideImage: React.FC<props> = ({
  submitLoading,
  onfinishCreateSlide,
  modalAddSlide,
  setModalAddSlide,
  createSlideImageForm,
  showModal,
  setImageFiles,
  imageFiles,
  slideImage,
  beforeUploadAddFiles,
}): React.ReactElement => {
  const handleChangeImageFiles: UploadProps["onChange"] = async ({ fileList: newFileList }) => {
    return setImageFiles(newFileList);
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <Button
          style={{ marginBottom: "20px" }}
          type="primary"
          onClick={() => {
            showModal();
            setImageFiles([]);
          }}>
          {`Add Slide`}
        </Button>
      </div>

      <Modal title="Add Slide" open={modalAddSlide} onCancel={() => setModalAddSlide(false)} width={400} footer={false}>
        <div className=" col-span-3 md:col-span-1 ml-5">
          <p>หมายเหตุ: อัปโหลดรูปภาพได้ครั้งละ 1 รูปเท่านั้น</p>
          <Form form={createSlideImageForm} name="create" onFinish={onfinishCreateSlide} autoComplete="off">
            <Form.Item label={`แนบไฟล์ :`} name={"addFile"} rules={[{ required: true, message: "กรุณาแนบไฟล์" }]}>
              <Upload
                accept="image/png,image/jpeg"
                beforeUpload={beforeUploadAddFiles}
                onChange={handleChangeImageFiles}
                fileList={imageFiles}
                multiple={false}
                maxCount={1}
                listType="picture">
                <Button icon={<UploadOutlined />}>Click to upload</Button>
              </Upload>
            </Form.Item>
            <Form.Item name={"addFile"}>
              <div style={{ textAlign: "right" }}>
                <Button type="primary" htmlType="submit" loading={submitLoading}>
                  ตกลง
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};
