"use client";
import { deleteIcon, editIcon } from "@/components/icon";
import { Button, Card, Col, Form, Input, Modal, Row, Space, Switch, Table, Tag, message } from "antd";

import React, { useState } from "react";
import { useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { InventoryServices } from "../services/inventory.service";
import { typeInventory } from "../common";
import { ColumnsType } from "antd/es/table";
import { checkRule } from "@/app/utils/rules";
import { dateToStringTh } from "@/app/utils/format";

export interface props {
  loading: boolean;
  getdataAll: typeInventory[];
  setLoading: (value: boolean) => void;
}

export const TableInventory: React.FC<props> = ({ loading, getdataAll, setLoading }) => {
  const stockAuth = useAxiosStock();

  const editRule = checkRule("sm-inventory-e");
  const deleteRule = checkRule("sm-inventory-d");
  const inventoryServices = InventoryServices(stockAuth);
  const [form] = Form.useForm();
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [switchChecked, setSwitchChecked] = useState<boolean>();
  const [buttonLoading, setbuttonLoading] = useState<boolean>(false);

  const handleChange = (checked: boolean) => {
    setSwitchChecked(checked);
  };

  const showModal = (row: typeInventory) => {
    form.setFieldValue("id", row.id);
    form.setFieldValue("inventoryNumber", row.inventoryNumber);
    form.setFieldValue("inventoryName", row.inventoryName);
    form.setFieldValue("locationPlace", row.locationPlace);
    form.setFieldValue("phoneNumber", row.phoneNumber);
    form.setFieldValue("status", row.status);
    setSwitchChecked(row.status);
    setOpenEdit(true);
  };
  const handleCancel = () => {
    setOpenEdit(false);
    form.resetFields();
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

  const onfinishDel = (event: number) => {
    setbuttonLoading(true);
    Modal.confirm({
      title: "Delete this inventory",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to delete this ?",
      okText: "Confirm",
      okButtonProps: { type: "primary", danger: true },
      cancelText: "Cancel",
      onOk: async () => {
        const dataResult = await inventoryServices.remove(event);
        if (dataResult) {
          message.success(`Delete success`);
          setLoading(true);
          setbuttonLoading(false);
        }
      },
      onCancel() {
        setbuttonLoading(false);
      },
    });
  };

  const onfinishEdit = async (event: typeInventory) => {
    setbuttonLoading(true);
    const dataUpdate = {
      id: event.id,
      data: {
        inventoryNumber: event.inventoryNumber,
        inventoryName: event.inventoryName,
        locationPlace: event.locationPlace,
        phoneNumber: event.phoneNumber,
        status: switchChecked,
        updatedAt: new Date().toISOString(),
      },
    };
    const dataResult = await inventoryServices.update(dataUpdate);
    if (dataResult) {
      message.success(`Edit success`);
      setLoading(true);
      setOpenEdit(false);
    }
    setbuttonLoading(false);
  };

  const columns: ColumnsType<typeInventory> = [
    {
      title: "INVENTORY NAME",
      dataIndex: "inventoryName",
      key: "inventoryName",
    },
    {
      title: "LOCATION PLACE",
      dataIndex: "locationPlace",
      key: "locationPlace",
    },
    {
      title: "PHONE NUMBER",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "CREATED",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: Date, row: typeInventory, index: number) => {
        return `${dateToStringTh(value)} น.`;
      },
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (event: boolean, row: typeInventory, index: number) =>
        event === true ? <Tag color="green">{`Active`}</Tag> : <Tag color="volcano">{`Inactive`}</Tag>,
    },
    {
      title: "ACTIVE",
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (event: number, row: typeInventory, index: number) => (
        <Space>
          {editRule ? (
            <Button type="link" onClick={() => showModal(row)}>
              {editIcon}
            </Button>
          ) : (
            <></>
          )}
          {deleteRule ? (
            <Button type="link" danger onClick={() => onfinishDel(Number(event))} disabled={buttonLoading}>
              {deleteIcon}
            </Button>
          ) : (
            <></>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className=" col-span-1 space-y-5">
        <div className=" overflow-auto md:overflow-hidden">
          <Table size="small" columns={columns} dataSource={getdataAll} loading={loading} rowKey="id" scroll={{ x: 1000 }} />
        </div>
      </div>
      <Modal title="Edit Inventory Store" open={openEdit} onCancel={handleCancel} footer={false}>
        <Form style={{ width: "100%" }} name="edit" autoComplete="off" layout="vertical" form={form} onFinish={onfinishEdit}>
          <Row gutter={[8, 8]}>
            <Form.Item name={`id`} hidden />
            <Col span={12}>
              <Form.Item name={"inventoryNumber"} label={`Inventory ID :`}>
                <Input readOnly disabled />
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
            <Col span={24}>
              <Row gutter={[8, 8]} style={{ justifyContent: "end", display: "flex" }}>
                <Col>
                  <Button
                    onClick={() => {
                      setOpenEdit(false);
                      form.resetFields();
                      setbuttonLoading(false);
                    }}
                  >{`Cancel`}</Button>
                </Col>
                <Col>
                  <Button htmlType="submit" type="default" className="button-blue" loading={buttonLoading}>{`Save Change`}</Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};
