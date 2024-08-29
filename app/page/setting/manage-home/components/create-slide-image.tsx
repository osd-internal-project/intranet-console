"use client";
import React, { useState } from "react";
import { FilterOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Carousel,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Popover,
  Row,
  Switch,
  Upload,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { SlideImageType } from "../common";
import { RcFile } from "antd/es/upload";

export interface props {
  addFile: any[];
  handleChangeAddFile: (e: any) => void;
  beforeUploadAddFiles: (e: RcFile) => void;
  submitLoading: boolean;
  onfinishCreateSlide: (values: SlideImageType) => void;
  modalAddSlide: boolean;
  setModalAddSlide: (value: boolean) => void;
  createSlideImageForm: any;
}

export const CreateSlideImage: React.FC<props> = ({
  addFile,
  handleChangeAddFile,
  beforeUploadAddFiles,
  submitLoading,
  onfinishCreateSlide,
  modalAddSlide,
  setModalAddSlide,
  createSlideImageForm,
}): React.ReactElement => {
  return (
    <>
      <div style={{ textAlign: "right" }}>
        <Button
          style={{
            marginBottom: "20px",
          }}
          type="primary"
          onClick={() => setModalAddSlide(true)}
        >{`Add Slide`}</Button>
      </div>
      <Modal
        title="Add Slide"
        open={modalAddSlide}
        onCancel={() => setModalAddSlide(false)}
        width={400}
        footer={false}
      >
        {" "}
        <div className=" col-span-3 md:col-span-1 ml-5">
          <Form
            form={createSlideImageForm}
            name="create"
            onFinish={onfinishCreateSlide}
            autoComplete="off"
          >
            <Form.Item
              label={`แนบไฟล์ :`}
              name={"addFile"}
              rules={[{ required: true, message: "กรุณาแนบไฟล์" }]}
            >
              <Upload
                fileList={addFile}
                onChange={handleChangeAddFile}
                beforeUpload={beforeUploadAddFiles}
                multiple={false}
                maxCount={1}
                accept=".jpg,.jpeg,.png,.gif"
              >
                <Button icon={<UploadOutlined />}>{`Click to Upload`}</Button>
              </Upload>
            </Form.Item>
            <Form.Item name={"addSlide"}>
              <div style={{ textAlign: "right" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitLoading}
                >
                  ตกลง
                </Button>
                {/* <Button htmlType="submit" type="primary">{`Add`}</Button> */}
              </div>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};
