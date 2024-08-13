"use client";
import ReactDOM from "react-dom";
import React, { useState, useEffect } from "react";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { RcFile } from "antd/es/upload";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import {
  Button,
  Row,
  Col,
  Modal,
  Input,
  Card,
  Pagination,
  Tabs,
  TabsProps,
  Table,
  TableProps,
  message,
  Form,
  Space,
  Upload,
} from "antd";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManagehandbookFileServices } from "../service/handbook.service";
import { useForm } from "antd/es/form/Form";
export interface handbookFile {
  id: Number;
  fileName: String;
  fileLocation: String;
  createdAt: String;
  updatedAt: String;
  status: boolean;
}

const Managehandbook: React.FC = () => {
  const intraAuth = useAxiosIntranet();
  const [handbookFile, sethandbookFile] = useState<handbookFile[]>([]);
  const managehandbookFileServices = ManagehandbookFileServices(intraAuth);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [form] = useForm();
  const [showmodalupload, setshowmodalupload] = useState(false);
  const [attendFiles, setAttendFiles] = useState<UploadFile[]>([]);

  useEffect(() => {
    fetchDataHandbook();
  }, []);

  const fetchDataHandbook = async () => {
    try {
      const maresponse =
        await managehandbookFileServices.gethandbookFileQuery();
      const handbookFile: handbookFile[] = maresponse.map(
        (item: any, index: number) => ({
          ...item,
          key: index.toString(),
        })
      );
      sethandbookFile(handbookFile);
      setSubmitLoading(false);
    } catch (error) {
      message.error("Failed to fetch car data");
    }
  };

  const handleChangeAttendFiles: UploadProps["onChange"] = async ({
    fileList: newFileList,
  }) => {
    console.log(newFileList[0]);
    return setAttendFiles(newFileList);
  };
  const beforeUploadAttendFiles = (file: RcFile) => {
    if (attendFiles.find((oneFile) => oneFile.name === file.name)) {
      message.warning(`ชื่อไฟล์ ${file.name} ซ้ำ`);
      return false;
    }
    return false;
  };

  const closecreate = () => {
    setshowmodalupload(false);
  };
  const opencreate = () => {
    setshowmodalupload(true);
  };
  const columns: TableProps<handbookFile>["columns"] = [
    {
      title: "ไอดี",
      dataIndex: "id",
      key: "id",
      align: "center",
      width: "20px",
    },
    {
      title: "ชื่อไฟล์",
      dataIndex: "fileName",
      key: "fileName",
      width: "180px",
    },
    {
      title: "ที่อยู่ข้อมูล",
      dataIndex: "fileLocation",
      key: "fileLocation",
      width: "140px",
    },
    {
      title: "นำเข้าเวลา",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "200px",
    },
    {
      title: "การดาวโหลด",
      dataIndex: "status",
      key: "status",
      width: "200px",
    },
  ];
  return (
    <div>
      <Button
        type="primary"
        onClick={opencreate}
      >
        การอัพโหลดไฟล์
      </Button>
      <Modal
        title="แก้ไขข้อมูลตรวจสภาพรถ"
        open={showmodalupload}
        onCancel={closecreate}
        footer={null}
        destroyOnClose
      >
        <Form>
          <Form.Item>
          <Upload
                // {...props}
                // onPreview={onPreview}
                fileList={attendFiles}
                onChange={handleChangeAttendFiles}
                beforeUpload={beforeUploadAttendFiles}
                multiple={true}
                maxCount={3}
                accept=".pdf"
              >
                <Button icon={<UploadOutlined />}>Select File</Button>
              </Upload>
          </Form.Item>
          <Form.Item>
            <Space style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={closecreate}>ยกเลิก</Button>
              <Button type="primary" htmlType="submit" loading={submitLoading}>
                บันทึก
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      <Table
        dataSource={handbookFile}
        columns={columns}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};
document.addEventListener("DOMContentLoaded", function () {
  ReactDOM.render(<Managehandbook />, document.getElementById("root"));
});
export default Managehandbook;
