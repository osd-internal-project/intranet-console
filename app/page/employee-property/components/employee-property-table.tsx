import type { ITEmployeePropertyCommon } from "@/app/common/epmployee-property";
import { loadAppConfig } from "@/app/config/app-config";
import { UserContext, type UserContectType } from "@/app/config/userContext";
import employeePropertyService from "@/app/services/employee-property.service";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { Button, Form, Input, message, Modal, Popover, Select, Space, Table, Typography, type MenuProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { saveAs } from "file-saver";
import type { ITMistakesType } from "@/app/common/mistakes-type";

export interface props {
  reloadKey: number;
}

const EmployeePropertyTable: React.FC<props> = ({ reloadKey }): React.ReactElement => {
  const { user } = (useContext(UserContext) as UserContectType) || {
    user: null,
  };
  const { id24Axios } = useId24();
  const baseUrIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const baseUrlReport = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_REPORT);
  const employeepropertyservice = employeePropertyService(baseUrIntranet);
  const employeepropertyserviceReprot = employeePropertyService(baseUrlReport);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataTable, setDataTable] = useState<ITEmployeePropertyCommon[]>([]);
  const [params, setParams] = useState<{ type: string; name: string }>({ type: "", name: "" });
  const [filterForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [mistakesForm] = Form.useForm();
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openModalMistake, setOpenModalMistake] = useState<boolean>(false);

  useEffect(() => {
    if (loading) {
      fetchData();
    }
  }, [loading, user, params, reloadKey]);

  const fetchData = async () => {
    if (!user) {
      return false;
    }
    const data = await employeepropertyservice.findByUserId(user?.userId, params);
    setDataTable(data);
    setLoading(false);
  };
  const employeePropertyColumns: ColumnsType<ITEmployeePropertyCommon> = [
    {
      title: "ลำดับ",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "ประเภททรัพย์สิน",
      dataIndex: "type",
      key: "type",
      render: (value: string) =>
        value === "computer_equipment" ? "อุปกรณ์คอมพิวเตอร์ " : value === "office_equipment" ? "อุปกรณ์สำนักงาน" : "อื่นๆ",
    },
    {
      title: "ชื่อทรัพย์สิน",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "ยี่ห้อ",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Serial",
      dataIndex: "serial",
      key: "serial",
    },
    {
      title: "Asset No.",
      dataIndex: "assetNumber",
      key: "assetNumber",
    },
    {
      title: "สถานะ",
      dataIndex: "assetStatus",
      key: "assetStatus",
    },
    {
      title: "ที่ตั้ง",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "วันที่สร้าง",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: string) => new Date(value).toLocaleDateString("th-TH"),
    },
    {
      title: "แก้ไขข้อมูล",
      dataIndex: "id",
      key: "id",
      render: (value: number, record: ITEmployeePropertyCommon) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            แก้ไข
          </Button>
          <Popover
            trigger="click"
            placement="left"
            content={
              <Button danger type="primary" block onClick={() => handleDelete(value)}>
                Delete
              </Button>
            }
          >
            <Button type="link" danger>
              ลบ
            </Button>
          </Popover>
        </Space>
      ),
    },
    {
      title: "แจ้งปัญหา",
      dataIndex: "id",
      key: "id",
      render: (value: number, record: ITEmployeePropertyCommon) => (
        <a onClick={() => handleMistakes(record)} className="text-red-700">
          รายงาน
        </a>
      ),
    },
  ];

  const handleEdit = (record: ITEmployeePropertyCommon) => {
    setOpenEdit(true);
    editForm.setFieldsValue({
      ...record,
    });
  };

  const onFinish = (values: { type: string; name: string }) => {
    setParams(values);
    setLoading(true);
  };

  const handleMistakes = (record: ITEmployeePropertyCommon) => {
    setOpenModalMistake(true);
    mistakesForm.setFieldsValue({
      ...record,
    });
  };

  const content = (
    <div className="w-full">
      <Form<ITEmployeePropertyCommon>
        name="filters"
        form={filterForm}
        layout="horizontal"
        className="w-full"
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 14 }}
        onFinish={onFinish}
      >
        <Form.Item label="ประเภททรัพย์สิน" name="type">
          <Select
            showSearch
            allowClear
            optionFilterProp="label"
            placeholder="Please Select"
            options={[
              { label: "อุปกรณ์คอมพิวเตอร์", value: "computer_equipment" },
              { label: "อุปกรณ์สำนักงาน", value: "office_equipment" },
              { label: "อื่นๆ", value: "other_asset" },
            ]}
          />
        </Form.Item>
        <Form.Item label="สถานะทรัพย์สิน" name="name">
          <Input placeholder="Please Input" />
        </Form.Item>
        <Form.Item className="flex justify-end">
          <Button htmlType="submit" type="primary">
            {`ค้นหา`}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );

  const handleDelete = async (id: number) => {
    try {
      await employeepropertyservice.delete(id);
      message.success("ลบข้อมูลสำเร็จ");
      setLoading(true);
    } catch {
      message.error("ไม่สามารถลบข้อมูลได้");
    } finally {
    }
  };

  const handleExport = async () => {
    if (!user) {
      return false;
    }
    const data = await employeepropertyserviceReprot.export(user?.userId, params);
    if (data) {
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, `รายงานอุปกรณ์-${dayjs(new Date()).format("YYYYMMDDHHmmss")}.xlsx`);
      message.success("สำเร็จ");
    }
  };

  const mistakeColumns: ColumnsType<ITMistakesType> = [
    {
      title: "ประเภทปัญหา",
      dataIndex: "typeName",
      key: "typeName",
    },
    {
      title: "รายละเอียด",
      dataIndex: "detail",
      key: "detail",
    },
    // {
    //   title: "สถานะ",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (status) => (status ? "ใช้งาน" : "ไม่ใช้งาน"),
    // },
    {
      title: "วันที่แจ้ง",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
  ];

  return (
    <div>
      <div>
        <Modal
          title="แจ้งปัญหาทรัพย์สิน"
          open={openModalMistake}
          onCancel={() => {
            setOpenModalMistake(false);
            mistakesForm.resetFields();
          }}
          width={1000}
          footer={null}
        >
          <Form
            form={mistakesForm}
            layout="vertical"
            onFinish={async (values) => {
              const editingRecord = mistakesForm.getFieldsValue(true) as ITEmployeePropertyCommon;
              try {
                const base = {
                  ...values,
                  typeId: values.typeId.value,
                  typeName: values.typeId.label,
                };
                delete base.typeId;
                await employeepropertyservice.createMistakesType(editingRecord!.id, base);
                message.success("แก้ไขข้อมูลสำเร็จ");
                setLoading(true);
                setOpenModalMistake(false);
                mistakesForm.resetFields();
              } catch {
                message.error("เกิดข้อผิดพลาด");
              } finally {
                setLoading(true);
              }
            }}
          >
            <div className="w-full mb-1">
              <Typography className="font-bold underline text-lg">{`ชื่ออุปกรณ์: ${mistakesForm.getFieldValue("name")}`}</Typography>
            </div>
            <Form.Item name="typeId" label="ประเภทปัญหา" rules={[{ required: true }]}>
              <Select
                allowClear
                labelInValue
                placeholder="เลือกประเภทปัญหา"
                optionFilterProp="label"
                showSearch
                options={[
                  { label: "ไม่พบปัญหาใดๆในการทำงาน", value: "NO_ISSUE" },
                  { label: "ปัญหาจากอุปกรณ์คอมพิวเตอร์", value: "COMPUTER_EQUIPMENT" },
                  { label: "ปัญหาจากเครื่องใช้สำนักงาน", value: "OFFICE_EQUIPMENT" },
                  { label: "ปัญหาจากอินเตอร์เน็ต", value: "INTERNET" },
                  { label: "ปัญหาจากสิ่งแวดล้อม เช่น ได้รับแสงไม่เพียงพอ เป็นต้น", value: "ENVIRONMENT" },
                  { label: "Other", value: "OTHER" },
                ]}
              />
            </Form.Item>
            <Form.Item name="detail" label="รายละเอียด" rules={[{ required: true }]}>
              <Input.TextArea rows={4} showCount maxLength={250} placeholder="รายละเอียดปัญหา" />
            </Form.Item>
            <Form.Item className="flex justify-end">
              <Button onClick={() => setOpenEdit(false)} style={{ marginRight: 8 }}>
                {`ยกเลิก`}
              </Button>
              <Button type="primary" htmlType="submit">
                {`แจ้งปัญหา`}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
      <div className="flex justify-between mb-2 w-full">
        <Popover placement="bottomLeft" content={content} trigger="click">
          <Button type="primary">Filters</Button>
        </Popover>
        <Button onClick={() => handleExport()}>Export</Button>
      </div>
      <Table
        dataSource={dataTable}
        columns={employeePropertyColumns}
        rowKey={"id"}
        scroll={{ x: "max-content" }}
        expandable={{
          expandedRowRender: (record) => {
            console.log(record);
            return <Table columns={mistakeColumns} dataSource={record.mistakesType} rowKey="id" pagination={false} size="small" />;
          },
          rowExpandable: (record) => {
            console.log(record);
            return record.mistakesType && record.mistakesType.length > 0;
          },
        }}
      />
      <div>
        <Modal
          title="แก้ไขข้อมูลทรัพย์สิน"
          open={openEdit}
          onCancel={() => {
            setOpenEdit(false);
            editForm.resetFields();
          }}
          footer={null}
        >
          <Form
            form={editForm}
            layout="vertical"
            onFinish={async (values) => {
              const editingRecord = editForm.getFieldsValue(true) as ITEmployeePropertyCommon;
              try {
                await employeepropertyservice.update(editingRecord!.id, values);
                message.success("แก้ไขข้อมูลสำเร็จ");
                setOpenEdit(false);
                editForm.resetFields();
              } catch {
                message.error("เกิดข้อผิดพลาด");
              } finally {
                setLoading(true);
              }
            }}
          >
            <Form.Item name="type" label="ประเภททรัพย์สิน" rules={[{ required: true }]}>
              <Select
                options={[
                  { label: "อุปกรณ์คอมพิวเตอร์", value: "computer_equipment" },
                  { label: "อุปกรณ์สำนักงาน", value: "office_equipment" },
                  { label: "อื่นๆ", value: "other_asset" },
                ]}
              />
            </Form.Item>
            <Form.Item name="name" label="ชื่อทรัพย์สิน" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="brand" label="ยี่ห้อ">
              <Input />
            </Form.Item>
            <Form.Item name="serial" label="Serial">
              <Input />
            </Form.Item>
            <Form.Item name="assetNumber" label="Asset Number">
              <Input />
            </Form.Item>
            <Form.Item name="address" label="ที่ตั้ง">
              <Input />
            </Form.Item>
            <Form.Item name="assetStatus" label="สถานะ">
              <Input />
            </Form.Item>
            <Form.Item className="flex justify-end">
              <Button onClick={() => setOpenEdit(false)} style={{ marginRight: 8 }}>
                ยกเลิก
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                บันทึก
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default EmployeePropertyTable;
