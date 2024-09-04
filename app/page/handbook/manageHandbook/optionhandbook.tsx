"use client";
import React, { useState, useEffect } from "react";
import type { TableProps, FormProps } from "antd";
import { DeleteIcon, EditIcon } from "@/components/icon";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManagehandbookFileServices } from "../service/handbook.service";
import { useForm } from "antd/es/form/Form";
import {
  Table,
  Space,
  Button,
  Modal,
  Form,
  Input,
  Tag,
  message,
  Popconfirm,
  Tooltip,
  Switch,
} from "antd";
import moment from "moment";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
export interface handbooktype {
  idhandtype: Number;
  nameType: String;
  createAt: String;
  updatedAt: String;
  status: boolean;
}
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

const Newoption: React.FC = () => {
  const intraAuth = useAxiosIntranet();
  const [handbooktype, sethandbooktype] = useState<handbooktype[]>([]);
  const [handbook, sethandbook] = useState<handbook[]>([]);
  const [handbookFile, sethandbookFile] = useState<handbookFile[]>([]);
  const managehandbookFileServices = ManagehandbookFileServices(intraAuth);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [IsmodlaOpencreate, setIsmodlaOpencreate] = useState(false);
  const [modalEditnewType, setModalEditnewType] = useState(false);
  const [form] = useForm();
  const [formEdit] = useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const { data: session } = useSession();
  useEffect(() => {
    fetchDatahandbooktype();
    fetchDataHandbookfile();
    fetchDataHandbook();
  }, []);

  const fetchDatahandbooktype = async () => {
    try {
      const maresponse =
        await managehandbookFileServices.gethandbooktypeQuery();
      const handbooktype: handbooktype[] = maresponse.map(
        (item: any, index: number) => ({
          ...item,
          key: index.toString(),
        })
      );
      sethandbooktype(handbooktype);
      setSubmitLoading(false);
    } catch (error) {
      message.error("ไม่สามารถเรียกข้อมูลเอกสารได้");
    }
  };
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
    } catch (error) {
      message.error("ไม่สามารถเรียกข้อมูลเอกสารได้");
    }
  };
  const fetchDataHandbook = async () => {
    try {
      const maresponse = await managehandbookFileServices.gethandbookQuery();
      const handbook: handbook[] = maresponse.map((item: any) => ({
        ...item,
        images: item.handbookFile,
      }));
      sethandbook(handbook);
      setSubmitLoading(false);
    } catch (error) {
      message.error("ไม่สามารถเรียกข้อมูลเอกสารได้");
    }
  };
  const newsTypeCreateDatacreate: FormProps<handbooktype>["onFinish"] = async (
    values
  ) => {
    setSubmitLoading(true);
    const informationNewsCreateData = {
      data: {
        idhandtype: values.idhandtype,
        nameType: values.nameType,
        createAt: new Date().toISOString(),
        status: values.status,
      },
    };
    try {
      const response = await managehandbookFileServices.createhandbooktype(
        informationNewsCreateData
      );
      if (response) {
        message.success("เพิ่มประเภทเอกสารสำเร็จ");
        form.resetFields();
      } else {
        message.error("เพิ่มประเภทเอกสารไม่สำเร็จ");
      }
      setSubmitLoading(false);
      fetchDatahandbooktype();
      fetchDataHandbookfile();
      fetchDataHandbook();
      setIsmodlaOpencreate(false);
    } catch (error) {
      message.error("เพิ่มประเภทเอกสารไม่สำเร็จ");
      setSubmitLoading(false);
    }
  };

  const updatednewType: FormProps<handbooktype>["onFinish"] = async (
    values
  ) => {
    setSubmitLoading(true);

    try {
      const updatenewType = {
        idhandtype: values?.idhandtype,
        nameType: values?.nameType,
        updatedAt: new Date().toISOString(),
        author: `${session?.user.firstNameTh} ${session?.user.lastNameTh}`,
        status: values?.status,
      };
      await managehandbookFileServices.updatehandbooktype(updatenewType);
      message.success("แก้ไขประเภทเอกสารสำเร็จ");
      fetchDatahandbooktype();
      fetchDataHandbookfile();
      fetchDataHandbook();
      formEdit.resetFields();
      setSubmitLoading(false);
      setModalEditnewType(false);
    } catch (error) {
      message.error("แก้ไขประเภทเอกสารไม่สำเร็จ");
    }
  };

  const handleDeletenewType = async (record: handbooktype) => {
    record.idhandtype;
    console.log(record.idhandtype);
    try {
      await managehandbookFileServices.deletehandbooktype(record.idhandtype);
      sethandbooktype(
        handbooktype.filter((item) => item.idhandtype !== record.idhandtype)
      );
      message.success("ลบประเภทเอกสารสำเร็จ");
      fetchDatahandbooktype();
    } catch (error) {
      message.error("ลบประเภทเอกสารไม่สำเร็จ");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const searthnews = handbooktype.filter((handbooktype) =>
    handbooktype.nameType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showModalEditnewType = (record: handbooktype) => {
    formEdit.setFieldsValue({
      ...record,
    });
    setModalEditnewType(true);
  };
  const modalopencreate = () => {
    setIsmodlaOpencreate(true);
  };
  const handleclosecreate = () => {
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

  const columns: TableProps<handbooktype>["columns"] = [
    {
      title: "ลำดับ",
      dataIndex: "key",
      key: "key",
      width: "40px",
      align: "center",
    },
    {
      title: "ชื่อประเภทเอกสาร",
      dataIndex: "nameType",
      key: "nameType",
      width: "400px",
    },
    {
      title: "วันที่สร้าง",
      dataIndex: "createAt",
      key: "createAt",
      width: "100px",
      render: (createAt: Date) =>
        moment(createAt).format("DD/MM/YYYY HH:mm" + " น."),
      ellipsis: true,
    },
    {
      title: "วันที่อัปเดต",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: "100px",
      render: (updatedAt: Date) =>
        moment(updatedAt).format("DD/MM/YYYY HH:mm" + " น."),
      ellipsis: true,
    },
    {
      title: "การมองเห็น",
      dataIndex: "status",
      key: "status",
      width: "80px",
      align: "center",
      ellipsis: true,
      render: (status: boolean) =>
        status ? (
          <Tag color="green">เปิดการมองเห็น</Tag>
        ) : (
          <Tag color="red">ปิดการมองเห็น</Tag>
        ),
    },
    {
      title: "ผู้อัปโหลด",
      dataIndex: "author",
      key: "author",
      width: "100px",
    },
    {
      title: "การจัดการ",
      dataIndex: "x",
      key: "x",
      align: "center",
      width: "80px",
      render: (row: number, record: handbooktype) => (
        <Space size="middle">
          <Tooltip title="แก้ไข">
            <a onClick={() => showModalEditnewType(record)}>
              <EditIcon width="24" height="24" />{" "}
            </a>
          </Tooltip>
          <Popconfirm
            title="คุณแน่ใจหรือไม่ว่าต้องการลบการเอกสารนี้?"
            onConfirm={() => handleDeletenewType(record)}
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
            ค้นหาชื่อประเภทเอกสาร :
            <Input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="ค้นหาชื่อประเภทเอกสาร"
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
          onClick={modalopencreate}
        >
          การอัพโหลดไฟล์
        </Button>
      </div>
      <Modal
        title="เพิ่มข้อมูลตรวจสภาพรถ"
        open={IsmodlaOpencreate}
        onCancel={handleclosecreate}
        footer={null}
        destroyOnClose
      >
        <Form form={form} onFinish={newsTypeCreateDatacreate} layout="vertical">
          <Form.Item
            name="nameType"
            label="ชื่อประเภทเอกสาร :"
            rules={[{ required: true, message: "กรุณากรอกชื่อประเภทเอกสาร" }]}
            style={{ width: "300px" }}
          >
            <Input placeholder="ชื่อประเภทเอกสาร" />
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
                onClick={handleclosecreate}
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

      <Modal
        title="แก้ไขการมองเอกสาร"
        open={modalEditnewType}
        onCancel={handleCancel1edit}
        footer={null}
        destroyOnClose
      >
        <Form form={formEdit} onFinish={updatednewType} layout="vertical">
          <Form.Item<handbooktype>
            name="idhandtype"
            label="ชื่อประเภทเอกสาร :"
            style={{
              width: "300px",
              visibility: "hidden",
              margin: "0 0 -60px 0",
            }}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="nameType"
            label="ชื่อประเภทเอกสาร :"
            rules={[{ required: true, message: "กรุณากรอกชื่อประเภทเอกสาร" }]}
            style={{ width: "300px" }}
          >
            <Input placeholder="ชื่อประเภทเอกสาร" />
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
                onClick={handleCancel1edit}
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
export default Newoption;
