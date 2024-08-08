"use client";
import React, { useState, useEffect } from "react";
import { AntDesignOutlined } from "@ant-design/icons";
import type { TableProps, FormProps } from "antd";
import { DeleteIcon, EditIcon } from "@/components/icon";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManageinformationNewsServices } from "../../service/information.service";
import { useForm } from "antd/es/form/Form";
import { useSession } from "next-auth/react";
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
} from "antd";
import { EyeOutlined } from "@ant-design/icons";

export interface informationNews {
  newsId: number;
  newsName: string;
  content: string;
  newsType: string;
  author: string;
  phblishedAt: string;
  updatedAt: Date | string;
  status: boolean;
}

const Newoption: React.FC = () => {
  const { data: session } = useSession();
  const intraAuth = useAxiosIntranet();
  const [informationNews, setinformationNews] = useState<informationNews[]>([]);
  const manageinformationNewsServices = ManageinformationNewsServices(intraAuth);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [form] = useForm();
  const [formdetail] = useForm();
  const [Ismodladetail, setIsmodladetail] = useState(false);
  const [Ismodlaupdatedata, setIsmodlaupdatedata] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDatainformationNews();
  }, []);

  const fetchDatainformationNews = async () => {
    try {
      const maresponse = await manageinformationNewsServices.getinformationNewsQuery();
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

  const detailnews = (record: informationNews) => {
    formdetail.setFieldsValue({
      ...record,
      phblishedAt: dayjs(record.phblishedAt),
    });
    setIsmodladetail(true);
  };
  
  const updatedinformation: FormProps<informationNews>["onFinish"] = async (values) => {
    setSubmitLoading(true);

    try {
      const updateinformationNews = {
        newsId: values?.newsId,
        newsName: values?.newsName,
        content: values?.content,
        newsType: values?.newsType,
        author: session?.user.username,
        phblishedAt: new Date(values.phblishedAt),
        updatedAt: values?.updatedAt,
        status: values?.status,
      };
      await manageinformationNewsServices.updateinformationNews(updateinformationNews);
      message.success("แก้ไขข้อมูลห้องสำเร็จ");

      fetchDatainformationNews();
      setSubmitLoading(false);
      setIsmodlaupdatedata(false);
    } catch (error) {
      message.error("แก้ไขข้อมูลห้องไม่สำเร็จ");
    }
  };

  const handleDeleteNews = async (newsId: number) => {
    try {
      await manageinformationNewsServices.deleteinformationNews(newsId);
      setinformationNews(informationNews.filter((item) => item.newsId !== newsId));
      message.success("ลบการจองสำเร็จ");
      fetchDatainformationNews();
    } catch (error) {
      message.error("ลบการจองไม่สำเร็จ");
    }
  };

  const showModalEditMaCarType = (record: informationNews) => {
    form.setFieldsValue({
      ...record,
      phblishedAt: dayjs(record.phblishedAt),
      updatedAt: dayjs(record.updatedAt),
    });
    setIsmodlaupdatedata(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = informationNews.filter((news) =>
    news.newsName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handledetail = () => {
    setIsmodladetail(false);
  };

  const handleCanceupdate = () => {
    setIsmodlaupdatedata(false);
  };

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
            <a onClick={() => showModalEditMaCarType(row)}>
              <EditIcon width="24" height="24" />{" "}
            </a>
          </Tooltip>
          <Popconfirm
            title="คุณแน่ใจหรือไม่ว่าต้องการลบการจองนี้?"
            onConfirm={() => handleDeleteNews(row.newsId)}
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
        <Form
          form={form}
          onFinish={updatedinformation}
          layout="vertical"
        >
          <Form.Item
            name="newsId"
            label="ชื่อประเภทข่าวสาร :"
            style={{
              width: "300px",
              // visibility: "hidden",
              // margin: "0 0 -60px 0",
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
              <Button
                type="primary"
                htmlType="submit"
                loading={submitLoading}
              >
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
