"use client";
import { Button, Card, DatePicker, Form, message, Rate, Row, Select, Space, Table } from "antd";
import React, { useState } from "react";
import { useForm } from "antd/es/form/Form";
import { useAxiosReport, useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import dayjs from "dayjs";
import { HouseKeeperStockServices } from "../services/housekeeper.service";

type FieldType = {
  duration: string;
  result: string;
  monthYear: string;
};

type TReport = {
  housekeeper_id: number;
  housekeeper_name: string;
  result: number;
  score: string;
};

interface ResultItem extends TReport {
  sum: number;
}

const { RangePicker } = DatePicker;

export default function ReportComponent() {
  const reportAuth = useAxiosReport();
  const houseKeeperStockServices = HouseKeeperStockServices(reportAuth);
  const [form] = useForm();
  const [dataReport, setDataeport] = useState<ResultItem[]>([]);
  const columns = [
    {
      title: "ชื่อแม่บ้าน",
      dataIndex: "housekeeper_name",
      key: "housekeeper_name",
      onCell: (record: any, index: number) => {
        return { rowSpan: record.sum };
      },
    },
    {
      title: "คะแนน",
      dataIndex: "result",
      key: "result",
      render: (value: number) => <Rate allowHalf defaultValue={value} disabled />,
    },
    {
      title: "จำนวน (ครั้ง)",
      dataIndex: "score",
      key: "score",
    },
  ];

  const submitForm = async () => {
    const value = form.getFieldsValue();
    if (value.export) {
      const response = await houseKeeperStockServices.exportReport(value);
      const blob = new Blob([response], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `คะแนนการทำงานแม่บ้าน- ${dayjs(new Date()).format("YYYYMMDDHHmmss")}.xlsx`;
      link.click();
      return message.success("สำเร็จ");
    }
    const resReport = await houseKeeperStockServices.getReport(value);
    const processData = (data: TReport[]): ResultItem[] => {
      const resultMap: { [date: string]: number } = {};
      data.forEach((item, index) => {
        resultMap[item.housekeeper_id] = (resultMap[item.housekeeper_id] || 0) + 1;
      });
      const result: ResultItem[] = data.map((item, index) => ({
        ...item,
        sum:
          index !== 0
            ? item.housekeeper_id === data[index - 1].housekeeper_id
              ? 0
              : resultMap[item.housekeeper_id]
            : resultMap[item.housekeeper_id],
        index: index,
      }));

      return result;
    };
    setDataeport(processData(resReport));
  };

  return (
    <Row>
      <Card className="w-full p-0" title={`Filter`}>
        <Form form={form} name="filterReport" className="p-0" onFinish={submitForm}>
          <div className="grid grid-cols-4 gap-2">
            <div>
              <Form.Item<FieldType> name="result" className="w-full p-0">
                <Select
                  allowClear
                  placeholder="คะแนน"
                  className="w-full"
                  options={[
                    { value: 5, label: "ดีมาก" },
                    { value: 4, label: "ดี" },
                    { value: 3, label: "ปานกลาง" },
                    { value: 2, label: "แย่" },
                    { value: 1, label: "แย่มาก" },
                  ]}
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item<FieldType> name="duration" className="w-full p-0">
                <Select
                  className="w-full"
                  placeholder="ช่วงเวลา"
                  options={[
                    { value: "morning", label: "ช่วงเช้า" },
                    { value: "afternoon", label: "ช่วงบ่าย" },
                  ]}
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item<FieldType> name="monthYear" rules={[{ required: true, message: "กรุณากรอกข้อมูล เดือน-ปี!" }]} className="p-0">
                <RangePicker picker="month" />
              </Form.Item>
            </div>
          </div>
          <div className="flex justify-end">
            <Space>
              <Form.Item className="p-0" name="export">
                <Button type="primary" htmlType="submit" onClick={() => form.setFieldValue("export", false)}>
                  Search
                </Button>
              </Form.Item>
              <Form.Item className="p-0" name="export">
                <Button type="primary" htmlType="submit" onClick={() => form.setFieldValue("export", true)} danger>
                  Export
                </Button>
              </Form.Item>
            </Space>
          </div>
        </Form>
      </Card>
      <Card className="w-full" title="Result:">
        <Table dataSource={dataReport} columns={columns as any} size="small" rowKey={`index`} />
      </Card>
    </Row>
  );
}
