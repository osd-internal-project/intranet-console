"use client";
import { useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import { dateToStringTh } from "@/app/utils/format";
import { deleteIcon, editIcon } from "@/components/icon";
import { Button, Card, Col, Form, Input, Modal, Row, Space, Spin, Switch, Table, TableColumnsType, Tag, message } from "antd";
import React, { useEffect, useState } from "react";
import MasterHazardTypeService from "../services/index.service";
import { InfoCircleOutlined } from "@ant-design/icons";

export interface props {
  propLoading: (loading: boolean) => void;
  loading: boolean;
  dataTable: any[];
  paginationConfig: number;
  filter: { current: number; pageSize: number; skip: number };
  handlerPaginationTable: (e: any) => void;
  setPagination: any;
}

export const TableMasterHazardtype: React.FC<props> = ({
  loading,
  dataTable,
  propLoading,
  paginationConfig,
  handlerPaginationTable,
  filter,
  setPagination,
}): React.ReactElement => {
  const stockAuth = useAxiosStock();
  const Masterhazardtype = MasterHazardTypeService(stockAuth);
  const [form] = Form.useForm();
  const [formDelete] = Form.useForm();
  const [switchChecked, setSwitchChecked] = useState<boolean>();
  const [buttonLoading, setbuttonLoading] = useState<boolean>(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState<boolean>(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState<boolean>(false);

  useEffect(() => {}, [switchChecked]);

  const handleChange = (checked: boolean) => {
    setSwitchChecked(checked);
  };

  const showModaledit = (event: any) => {
    if (event) {
      setSwitchChecked(event.status);
      form.setFieldValue("id", event.id);
      form.setFieldValue("nameHazard", event.nameHazard);
      form.setFieldValue("status", event.status);
      form.setFieldValue("description", event.description);
    }
    setIsModalOpenEdit(true);
  };

  const handleOkedit = () => {
    setIsModalOpenEdit(false);
  };

  const handleCanceledit = () => {
    form.resetFields();
    setIsModalOpenEdit(false);
  };
  const showModaldelete = (event: any) => {
    formDelete.setFieldValue("id", event.id);
    setIsModalOpenDelete(true);
  };
  const handleCanceldelete = () => {
    setIsModalOpenDelete(false);
    setbuttonLoading(false);
  };
  const columns: TableColumnsType<any> = [
    {
      title: "NO.",
      dataIndex: "id",
      key: "id",
      render: (event: string, row: any, index: number) => {
        let skip = (filter.current - 1) * filter.pageSize;
        return index + skip + 1;
      },
    },
    {
      title: "HAZARD TYPE",
      dataIndex: "nameHazard",
      key: "nameHazard",
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (event: boolean, row: any, index: number) =>
        event === true ? <Tag color="green">{`Active`}</Tag> : <Tag color="volcano">{`Inactive`}</Tag>,
    },
    {
      title: "CREATED",
      dataIndex: "createdAt",
      width: "18%",
      key: "createdAt",
      render: (event: Date, row: any, index: number) => {
        return `${dateToStringTh(event)} น.`;
      },
    },
    {
      title: "ACTIVE",
      dataIndex: "ghsId",
      key: "ghsId",
      width: "15%",
      align: "center",
      render: (text: string, record: any, index: number) => (
        <div className="space-x-2">
          <Button type="link" onClick={() => showModaledit(record)}>
            {editIcon}
          </Button>

          <Button type="link" danger onClick={() => showModaldelete(record)} disabled={buttonLoading}>
            {deleteIcon}
          </Button>
        </div>
      ),
    },
  ];

  const finishEdit = async (values: any) => {
    setbuttonLoading(true);
    const dataUpdate = {
      id: values.id,
      data: {
        nameHazard: values.nameHazard,
        description: values.description,
        status: switchChecked,
        updatedAt: new Date().toISOString(),
      },
    };
    const dataupdateRes = await Masterhazardtype.updateHazardType(dataUpdate);
    if (dataupdateRes) {
      propLoading(true);
      message.success(`Edit success`);
      setbuttonLoading(false);
      setIsModalOpenEdit(false);
    }
  };

  const finishDelete = async () => {
    setbuttonLoading(true);
    const deleteData = await Masterhazardtype.deleteMasterGhs(formDelete.getFieldValue("id"));
    if (deleteData) {
      setPagination({
        current: 1,
        pageSize: 10,
        skip: 0,
      });
      message.success(`Delete success`);
      propLoading(true);
      setIsModalOpenDelete(false);
      setbuttonLoading(false);
    }
    propLoading(true);
  };

  return loading === true ? (
    <Spin></Spin>
  ) : (
    <div className=" grid grid-cols-1 gap-y-2">
      <div>
        <div className=" col-span-1 space-y-5">
          <div className=" overflow-auto md:overflow-hidden">
            <Table
              loading={loading}
              columns={columns}
              dataSource={dataTable}
              rowKey={(e: any) => e.id}
              pagination={{ total: paginationConfig, current: filter?.current, showSizeChanger: false }}
              onChange={handlerPaginationTable}
            />
          </div>
        </div>
      </div>

      <Modal title="Edit Hazard Type" open={isModalOpenEdit} onOk={handleOkedit} onCancel={handleCanceledit} footer={false}>
        <Form layout="vertical" form={form} onFinish={finishEdit}>
          <Form.Item className=" mb-0" name="id" hidden>
            <Input />
          </Form.Item>
          <Row gutter={[8, 8]}>
            <Col span={12}>
              <Form.Item className=" mb-0" label="Hazard Type :" name="nameHazard" rules={[{ required: true, message: "Please enter Hazard type" }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item className=" mb-0" name={"status"} label={`Status :`}>
                <Switch
                  checkedChildren="Active"
                  unCheckedChildren="Inactive"
                  defaultChecked
                  checked={switchChecked}
                  onChange={(e: boolean) => handleChange(e)}
                  className={switchChecked === true ? "active-switch" : "inactive-switch"}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="description" label="Description :" rules={[{ required: true, message: "Please enter description" }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <div className=" flex justify-end space-x-4">
              <Button onClick={handleCanceledit}>Cancel</Button>
              <Button className="button-blue" loading={buttonLoading} type="primary" htmlType="submit">
                Save Change
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={
          <>
            <Space>
              <InfoCircleOutlined style={{ color: "orange", fontSize: "18px" }} />
              {"Delete this hazard type"}
            </Space>
          </>
        }
        open={isModalOpenDelete}
        onCancel={handleCanceldelete}
        footer={false}
      >
        <div className=" col-span-1">
          <div>{`Are you sure you want to delete this ?`}</div>
          <div className=" flex justify-end space-x-4">
            <Button onClick={handleCanceldelete}>{`Cancel`}</Button>
            <Button type="primary" loading={buttonLoading} onClick={finishDelete} danger>
              {`Confirm`}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
