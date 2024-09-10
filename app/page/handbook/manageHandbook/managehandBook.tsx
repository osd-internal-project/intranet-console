"use client";
import React, { useState, useEffect } from "react";
import type { FormProps } from "antd";
import type { UploadFile, UploadProps } from "antd";
import { RcFile } from "antd/es/upload";
import {
  DownloadOutlined,
  FilePdfOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { DeleteIcon, EditIcon } from "@/components/icon";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import {
  Button,
  Modal,
  Input,
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
  const [searchFileName, setSearchFileName] = useState("");
  const [searchFileType, setSearchFileType] = useState("");
  const [selectedhandbook, setSelectedhandbook] = useState<handbook | null>(
    null
  );
  const [handbooktypeOptions, sethandbooktypeOptions] = useState<
    {
      value: number;
      label: string;
    }[]
  >([]);
  useEffect(() => {
    fetchDataHandbookoption();
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
      message.error("ไม่สามารถเรียกข้อมูลเอกสารได้");
    }
  };
  const fetchDataType = async () => {
    try {
      const handbookoption =
        await managehandbookFileServices.gethandbooktypeQuery();
      const handoptionsmaResponse = handbookoption.map((event: newsType) => {
        return {
          value: event.nameType,
          label: event.nameType,
        };
      });
      sethandbooktypeOptions(handoptionsmaResponse);
      sethandbooktype(handbookoption);
    } catch (error) {
      message.error("ไม่สามารถเรียกข้อมูลเอกสารได้");
    }
  };
  const fetchDataHandbookoption = async () => {
    try {
      const handtype = await managehandbookFileServices.gethandbooktypeQuery();
      const optionsmaResponse = handtype.map((event: handbook) => {
        return {
          value: event.fileName,
          label: event.fileName,
        };
      });
      sethandbooktypeOptions(optionsmaResponse);
      sethandbooktype(handtype);
    } catch (error) {
      message.error("ไม่สามารถเรียกข้อมูลเอกสารได้");
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
      message.error("ไม่สามารถเรียกข้อมูลเอกสารได้");
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
        author: `${session?.user.firstNameTh} ${session?.user.lastNameTh}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: values.status,
      },
    };
    try {
      const response = await managehandbookFileServices.createhandbook(
        handbookCreateData
      );
      if (response && attendFiles.length > 0) {
        await Promise.all(
          attendFiles.map(async (file) => {
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
    setSubmitLoading(true);
    const handbookFileUpdateData = {
      idbook: values?.idbook,
      fileName: values.fileName,
      filetype: values.filetype,
      author: `${session?.user.firstNameTh} ${session?.user.lastNameTh}`,
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
    if (
      record.handbookFile &&
      record.handbookFile[0] &&
      record.handbookFile[0].fileName
    ) {
      window.open(
        `http://localhost:4003/api/public/handbook-file/${record.handbookFile[0].fileName}`,
        "_blank"
      );
    } else {
      message.error("ไม่มีไฟล์ให้ดาวน์โหลด");
    }
  };
  const handleDeleteImage = async (file: UploadFile) => {
    const handbookid = file.uid;

    try {
      const response = await managehandbookFileServices.deletehandbookFile(
        +handbookid
      );

      if (response) {
        const updatedFiles = existingFiles.filter(
          (existingFile) => existingFile.uid !== handbookid
        );
        setExistingFiles(updatedFiles);
        message.success("ลบไฟล์สำเร็จ");
        fetchDataHandbook();
        fetchDataHandbookfile();
      } else {
        message.error("ลบไฟล์ไม่สำเร็จ");
      }
    } catch {
      message.error("ลบไฟล์ไม่สำเร็จ");
    }
  };

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFileName(e.target.value);
  };

  const handleFileTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFileType(e.target.value);
  };

  const filteredData = handbook.filter(
    (handbook) =>
      handbook.fileName.toLowerCase().includes(searchFileName.toLowerCase()) &&
      handbook.filetype.toLowerCase().includes(searchFileType.toLowerCase())
  );

  const closecreate = () => {
    formupload.resetFields();
    setshowmodalupload(false);
  };
  const opencreate = () => {
    setshowmodalupload(true);
  };
  const closeupdate = () => {
    formupload.resetFields();
    setshowmodalupdate(false);
  };

  const dataWithKey = filteredData.map((item, index) => ({
    ...item,
    key: index + 1,
    index: index + 1,
  }));
  const columns: TableProps<handbook>["columns"] = [
    {
      title: "ไอดี",
      dataIndex: "key",
      key: "key",
      align: "center",
      width: "40px",
    },
    {
      title: "ชื่อไฟล์",
      dataIndex: "fileName",
      key: "fileName",
      width: "270px",
    },
    {
      title: "ประเภทเอกสาร",
      dataIndex: "filetype",
      key: "filetype",
      width: "70px",
      ellipsis: true,
    },
    {
      title: "วันที่อัปเดต",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: "90px",
      render: (updatedAt: Date) =>
        moment(updatedAt).format("DD/MM/YYYY HH:mm" + " น."),
    },
    {
      title: "วันที่สร้าง",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "90px",
      render: (createdAt: Date) =>
        moment(createdAt).format("DD/MM/YYYY HH:mm" + " น."),
    },
    {
      title: "ผู้อัปโหลด",
      dataIndex: "author",
      key: "author",
      width: "100px",
    },
    {
      title: "สถานะการมองเห็น",
      dataIndex: "status",
      key: "status",
      width: "80px",
      align: "center",
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
      align: "center",
      render: (_record: number, row: any, _index: number) => (
        <Space size="middle">
          <Tooltip title="แก้ไข">
            <a onClick={() => showModalinformationNews(row)}>{EditIcon}</a>
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
      dataIndex: "O",
      key: "O",
      width: "70px",
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
  return (
    <div>
      <div style={{ margin: " 10px 40px 20px 0px ", fontSize: "20px" }}>
        คำเตือน : การบันทึกเอกสารของคุณ ไม่สามารถอัพโหลดได้เกิน 1 เอกสาร
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "16px",
        }}
      >
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
        <Button
          style={{ alignContent: "right" }}
          type="primary"
          onClick={opencreate}
        >
          การอัพโหลดไฟล์
        </Button>
      </div>

      <Modal
        title="สร้างข้อมูลเอกสาร"
        open={showmodalupload}
        onCancel={closecreate}
        footer={null}
        destroyOnClose
      >
        <Form form={formupload} onFinish={handbookfileCreate} layout="vertical">
          <Form.Item
            name="fileName"
            label="ชื่อเอกสาร :"
            rules={[{ required: true, message: "กรุณากรอกชื่อเอกสาร" }]}
            style={{ width: "300px" }}
          >
            <Input placeholder="ชื่อเอกสาร" 
              showCount
              maxLength={100}/>
          </Form.Item>
          <Form.Item
            name="filetype"
            label="ประเภทเอกสาร :"
            rules={[{ required: true, message: "กรุณากรอกประเภทเอกสาร" }]}
            style={{ width: "300px" }}
          >
            <Select placeholder="ประเภทเอกสาร">
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
              <Button icon={<UploadOutlined />}>อัปโหลดเอกสาร</Button>
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
        title="แก้ไขข้อมูลเอกสาร"
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
              visibility: "hidden",
              margin: "0px -80px -60px 0px",
            }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="fileName"
            label="ชื่อเอกสาร :"
            rules={[{ required: true, message: "กรุณากรอกชื่อเอกสาร" }]}
            style={{ width: "300px" }}
          >
            <Input placeholder="ชื่อเอกสาร" 
              showCount
              maxLength={100}/>
          </Form.Item>
          <Form.Item
            name="filetype"
            label="ประเภทเอกสาร :"
            rules={[{ required: true, message: "กรุณากรอกประเภทเอกสาร" }]}
            style={{ width: "300px" }}
          >
            <Select placeholder="ประเภทเอกสาร">
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
                <Button
                  type="link"
                  href={file.url}
                  target="_blank"
                  style={{ width: "100%", textAlign: "left" }}
                >
                  <FilePdfOutlined
                    style={{ fontSize: "48px", color: "#d32f2f" }}
                  />
                  <span style={{ marginLeft: "10px" }}>{file.fileName}</span>
                </Button>
                <a
                  href={file.url}
                  download={file.fileName}
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 50,
                  }}
                >
                  <Button type="primary" icon={<DownloadOutlined />} />
                </a>
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
                  ลบไฟล์
                </Button>
                <Form.Item name="fileName" style={{ width: "450px" }}>
                  <Input
                    style={{
                      border: "none",
                      boxShadow: "none",
                      color: "red",
                      textAlign: "center",
                      margin: " 0 0 0 10px",
                      borderBlock: "3px solid red",
                    }}
                    readOnly
                  />
                </Form.Item>
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
              <Button icon={<UploadOutlined />}>อัปโหลดเอกสาร</Button>
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
        dataSource={dataWithKey}
        columns={columns}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};
export default Managehandbook;
