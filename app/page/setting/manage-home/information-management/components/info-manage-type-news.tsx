"use client";
import React, { useState, useEffect } from "react";
import type { TableProps, FormProps } from "antd";
import { DeleteIcon, EditIcon } from "@/components/icon";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { useForm } from "antd/es/form/Form";
import { Table, Space, Button, Modal, Form, Input, Tag, Popconfirm, Tooltip, Switch } from "antd";
import moment from "moment";
import { ManageinformationNewsServices } from "../services/information.service";
import { DeleteOutlined, FormOutlined } from "@ant-design/icons";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import { notifyError, notifySuccess } from "@/app/utils/message";
export interface newType {
  idType: Number;
  nameType: string;
  deteil: string;
  updatedAt: string;
  createAt: string;
  status: boolean;
}

const InfoTypeNews: React.FC = () => {
  const [form] = useForm();
  const [formEdit] = useForm();
  const { id24Axios } = useId24();
  const baseUrlIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const manageinformationNewsServices = ManageinformationNewsServices(baseUrlIntranet);
  const [newType, setnewType] = useState<newType[]>([]);
  const [submitLoading, setSubmitLoading] = useState<boolean>(true);
  const [IsmodlaOpencreate, setIsmodlaOpencreate] = useState<boolean>(false);
  const [modalEditnewType, setModalEditnewType] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    if (submitLoading) fetchDatanewType();
  }, [submitLoading]);

  const fetchDatanewType = async () => {
    try {
      const maresponse = await manageinformationNewsServices.getnewsTypeQuery();
      const newType: newType[] = maresponse.map((item: any, index: number) => ({
        ...item,
        key: index.toString(),
      }));
      setnewType(newType);
      setSubmitLoading(false);
    } catch (error) {
      notifyError(error, "setting.news.load");
    }
  };

  const newsTypeCreateDatacreate: FormProps<newType>["onFinish"] = async (values) => {
    const informationNewsCreateData = {
      data: {
        nameType: values.nameType,
        deteil: values.deteil,
        updatedAt: new Date().toISOString(),
        createAt: new Date().toISOString(),
        status: values.status,
      },
    };
    try {
      const response = await manageinformationNewsServices.createnewsType(informationNewsCreateData);
      if (response) {
        notifySuccess("setting.newstype.create");
        form.resetFields();
        setIsmodlaOpencreate(false);
      } else {
        notifyError(undefined, "setting.newstype.create");
      }
      setSubmitLoading(true);
    } catch (error) {
      notifyError(error, "setting.newstype.create");
      setSubmitLoading(true);
    }
  };

  const updatednewType: FormProps<newType>["onFinish"] = async (values) => {
    try {
      const updatenewType = {
        idType: values?.idType,
        nameType: values?.nameType,
        deteil: values?.deteil,
        updatedAt: new Date().toISOString(),
        status: values?.status,
      };
      await manageinformationNewsServices.updatenewsType(updatenewType);
      notifySuccess("setting.newstype.update");
      setSubmitLoading(true);
      setModalEditnewType(false);
    } catch (error) {
      setSubmitLoading(true);
      notifyError(error, "setting.newstype.update");
    }
  };

  const handleDeletenewType = async (idType: number) => {
    try {
      await manageinformationNewsServices.deletenewsType(idType);
      setnewType(newType.filter((item) => item.idType !== idType));
      notifySuccess("setting.newstype.delete");
      setSubmitLoading(true);
    } catch (error) {
      notifyError(error, "setting.newstype.delete");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const searthnews = newType.filter((newType) => newType.nameType.toLowerCase().includes(searchTerm.toLowerCase()));

  const showModalEditnewType = (record: newType) => {
    formEdit.setFieldsValue(record);
    setModalEditnewType(true);
  };
  const modalopencreate = () => {
    setIsmodlaOpencreate(true);
  };
  const handleclosecreate = () => {
    form.resetFields();
    setIsmodlaOpencreate(false);
  };
  const handleCancel1edit = () => {
    setModalEditnewType(false);
  };
  const dataWithKey = searthnews.map((item, index) => ({
    ...item,
    key: index + 1,
    index: index + 1,
  }));

  const columns: TableProps<newType>["columns"] = [
    {
      title: "ลำดับ",
      dataIndex: "key",
      key: "key",
      width: "40px",
      align: "center",
      fixed: "left",
    },
    {
      title: "ชื่อประเภทข่าวสาร",
      dataIndex: "nameType",
      key: "nameType",
      width: "300px",
      fixed: "left",
    },
    {
      title: "รายละเอียด",
      dataIndex: "deteil",
      key: "deteil",
      width: "170px",
    },
    {
      title: "วันที่สร้าง",
      dataIndex: "createAt",
      key: "createAt",
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
      title: "การมองเห็น",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: "80px",
      render: (status: boolean) => (status ? <Tag color="green">เปิดการมองเห็น</Tag> : <Tag color="red">ปิดการมองเห็น</Tag>),
    },
    {
      title: "การจัดการ",
      dataIndex: "manage",
      key: "manage",
      align: "center",
      width: "70px",
      render: (record: newType, row: any) => (
        <Space size="middle">
          <Tooltip title="แก้ไข">
            <Button size="small" type="link" onClick={() => showModalEditnewType(row)}>
              <FormOutlined />
            </Button>
          </Tooltip>
          <Popconfirm
            title="คุณแน่ใจหรือไม่ว่าต้องการลบประเภทข่าวสารนี้ ? "
            onConfirm={() => handleDeletenewType(row.idType)}
            okText="ใช่"
            cancelText="ไม่">
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "16px",
        }}>
        <div
          style={{
            margin: "10px 10px 10px 20px",
          }}>
          ค้นหาประเภทข่าวสาร :
          <Input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="ค้นหาประเภทข่าวสาร"
            style={{
              margin: "10px 10px 10px 10px",
              width: "300px",
            }}
          />
        </div>
        <Button style={{ alignContent: "right" }} type="primary" onClick={modalopencreate}>
          สร้างประเภทข่าวสาร
        </Button>
      </div>
      <Modal title="สร้างประเภทข้อมูลข่าวสาร" open={IsmodlaOpencreate} onCancel={handleclosecreate} footer={null} destroyOnClose>
        <Form form={form} onFinish={newsTypeCreateDatacreate} layout="vertical">
          <Form.Item
            name="nameType"
            label="ชื่อประเภทข่าวสาร :"
            rules={[{ required: true, message: "กรุณากรอกชื่อประเภทข่าวสาร" }]}
            style={{ width: "460px" }}>
            <Input placeholder="ชื่อประเภทข่าวสาร" showCount maxLength={50} />
          </Form.Item>
          <Form.Item
            name="deteil"
            label="รายละเอียดข่าวสาร :"
            rules={[{ required: true, message: "กรุณากรอกรายละเอียดข่าวสาร" }]}
            style={{ width: "460px" }}>
            <Input.TextArea rows={12} placeholder="รายละเอียดข่าวสาร" showCount maxLength={200} />
          </Form.Item>
          <Form.Item name="status" label="สถานะการมอง :" style={{ width: "460px" }}>
            <Switch checkedChildren="เปิดการมอง" unCheckedChildren="ปิดการมอง" defaultChecked />
          </Form.Item>
          <div className="flex justify-end w-full">
            <Form.Item>
              <Button type="default" onClick={handleclosecreate} style={{ marginRight: 8 }}>
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

      <Modal title="แก้ไขประเภทข้อมูลข่าวสาร" open={modalEditnewType} onCancel={handleCancel1edit} footer={null} destroyOnClose>
        <Form form={formEdit} onFinish={updatednewType} layout="vertical">
          <Form.Item
            name="idType"
            label="ชื่อประเภทข่าวสาร :"
            style={{
              width: "450px",
              visibility: "hidden",
              margin: "0 0 -60px 0",
            }}>
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="nameType"
            label="ชื่อประเภทข่าวสาร :"
            rules={[{ required: true, message: "กรุณากรอกชื่อประเภทข่าวสาร" }]}
            style={{ width: "460px" }}>
            <Input placeholder="ชื่อประเภทข่าวสาร" showCount maxLength={50} />
          </Form.Item>
          <Form.Item
            name="deteil"
            label="รายละเอียดข่าวสาร :"
            rules={[{ required: true, message: "กรุณากรอกรายละเอียดข่าวสาร" }]}
            style={{ width: "460px" }}>
            <Input.TextArea rows={12} placeholder="รายละเอียดข่าวสาร" showCount maxLength={200} />
          </Form.Item>
          <Form.Item name="status" label="สถานะการมอง :" style={{ width: "460px" }}>
            <Switch checkedChildren="เปิดการมอง" unCheckedChildren="ปิดการมอง" defaultChecked />
          </Form.Item>
          <div className="flex justify-end w-full">
            <Form.Item>
              <Button type="default" onClick={handleCancel1edit} style={{ marginRight: 8 }}>
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
      <Table
        size="small"
        dataSource={dataWithKey}
        columns={columns}
        scroll={{ x: "max-content" }}
        rowKey="key"
        bordered
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};
export default InfoTypeNews;
