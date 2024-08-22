"use client";
import React, { useState, useEffect } from "react";
import { AntDesignOutlined } from "@ant-design/icons";
import type { TableProps, FormProps } from "antd";
import { DeleteIcon, EditIcon } from "@/components/icon";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManageinformationNewsServices } from "../../service/information.service";
import { useForm } from "antd/es/form/Form";
import { useSession } from "next-auth/react";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import { UploadFileStatus } from "antd/es/upload/interface";
import dayjs from "dayjs";
import {
  Select,
  Table,
  Space,
  Button,
  Row,
  Col,
  Modal,
  Form,
  Input,
  Tag,
  message,
  Popconfirm,
  InputNumber,
  Tooltip,
  Card,
  Pagination,
  Switch,
  DatePicker,
  Upload,
  Image,
} from "antd";
import { EyeOutlined } from "@ant-design/icons";

export interface informationNews {
  [x: string]: any;
  newsId: number;
  newsName: string;
  content: string;
  newsType: string;
  author: string;
  phblishedAt: string;
  updatedAt: Date | string;
  status: boolean;
  images: newsImage[];
}
export interface newsImage {
  [x: string]: any;
  imageId: number;
  newsId?: number | undefined;
  createdAt?: String;
  updatedAt?: String;
  fileimageName?: String;
  fileimagePath?: String;
}
export interface newsType {
  idType: Number;
  nameType: String;
  deteil: String;
  createAt: String;
  status: boolean;
}
const Newoption: React.FC = () => {
  const { data: session } = useSession();
  const intraAuth = useAxiosIntranet();
  const [informationNews, setinformationNews] = useState<informationNews[]>([]);
  const [newsimage, setnewsimage] = useState<newsImage[]>([]);
  const manageinformationNewsServices =
    ManageinformationNewsServices(intraAuth);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [form] = useForm();
  const [formdetail] = useForm();
  const [Ismodladetail, setIsmodladetail] = useState(false);
  const [Ismodlaupdatedata, setIsmodlaupdatedata] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newsType, setnewsType] = useState<newsType[]>([]);
  const [attendFiles, setAttendFiles] = useState<UploadFile[]>([]);
  const [existingFiles, setExistingFiles] = useState<UploadFile[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNews, setSelectedNews] = useState<informationNews | null>(
    null
  );
  const [newsTypeOptions, setnewsTypeOptions] = useState<
    {
      value: number;
      label: string;
    }[]
  >([]);

  useEffect(() => {
    fetchDatainformationNews();
    fetchDataType();
    setAttendFiles([]);
    fetchDatanewimage();
  }, []);

  const fetchDatainformationNews = async () => {
    try {
      const newsResponse =
        await manageinformationNewsServices.getinformationNewsQuery();
      const newsData: informationNews[] = newsResponse.map((item: any) => ({
        ...item,
        images: item.newsImage,
      }));

      setinformationNews(newsData);
    } catch (error) {
      message.error("Failed to fetch news data");
    }
  };
  const detailnews = (record: informationNews) => {
    formdetail.setFieldsValue({
      ...record,
      phblishedAt: dayjs(record.phblishedAt),
    });
    setIsmodladetail(true);
  };

  const handleChangeAttendFiles: UploadProps["onChange"] = async ({
    fileList: newFileList,
  }) => {
    const totalFilesCount = existingFiles.length + newFileList.length;

    if (totalFilesCount > 3) {
      message.warning("คุณไม่สามารถอัปโหลดไฟล์เกิน 3 รูปได้");
      return; // หยุดการดำเนินการหากจำนวนไฟล์เกิน
    }

    setAttendFiles(newFileList);
  };
  const fetchDatanewimage = async () => {
    try {
      const maresponse =
        await manageinformationNewsServices.getnewsImageQuery();
      const newsImage: newsImage[] = maresponse.map(
        (item: any, index: number) => ({
          ...item,
          key: index.toString(),
        })
      );
      setnewsimage(newsImage);
      setSubmitLoading(false);
    } catch (error) {
      message.error("Failed to fetch car data");
    }
  };
  const beforeUploadAttendFiles = (file: RcFile) => {
    const totalFilesCount = existingFiles.length + attendFiles.length + 1; // บวก 1 เพื่อรวมไฟล์ใหม่ที่กำลังอัปโหลดด้วย

    if (totalFilesCount > 3) {
      message.warning("คุณไม่สามารถอัปโหลดไฟล์เกิน 3 รูปได้");
      return Upload.LIST_IGNORE; // ปฏิเสธการอัปโหลดไฟล์ใหม่
    }

    if (attendFiles.find((oneFile) => oneFile.name === file.name)) {
      message.warning(`ชื่อไฟล์ ${file.name} ซ้ำ`);
      return Upload.LIST_IGNORE;
    }

    return true; // อนุญาตให้อัปโหลดไฟล์ได้
  };

  const informationNewsUpdate: FormProps<
    informationNews & newsImage
  >["onFinish"] = async (values) => {
    console.log(attendFiles);

    setSubmitLoading(true);

    const informationNewsUpdateData = {
      newsId: values?.newsId,
      newsName: values.newsName,
      content: values.content,
      newsType: values.newsType,
      author: session?.user.username,
      phblishedAt: values.phblishedAt,
      updatedAt: new Date().toISOString(),
      status: values.status,
    };

    try {
      const response =
        await manageinformationNewsServices.updateinformationNews(
          informationNewsUpdateData
        );
      if (response && attendFiles.length > 0) {
        await Promise.all(
          attendFiles.map(async (file) => {
            console.log(`${response.newsId}`);
            const formData = new FormData();
            formData.append("file", file.originFileObj as RcFile);
            await manageinformationNewsServices.uploadFiles(
              response.newsId,
              formData
            );
          })
        );
      }
      if (response) {
        message.success("อัปเดตข่าวสารสำเร็จ");
        form.resetFields();
        setAttendFiles([]);
      } else {
        message.error("อัปเดตข่าวสารไม่สำเร็จ");
      }
      setSubmitLoading(false);
      fetchDatainformationNews();
      fetchDatanewimage();
    } catch (error) {
      message.error("อัปเดตข่าวสารไม่สำเร็จ");
      setSubmitLoading(false);
    }
  };

  const handleDeleteNews = async (record: informationNews) => {
    try {
      setSubmitLoading(true);
      const responsefile = await manageinformationNewsServices.deletenewsImage(
        record.newsImage[0].imageId ||
        record.newsImage[1].imageId ||
        record.newsImage[2].imageId 
      );
      const response =
        await manageinformationNewsServices.deleteinformationNews(
          record.newsId
        );

      if (response && responsefile) {
        message.success("ลบข่าวสารสำเร็จ");
        fetchDatainformationNews();
        fetchDatanewimage();
      } else {
        message.error("ลบข่าวสารไม่สำเร็จ");
      }
    } catch (error) {
      message.error("ลบข่าวสารไม่สำเร็จ");
    } finally {
      setSubmitLoading(false);
    }
  };

  const fetchDataType = async () => {
    try {
      const maresponse = await manageinformationNewsServices.getnewsTypeQuery();
      const optionsmaResponse = maresponse.map((event: newsType) => {
        return {
          value: event.nameType,
          label: event.nameType,
        };
      });
      setnewsTypeOptions(optionsmaResponse);
      setnewsType(maresponse);
    } catch (error) {
      message.error("Failed to fetch car data");
    }
  };

  const showModalinformationNews = async (record: informationNews) => {
    form.setFieldsValue({
      ...record,
      phblishedAt: dayjs(record.phblishedAt),
      updatedAt: dayjs(record.updatedAt),
    });
    console.log(record.images);

    const existingFilesList: UploadFile[] = record.images.map(
      (image, index) => ({
        uid: String(image.imageId),
        name: image.fileimageName as string,
        status: "done" as UploadFileStatus,
        url: `http://localhost:4003/api/public/news-image/${image.fileName}`,
      })
    );
    console.log(existingFilesList);
    setExistingFiles(existingFilesList);
    setSelectedNews(record);
    setIsmodlaupdatedata(true);
  };

  const handleDeleteImage = async (file: UploadFile) => {
    const imageId = file.uid;
    console.log(imageId);

    try {
      const response = await manageinformationNewsServices.deletenewsImage(
        +imageId
      );

      if (response) {
        const updatedFiles = existingFiles.filter(
          (existingFile) => existingFile.uid !== imageId
        );
        setExistingFiles(updatedFiles);
        message.success("ลบข้อมูลภาพสำเร็จ");
        fetchDatanewimage();
        fetchDatainformationNews();
      } else {
        message.error("ลบข้อมูลภาพไม่สำเร็จ");
      }
    } catch {
      message.error("ลบข้อมูลภาพไม่สำเร็จ");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = informationNews.filter((news) =>
    news.newsName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handledetail = () => {
    setSelectedNews(null);
    setIsmodladetail(false);
  };

  const handleCanceupdate = () => {
    setAttendFiles([]);
    setIsmodlaupdatedata(false);
  };
  console.log(selectedNews);

  const columns: TableProps<informationNews>["columns"] = [
    {
      title: "ลำดับ",
      dataIndex: "newsId",
      key: "newsId",
      align: "center",
      width: "20px",
    },
    {
      title: "ชื่อข่าว",
      dataIndex: "newsName",
      key: "newsName",
    },
    {
      title: "ประเภทข่าว",
      dataIndex: "newsType",
      key: "newsType",
    },
    {
      title: "เนื้อหา:",
      dataIndex: "content",
      key: "content",
      align: "center",
      render: (_: any, record: informationNews) => (
        <a onClick={() => detailnews(record)}>
          <Tooltip title="View">
            <EyeOutlined
              style={{ fontSize: "24px", color: "#08c", cursor: "pointer" }}
            />
          </Tooltip>
        </a>
      ),
    },
    {
      title: "ผู้เขียน:",
      dataIndex: "author",
      key: "author",
      width: "200px",
    },
    {
      title: "การจัดการ",
      dataIndex: "manage",
      key: "manage",
      render: (record: number, row: any, index: number) => (
        <Space size="middle">
          <Tooltip title="แก้ไข">
            <a onClick={() => showModalinformationNews(row)}>
              <EditIcon width="24" height="24" />{" "}
            </a>
          </Tooltip>
          <Popconfirm
            title="คุณแน่ใจหรือไม่ว่าต้องการลบการจองนี้?"
            onConfirm={() => handleDeleteNews(row)}
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
  ];

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
            margin: "10px 0 10px 10px",
            width: "300px",
          }}
        />
      </div>
      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title="หมายเหตุ (รายละเอียด)"
        width={600}
        open={Ismodladetail}
        onCancel={handledetail}
        footer={null}
        destroyOnClose
        style={{ textAlign: "center" }}
      >
        <Form form={formdetail}>
          <Form.Item<informationNews> name="content">
            <Input.TextArea
              style={{
                fontSize: "16px",
                userSelect: "none",
              }}
              rows={27}
              readOnly
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="แก้ไขการมองเห็นข่าว"
        open={Ismodlaupdatedata}
        onCancel={handleCanceupdate}
        footer={null}
        destroyOnClose
      >
        <Form form={form} onFinish={informationNewsUpdate} layout="vertical">
          <Form.Item
            name="newsId"
            label="ชื่อประเภทข่าวสาร :"
            style={{
              width: "300px",
            }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="newsName"
            label="หัวข้อข่าวสาร :"
            style={{ width: "300px" }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="newsType"
            label="ประเภทข่าวสาร :"
            style={{ width: "300px" }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label="เนื้อหาข่าวสาร : "
            style={{ width: "300px" }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="updatedAt"
            label="วันที่เผยแพร่ :"
            style={{ width: "300px" }}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="รูปภาพปัจจุบัน:">
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
                  alt="news"
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
              accept=".png,.jpg,.jpeg"
              listType="picture"
            >
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="status"
            label="สถานะการมอง :"
            style={{ width: "300px" }}
          >
            <Switch
              checkedChildren="เปิดการมอง"
              unCheckedChildren="ปิดการมอง"
              defaultChecked
            />
          </Form.Item>
          <div className="flex justify-end w-full">
            <Form.Item>
              <Button
                type="default"
                onClick={handleCanceupdate}
                style={{ marginRight: 8 }}
              >
                ยกเลิก
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={submitLoading}>
                ตกลง
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Newoption;
