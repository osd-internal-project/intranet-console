"use client";
import React, { useState, useEffect } from "react";
import type { FormProps } from "antd";
import { ManageinformationNewsServices } from "../../service/information.service";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { useForm } from "antd/es/form/Form";
import { useSession } from "next-auth/react";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { RcFile } from "antd/es/upload";
import { Select, Button, Form, Input, message, DatePicker, Upload } from "antd";
export interface informationNews {
  newsId: Number;
  newsName: String;
  content: String;
  newsType: String;
  author: String;
  phblishedAt: String;
  updatedAt: String;
  status: boolean;
}
export interface newsImage {
  imageId?: number | undefined;
  newsIdimg?: number | undefined;
  createdAt?: String;
  updatedAt?: String;
  fileimageName?: String;
  fileimagePath?: String;
  onSaveimgnews?: (
    imageId: number | undefined,
    newsIdimg: number,
    dataForm: newsImage,
    attendFiles: UploadFile[]
  ) => void;
}

export interface newsType {
  idType: Number;
  nameType: String;
  deteil: String;
  createAt: String;
  status: boolean;
}

const Infomation_management: React.FC<newsImage> = ({}) => {
  const { data: session } = useSession();
  const [submitLoading, setSubmitLoading] = useState(true);
  const intraAuth = useAxiosIntranet();
  const [attendFiles, setAttendFiles] = useState<UploadFile[]>([]);
  const [informationNews, setinformationNews] = useState<informationNews[]>([]);
  const [newsType, setnewsType] = useState<newsType[]>([]);
  const [newsimage, setnewsimage] = useState<newsImage[]>([]);
  const [newsTypeOptions, setnewsTypeOptions] = useState<
    {
      value: number;
      label: string;
    }[]
  >([]);
  const manageinformationNewsServices =
    ManageinformationNewsServices(intraAuth);
  const [form] = useForm();

  useEffect(() => {
    fetchDatainformationNews();
    fetchDataType();
    fetchDatanewimage();
    setAttendFiles([]);
  }, []);

  const fetchDatainformationNews = async () => {
    try {
      const maresponse =
        await manageinformationNewsServices.getinformationNewsQuery();
      const informationNews: informationNews[] = maresponse.map(
        (item: any, index: number) => ({
          ...item,
          key: index.toString(),
        })
      );
      setinformationNews(informationNews);
    } catch (error) {
      message.error("ไม่สามารถโหลดข้อมูลข่าวสารได้");
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
      message.error("ไม่สามารถโหลดข้อมูลข่าวสารได้");
    }
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
      message.error("ไม่สามารถโหลดข้อมูลข่าวสารได้");
    }
  };
  const informationNewsCreate: FormProps<
    informationNews & newsImage
  >["onFinish"] = async (values) => {
    setSubmitLoading(true);
    const informationNewsCreateData = {
      data: {
        newsId: values?.newsId,
        newsName: values.newsName,
        content: values.content,
        newsType: values.newsType,
        author: `${session?.user.firstNameTh} ${session?.user.lastNameTh}`,
        phblishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: values.status,
      },
    };
    try {
      const response =
        await manageinformationNewsServices.createinformationNews(
          informationNewsCreateData
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
        fetchDatainformationNews();
        fetchDataType();
        setAttendFiles([]);
      }
      if (response) {
        message.success("เพิ่มข่าวสารสำเร็จ");
        fetchDatainformationNews();
        fetchDataType();
        setAttendFiles([]);
        form.resetFields();
      } else {
        message.error("เพิ่มข่าวสารไม่สำเร็จ");
        fetchDatainformationNews();
        fetchDataType();
        setAttendFiles([]);
        form.resetFields();
      }
      fetchDatainformationNews();
      fetchDataType();
      setAttendFiles([]);
      setSubmitLoading(false);
    } catch (error) {
      message.error("เพิ่มข่าวสารไม่สำเร็จ");
      fetchDatainformationNews();
      fetchDataType();
      setAttendFiles([]);
      form.resetFields();
      setSubmitLoading(false);
    }
  };

  const handleChangeAttendFiles: UploadProps["onChange"] = async ({
    fileList: newFileList,
  }) => {
    if (newFileList.length > 3) {
      message.warning("คุณไม่สามารถอัปโหลดภาพเกิน 3 ไฟล์ได้");
      return Upload.LIST_IGNORE;
    }
    return setAttendFiles(newFileList);
  };

  const beforeUploadAttendFiles = (file: RcFile) => {
    if (attendFiles.find((oneFile) => oneFile.name === file.name)) {
      message.warning(`ชื่อไฟล์ ${file.name} ซ้ำ`);
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <div style={{ margin: " 10px 40px 50px 10px " }}>
        <div style={{ margin: " 10px 40px 20px 0px ", fontSize: "20px" }}>
          คำเตือน : รูปภาพของคุณในการสร้างข่าวสาร คุณจะไม่สามารถอัพรูปภาพได้เกิน
          3 ภาพ / 1 ข่าวสาร
        </div>
        <Form form={form} onFinish={informationNewsCreate} layout="vertical">
          <Form.Item
            name="newsName"
            label="หัวข้อข่าวสาร"
            rules={[{ required: true, message: "กรุณากรอกหัวข้อข่าวสาร" }]}
            style={{ width: "300px" }}
          >
            <Input placeholder="หัวข้อข่าวสาร" showCount maxLength={50}/>
          </Form.Item>
          <Form.Item
            name="newsType"
            label="ประเภทข่าวสาร:"
            rules={[{ required: true, message: "กรุณากรอกประเภทข่าวสาร" }]}
            style={{ width: "300px" }}
          >
            <Select placeholder="ประเภทข่าวสาร">
              {newsTypeOptions
                .filter((option) => {
                  const type = newsType.find(
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
          <Form.Item
            name="content"
            label=" เนื้อหาข่าวสาร : "
            rules={[{ required: true, message: "กรุณากรอกเนื้อหาข่าวสาร" }]}
            style={{ width: "900px" }}
          >
            <Input.TextArea rows={15} placeholder="เนื้อหาข่าวสาร" />
          </Form.Item>
          <Form.Item valuePropName="filelist">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <Upload
                listType="picture"
                fileList={attendFiles}
                onChange={handleChangeAttendFiles}
                beforeUpload={beforeUploadAttendFiles}
                multiple={true}
                accept=".png,.jpg,.jpeg"
              >
                <Button icon={<UploadOutlined />}>อัปโหลดรูปภาพ</Button>
              </Upload>
            </div>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              loading={submitLoading}
              style={{ marginTop: 16 }}
              htmlType="submit" 
            >
              สร้างข่าวสาร
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Infomation_management;
