"use client";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, DatePicker, Form, Input, Modal, Popover, Row, Spin, Switch, Table, Tag, message } from "antd";
import { ColumnsType } from "antd/lib/table";
import { ExclamationCircleFilled, FilterOutlined } from "@ant-design/icons";
import { useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
import { PositionServices } from "../services/position.service";
import { FieldTypeUnit } from "../common";
import { editIcon, deleteIcon } from "@/components/icon";
import { checkRule } from "@/app/utils/rules";
import { dateToStringTh } from "@/app/utils/format";

export interface props {
  getloading: boolean;
  getdataAll: any[];
  setLoading: (value: boolean) => void;
  handleOpenFilter: (event: boolean) => void;
  openFilter: boolean;
  onFilter: (value: any) => void;
}

export const TableMasterdataPosition: React.FC<props> = ({
  getloading,
  getdataAll,
  setLoading,
  handleOpenFilter,
  openFilter,
  onFilter,
}): React.ReactElement => {
  const userAuth = useAxiosUser();

  // const editRule = checkRule("st-p-e");
  // const deleteRule = checkRule("st-p-d");
  const positionServices = PositionServices(userAuth);

  const { RangePicker } = DatePicker;
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [buttonLoading, setbuttonLoading] = useState<boolean>(false);

  const searchContent = (
    <Form layout="vertical" onFinish={onFilter} autoComplete="off">
      <div className="grid grid-cols-1 md:gap-4 md:grid-cols-4">
        <Form.Item label="Name TH" name="nameTh">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="Name EN" name="nameEn">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="Created" name="createdAt">
          <RangePicker className=" w-full" />
        </Form.Item>
        <div></div>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Search
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
  useEffect(() => {
    setCurrentPage(1);
  }, [getdataAll]);

  const showModal = (row: any) => {
    if (row) {
      form.setFieldValue("nameTh", row.nameTh);
      form.setFieldValue("nameEn", row.nameEn);
      form.setFieldValue("id", row.id);
      form.setFieldValue("status", row.status);
    }
    setOpenEdit(true);
  };

  const handleCancel = () => {
    setOpenEdit(false);
    form.resetFields();
    setbuttonLoading(false);
  };
  const onfinishEdit = async (event: any) => {
    setbuttonLoading(true);
    const dataUpdate = {
      id: event.id,
      data: {
        nameTh: event.nameTh,
        nameEn: event.nameEn,
        updatedAt: new Date().toISOString(),
      },
    };
    const dataResult = await positionServices.update(dataUpdate);
    if (dataResult) {
      message.success(`Edit success`);
      setLoading(true);
      setOpenEdit(false);
      setbuttonLoading(false);
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: "NO.",
      dataIndex: "id",
      key: "id",
      width: "5%",
      render: (value, record, index: number) => (currentPage - 1) * 10 + index + 1,
    },
    { title: "NAME TH", dataIndex: "nameTh", key: "nameTh" },
    { title: "NAME EN", dataIndex: "nameEn", key: "nameEn" },
    {
      title: "CREATED",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "15%",
      render: (event: Date, row: any, index: number) => dateToStringTh(event),
    },
    {
      title: "ACTIVE",
      dataIndex: "id",
      key: "id",
      align: "center",
      width: "15%",
      render: (event: string, row: any, index: number) => {
        return (
          <>
            <Row gutter={[8, 8]} className="card-filter" style={{ justifyContent: "center", display: "flex" }}>
              {/* {editRule ? ( */}
              <Col>
                <Button type="link" onClick={() => showModal(row)}>
                  {editIcon}
                </Button>
              </Col>
              {/* ) : (
                <></>
              )} */}
              {/* {deleteRule ? ( */}
              <Col>
                <Button type="link" danger onClick={() => onfinishDel(Number(event))} disabled={buttonLoading}>
                  {deleteIcon}
                </Button>
              </Col>
              {/* ) : (
                <></>
              )} */}
            </Row>
          </>
        );
      },
    },
  ];

  const onfinishDel = (event: number) => {
    setbuttonLoading(true);
    Modal.confirm({
      title: "Delete this position",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to delete this ?",
      okText: "Confirm",
      okButtonProps: { type: "primary", danger: true },
      cancelText: "Cancel",
      onOk: async () => {
        const dataResult = await positionServices.remove(event);
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return getloading ? (
    <>
      <Spin />
    </>
  ) : (
    <div className=" grid grid-cols-1 gap-y-2">
      <Row gutter={[8, 8]}>
        <Col span={24}>
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
        </Col>
        <Col span={24}>
          <Card className="card-filter">
            <Table
              size="small"
              loading={getloading}
              dataSource={getdataAll}
              rowKey={(value: any) => value.id}
              columns={columns}
              pagination={{ current: currentPage, onChange: handlePageChange, showSizeChanger: false }}
            />
          </Card>
        </Col>
      </Row>
      <Modal title="Edit Position" open={openEdit} onCancel={handleCancel} footer={false} width={800}>
        <Row gutter={[8, 8]}>
          <Form
            style={{ width: "100%", marginTop: "10px", marginBottom: "-10px" }}
            name="edit"
            autoComplete="off"
            layout="inline"
            form={form}
            onFinish={onfinishEdit}
          >
            <Form.Item<FieldTypeUnit> name={`id`} hidden />
            <Col span={12}>
              <Form.Item<FieldTypeUnit> name={`nameTh`} label={`Name TH :`} rules={[{ required: true, message: "Please enter name TH" }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<FieldTypeUnit> name={`nameEn`} label={`Name EN :`} rules={[{ required: true, message: "Please enter name EN" }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col className="flex  justify-end space-x-2" span={24} style={{ marginTop: "20px" }}>
              <Button
                type="default"
                onClick={() => {
                  setOpenEdit(false);
                  form.resetFields();
                }}
              >{`Cancel`}</Button>

              <Button htmlType="submit" type="default" className="button-blue" loading={buttonLoading}>{`Save Change`}</Button>
            </Col>
          </Form>
        </Row>
      </Modal>
    </div>
  );
};
