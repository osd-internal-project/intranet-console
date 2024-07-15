"use client";
import { useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import { Button, Col, DatePicker, Form, Input, Modal, Popover, Row, Space, Switch, message } from "antd";
import React, { useState } from "react";
import { ExclamationCircleFilled, FilterOutlined } from "@ant-design/icons";
import { InventoryServices } from "../services/inventory.service";
import { typeInventory, typeInventoryFIlters } from "../common";
import { checkRule } from "@/app/utils/rules";

export interface props {
  setLoading: (value: boolean) => void;
  locationId: string;
  onFilter: (value: typeInventoryFIlters) => void;
  handleOpenFilter: (event: boolean) => void;
  openFilter: boolean;
}

export const AddInventory: React.FC<props> = ({ setLoading, locationId, onFilter, handleOpenFilter, openFilter }): React.ReactElement => {
  const { RangePicker } = DatePicker;
  const stockAuth = useAxiosStock();
  const addRule = checkRule("sm-inventory-a");
  const inventoryServices = InventoryServices(stockAuth);
  const [FORMCREATE] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [switchChecked, setSwitchChecked] = useState(true);
  const [buttonLoading, setbuttonLoading] = useState<boolean>(false);
  const [buttonAdd, setbuttonAdd] = useState<boolean>(false);

  const handleChange = (checked: boolean) => {
    setSwitchChecked(checked);
  };

  const showModal = () => {
    setbuttonLoading(true);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    FORMCREATE.resetFields();
    setIsModalOpen(false);
    setbuttonLoading(false);
  };

  const validateOnlyNumbers = (rule: any, value: any, callback: any) => {
    if (value !== undefined) {
      if (isNaN(value)) {
        callback("Please enter numbers only");
      } else if (value.length > 10) {
        callback("Please enter no more than 10 digits.");
      } else if (/\s/.test(value)) {
        callback("Please do not enter space");
      } else {
        callback();
      }
    } else {
      callback();
    }
  };

  const onfinish = (event: typeInventory) => {
    setbuttonAdd(true);
    setbuttonLoading(true);
    const condition = {
      data: {
        ...event,
        status: switchChecked,
        inventoryNumber: event.inventoryNumber,
        locationId: locationId === null ? null : Number(locationId),
      },
    };
    Modal.confirm({
      title: "Add Inventory",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to add this ?",
      okText: "Confirm",
      okButtonProps: {
        style: {
          backgroundColor: "#00a1df", // Change this to your desired color
          borderColor: "#00a1df", // Change this to your desired color
        },
      },
      cancelText: "Cancel",
      onOk: async () => {
        const result = await inventoryServices.create(condition);
        if (result) {
          message.success(`Add success`);
          FORMCREATE.resetFields();
          setIsModalOpen(false);
          setbuttonLoading(false);
          setLoading(true);
          setbuttonAdd(false);
        }
      },
      onCancel() {
        setbuttonAdd(false);
        setbuttonLoading(false);
      },
    });
  };

  const searchContent = (
    <Form layout="vertical" onFinish={onFilter} autoComplete="off">
      <div className="grid grid-cols-1 md:gap-4 md:grid-cols-4">
        <Form.Item label="Inventory Name" name="inventoryName">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="Location" name="locationPlace">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="Phone Number" name="phoneNumber">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="Created" name="createdAt">
          <RangePicker className=" w-full" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="button-blue">
            Search
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
  return (
    <div>
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
              Filters
            </Button>
          </Popover>
          {addRule ? (
            <Button className="button-blue" type="primary" onClick={showModal} disabled={buttonLoading}>{`Add Inventory Store`}</Button>
          ) : (
            <></>
          )}
        </Space>
      </div>
      <Modal title="Add Inventory Store" footer={false} open={isModalOpen} onCancel={handleCancel}>
        <Form name={`createinventory`} layout="vertical" onFinish={onfinish} form={FORMCREATE}>
          <Row gutter={[8, 8]}>
            <Col span={12}>
              <Form.Item name={"inventoryNumber"} label={`Inventory ID :`} rules={[{ required: true, message: "Please enter inventory id" }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={"inventoryName"} label={`Inventory Name :`} rules={[{ required: true, message: "Please enter inventory name" }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name={"locationPlace"} label={`Location :`} rules={[{ required: true, message: "Please enter location" }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={"phoneNumber"}
                label={`Phone Number :`}
                rules={[{ required: true, message: "Please enter phone number" }, { validator: validateOnlyNumbers }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name={"status"} label={`Status :`}>
                <Switch
                  checkedChildren="Active"
                  unCheckedChildren="Inactive"
                  checked={switchChecked}
                  onChange={handleChange}
                  className={switchChecked === true ? "active-switch" : "inactive-switch"}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[8, 8]} style={{ display: "flex", alignItems: "center", justifyContent: "end" }}>
            <Col>
              <Button type="default" onClick={() => handleCancel()}>{`Cancel`}</Button>
            </Col>
            <Col>
              <Button htmlType="submit" type="default" className="button-blue" disabled={buttonAdd}>{`Add`}</Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};
