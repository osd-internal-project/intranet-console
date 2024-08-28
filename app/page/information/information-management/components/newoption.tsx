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
      message.error("Failed to fetch car data");
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
        status: values?.status,
      };
      await manageinformationNewsServices.updatenewsType(updatenewType);
      message.success("แก้ไขข้อมูลห้องสำเร็จ");

      fetchDatanewType();
      setSubmitLoading(false);
    } catch (error) {
      message.error("แก้ไขข้อมูลห้องไม่สำเร็จ");
    }
  };

  const handleDeletenewType = async (idType: number) => {
    try {
      await manageinformationNewsServices.deletenewsType(idType);
      setnewType(newType.filter((item) => item.idType !== idType));
      message.success("ลบการจองสำเร็จ");
      fetchDatanewType();
    } catch (error) {
      message.error("ลบการจองไม่สำเร็จ");
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
      align: "center",
    },
    {
      title: "ชื่อประเภทข่าว",
      dataIndex: "nameType",
      key: "nameType",
    },
    {
      title: "รายละเอียด",
      dataIndex: "deteil",
      key: "deteil",
    },
    {
      title: "อัพเดทล่าสุด",
      dataIndex: "updateAt",
      key: "updateAt",
      render: (updateAt: Date) =>
        moment(updateAt).format("DD/MM/YYYY HH:mm" + " น."),
    },
    {
      title: "เวลาการสร้าง",
      dataIndex: "createAt",
      key: "createAt",
      render: (createdAt: Date) =>
        moment(createdAt).format("DD/MM/YYYY HH:mm" + " น."),
    },

    {
      title: "การมองเห็น",
      dataIndex: "status",
      key: "status",
      render: (status: boolean) =>
        status ? (
          <Tag color="green">เปิดการมอง</Tag>
        ) : (
          <Tag color="red">ปิดการมอง</Tag>
        ),
    },
    {
      title: "การจัดการ",
      dataIndex: "manage",
      key: "manage",
      align: "center",
      render: (record: number, row: any, index: number) => (
        <Space size="middle">
          <Tooltip title="แก้ไข">
            <a onClick={() => showModalEditnewType(row)}>
              <EditIcon width="24" height="24" />{" "}
            </a>
          </Tooltip>
          <Popconfirm
            title="คุณแน่ใจหรือไม่ว่าต้องการลบการจองนี้?"
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
      ><div style={{
        margin: "10px 10px 10px 20px",
      }}>ค้นหาประเภทข่าว :
        <Input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="ค้นหาประเภทข่าวสาร"
          style={{
            margin: "10px 10px 10px 10px",
            width: "300px",
          }}
        /></div>
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
        title="เพิ่มข้อมูลตรวจสภาพรถ"
        open={IsmodlaOpencreate}
        onCancel={handleclosecreate}
        footer={null}
        destroyOnClose
      >
        <Form form={form} onFinish={newsTypeCreateDatacreate} layout="vertical">
          <Form.Item
            name="nameType"
            label="ชื่อประเภทข่าวสาร :"
            style={{ width: "300px" }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="deteil"
            label="รายละเอียดข่าวสาร :"
            style={{ width: "300px" }}
          >
            <Input />
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
              <Button
                type="primary"
                htmlType="submit"
                loading={submitLoading}
                onClick={handleclosecreate}
              >
                ตกลง
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>

      <Modal
        title="แก้ไขการมองเห็นข่าว"
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
              width: "300px",
              visibility: "hidden",
              margin: "0 0 -60px 0",
            }}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="nameType"
            label="ชื่อประเภทข่าวสาร :"
            style={{ width: "300px" }}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="deteil"
            label="รายละเอียดข่าวสาร :"
            style={{ width: "300px" }}
          >
            <Input disabled />
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
              <Button
                type="primary"
                htmlType="submit"
                loading={submitLoading}
                onClick={handleCancel1edit}
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
