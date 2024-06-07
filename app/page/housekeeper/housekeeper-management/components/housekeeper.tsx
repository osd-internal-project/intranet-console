"use client";
import {
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Popover,
  Row,
  Space,
  Switch,
  Table,
  Tabs,
  TabsProps,
  Tag,
} from "antd";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAxiosIntranet, useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import { render } from "react-dom";
import { useForm } from "antd/es/form/Form";
import { FilterOutlined } from "@ant-design/icons";
import { HouseKeeperStockServices } from "../../housekeepers/services/housekeeper.service";

type FieldType = {
  type: string;
  houseKeeperId?: number;
  quitYourJob?: boolean;
  houseKeepName: string;
};

const { RangePicker } = DatePicker;

export default function Housekeeper() {
  const intranetAuth = useAxiosIntranet();
  const houseKeeperStockServices = HouseKeeperStockServices(intranetAuth);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openModalFilter, setOpenModalFilter] = useState<boolean>(false);
  const [dataHouseKeeper, setDataHouseKeeper] = useState([]);
  const [dataHouseKeeperCount, setDataHouseKeeperCount] = useState();
  const [titleModal, setTitleModal] = useState<string>("");
  const [form] = useForm();
  const [formFilter] = useForm();

  useEffect(() => {
    featData();
  }, []);

  const featData = async () => {
    const result = await houseKeeperStockServices.getHousekeeperQuery({});
    const resultCount = await houseKeeperStockServices.getHousekeeperCount({});
    setDataHouseKeeperCount(resultCount);
    setDataHouseKeeper(result);
  };

  const columns = [
    {
      title: "ชื่อ",
      dataIndex: "houseKeepName",
      key: "houseKeepName",
      width: "20%",
    },
    {
      title: "สถานะ",
      dataIndex: "quitYourJob",
      key: "quitYourJob",
      width: "20%",
      render: (value: boolean) => (!value ? <Tag color="red">ลาออก</Tag> : <Tag color="green">ยังอยู่</Tag>),
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
    setTitleModal("เพิ่มแม่บ้าน");
    form.setFieldValue("type", "create");
    setOpenModal(true);
  };

  const onClickEdit = (row: any) => {
    setTitleModal("แก้ใขข้อมูลแม่บ้าน");
    form.setFieldsValue(row);
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
      resultCreate = await houseKeeperStockServices.createHousekeeper(value);
    } else {
      resultCreate = await houseKeeperStockServices.updateHousekeeper(value);
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
    const { houseKeepName, createdAt, updatedAt } = formFilter.getFieldsValue();
    const param = { houseKeepName: houseKeepName, createdAt: createdAt, updatedAt: updatedAt };
    const result = await houseKeeperStockServices.getHousekeeperQuery(param);
    const resultCount = await houseKeeperStockServices.getHousekeeperCount(param);
    setDataHouseKeeperCount(resultCount);
    setDataHouseKeeper(result);
    setOpenModalFilter(false);
  };

  const searchContent = (
    <Form form={formFilter} layout="vertical" onFinish={onFinishFilter} autoComplete="off">
      <div className="grid grid-cols-1 md:gap-4 md:grid-cols-4">
        <Form.Item label="ชื่อ" name="houseKeepName">
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
        <Table columns={columns} dataSource={dataHouseKeeper} size="small" />
        <Modal title={titleModal} open={openModal} onCancel={handleCancelModal} footer={[]}>
          <Form
            form={form}
            name="basic"
            initialValues={{ remember: true }}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item<FieldType> name="houseKeeperId" hidden>
              <Input />
            </Form.Item>
            <Form.Item<FieldType> name="type" hidden>
              <Input />
            </Form.Item>
            <Form.Item<FieldType> label="ชื่อ" name="houseKeepName" rules={[{ required: true, message: "กรุณากรอกข้อมูล ชืื่อ!" }]}>
              <Input />
            </Form.Item>
            <Form.Item<FieldType> label="สถานะ" name="quitYourJob" hidden={form.getFieldValue("type") === "create"}>
              <Switch />
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
