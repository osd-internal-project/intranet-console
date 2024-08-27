"use client";
import React, { useState, useEffect } from "react";
import type { FormProps } from "antd";
import type { UploadFile, UploadProps } from "antd";
import { RcFile } from "antd/es/upload";
import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import { DeleteIcon, EditIcon } from "@/components/icon";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import {
  Button,
  Modal,
  Input,
  Image,
  Table,
  TableProps,
  message,
  Form,
  Space,
  Upload,
  Switch,
  Tooltip,
  Popconfirm,
  Select,
  Tag,
} from "antd";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManagehandbookFileServices } from "../service/handbook.service";
import { useForm } from "antd/es/form/Form";
import { newsType } from "../../information/common";
import { UploadFileStatus } from "antd/es/upload/interface";
export interface handbookFile {
  [x: string]: any;
  handbookid: number;
  fileName?: String;
  fileLocation?: String;
  author?: String;
  createdAt?: Date;
  updatedAt?: Date;
  filetype?: String;
  status?: boolean;
  idbook?: Number;
}
export interface handbook {
  [x: string]: any;
  idbook: Number;
  fileName: String;
  filetype: String;
  createdAt: Date;
  updatedAt: Date | string;
  author: String;
  status: boolean;
  image: handbookFile[];
}
export interface handbooktype {
  idhandtype: Number;
  nameType: String;
  createAt: String;
  status: boolean;
}
const Managehandbook: React.FC = () => {
  const intraAuth = useAxiosIntranet();
  const [handbook, sethandbook] = useState<handbook[]>([]);
  const [handbooktype, sethandbooktype] = useState<handbooktype[]>([]);
  const [handbookFile, sethandbookFile] = useState<handbookFile[]>([]);
  const managehandbookFileServices = ManagehandbookFileServices(intraAuth);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formupload] = useForm();
  const [showmodalupdate, setshowmodalupdate] = useState(false);
  const [showmodalupload, setshowmodalupload] = useState(false);
  const [attendFiles, setAttendFiles] = useState<UploadFile[]>([]);
  const [existingFiles, setExistingFiles] = useState<UploadFile[]>([]);
  const { data: session } = useSession();
  const [form] = useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedhandbook, setSelectedhandbook] = useState<handbook | null>(
    null
  );const [handbooktypeOptions, sethandbooktypeOptions] = useState<
  {
    value: number;
    label: string;
  }[]
