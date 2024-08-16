"use client";
import ReactDOM from "react-dom";
import React, { useState, useEffect } from "react";
import type { FormProps } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { RcFile } from "antd/es/upload";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import { useSession } from "next-auth/react";
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
  Switch,
} from "antd";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManagehandbookFileServices } from "../service/handbook.service";
import { useForm } from "antd/es/form/Form";
import { Anybody } from "next/font/google";
export interface handbookFile {
  handbookid: number;
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
  const [formupload] = useForm();
  const [showmodalupload, setshowmodalupload] = useState(false);
  const [attendFiles, setAttendFiles] = useState<UploadFile[]>([]);
  const { data: session } = useSession();

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
  const handbookfileCreate: FormProps<handbookFile>["onFinish"] = async (
    values
  ) => {
    console.log(attendFiles);
    setSubmitLoading(true);
    const handbookCreateData = {
      data: {
        fileName: values?.fileName,
        fileLocation: values?.fileLocation,
        author: session?.user.username,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: values.status,
      },
    };
    console.log(values.handbookid);
    console.log(session?.user.username);

    try {
      const response = await managehandbookFileServices.createhandbookFile(
        handbookCreateData
      );
      if (response && attendFiles.length > 0) {
        await Promise.all(
          attendFiles.map(async (file) => {
            console.log(`${response.handbookid}`);
            const formData = new FormData();
            formData.append("file", file.originFileObj as RcFile);
            await managehandbookFileServices.uploadFiles(response.handbookid, formData);
          })
        );
      }
      if (response) {
        formupload.resetFields();
        message.success("เพิ่มข่าวสารสำเร็จ");
      } else {
        message.error("เพิ่มข่าวสารไม่สำเร็จ");
      }
      setSubmitLoading(false);
      fetchDataHandbook();
      closecreate();
    } catch (error) {
      message.error("อัปโหลดไฟล์ไม่สำเร็จ");
      setSubmitLoading(false);
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
      dataIndex: "handbookid",
      key: "handbookid",
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
      title: "นำเข้าเวลา",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "200px",
      render: (createdAt: Date) => moment(createdAt).format("YYYY/MM/DD"),
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
      <Button type="primary" onClick={opencreate}>
        การอัพโหลดไฟล์
      </Button>
      <Modal
        title="แก้ไขข้อมูลตรวจสภาพรถ"
        open={showmodalupload}
        onCancel={closecreate}
        footer={null}
        destroyOnClose
      >
        <Form form={formupload} onFinish={handbookfileCreate} layout="vertical">
          <Form.Item valuePropName="filelist">
            <Upload
              // {...props}
              // onPreview={onPreview}
              fileList={attendFiles}
              onChange={handleChangeAttendFiles}
              beforeUpload={beforeUploadAttendFiles}
              multiple={true}
              maxCount={1}
              accept=".pdf"
            >
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="status"
            label="สถานะการมองเห็น"
            style={{ width: "300px" }}
          >
            <Switch
                checkedChildren="เปิดการมอง"
                unCheckedChildren="ปิดการมอง"
                defaultChecked
              />
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
export default Managehandbook;
