"use client";
import React, { useState, useEffect } from "react";
import type { TableProps, FormProps } from "antd";
import { DeleteIcon, EditIcon } from "@/components/icon";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManageinformationNewsServices } from "../../service/information.service";
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
export interface newType {
  idType: Number;
  nameType: string;
  deteil: string;
  updatedAt: string;
  createAt: string;
  status: boolean;
}

const Newoption: React.FC = () => {
  const intraAuth = useAxiosIntranet();
  const [newType, setnewType] = useState<newType[]>([]);
  const manageinformationNewsServices =
    ManageinformationNewsServices(intraAuth);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [IsmodlaOpencreate, setIsmodlaOpencreate] = useState(false);
  const [modalEditnewType, setModalEditnewType] = useState(false);
  const [form] = useForm();
  const [formEdit] = useForm();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDatanewType();
  }, []);

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
      message.error("ไม่สามารถเรียกข้อมูลได้");
    }
  };

  const newsTypeCreateDatacreate: FormProps<newType>["onFinish"] = async (
    values
  ) => {
    setSubmitLoading(true);

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
      const response = await manageinformationNewsServices.createnewsType(
        informationNewsCreateData
      );
      if (response) {
        message.success("เพิ่มประเภทข่าวสารสำเร็จ");
        form.resetFields();
        setIsmodlaOpencreate(false);
      } else {
        message.error("เพิ่มประเภทข่าวสารไม่สำเร็จ");
      }
      setSubmitLoading(false);
      fetchDatanewType();
    } catch (error) {
      message.error("เพิ่มประเภทข่าวสารไม่สำเร็จ");
      setSubmitLoading(false);
    }
  };

  const updatednewType: FormProps<newType>["onFinish"] = async (values) => {
    setSubmitLoading(true);

    try {
      const updatenewType = {
        idType: values?.idType,
        nameType: values?.nameType,
        deteil: values?.deteil,
        updatedAt: new Date().toISOString(),
        status: values?.status,
      };
      await manageinformationNewsServices.updatenewsType(updatenewType);
      message.success("แก้ไขประเภทข่าวสารสำเร็จ");
      fetchDatanewType();
      setSubmitLoading(false);
      setModalEditnewType(false);
    } catch (error) {
      fetchDatanewType();
      message.error("แก้ไขประเภทข่าวสารไม่สำเร็จ");
    }
  };

  const handleDeletenewType = async (idType: number) => {
    try {
      await manageinformationNewsServices.deletenewsType(idType);
      setnewType(newType.filter((item) => item.idType !== idType));
      message.success("ลบประเภทข่าวสารสำเร็จ");
      fetchDatanewType();
    } catch (error) {
      message.error("ลบประเภทไม่ข่าวสารสำเร็จ");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const searthnews = newType.filter((newType) =>
    newType.nameType.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    },
    {
      title: "ชื่อประเภทข่าว",
      dataIndex: "nameType",
      key: "nameType",
      width: "300px",
    },
    {
      title: "รายละเอียด",
      dataIndex: "deteil",
      key: "deteil",
      width: "100px",
      ellipsis: true,
    },
    {
      title: "วันที่สร้าง",
      dataIndex: "createAt",
      key: "createAt",
      width: "85px",
      render: (createdAt: Date) =>
        moment(createdAt).format("DD/MM/YYYY HH:mm" + " น."),
    },
    {
      title: "วันที่อัปเดต",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: "85px",
      render: (updatedAt: Date) =>
        moment(updatedAt).format("DD/MM/YYYY HH:mm" + " น."),
    },
    {
      title: "การมองเห็น",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: "70px",
      render: (status: boolean) =>
        status ? (
          <Tag color="green">เปิดการมองเห็น</Tag>
        ) : (
          <Tag color="red">ปิดการมองเห็น</Tag>
        ),
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
            <a onClick={() => showModalEditnewType(row)}>
              <EditIcon width="24" height="24" />{" "}
            </a>
          </Tooltip>
          <Popconfirm
            title="คุณแน่ใจหรือไม่ว่าต้องการลบประเภทข่าวสารนี้ ? "
            onConfirm={() => handleDeletenewType(row.idType)}
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
        <div
          style={{
            margin: "10px 10px 10px 20px",
          }}
        >
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
        <div></div>
        <Button
          style={{ alignContent: "right" }}
          type="primary"
          onClick={modalopencreate}
        >
          สร้างประเภทข่าวสาร
        </Button>
      </div>
      <Modal
        title="สร้างประเภทข้อมูลข่าวสาร"
        open={IsmodlaOpencreate}
        onCancel={handleclosecreate}
        footer={null}
        destroyOnClose
      >
        <Form form={form} onFinish={newsTypeCreateDatacreate} layout="vertical">
          <Form.Item
            name="nameType"
            label="ชื่อประเภทข่าวสาร :"
            rules={[{ required: true, message: "กรุณากรอกชื่อประเภทข่าวสาร" }]}
            style={{ width: "460px" }}
          >
            <Input placeholder="ชื่อประเภทข่าวสาร" />
          </Form.Item>
          <Form.Item
            name="deteil"
            label="รายละเอียดข่าวสาร :"
            rules={[{ required: true, message: "กรุณากรอกรายละเอียดข่าวสาร" }]}
            style={{ width: "460px" }}
          >
            <Input.TextArea rows={12} placeholder="รายละเอียดข่าวสาร" />
          </Form.Item>
          <Form.Item
            name="status"
            label="สถานะการมอง :"
            style={{ width: "460px" }}
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
        title="แก้ไขประเภทข้อมูลข่าวสาร"
        open={modalEditnewType}
        onCancel={handleCancel1edit}
        footer={null}
        destroyOnClose
      >
        <Form form={formEdit} onFinish={updatednewType} layout="vertical">
          <Form.Item
            name="idType"
            label="ชื่อประเภทข่าวสาร :"
            style={{
              width: "450px",
              visibility: "hidden",
              margin: "0 0 -60px 0",
            }}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="nameType"
            label="ชื่อประเภทข่าวสาร :"
            rules={[{ required: true, message: "กรุณากรอกชื่อประเภทข่าวสาร" }]}
            style={{ width: "460px" }}
          >
            <Input placeholder="ชื่อประเภทข่าวสาร" />
          </Form.Item>
          <Form.Item
            name="deteil"
            label="รายละเอียดข่าวสาร :"
            rules={[{ required: true, message: "กรุณากรอกรายละเอียดข่าวสาร" }]}
            style={{ width: "460px" }}
          >
            <Input.TextArea rows={12} placeholder="รายละเอียดข่าวสาร" />
          </Form.Item>
          <Form.Item
            name="status"
            label="สถานะการมอง :"
            style={{ width: "460px" }}
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