>([]);

  useEffect(() => {
    fetchDataHandbookfile();
    fetchDataHandbook();
    fetchDataType();
  }, []);

  const fetchDataHandbookfile = async () => {
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
  const fetchDataType = async () => {
    try {
      const handtype = await managehandbookFileServices.gethandbooktypeQuery();
      const optionsmaResponse = handtype.map((event: newsType) => {
        return {
          value: event.nameType,
          label: event.nameType,
        };
      });
      sethandbooktypeOptions(optionsmaResponse);
      sethandbooktype(handtype);
    } catch (error) {
      message.error("Failed to fetch car data");
    }
  };

  const fetchDataHandbook = async () => {
    try {
      const maresponse = await managehandbookFileServices.gethandbookQuery();
      const handbook: handbook[] = maresponse.map(
        (item: any, index: number) => ({
          ...item,
          images: item.handbookFile,
        })
      );
      sethandbook(handbook);
      setSubmitLoading(false);
    } catch (error) {
      message.error("Failed to fetch car data");
    }
  };

  const handbookfileCreate: FormProps<
    handbook & handbookFile
  >["onFinish"] = async (values) => {
    setSubmitLoading(true);
    const handbookCreateData = {
      data: {
        fileName: values.fileName,
        filetype: values.filetype,
        fileLocation: values?.fileLocation,
        author: session?.user.username,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: values.status,
      },
    };
    try {
      const response = await managehandbookFileServices.createhandbook(
        handbookCreateData
      );
      console.log(response);
      console.log(attendFiles);
      if (response && attendFiles.length > 0) {
        await Promise.all(
          attendFiles.map(async (file) => {
            console.log(`${response.idbook}`);
            const formData = new FormData();
            formData.append("file", file.originFileObj as RcFile);
            await managehandbookFileServices.uploadFiles(
              response.idbook,
              formData
            );
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
      fetchDataHandbookfile();
      fetchDataHandbook();
      setAttendFiles([]);
      closecreate();
    } catch (error) {
      message.error("อัปโหลดไฟล์ไม่สำเร็จ");
      setSubmitLoading(false);
    }
  };

  const handbookFileUpdate: FormProps<
    handbook & handbookFile
  >["onFinish"] = async (values) => {
    console.log(attendFiles);
    setSubmitLoading(true);
    const handbookFileUpdateData = {
      idbook: values?.idbook,
      fileName: values.fileName,
      filetype: values.filetype,
      author: session?.user.username,
      updatedAt: new Date().toISOString(),
      status: values.status,
    };

    try {
      const response = await managehandbookFileServices.updatehandbook(
        handbookFileUpdateData
      );
      if (response && attendFiles.length > 0) {
        await Promise.all(
          attendFiles.map(async (file) => {
            console.log(`${response.idbook}`);
            const formData = new FormData();
            formData.append("file", file.originFileObj as RcFile);
            await managehandbookFileServices.uploadFiles(
              response.idbook,
              formData
            );
          })
        );
      }
      if (response) {
        message.success("อัปเดตไฟล์สำเร็จ");
        form.resetFields();
        fetchDataHandbook();
        fetchDataHandbookfile();
        setshowmodalupdate(false);
        setAttendFiles([]);
      } else {
        message.error("อัปเดตไฟล์ไม่สำเร็จ");
      }
      setSubmitLoading(false);
      fetchDataHandbook();
      setAttendFiles([]);
    } catch (error) {
      message.error("อัปเดตไฟล์ไม่สำเร็จ");
      setSubmitLoading(false);
    }
  };

  const handleDeletehandbook = async (record: handbook) => {
    try {
      setSubmitLoading(true);
      const responsefile = await managehandbookFileServices.deletehandbookFile(
        record.handbookFile[0].handbookid
      );
      const response = await managehandbookFileServices.deletehandbook(
        record.idbook
      );
      if (record.idbook || !record.handbookFile[0].handbookid) {
        message.error("ไม่พบ handbookid สำหรับ idbook นี้");
        return;
      }
      if (response && responsefile) {
        message.success("ลบไฟล์สำเร็จ");
        fetchDataHandbook();
        fetchDataHandbookfile();
      } else {
        message.error("ลบไฟล์ไม่สำเร็จ");
      }
    } catch (error) {
      message.error("ลบไฟล์ไม่สำเร็จ");
    } finally {
      setSubmitLoading(false);
    }
  };

  const showModalinformationNews = async (record: handbook) => {
    form.setFieldsValue({
      ...record,
      createdAt: dayjs(record.createdAt),
      updatedAt: dayjs(record.updatedAt),
    });
    const existingFilesList: UploadFile[] = record.images.map(
      (images: { handbookid: any; fileName: string }) => ({
        uid: String(images.handbookid),
        name: images.fileName as string,
        status: "done" as UploadFileStatus,
        url: `http://localhost:4003/api/public/handbook-file/${images.fileName}`,
      })
    );
    setExistingFiles(existingFilesList);
    setSelectedhandbook(record);
    setshowmodalupdate(true);
  };
  const handleChangeAttendFiles: UploadProps["onChange"] = async ({
    fileList: newFileList,
  }) => {
    const totalFilesCount = existingFiles.length + newFileList.length;
    if (totalFilesCount > 1) {
      message.warning("คุณไม่สามารถอัปโหลดไฟล์เกิน 1 ไฟล์ได้");
      return;
    }
    setAttendFiles(newFileList);
  };

  const beforeUploadAttendFiles = (file: RcFile) => {
    const totalFilesCount = existingFiles.length + attendFiles.length + 1;
    if (totalFilesCount > 1) {
      message.warning("คุณไม่สามารถอัปโหลดไฟล์เกิน 1 ไฟล์ได้");
      return Upload.LIST_IGNORE;
    }
    if (attendFiles.find((oneFile) => oneFile.name === file.name)) {
      message.warning(`ชื่อไฟล์ ${file.name} ซ้ำ`);
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const handleDownload = (record: handbook) => {
    if (record.handbookFile && record.handbookFile[0] && record.handbookFile[0].fileName) {
      window.open(
        `http://localhost:4003/api/public/handbook-file/${record.handbookFile[0].fileName}`,
        "_blank"
      );
    } else {
      message.error("ไม่มีไฟล์ให้ดาวน์โหลด");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = handbook.filter(
    (handbook) =>
      handbook.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      handbook.filetype.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const closecreate = () => {
    setshowmodalupload(false);
  };
  const opencreate = () => {
    setshowmodalupload(true);
  };
  const closeupdate = () => {
    setshowmodalupdate(false);
  };

  const columns: TableProps<handbook>["columns"] = [
    {
      title: "ไอดี",
      dataIndex: "idbook",
      key: "idbook",
      align: "center",
      width: "20px",
    },
    {
      title: "ชื่อไฟล์",
      dataIndex: "fileName",
      key: "fileName",
      width: "240px",
    },
    {
      title: "ประเภทเอกสาร",
      dataIndex: "filetype",
      key: "filetype",
      width: "50px",
    },
    {
      title: "เวลาอัพเดท",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: "50px",
      render: (updatedAt: Date) => moment(updatedAt).format("YYYY/MM/DD"),
    },
    {
      title: "นำเข้าเวลา",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "50px",
      render: (createdAt: Date) => moment(createdAt).format("YYYY/MM/DD"),
    },
    {
      title: "ผู้อัพโหลด",
      dataIndex: "author",
      key: "author",
      width: "100px",
    },
    {
      title: "สถานะการมองเห็น",
      dataIndex: "status",
      key: "status",
      width: "80px",
      render: (status: boolean) =>
        status === true ? (
          <Tag color="green">เปิดการมองเห็น</Tag>
        ) : (
          <Tag color="red">ปิดการมองเห็น</Tag>
        ),
    },
    {
      title: "การจัดการ",
      dataIndex: "x",
      key: "x",
      width: "60px",
      render: (_record: number, row: any, _index: number) => (
        <Space size="middle">
          <Tooltip title="แก้ไข">
            <a onClick={() => showModalinformationNews(row)}>
              <EditIcon width="24" height="24" />{" "}
            </a>
          </Tooltip>
          <Popconfirm
            title="คุณแน่ใจหรือไม่ว่าต้องการลบการจองนี้?"
            onConfirm={() => handleDeletehandbook(row)}
            okText="ใช่"
            cancelText="ไม่"
          >
            <Tooltip title="ลบ">
              <a>
                {" "}
                <DeleteIcon width="24" height="24" />{" "}
              </a>
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
    {
      title: "ดาวโหลดไฟล์",
      dataIndex: "x",
      key: "x",
      width: "200px",
      align: "center",
      render: (_record: number, row: any, _index: number) => (
        <Button
          icon={<DownloadOutlined />}
          size="small"
          onClick={() => handleDownload(row)}
        >
          ดาวน์โหลด
        </Button>
      ),
    },
  ];
  function handleDeleteImage(_file: any): void {
    throw new Error("Function not implemented.");
  }
  return (
    <div>
      <div style={{ fontSize: "16px" }}>
        ค้นหาข่าวสาร :
        <Input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="ค้นหาข่าวสาร"
          style={{
            margin: "10px 10px 10px 10px",
            width: "300px",
          }}
        />
        <Button type="primary" onClick={opencreate}>
        การอัพโหลดไฟล์
      </Button>
      </div>
      
      <Modal
        title="แก้ไขข้อมูลตรวจสภาพรถ"
        open={showmodalupload}
        onCancel={closecreate}
        footer={null}
        destroyOnClose
      >
        <Form form={formupload} onFinish={handbookfileCreate} layout="vertical">
          <Form.Item
            name="fileName"
            label="ชื่อไฟล์ :"
            style={{ width: "300px" }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="filetype"
            label="ประเภทไฟล์งาน :"
            style={{ width: "300px" }}
          >
            <Select>
              {handbooktypeOptions
                .filter((option) => {
                  const type = handbooktype.find(
                    (type) => type.nameType === option.label
                  );
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
            <Upload
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
      <Modal
        title="แก้ไขข้อมูลตรวจสภาพรถ"
        open={showmodalupdate}
        onCancel={closeupdate}
        footer={null}
        destroyOnClose
      >
        <Form form={form} onFinish={handbookFileUpdate} layout="vertical">
          <Form.Item
            name="idbook"
            label="ชื่อไฟล์ :"
            style={{
              width: "300px",
            }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="fileName"
            label="ชื่อไฟล์ :"
            style={{ width: "300px" }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="filetype"
            label="ประเภทไฟล์งาน :"
            style={{ width: "300px" }}
          >
            <Select>
              {handbooktypeOptions
                .filter((option) => {
                  const type = handbooktype.find(
                    (type) => type.nameType === option.label
                  );
                  return type && type.status;
                })
                .map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item label="ไฟล์ปัจจุบัน:">
            {existingFiles.map((file, index) => (
              <div
                key={index}
                style={{ marginBottom: "20px", position: "relative" }}
              >
                <Image
                  preview={false}
                  crossOrigin="anonymous"
                  src={file.url}
                  style={{ width: "100%" }}
                  alt={file.name}
                />
                <Button
                  type="primary"
                  danger
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                  }}
                  onClick={() => handleDeleteImage(file)}
                >
                  ลบรูปภาพ
                </Button>
              </div>
            ))}
          </Form.Item>
          <Form.Item valuePropName="fileList">
            <Upload
              fileList={[...attendFiles]}
              onChange={handleChangeAttendFiles}
              beforeUpload={beforeUploadAttendFiles}
              multiple={true}
              accept=".pdf"
              listType="picture"
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
              <Button onClick={closeupdate}>ยกเลิก</Button>
              <Button type="primary" htmlType="submit" loading={submitLoading}>
                บันทึก
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};
export default Managehandbook;

