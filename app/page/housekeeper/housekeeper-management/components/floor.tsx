"use client";
import { useAxiosIntranet, useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import {
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popover,
  Row,
  Space,
  Table,
  Tabs,
  TabsProps,
  Tag,
} from "antd";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useForm } from "antd/es/form/Form";
import { FilterOutlined } from "@ant-design/icons";
import { HouseKeeperStockServices } from "../../housekeepers/services/housekeeper.service";

type FieldType = {
  type: string;
  floorId?: number;
  floorName: string;
};

const { RangePicker } = DatePicker;

export default function Floor() {
  const intranetAuth = useAxiosIntranet();
  const houseKeeperStockServices = HouseKeeperStockServices(intranetAuth);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openModalFilter, setOpenModalFilter] = useState<boolean>(false);
  const [dataFloor, setDataFloor] = useState([]);
  const [dataFloorCount, setDataFloorCount] = useState();
  const [titleModal, setTitleModal] = useState<string>("");
  const [form] = useForm();
  const [formFilter] = useForm();

  useEffect(() => {
    featData();
  }, []);

  const featData = async () => {
    const result = await houseKeeperStockServices.getFloorQuery({});
    const resultCount = await houseKeeperStockServices.getFloorCount({});
    setDataFloorCount(resultCount);
    setDataFloor(result);
  };

  const columns = [
    {
      title: "หมายเลข-ชั้น",
      dataIndex: "floorId",
      key: "floorId",
      width: "20%",
    },
    {
      title: "ชื่อ-ชั้น",
      dataIndex: "floorName",
      key: "floorName",
      width: "20%",
    },
    {
      title: "สร้างเมื่อ",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "20%",
    },
    {
      title: "อัปเดท",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: "20%",
    },
    {
      title: "แก้ใข",
      dataIndex: "id",
      key: "id",
      width: "20%",
      render: (value: number, row: any) => (
        <Space>
          <Button size="small" onClick={() => onClickEdit(row)}>
            แก้ใข
          </Button>
        </Space>
      ),
    },
  ];

  const onClickCreate = async () => {
    setTitleModal("เพิ่มชั้น");
    form.setFieldValue("type", "create");
    setOpenModal(true);
  };

  const onClickEdit = (row: any) => {
    setTitleModal("แก้ใขชั้น");
    form.setFieldsValue(row);
    form.setFieldValue("type", "update");
    setOpenModal(true);
  };

  const handleCancelModal = () => {
    form.resetFields();
    setOpenModal(false);
  };

  const handleOpenFilter = (state: boolean) => {
    setOpenModalFilter(state);
  };

  const onFinish = async () => {
    const value = form.getFieldsValue();
    let resultCreate;
    if (value.type === "create") {
      resultCreate = await houseKeeperStockServices.createFloor(value);
    } else {
      resultCreate = await houseKeeperStockServices.updateFloor(value);
    }
    if (resultCreate === 200) {
      message.error("Fault !!");
      setOpenModal(false);
      return;
    } else {
      form.resetFields();
      message.success("Success !!");
      featData();
      setOpenModal(false);
    }
  };

  const onFinishFilter = async () => {
    const { floorName, createdAt, updatedAt } = formFilter.getFieldsValue();
    const param = { floorName: floorName, createdAt: createdAt, updatedAt: updatedAt };
    const result = await houseKeeperStockServices.getFloorQuery(param);
    const resultCount = await houseKeeperStockServices.getFloorCount(param);
    setDataFloorCount(resultCount);
    setDataFloor(result);
    setOpenModalFilter(false);
  };

  const searchContent = (
    <Form form={formFilter} layout="vertical" onFinish={onFinishFilter} autoComplete="off">
      <div className="grid grid-cols-1 md:gap-4 md:grid-cols-4">
        <Form.Item label="ชื่อ" name="floorName">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="สร้างเมื่อ" name="createdAt">
          <RangePicker className=" w-full" />
        </Form.Item>
        <Form.Item label="อัปเดท" name="updatedAt">
          <RangePicker className=" w-full" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Search
          </Button>
        </Form.Item>
      </div>
    </Form>
  );

  return (
    <Row>
      <div className="w-full">
        <div className="flex justify-end p-1">
          <Space>
            <Popover
              onOpenChange={handleOpenFilter}
              open={openModalFilter}
              content={searchContent}
              title="Search"
              trigger="click"
              overlayStyle={{ width: "calc(100% - 240px)" }}
            >
              <Button icon={<FilterOutlined />}>Filters</Button>
            </Popover>
            <Button type="primary" onClick={onClickCreate}>
              เพิ่ม
            </Button>
          </Space>
        </div>
        <div></div>
        <Table columns={columns} dataSource={dataFloor} size="small" rowKey={"id"} />
        <Modal title={titleModal} open={openModal} onCancel={handleCancelModal} footer={[]}>
          <Form
            form={form}
            name="basic"
            initialValues={{ remember: true }}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item<FieldType> name="type" hidden>
              <Input />
            </Form.Item>
            <Form.Item<FieldType> label="หมายเลข-ชั้น" name="floorId" rules={[{ required: true, message: "กรุณากรอกข้อมูล หมายเลข-ชั้น!" }]}>
              <InputNumber disabled={form.getFieldValue("type") === "update"} />
            </Form.Item>
            <Form.Item<FieldType> label="ชื่อ-ชั้น" name="floorName" rules={[{ required: true, message: "กรุณากรอกข้อมูล ชื่อ-ชั้น!" }]}>
              <Input />
            </Form.Item>

            <div className="flex justify-end">
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </div>
          </Form>
        </Modal>
      </div>
    </Row>
  );
}
