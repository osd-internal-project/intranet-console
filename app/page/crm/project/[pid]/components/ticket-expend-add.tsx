import React, { useEffect, useState } from "react";
import type {
  BadgeProps,
  CalendarProps,
  TableColumnsType,
  TableColumnType,
  TablePaginationConfig,
} from "antd";
import {
  Badge,
  Button,
  Calendar,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Switch,
  Table,
  Tag,
} from "antd";
import {
  countWithCommas,
  dateToStringTh,
  dateToStringThNoTime,
  numberWithCommas,
} from "@/app/utils/format";

import Link from "next/link";
import { ITExpendType, ITTicketExpend } from "../../common";
import { PlusOutlined } from "@ant-design/icons";
import { FormInstance } from "antd/lib";

export interface props {
  addform: FormInstance<ITTicketExpend>;
  ticketId: number;
  showModalAdd: boolean;
  closeAddModal: () => void;
  expendType: ITExpendType[];
  handleAddTicketExpend: (value: ITTicketExpend) => void;
}

const TicketExpendAdd: React.FC<props> = ({
  addform,
  ticketId,
  showModalAdd,
  closeAddModal,
  expendType,
  handleAddTicketExpend,
}): React.ReactElement => {
  const [summaryPrice, setSummaryPrice] = useState(0);
  useEffect(() => {
    addform.resetFields();
  }, [showModalAdd]);
  const onCalSummaryPrice = () => {
    const amount = addform.getFieldValue("expendAmount");
    const price = addform.getFieldValue("expendPrice");
    console.log(amount * price);
    setSummaryPrice(amount && price ? amount * price : 0);
  };
  return (
    <Modal
      open={showModalAdd}
      title={"เพิ่มรายการขอเบิก"}
      onCancel={closeAddModal}
      footer={[]}
      maskClosable={false}
    >
      <Form
        form={addform}
        labelCol={{ sm: 5 }}
        onFinish={handleAddTicketExpend}
      >
        <Form.Item
          label={`รายการ`}
          name={`expendCode`}
          rules={[{ required: true, message: "Please Select" }]}
        >
          <Select
            showSearch
            optionFilterProp="label"
            options={expendType.map((data) => ({
              value: data.expendCode,
              label: `${data.expendCode} : ${data.expendName}`,
            }))}
          />
        </Form.Item>
        <Form.Item label={`รายละเอียด`} name={`description`}>
          <Input />
        </Form.Item>
        <Form.Item
          label={`จำนวน`}
          name={`expendAmount`}
          rules={[{ required: true, message: "Please Enter" }]}
        >
          <InputNumber
            onChange={() => onCalSummaryPrice()}
            // precision={2}
            // decimalSeparator={"."}
            // formatter={(value) =>
            //   `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            // }
            min={0}
            className=" w-full"
          />
        </Form.Item>
        <Form.Item
          label={`ราคา/หน่วย`}
          name={`expendPrice`}
          rules={[{ required: true, message: "Please Enter" }]}
        >
          <InputNumber
            onChange={() => onCalSummaryPrice()}
            precision={2}
            decimalSeparator={"."}
            // formatter={(value) =>
            //   `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            // }
            min={0}
            className=" w-full"
          />
        </Form.Item>
        <Form.Item label={`ราคารวม`}>
          <Input readOnly width={200} value={numberWithCommas(summaryPrice)} />
        </Form.Item>
        <div className=" flex justify-end space-x-2">
          <Button onClick={() => closeAddModal()}>Cancel</Button>
          <Button htmlType="submit" type="primary">
            Add
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default TicketExpendAdd;
