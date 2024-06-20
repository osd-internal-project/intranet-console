"use client";
import { useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ExclamationCircleFilled, FilterOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Form, Input, Modal, Popover, Row, Space, Switch, message } from "antd";
import React, { useEffect, useState } from "react";
import MasterHazardTypeService from "../services/index.service";

export interface props {
  propLoading: (value: boolean) => void;
  loading: boolean;
  handleOpenFilter: (event: boolean) => void;
  openFilter: boolean;
  onFilter: (value: any) => void;
}

export const CreateMasterHazardtype: React.FC<props> = ({ propLoading, loading, handleOpenFilter, openFilter, onFilter }): React.ReactElement => {
  const stockAuth = useAxiosStock();
  const Masterhazardtype = MasterHazardTypeService(stockAuth);
  const { RangePicker } = DatePicker;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [switchChecked, setSwitchChecked] = useState<boolean>(false);
  const [buttonLoading, setbuttonLoading] = useState<boolean>(false);
  const [buttonAdd, setbuttonAdd] = useState<boolean>(false);

  const [form] = Form.useForm();
  useEffect(() => {}, [switchChecked]);

  const showModal = () => {
    setbuttonLoading(true);
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setbuttonLoading(false);
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleChange = (checked: boolean) => {
    setSwitchChecked(checked);
  };

  const finishAdd = async (values: any) => {
    const condition = {
      ...values,
      status: values.status === true ? true : false,
    };

    Modal.confirm({
      title: "Add Hazard Type",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to add this ?",
      okText: "Confirm",
      okButtonProps: {
        style: {
          backgroundColor: "#00a1df",
          borderColor: "#00a1df",
        },
      },
      cancelText: "Cancel",
      onOk: async () => {
        const result = await Masterhazardtype.createHazardType(condition);
        if (result) {
          propLoading(true);
          setIsModalOpen(false);
          form.resetFields();
          setSwitchChecked(false);
          setbuttonLoading(false);
          setbuttonAdd(false);
          message.success("Add success");
        }
      },
      onCancel() {
        propLoading(false);
        setbuttonLoading(false);
        setbuttonAdd(false);
      },
    });
  };

  const searchContent = (
    <Form layout="vertical" onFinish={onFilter} autoComplete="off">
      <div className="grid grid-cols-1 md:gap-4 md:grid-cols-4">
        <Form.Item label="Hazard Type" name="nameHazard">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="CreatedAt" name="createdAt">
          <RangePicker className=" w-full" />
        </Form.Item>
        <Form.Item style={{ marginTop: "30px" }}>
          <Button type="primary" htmlType="submit" className="button-blue">
            Search
          </Button>
        </Form.Item>
      </div>
    </Form>
  );

  return (
    <>
      <Modal title="Add Hazard Type" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={false}>
        <Form layout="vertical" form={form} onFinish={finishAdd}>
          <Row gutter={[8, 8]}>
            <Col span={12}>
              <Form.Item
                className=" mb-0"
                label="Hazard Type Name :"
                name="nameHazard"
                rules={[{ required: true, message: "Please enter name hazard" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item className=" mb-0" name={"status"} label={`Status :`}>
                <Switch
                  checkedChildren="Active"
                  unCheckedChildren="Inactive"
                  checked={switchChecked}
                  onChange={handleChange}
                  className={switchChecked === true ? "active-switch" : "inactive-switch"}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Description :" name="description" rules={[{ required: true, message: "Please enter detail" }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <div className=" flex justify-end space-x-4">
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit" disabled={buttonAdd}>
                Add
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      <div className=" flex justify-end pb-4">
        <Space>
          <Popover
            onOpenChange={handleOpenFilter}
            open={openFilter}
            content={searchContent}
            placement="bottomLeft"
            title="Search"
            trigger="click"
            overlayStyle={{ width: "calc(100% - 240px)" }}
          >
            <Button className="button-blue" type="primary" icon={<FilterOutlined />}>
              {`Filters`}
            </Button>
          </Popover>

          <Button type="primary" onClick={showModal} disabled={buttonLoading}>
            {`Add Hazard Type`}
          </Button>
        </Space>
      </div>
    </>
  );
};
