"use client";
import React, { useState, useEffect } from "react";
import { AntDesignOutlined } from "@ant-design/icons";
import type { TableProps, FormProps } from "antd";
import ImageUpload from "./ImageUpload";
import { ManageinformationNewsServices } from "../../service/information.service";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { useForm } from "antd/es/form/Form";
import { useSession } from "next-auth/react";
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
  TabsProps,
  Tabs,
  DatePicker,
} from "antd";

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
  imageId: Number;
  newsId: Number;
  createdAt: String;
  updatedAt: String;
  fileimageName: String;
  fileimagePath: String;
}
export interface newsType {
  idType: Number;
  nameType: String;
  deteil: String;
  createAt: String;
  status: boolean;
}
const { TextArea } = Input;

const Infomation_management: React.FC = () => {
  const { data: session } = useSession();
  const [submitLoading, setSubmitLoading] = useState(true);
  const intraAuth = useAxiosIntranet();
  const [informationNews, setinformationNews] = useState<informationNews[]>([]);
  const [newsType, setnewsType] = useState<newsType[]>([]);
  const [newsTypeOptions, setnewsTypeOptions] = useState<
    {
      value: number;
      label: string;
    }[]
  >([]);
  const manageinformationNewsServices =
    ManageinformationNewsServices(intraAuth);
  const [form] = useForm();

  const handleFilesUpload = (files: File[]) => {
    // คุณสามารถส่งไฟล์ไปยังเซิร์ฟเวอร์ของคุณได้ที่นี่
  };
  useEffect(() => {
    fetchDatainformationNews();
    fetchDataType();
  }, []);

  const informationNewsCreateDatacreate: FormProps<
    informationNews & newsImage
  >["onFinish"] = async (values) => {
    setSubmitLoading(true);
    // const carIdData = maCar.findLast((car) => car.carId === values.carId);
    // console.log(`${carIdData}`);

    const informationNewsCreateData = {
      data: {
        newsId: values.newsId,
        newsName: values.newsName,
        content: values.content,
        newsType: values.newsType,
        author: session?.user.username,
        phblishedAt: new Date().toISOString(),
        updatedAt: values.updatedAt,
        status: values.status,
      },
    };
    try {
      const response =
        await manageinformationNewsServices.createinformationNews(
          informationNewsCreateData
        );
      if (response) {
        message.success("เพิ่มข่าวสารสำเร็จ");
        form.resetFields();
      } else {
        message.error("เพิ่มข่าวสารไม่สำเร็จ");
      }
      setSubmitLoading(false);
      fetchDatainformationNews();
    } catch (error) {
      message.error("เพิ่มข่าวสารไม่สำเร็จ");
      setSubmitLoading(false);
    }
  };
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
      setSubmitLoading(false);
    } catch (error) {
      message.error("Failed to fetch car data");
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
      setnewsType(maresponse)
    } catch (error) {
      message.error("Failed to fetch car data");
    }
  };

  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <div style={{ margin: " 10px 0 0 10px " }}>
        <Form
          form={form}
          onFinish={informationNewsCreateDatacreate}
          layout="vertical"
        >
          <Form.Item
            name="newsName"
            label="หัวข้อข่าวสาร"
            style={{ width: "300px" }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="newsType"
            label="ประเภทข่าวสาร:"
            style={{ width: "300px" }}
          >
            <Select>
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
            style={{ width: "500px" }}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="updatedAt"
            label="วันที่เผยแพร่ :"
            style={{ width: "300px" }}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="carId"
            label="รูปอัพโหลด :"
            style={{ margin: "10px 0 0 0", width: "500px" }}
          >
            <ImageUpload />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitLoading}
              style={{ margin: "20px 0 0 0" }}
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
