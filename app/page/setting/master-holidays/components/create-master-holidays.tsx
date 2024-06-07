"use client";
import React, { useState } from "react";
import { FilterOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Form, Input, Modal, Popover, Row, Switch } from "antd";
import TextArea from "antd/es/input/TextArea";
import { FilterMasterdataHolidys, ITypeMasterdataHolidys } from "../common";

export interface props {
  onFinishCreate: (event: ITypeMasterdataHolidys) => void;
  onSearch: (event: FilterMasterdataHolidys) => void;
  setSwitch: (event: boolean) => void;
  getswitch: boolean;
  setOpenFilter: (e: boolean) => void;
  setOpenModal: (e: boolean) => void;
  openFilter: boolean;
  openModal: boolean;
  formfilters: any;
  formcreate: any;
}

export const CreateMasterHolidays: React.FC<props> = ({
  onFinishCreate,
  setSwitch,
  getswitch,
  setOpenFilter,
  setOpenModal,
  openFilter,
  openModal,
  formfilters,
  formcreate,
  onSearch,
}): React.ReactElement => {
  const { RangePicker } = DatePicker;

  const searchContent = (
    <Form form={formfilters} layout="vertical" autoComplete="off" onFinish={onSearch}>
      <div className="grid grid-cols-1 md:gap-4 md:grid-cols-4">
        <Form.Item label="วันหยุด :" name="holidaysName">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="วันที่สร้าง :" name="createdAt">
          <RangePicker />
        </Form.Item>
        <div className=" md:col-span-4">
          <Form.Item style={{ justifyContent: "end", display: "flex", alignItems: "center" }}>
            <Button className=" mr-2" onClick={() => formfilters.resetFields()}>
              {`Reset`}
            </Button>
            <Button type="primary" htmlType="submit">
              {`Search`}
            </Button>
          </Form.Item>
        </div>
      </div>
    </Form>
  );

  return (
    <div>
      <Modal title="Add New Holidays" open={openModal} onOk={() => setOpenModal(false)} onCancel={() => setOpenModal(false)} footer={false}>
        <Form layout="vertical" form={formcreate} autoComplete="off" onFinish={onFinishCreate}>
          <Row gutter={[8, 8]}>
            <Col span={24}>
              <Form.Item className=" mb-0" label="วันหยุด:" name="holidaysName" rules={[{ required: true, message: "กรุณากรอกวันลา" }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item className=" mb-0" label="วันที่หยุด:" name="holidaysDate" rules={[{ required: true, message: "กรุณากรอกชื่อภาษาไทย" }]}>
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
            {/* <Col span={24}>
              <Form.Item label="ต้องการให้ลารวมถึงเสาร์อาทิตย์ :" name="typeEveryDay">
                <Switch
                  checkedChildren="Off"
                  unCheckedChildren="On"
                  defaultChecked={false}
                  onChange={setSwitch}
                  className={getswitch === true ? "active-switch" : "inactive-switch"}
                />
              </Form.Item>
            </Col> */}
          </Row>
          <Form.Item>
            <div className=" flex justify-end space-x-4 mt-2">
              <Button onClick={() => setOpenModal(false)}>{`Cancel`}</Button>
              <Button type="primary" htmlType="submit">
                {`Add`}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      <div className="flex justify-between mb-5">
        <div>
          <Popover
            onOpenChange={() => setOpenFilter(!openFilter)}
            open={openFilter}
            content={searchContent}
            placement="bottomLeft"
            title="Search"
            trigger="click"
            overlayStyle={{ width: "calc(100% - 300px)" }}
          >
            <Button type="primary" className="button-blue" icon={<FilterOutlined />}>
              {`Filters`}
            </Button>
          </Popover>
        </div>
        <Button type="primary" onClick={() => setOpenModal(true)}>{`Add Type Leave`}</Button>
      </div>
    </div>
  );
};
