import React, { useState, useEffect } from "react";
import { Select, Table, Space, Button, Row, Modal, Form, Input, Divider, Tag, message, Popconfirm } from "antd";
import type { TableProps, FormProps } from "antd";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManageRoomServices } from "../services/manage-room.service";
import { useForm } from "antd/es/form/Form";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";

interface MasterRoomType {
  id: string;
  no: string;
  roomName: string;
  roomsStatus: boolean;
  roomDescription: string;
}

const RoomStatus = () => {
  const [form] = useForm();
  const { id24Axios } = useId24();
  const baseUrIntranet = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_INTRANET);
  const [bookingData, setBookingData] = useState<MasterRoomType[]>([]);
  const [currentBookingId, setCurrentBookingId] = useState<string | null>(null);
  const [modalEditMasterRoom, setModalEditMasterRoom] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const columns: TableProps<MasterRoomType>["columns"] = [
    {
      title: "ลำดับ",
      dataIndex: "no",
      key: "no",
      render: (_, __, index) => <>{index + 1}</>,
    },
    {
      title: "ชื่อห้องประชุม",
      dataIndex: "roomName",
      key: "roomName",
    },
    {
      title: "สถานะ",
      dataIndex: "roomsStatus",
      key: "roomsStatus",
      render: (status: boolean) => (status ? <Tag color="green">ใช้งานได้ปกติ</Tag> : <Tag color="red">ไม่สามารถใช้งานได้</Tag>),
    },
    {
      title: "หมายเหตุ",
      dataIndex: "roomDescription",
      key: "roomDescription",
    },
    {
      title: "จัดการ",
      dataIndex: "manage",
      key: "manage",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => showModalEditMasterRoom(record)}>แก้ไข</a>
          <Popconfirm title="คุณแน่ใจหรือไม่ว่าต้องการลบการจองนี้?" onConfirm={() => handleDeleteRoomStatus(record.id)} okText="ใช่" cancelText="ไม่">
            <a>ลบ</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleEditMasterRoomCancel = () => {
    setModalEditMasterRoom(false);
    form.resetFields();
  };

  const showModalEditMasterRoom = (record: MasterRoomType) => {
    setCurrentBookingId(record.id);
    form.setFieldsValue(record);
    setModalEditMasterRoom(true);
  };

  const handleDeleteRoomStatus = async (id: string) => {
    try {
      await ManageRoomServices(baseUrIntranet).deleteMasterRoom(id);
      setBookingData(bookingData.filter((item) => item.id !== id));
      message.success("ลบการจองสำเร็จ");
    } catch (error) {
      message.error("ลบการจองไม่สำเร็จ");
    }
  };

  const updatedRoom: FormProps<MasterRoomType>["onFinish"] = async (values) => {
    setSubmitLoading(true);
    try {
      const { ...restValues } = values;
      const updatedMasterRoom = {
        ...restValues,
        id: currentBookingId,
      };
      await ManageRoomServices(baseUrIntranet).updateMasterRoom(updatedMasterRoom);
      message.success("แก้ไขข้อมูลห้องสำเร็จ");
      fetchData();
      handleEditMasterRoomCancel();
      setSubmitLoading(false);
    } catch (error) {
      message.error("แก้ไขข้อมูลห้องไม่สำเร็จ");
    }
  };

  const fetchData = async () => {
    try {
      const Bookingresponse = await ManageRoomServices(baseUrIntranet).getMasterRoomQuery();
      const BookingRoom: MasterRoomType[] = Bookingresponse.map((item: any, index: number) => ({
        ...item,
        key: index.toString(),
      }));
      setBookingData(BookingRoom);
    } catch (error) {
      message.error("Failed to fetch room data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Modal title="แก้ไขห้องประชุม" open={modalEditMasterRoom} onCancel={handleEditMasterRoomCancel} footer={null} width={500}>
        <Form
          form={form}
          name="edit_booking"
          initialValues={{ remember: true }}
          onFinish={updatedRoom}
          autoComplete="off"
          labelCol={{ md: 10, sm: 12 }}>
          <Divider orientation="left">แก้ไขห้องประชุม</Divider>
          <Form.Item label="ชื่อห้องประชุม" name="roomName" rules={[{ required: true, message: "กรุณากรอกชื่อห้องประชุม!" }]}>
            <Input placeholder="กรอกชื่อห้องประชุม" />
          </Form.Item>
          <Form.Item label="รายละเอียดห้องประชุม" name="roomDescription" rules={[{ required: true, message: "กรุณากรอกรายละเอียดห้องประชุม!" }]}>
            <Input placeholder="กรอกรายละเอียดห้องประชุม" />
          </Form.Item>
          <Form.Item label="สถานะห้องประชุม" name="roomsStatus" rules={[{ required: true, message: "กรุณาเลือกสถานะห้องประชุม!" }]}>
            <Select placeholder="เลือกสถานะห้องประชุม">
              <Select.Option value={true}>ใช้งานได้ปกติ</Select.Option>
              <Select.Option value={false}>ไม่สามารถใช้งานได้</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Row justify="end">
              <Button type="default" onClick={handleEditMasterRoomCancel} style={{ marginRight: 8 }}>
                ยกเลิก
              </Button>
              <Button type="primary" htmlType="submit" loading={submitLoading}>
                ตกลง
              </Button>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
      <Table columns={columns} dataSource={bookingData} />
    </>
  );
};

export default RoomStatus;
