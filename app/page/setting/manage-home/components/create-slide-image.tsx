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
}

export const CreateSlideImage: React.FC<props> = ({
  addFile,
  handleChangeAddFile,
  beforeUploadAddFiles,
  submitLoading,
}): React.ReactElement => {
  const [modalAddSlide, setModalAddSlide] = useState<boolean>(false);

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
            // form={form}
            layout="vertical"
            name="create"
            // onFinish={createBooking}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item label={`แนบไฟล์ :`} name={"addFile"}>
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
              </div>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};
