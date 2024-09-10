import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  Table,
  Input,
  Tag,
  Button,
  Modal,
  Select,
  Space,
  Popconfirm,
  message,
  Form,
  FormProps,
  Tooltip,
  Switch,
} from "antd";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManageCarServices } from "../../services/manage-car.service";
import { useForm } from "antd/es/form/Form";
import { useSession } from "next-auth/react";
import { DeleteIcon, EditIcon } from "@/components/icon";
import ExportExcel from "./components/ExportMatype";
export interface MaCarType {
  id: number;
  typeName: string;
  detail: string;
  status: boolean;
  createdAt: string;
  createdById: string;
  createdByName: string;
}

const masterType: React.FC = () => {
  const { data: session } = useSession();
  const [form] = useForm();
  const [formEdit] = useForm();
  const IntranetAuth = useAxiosIntranet();
  const maCarServices = ManageCarServices(IntranetAuth);
  const [maCarData, setmaCarData] = useState<MaCarType[]>([]);
  const [submitLoading, setSubmitLoading] = useState(true);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const manageCarServices = ManageCarServices(IntranetAuth);
  const [modalEditMaCarType, setModalEditMaCarType] = useState(false);

  useEffect(() => {
    if (submitLoading) fetchData();
  }, []);

  const fetchData = async () => {
    const maCarresponse = await maCarServices.getMaCarQueryType();
    const maCar: MaCarType[] = maCarresponse.map(
      (item: any, index: Number) => ({
        ...item,
        key: index.toString(),
      })
    );
    setmaCarData(maCar);
    setSubmitLoading(false);
  };

  const handleEditMaCarCancelType = () => {
    setModalEditMaCarType(false);
    form.resetFields();
  };
  const showModalEditMaCarType = (record: MaCarType) => {
    formEdit.setFieldsValue(record);
    setModalEditMaCarType(true);
  };

  const showModal = () => {
    setIsModalOpen1(true);
  };
  const handleOk = () => {
    setIsModalOpen1(false);
  };
  const handleCancel = () => {
    setIsModalOpen1(false);
  };

  const handleOk1edit = () => {
    setModalEditMaCarType(false);
  };
  const handleCancel1edit = () => {
    setModalEditMaCarType(false);
  };
  const createMaCarType: FormProps<MaCarType>["onFinish"] = async (values) => {
    const maCarCreateData = {
      typeName: values.typeName,
      detail: values.detail,
      status: values.status,
      createdById: session?.user.userId,
      createdByName: session?.user.username,
    };
    try {
      const response = await manageCarServices.createMaCarType(maCarCreateData);
      if (response) {
        message.success("เพิ่มรถสำเร็จ");
        form.resetFields();
      } else {
        message.error("เพิ่มรถไม่สำเร็จ");
      }

      setSubmitLoading(false);
      fetchData();
    } catch (error) {
      message.error("เพิ่มรถไม่สำเร็จ");
      setSubmitLoading(true);
    }
  };

  const updatedCarType: FormProps<MaCarType>["onFinish"] = async (values) => {
    setSubmitLoading(true);

    try {
      const updateMaCarType = {
        id: values?.id,
        typeName: values?.typeName,
        detail: values?.detail,
        status: values?.status,
      };
      await manageCarServices.updateMaCarType(updateMaCarType);
      message.success("แก้ไขข้อมูลห้องสำเร็จ");

      fetchData();
      handleEditMaCarCancelType();
      setSubmitLoading(false);
    } catch (error) {
      message.error("แก้ไขข้อมูลห้องไม่สำเร็จ");
    }
  };

  const handleDeletemaCar = async (id: number) => {
    try {
      await maCarServices.deleteMaCarType(id);
      setmaCarData(maCarData.filter((item) => item.id !== id));
      message.success("ลบการจองสำเร็จ");
      fetchData();
    } catch (error) {
      message.error("ลบการจองไม่สำเร็จ");
    }
  };
  const columns = [
    {
      title: "ไอดี",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "ประเภทการบำรุง",
      dataIndex: "typeName",
      key: "typeName",
    },
    {
      title: "รายละเอียดการบำรุงรักษา",
      dataIndex: "detail",
      key: "detail",
    },
    {
      title: "ชื่อ",
      dataIndex: "createdByName",
      key: "createdByName",
    },
    {
      title: "เวลาการสร้าง",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: Date) =>
        moment(createdAt).format("YYYY-MM-DD HH:mm A"),
    },

    {
      title: "Active",
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
      render: (record: number, row: any, index: number) => (
        <Space size="middle">
          <Tooltip title="แก้ไข">
            <a onClick={() => showModalEditMaCarType(row)}>{EditIcon}</a>
          </Tooltip>
          <Popconfirm
            title="คุณแน่ใจหรือไม่ว่าต้องการลบการจองนี้?"
            onConfirm={() => handleDeletemaCar(row.id)}
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
      <div className="value">
        <div>
          <Button
            type="primary"
            style={{
              margin: "10px 0 20px 10px",
              padding: " 20px 30px 20px 30px ",
              fontSize: "16px",
            }}
            onClick={showModal}
          >
            สร้างประเภทตรวจสภาพ
          </Button>
          <div
            style={{
              float: "right",
              margin: "10px",
              padding: " 20px 30px 20px 30px",
              fontSize: "16px",
            }}
          >
            <ExportExcel datamacartype={maCarData} />
          </div>
        </div>

        <Modal
          width={350}
          title="การจัดการประเภทรถ"
          open={isModalOpen1}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={createMaCarType}
            autoComplete="off"
            layout="vertical"
            form={form}
          >
            <Form.Item<MaCarType>
              style={{
                textAlign: "left",
                margin: "0 0 10px 0",
                width: "450px",
              }}
              name="typeName"
              label={"ประเภทการบำรุงรักษา :"}
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item<MaCarType>
              style={{
                textAlign: "left",
                margin: "0 0 10px 0",
                width: "450px",
              }}
              name="detail"
              label={"รายละเอียดรถ :"}
            >
              <Input size="large" placeholder="รายละเอียดรถ" />
            </Form.Item>
            <Form.Item<MaCarType>
              style={{
                textAlign: "left",
                margin: "0 0 10px 0",
                width: "450px",
              }}
              name="status"
              label={"สถานะ :"}
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
                  onClick={handleCancel}
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
                  onClick={handleCancel}
                >
                  ตกลง
                </Button>
              </Form.Item>
            </div>
          </Form>
        </Modal>

        <Modal
          width={350}
          title="การแก้ไขบำรุงการรักษา"
          open={modalEditMaCarType}
          onOk={handleOk1edit}
          onCancel={handleCancel1edit}
          footer={null}
        >
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={updatedCarType}
            autoComplete="off"
            layout="vertical"
            form={formEdit}
          >
            <Form.Item<MaCarType>
              style={{
                textAlign: "left",
                margin: "0 0 -80px 0",
                width: "450px",
                visibility: "hidden",
              }}
              name="id"
              label={"ID :"}
            >
              <Input size="large" disabled />
            </Form.Item>
            <Form.Item<MaCarType>
              style={{
                textAlign: "left",
                margin: "0 0 10px 0",
                width: "450px",
              }}
              name="typeName"
              label={"ประเภทการบำรุงรักษา :"}
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item<MaCarType>
              style={{
                textAlign: "left",
                margin: "0 0 10px 0",
                width: "450px",
              }}
              name="detail"
              label={"รายละเอียดรถ :"}
            >
              <Input size="large" placeholder="รายละเอียดรถ" />
            </Form.Item>
            <Form.Item<MaCarType>
              style={{
                textAlign: "left",
                margin: "0 0 10px 0",
                width: "450px",
              }}
              name="status"
              label={"สถานะ :"}
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
      </div>
      <Table dataSource={maCarData} columns={columns} />
    </div>
  );
};

export default masterType;
