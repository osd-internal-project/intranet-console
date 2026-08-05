"use client";
import React, { useState, useEffect, useContext } from "react";
import type { TableProps, FormProps } from "antd";
import { useForm } from "antd/es/form/Form";
import type { UploadFile, UploadProps } from "antd";
import { DeleteOutlined, FormOutlined, UploadOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import { UploadFileStatus } from "antd/es/upload/interface";
import dayjs from "dayjs";
import { Table, Space, Button, Modal, Form, Input, message, Popconfirm, Tooltip, Switch, Upload, Image, Tag, Select } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import moment from "moment";
import { ManageinformationNewsServices } from "../services/information.service";
import { UserContectType, UserContext } from "@/app/config/userContext";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import { handleCompress } from "@/app/utils";

import { notifyError, notifySuccess } from "@/app/utils/message";
export interface informationNews {
  [x: string]: any;
  newsId: number;
  newsName: string;
  content: string;
  newsType: string;
  author: string;
  phblishedAt: Date | string;
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
const InfoTableNews: React.FC = () => {
  const { user } = (useContext(UserContext) as UserContectType) || { user: null };
  const { id24Axios, tokenAccess } = useId24();
  // const baseUrlUser = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_USER);
  const baseUrlIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const [informationNews, setinformationNews] = useState<informationNews[]>([]);
  // const [newsimage, setnewsimage] = useState<newsImage[]>([]);
  const manageinformationNewsServices = ManageinformationNewsServices(baseUrlIntranet);
  const [submitLoading, setSubmitLoading] = useState<boolean>(true);
  const [form] = useForm();
  const [formdetail] = useForm();
  const [Ismodladetail, setIsmodladetail] = useState(false);
  const [Ismodlaupdatedata, setIsmodlaupdatedata] = useState(false);
  const [newsType, setnewsType] = useState<newsType[]>([]);
  const [attendFiles, setAttendFiles] = useState<UploadFile[]>([]);
  const [existingFiles, setExistingFiles] = useState<UploadFile[]>([]);
  const [searchFileName, setSearchFileName] = useState("");
  const [searchFileType, setSearchFileType] = useState("");
  // const [selectedNews, setSelectedNews] = useState<informationNews | null>(null);
  const [newsTypeOptions, setnewsTypeOptions] = useState<
    {
      value: number;
      label: string;
    }[]
  >([]);

  useEffect(() => {
    fetchDataType();
    if (submitLoading) {
      fetchDatainformationNews();
    }
  }, [submitLoading]);

  const fetchDatainformationNews = async () => {
    try {
      const newsResponse = await manageinformationNewsServices.getinformationNewsQuery();
      const newsData: informationNews[] = newsResponse.map((item: any) => ({
        ...item,
        images: item.newsImage,
      }));
      setinformationNews(newsData);
      // fetchDatanewimage();
      setSubmitLoading(false);
    } catch (error) {
      notifyError(error, "setting.news.load");
    }
  };
  const detailnews = (record: informationNews) => {
    formdetail.setFieldsValue({
      ...record,
      phblishedAt: dayjs(record.phblishedAt),
      updatedAt: dayjs(record.updatedAt),
    });
    setIsmodladetail(true);
  };

  const handleChangeAttendFiles: UploadProps["onChange"] = async ({ fileList: newFileList }) => {
    const totalFilesCount = existingFiles.length + newFileList.length;
    if (totalFilesCount > 3) {
      message.warning("คุณไม่สามารถอัปโหลดรูปภาพเกิน 3 รูปได้");
      return;
    }
    setAttendFiles(newFileList);
  };
  // const fetchDatanewimage = async () => {
  //   try {
  //     const maresponse = await manageinformationNewsServices.getnewsImageQuery();
  //     const newsImage: newsImage[] = maresponse.map((item: any, index: number) => ({
  //       ...item,
  //       key: index.toString(),
  //     }));
  //     setnewsimage(newsImage);
  //   } catch (error) {
  //     notifyError(error, "car.load");
  //   }
  // };
  const beforeUploadAttendFiles = async (file: RcFile) => {
    const totalFilesCount = existingFiles.length + attendFiles.length + 1;
    if (totalFilesCount > 3) {
      message.warning("คุณไม่สามารถอัปโหลดไฟล์เกิน 3 รูปได้");
      return Upload.LIST_IGNORE;
    }
    if (attendFiles.find((oneFile) => oneFile.name === file.name)) {
      message.warning(`ชื่อไฟล์ ${file.name} ซ้ำ`);
      return Upload.LIST_IGNORE;
    }
    const compressed = await handleCompress(file);
    return compressed;
  };

  const informationNewsUpdate: FormProps<informationNews & newsImage>["onFinish"] = async (values) => {
    const informationNewsUpdateData = {
      newsId: values?.newsId,
      newsName: values.newsName,
      content: values.content,
      newsType: values.newsType,
      author: `${user?.firstNameTh} ${user?.lastNameTh}`,
      updatedAt: new Date().toISOString(),
      status: values.status,
    };

    try {
      const response = await manageinformationNewsServices.updateinformationNews(informationNewsUpdateData);
      if (response && attendFiles.length > 0) {
        await Promise.all(
          attendFiles.map(async (file) => {
            const formData = new FormData();
            formData.append("file", file.originFileObj as RcFile);
            await manageinformationNewsServices.uploadFiles(response.newsId, formData);
          }),
        );
      }
      if (response) {
        notifySuccess("setting.news.update");
        form.resetFields();
        setIsmodlaupdatedata(false);
        setAttendFiles([]);
      } else {
        notifyError(undefined, "setting.news.update");
      }
      setSubmitLoading(true);
      fetchDatainformationNews();
      // fetchDatanewimage();
      setIsmodlaupdatedata(false);
    } catch (error) {
      notifyError(error, "setting.news.update");
      setSubmitLoading(true);
    }
  };

  const handleDeleteNews = async (record: informationNews) => {
    try {
      const deleteImagePromises = record.newsImage.map((image: { imageId: number }) => manageinformationNewsServices.deletenewsImage(image.imageId));
      const responsefile = await Promise.all(deleteImagePromises);
      if (responsefile.every((res) => res)) {
        const response = await manageinformationNewsServices.deleteinformationNews(record.newsId);
        if (response) {
          notifySuccess("setting.news.delete");
          setSubmitLoading(true);
        } else {
          notifyError(undefined, "setting.news.delete");
        }
      } else {
        notifyError(undefined, "setting.image.delete");
      }
    } catch (error) {
      notifyError(error, "setting.news.delete");
    } finally {
      setSubmitLoading(true);
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
      notifyError(error, "car.load");
    }
  };

  const showModalinformationNews = async (record: informationNews) => {
    form.setFieldsValue({
      ...record,
      phblishedAt: dayjs(record.phblishedAt),
      updatedAt: dayjs(record.updatedAt),
    });
    const existingFilesList: UploadFile[] = record.images.map((image) => ({
      uid: String(image.imageId),
      name: image.fileimageName as string,
      status: "done" as UploadFileStatus,
      url: `${process.env.NEXT_PUBLIC_API_BASE_URL_INTRANET}/public/news-image/${image.fileName}`,
    }));
    setExistingFiles(existingFilesList);
    setIsmodlaupdatedata(true);
  };

  const handleDeleteImage = async (file: UploadFile) => {
    const imageId = file.uid;

    try {
      const response = await manageinformationNewsServices.deletenewsImage(+imageId);

      if (response) {
        const updatedFiles = existingFiles.filter((existingFile) => existingFile.uid !== imageId);
        setExistingFiles(updatedFiles);
        notifySuccess("setting.image.delete");
        setSubmitLoading(true);
      } else {
        notifyError(undefined, "setting.image.delete");
      }
    } catch {
      notifyError(undefined, "setting.image.delete");
    }
  };

  const handleInputNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFileName(e.target.value);
  };
  const handleInputTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFileType(e.target.value);
  };

  const filteredData = informationNews.filter(
    (news) =>
      news.newsName.toLowerCase().includes(searchFileName.toLowerCase()) || news.newsType.toLowerCase().includes(searchFileType.toLowerCase()),
  );

  const handledetail = () => {
    setIsmodladetail(false);
  };

  const handleCanceupdate = () => {
    setAttendFiles([]);
    setIsmodlaupdatedata(false);
  };

  const dataWithKey = filteredData.map((item, index) => ({
    ...item,
    key: index + 1,
    index: index + 1,
  }));

  const columns: TableProps<informationNews>["columns"] = [
    {
      title: "ลำดับ",
      dataIndex: "key",
      key: "key",
      align: "center",
      width: "40px",
      fixed: "left",
    },
    {
      title: "ชื่อข่าวสาร",
      dataIndex: "newsName",
      key: "newsName",
      width: "350px",
      fixed: "left",
    },
    {
      title: "ประเภทข่าวสาร",
      dataIndex: "newsType",
      key: "newsType",
      width: "150px",
    },
    {
      title: "วันที่สร้าง",
      dataIndex: "phblishedAt",
      key: "phblishedAt",
      width: "170px",
      render: (phblishedAt: Date) => moment(phblishedAt).format("DD/MM/YYYY HH:mm" + " น."),
    },
    {
      title: "วันที่อัปเดต",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: "170px",
      render: (updatedAt: Date) => moment(updatedAt).format("DD/MM/YYYY HH:mm" + " น."),
    },

    {
      title: "เนื้อหา",
      dataIndex: "content",
      key: "content",
      width: "45px",
      align: "center",
      render: (_: any, record: informationNews) => (
        <a onClick={() => detailnews(record)}>
          <Tooltip title="View">
            <EyeOutlined style={{ fontSize: "24px", color: "#08c", cursor: "pointer" }} />
          </Tooltip>
        </a>
      ),
    },
    {
      title: "ผู้เขียน",
      dataIndex: "author",
      key: "author",
      width: "170px",
    },
    {
      title: "การมองเห็น",
      dataIndex: "status",
      key: "status",
      width: "90px",
      align: "center",
      render: (status: boolean) => (status ? <Tag color="green">เปิดการมองเห็น</Tag> : <Tag color="red">ปิดการมองเห็น</Tag>),
    },
    {
      title: "การจัดการ",
      dataIndex: "manage",
      key: "manage",
      width: "60px",
      align: "center",
      render: (record: number, row: any) => (
        <Space size="middle">
          <Tooltip title="แก้ไข">
            <Button size="small" type="link" onClick={() => showModalinformationNews(row)}>
              <FormOutlined />
            </Button>
          </Tooltip>
          <Popconfirm title="คุณแน่ใจหรือไม่ว่าต้องการลบข่าวสารนี้?" onConfirm={() => handleDeleteNews(row)} okText="ใช่" cancelText="ไม่">
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
      <div style={{ margin: " 10px 40px 20px 0px ", fontSize: "20px" }}>
        คำเตือน : รูปภาพของคุณในการแก้ไขข่าวสาร คุณจะไม่สามารถอัพรูปภาพได้เกิน 3 ภาพ / 1 ข่าวสาร
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "16px",
        }}>
        <div>
          <div>
            ค้นหาชื่อข่าวสาร :
            <Input
              type="text"
              value={searchFileName}
              onChange={handleInputNameChange}
              placeholder="ค้นหาชื่อข่าวสาร"
              style={{
                margin: "10px 10px 20px 10px",
                width: "300px",
              }}
            />
            ค้นหาประเภทข่าวสาร :
            <Input
              type="text"
              value={searchFileType}
              onChange={handleInputTypeChange}
              placeholder="ค้นหาประเภทข่าวสาร"
              style={{
                margin: "10px 10px 20px 10px",
                width: "300px",
              }}
            />
          </div>
        </div>
      </div>
      <Table
        size="small"
        dataSource={dataWithKey}
        columns={columns}
        scroll={{ x: "max-content" }}
        rowKey="key"
        bordered
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title="เนื้อหาข่าวสาร"
        width={600}
        open={Ismodladetail}
        onCancel={handledetail}
        footer={null}
        destroyOnClose
        style={{ textAlign: "center" }}>
        <Form form={formdetail}>
          <Form.Item<informationNews> name="content">
            <Input.TextArea
              style={{
                fontSize: "16px",
                userSelect: "none",
                border: "none",
                outline: "none",
                resize: "none",
                boxShadow: "none",
              }}
              rows={27}
              readOnly
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="แก้ไขการมองเห็นข่าวสาร" open={Ismodlaupdatedata} onCancel={handleCanceupdate} footer={null} destroyOnClose width={950}>
        <Form form={form} onFinish={informationNewsUpdate} layout="vertical">
          <Form.Item
            name="newsId"
            label="ชื่อประเภทข่าวสาร :"
            rules={[{ required: true, message: "กรุณากรอกชื่อประเภทข่าวสาร" }]}
            style={{
              width: "300px",
              visibility: "hidden",
              margin: " 0 -60px -60px 0 ",
            }}>
            <Input placeholder="ชื่อประเภทข่าวสาร" />
          </Form.Item>
          <Form.Item
            name="newsName"
            label="หัวข้อข่าวสาร :"
            rules={[{ required: true, message: "กรุณากรอกหัวข้อข่าวสาร" }]}
            style={{ width: "300px" }}>
            <Input placeholder="หัวข้อข่าวสาร" showCount maxLength={50} />
          </Form.Item>
          <Form.Item
            name="newsType"
            label="ประเภทข่าวสาร :"
            rules={[{ required: true, message: "กรุณากรอกประเภทข่าวสาร" }]}
            style={{ width: "300px" }}>
            <Select placeholder="ประเภทข่าวสาร">
              {newsTypeOptions
                .filter((option) => {
                  const type = newsType.find((type) => type.nameType === option.label);
                  return type && type.status;
                })
                .map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="content"
            label="เนื้อหาข่าวสาร : "
            rules={[{ required: true, message: "กรุณากรอกเนื้อหาข่าวสาร" }]}
            style={{ width: "900px" }}>
            <Input.TextArea rows={12} placeholder="เนื้อหาข่าวสาร" />
          </Form.Item>
          <Form.Item label="รูปภาพปัจจุบัน:">
            {existingFiles.map((file, index) => (
              <div key={index} style={{ marginBottom: "20px", position: "relative" }}>
                <Image preview={false} crossOrigin="anonymous" src={file.url} style={{ width: "475px", height: "400px" }} alt="news" />
                <Button
                  type="primary"
                  danger
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                  }}
                  onClick={() => handleDeleteImage(file)}>
                  ลบรูปภาพ
                </Button>
              </div>
            ))}
          </Form.Item>
          <Form.Item valuePropName="fileList">
            <div>
              <p
                style={{
                  color: "red",
                  fontSize: "16px",
                  margin: " 0 0 -5px 0",
                }}>
                คำเตือน **
              </p>
              รูปภาพของคุณในการอัปเดตข่าวสาร รวมถึงรูปเก่าในข้อมูลเดิม คุณจะไม่สามารถอัพรูปภาพได้เกิน 3 ภาพ / 1 ข่าวสาร
            </div>
            <Upload
              fileList={[...attendFiles]}
              onChange={handleChangeAttendFiles}
              beforeUpload={beforeUploadAttendFiles}
              multiple={true}
              accept=".png,.jpg,.jpeg"
              listType="picture">
              <Button icon={<UploadOutlined />}>อัปโหลดรูปภาพ</Button>
            </Upload>
          </Form.Item>

          <Form.Item name="status" label="สถานะการมอง :" style={{ width: "300px" }}>
            <Switch checkedChildren="เปิดการมอง" unCheckedChildren="ปิดการมอง" defaultChecked />
          </Form.Item>
          <div className="flex justify-end w-full">
            <Form.Item>
              <Button type="default" onClick={handleCanceupdate} style={{ marginRight: 8 }}>
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

export default InfoTableNews;
