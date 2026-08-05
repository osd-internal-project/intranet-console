"use client";
import React, { useState, useEffect, useContext } from "react";
import type { FormProps } from "antd";
import type { UploadFile, UploadProps } from "antd";
import { RcFile } from "antd/es/upload";
import { DeleteOutlined, DownloadOutlined, FormOutlined, UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import dayjs from "dayjs";
import { Button, Modal, Input, Table, TableProps, message, Form, Space, Upload, Switch, Tooltip, Popconfirm, Select, Tag } from "antd";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManagehandbookFileServices } from "../service/handbook.service";
import { useForm } from "antd/es/form/Form";
import { UserContectType, UserContext } from "@/app/config/userContext";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import imageCompression from "browser-image-compression";
import { handleCompress } from "@/app/utils";
import { notifyError, notifySuccess } from "@/app/utils/message";
export interface handbookFile {
  [x: string]: any;
  handbookid?: Number | null;
  fileName: String;
  fileoriginalName: string;
  author: String;
  createdAt?: Date;
  updatedAt?: Date;
  filetype: String;
  status?: boolean;
}
export interface handbooktype {
  idhandtype: Number;
  nameType: String;
  createAt: String;
  status: boolean;
}
const HandBookManage: React.FC = () => {
  const { user } = (useContext(UserContext) as UserContectType) || { user: null };
  const { id24Axios } = useId24();
  const baseUrlIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const managehandbookFileServices = ManagehandbookFileServices(baseUrlIntranet);
  const [handbooktype, sethandbooktype] = useState<handbooktype[]>([]);
  const [handbookFile, sethandbookFile] = useState<handbookFile[]>([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formupload] = useForm();
  const [showmodalupdate, setshowmodalupdate] = useState(false);
  const [showmodalupload, setshowmodalupload] = useState(false);
  const [attendFiles, setAttendFiles] = useState<UploadFile[]>([]);
  const [existingFiles, setExistingFiles] = useState<UploadFile[]>([]);
  const [form] = useForm();
  const [searchFileName, setSearchFileName] = useState("");
  const [searchFileType, setSearchFileType] = useState("");
  const baseImageUrl = process.env.NEXT_PUBLIC_API_BASE_URL_INTRANET;
  const [handbooktypeOptions, sethandbooktypeOptions] = useState<
    {
      value: number;
      label: string;
    }[]
  >([]);
  useEffect(() => {
    fetchDataHandbookfile();
    fetchDataType();
  }, []);

  const fetchDataHandbookfile = async () => {
    try {
      const maresponse = await managehandbookFileServices.gethandbookFileQuery();
      const handbookFile: handbookFile[] = maresponse.map((item: any, index: number) => ({
        ...item,
        key: index.toString(),
      }));
      sethandbookFile(handbookFile);
      setSubmitLoading(false);
    } catch (error) {
      notifyError(error, "car.document.load");
    }
  };
  const fetchDataType = async () => {
    try {
      const handbookoption = await managehandbookFileServices.gethandbooktypeQuery();
      const handoptionsmaResponse = handbookoption.map((event: handbooktype) => {
        return {
          value: event.nameType,
          label: event.nameType,
        };
      });
      sethandbooktypeOptions(handoptionsmaResponse);
      sethandbooktype(handbookoption);
    } catch (error) {
      notifyError(error, "car.document.load");
    }
  };

  const handbookfileCreate: FormProps<handbookFile>["onFinish"] = async (values) => {
    setSubmitLoading(true);

    try {
      if (attendFiles.length > 0) {
        const formData: any = new FormData();
        formData.append("fileName", values.fileName);
        formData.append("filetype", values.filetype);
        formData.append("author", `${user?.firstNameTh} ${user?.lastNameTh}`);
        formData.append("status", values?.status);
        formData.append("file", attendFiles[0].originFileObj as RcFile);
        const response = await managehandbookFileServices.uploadFiles(formData);
        if (response) {
          formupload.resetFields();
          notifySuccess("setting.document.create");
        } else {
          notifyError(undefined, "setting.document.create");
        }

        fetchDataHandbookfile();
        setAttendFiles([]);
        closecreate();
      } else if (attendFiles.length === 0) {
        message.error("กรุณาอัพโหลดเอกสาร");
      } else {
        message.error("กรุณาอัพโหลดเอกสาร");
      }
      setSubmitLoading(false);
      return true;
    } catch (error) {
      notifyError(error, "setting.document.upload");
      setSubmitLoading(false);
    }
  };

  const handbookFileUpdate: FormProps<handbookFile>["onFinish"] = async (values) => {
    setSubmitLoading(true);
    const handbookCreateData = {
      handbookid: values.handbookid,
      fileName: values.fileName,
      filetype: values.filetype,
      author: `${user?.firstNameTh} ${user?.lastNameTh}`,
      updatedAt: new Date().toISOString(),
      status: values?.status,
    };
    try {
      const response = await managehandbookFileServices.updatehandbookFile(handbookCreateData);

      if (response !== undefined) {
        formupload.resetFields();
        notifySuccess("setting.file.update");
      } else {
        notifyError(undefined, "setting.file.update");
      }

      fetchDataHandbookfile();
      setshowmodalupdate(false);
      setAttendFiles([]);
    } catch (error) {
      notifyError(error, "setting.file.update");
      setSubmitLoading(false);
    }
  };

  const handleDeletehandbook = async (record: handbookFile) => {
    try {
      setSubmitLoading(true);

      await managehandbookFileServices.deletehandbookFile(record.handbookid);

      notifySuccess("setting.file.delete");

      fetchDataHandbookfile();
    } catch (error) {
      notifyError(error, "setting.file.delete");
    } finally {
      setSubmitLoading(false);
    }
  };

  const showModalinformationNews = async (record: handbookFile) => {
    form.setFieldsValue({
      ...record,
      createdAt: dayjs(record.createdAt),
      updatedAt: dayjs(record.updatedAt),
    });
    setshowmodalupdate(true);
  };

  const handleChangeAttendFiles: UploadProps["onChange"] = async ({ fileList: newFileList }) => {
    const totalFilesCount = existingFiles.length + newFileList.length;
    if (totalFilesCount > 1) {
      message.warning("คุณไม่สามารถอัปโหลดไฟล์เกิน 1 ไฟล์");
      return;
    }
    return setAttendFiles(newFileList);
  };

  const beforeUploadAttendFiles = async (file: RcFile) => {
    if (attendFiles.find((oneFile) => oneFile.name === file.name)) {
      message.warning(`ชื่อไฟล์ ${file.name} ซ้ำ`);
      return Upload.LIST_IGNORE;
    }
    try {
      const compressed = await handleCompress(file);
      return compressed ?? true; // ✅ ถ้า compress สำเร็จ หรือ undefined → upload ปกติ
    } catch (err) {
      console.error("❌ Compress error:", err);
      message.error(`ไฟล์ ${file.name} ขนาดใหญ่เกินไปหรือ compress ล้มเหลว`);
      return true; 
    }
  };

  const handleDownload = async (record: handbookFile) => {
    if (record && record.fileId) {
      const fileUrl = `${baseImageUrl}/public/handbook-file/${record.fileId}?fileName=${encodeURIComponent(String(record.fileName))}`;
      try {
        const response = await fetch(fileUrl);

        if (response.ok) {
          const blob = await response.blob();
          const link = document.createElement("a");

          link.href = window.URL.createObjectURL(blob);
          link.download = String(record.fileName);
          link.click();

          window.URL.revokeObjectURL(link.href);
        } else {
          message.error("ไม่มีไฟล์ให้ดาวน์โหลด");
        }
      } catch (error) {
        notifyError(error, "file.download");
      }
    } else {
      message.error("ไม่มีไฟล์ให้ดาวน์โหลด");
    }
  };

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFileName(e.target.value);
  };

  const handleFileTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFileType(e.target.value);
  };

  const filteredData = handbookFile.filter(
    (handbookFile) =>
      handbookFile.fileName.toLowerCase().includes(searchFileName.toLowerCase()) &&
      handbookFile.filetype.toLowerCase().includes(searchFileType.toLowerCase()),
  );

  const closecreate = () => {
    setAttendFiles([]);
    formupload.resetFields();
    setshowmodalupload(false);
  };
  const opencreate = () => {
    setAttendFiles([]);
    setshowmodalupload(true);
  };
  const closeupdate = () => {
    formupload.resetFields();
    setExistingFiles([]);
    setAttendFiles([]);
    setshowmodalupdate(false);
  };

  const dataWithKey = filteredData.map((item, index) => ({
    ...item,
    key: index + 1,
    index: index + 1,
  }));
  const columns: TableProps<handbookFile>["columns"] = [
    {
      title: "ลำดับ",
      dataIndex: "key",
      key: "key",
      align: "center",
      width: "40px",
      fixed: "left",
    },
    {
      title: "ชื่อเอกสาร",
      dataIndex: "fileName",
      key: "fileName",
      width: "300px",
      fixed: "left",
    },
    {
      title: "ประเภทเอกสาร",
      dataIndex: "filetype",
      key: "filetype",
      width: "180px",
    },
    {
      title: "วันที่สร้าง",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "170px",
      render: (createdAt: Date) => moment(createdAt).format("DD/MM/YYYY HH:mm" + " น."),
    },
    {
      title: "วันที่อัปเดต",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: "170px",
      render: (updatedAt: Date) => moment(updatedAt).format("DD/MM/YYYY HH:mm" + " น."),
    },
    {
      title: "ผู้อัปโหลด",
      dataIndex: "author",
      key: "author",
      width: "200px",
    },
    {
      title: "สถานะการมองเห็น",
      dataIndex: "status",
      key: "status",
      width: "80px",
      align: "center",
      render: (status: boolean) => (status === true ? <Tag color="green">เปิดการมองเห็น</Tag> : <Tag color="red">ปิดการมองเห็น</Tag>),
    },
    {
      title: "ดาวโหลดไฟล์",
      dataIndex: "O",
      key: "O",
      width: "50px",
      align: "center",
      render: (_record: number, row: any, _index: number) => (
        <Button icon={<DownloadOutlined />} size="small" onClick={() => handleDownload(row)}>
          ดาวน์โหลด
        </Button>
      ),
    },
    {
      title: "การจัดการ",
      dataIndex: "x",
      key: "x",
      width: "50px",
      align: "center",
      render: (_record: number, row: any, _index: number) => (
        <Space size="middle">
          <Tooltip title="แก้ไข">
            <Button size="small" type="link" onClick={() => showModalinformationNews(row)}>
              <FormOutlined />
            </Button>
          </Tooltip>
          <Popconfirm title="คุณแน่ใจหรือไม่ว่าต้องการลบเอกสารนี้?" onConfirm={() => handleDeletehandbook(row)} okText="ใช่" cancelText="ไม่">
            <Tooltip title="ลบ">
              <Button size="small" type="link">
                <DeleteOutlined style={{ color: "red" }} />
              </Button>
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <div>
      <div style={{ margin: " 10px 40px 20px 0px ", fontSize: "20px" }}>คำเตือน : การบันทึกเอกสารของคุณ ไม่สามารถอัพโหลดได้เกิน 1 เอกสาร</div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "16px",
        }}>
        <div>
          <div>
            ค้นหาชื่อเอกสาร :
            <Input
              type="text"
              value={searchFileName}
              onChange={handleFileNameChange}
              placeholder="ค้นหาชื่อเอกสาร"
              style={{
                margin: "10px 10px 10px 10px",
                width: "300px",
              }}
            />
            ค้นหาประเภทเอกสาร :
            <Input
              type="text"
              value={searchFileType}
              onChange={handleFileTypeChange}
              placeholder="ค้นหาประเภทเอกสาร"
              style={{
                margin: "10px 10px 10px 10px",
                width: "300px",
              }}
            />
          </div>
        </div>
        <div></div>
        <Button style={{ alignContent: "right" }} type="primary" onClick={opencreate}>
          การอัปโหลดไฟล์
        </Button>
      </div>

      <Modal title="สร้างข้อมูลเอกสาร" open={showmodalupload} onCancel={closecreate} footer={null} destroyOnClose>
        <Form form={formupload} onFinish={handbookfileCreate} layout="vertical">
          <Form.Item name="fileName" label="ชื่อเอกสาร :" rules={[{ required: true, message: "กรุณากรอกชื่อเอกสาร" }]} style={{ width: "300px" }}>
            <Input placeholder="ชื่อเอกสาร" showCount maxLength={50} />
          </Form.Item>
          <Form.Item name="filetype" label="ประเภทเอกสาร :" rules={[{ required: true, message: "กรุณากรอกประเภทเอกสาร" }]} style={{ width: "300px" }}>
            <Select placeholder="ประเภทเอกสาร">
              {handbooktypeOptions
                .filter((option) => {
                  const type = handbooktype.find((type) => type.nameType === option.label);
                  return type && type.status;
                })
                .map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item valuePropName="filelist">
            <Upload fileList={attendFiles} onChange={handleChangeAttendFiles} beforeUpload={beforeUploadAttendFiles} maxCount={1} accept=".pdf">
              <Button icon={<UploadOutlined />}>อัปโหลดเอกสาร</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="status" label="สถานะการมองเห็น" style={{ width: "300px" }}>
            <Switch checkedChildren="เปิดการมอง" unCheckedChildren="ปิดการมอง" defaultChecked={true} />
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
      <Modal title="แก้ไขข้อมูลเอกสาร" open={showmodalupdate} onCancel={closeupdate} footer={null} destroyOnClose>
        <Form form={form} onFinish={handbookFileUpdate} layout="vertical">
          <Form.Item
            name="handbookid"
            label="ชื่อไฟล์ :"
            style={{
              width: "300px",
              visibility: "hidden",
              margin: "0px -80px -60px 0px",
            }}>
            <Input />
          </Form.Item>
          <Form.Item name="fileName" label="ชื่อเอกสาร :" rules={[{ required: true, message: "กรุณากรอกชื่อเอกสาร" }]} style={{ width: "300px" }}>
            <Input placeholder="ชื่อเอกสาร" showCount maxLength={50} />
          </Form.Item>
          <Form.Item name="filetype" label="ประเภทเอกสาร :" rules={[{ required: true, message: "กรุณากรอกประเภทเอกสาร" }]} style={{ width: "300px" }}>
            <Select placeholder="ประเภทเอกสาร">
              {handbooktypeOptions
                .filter((option) => {
                  const type = handbooktype.find((type) => type.nameType === option.label);
                  return type && type.status;
                })
                .map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item name="status" label="สถานะการมองเห็น" style={{ width: "300px" }}>
            <Switch checkedChildren="เปิดการมอง" unCheckedChildren="ปิดการมอง" defaultChecked />
          </Form.Item>
          <Form.Item>
            <Space style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={closeupdate}>ยกเลิก</Button>
              <Button type="primary" htmlType="submit" loading={submitLoading}>
                บันทึก
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      <Table
        dataSource={dataWithKey}
        columns={columns}
        size="small"
        scroll={{ x: "max-content" }}
        rowKey="key"
        bordered
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};
export default HandBookManage;
