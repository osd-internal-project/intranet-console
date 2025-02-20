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
  dateToStringTh,
  dateToStringThNoTime,
  numberWithCommas,
} from "@/app/utils/format";

import Link from "next/link";
import { ITExpenseType, ITTicketExpense } from "@/app/common/ticket";
import { PlusOutlined } from "@ant-design/icons";
import { FormInstance } from "antd/lib";

export interface props {
  editform: FormInstance<ITTicketExpense>;
  ticketId: number;
  editExpenseId: number;
  closeEditModal: () => void;
  expenseType: ITExpenseType[];
  handleEditTicketExpense: (expenseId: number, value: ITTicketExpense) => void;
}

const TicketExpenseEdit: React.FC<props> = ({
  editform,
  ticketId,
  editExpenseId,
  closeEditModal,
  expenseType,
  handleEditTicketExpense,
}): React.ReactElement => {
  const [summaryPrice, setSummaryPrice] = useState(0);
  useEffect(() => {
    onCalSummaryPrice();
  }, [editExpenseId]);

  const onCalSummaryPrice = () => {
    const amount = editform.getFieldValue("expenseAmount");
    const price = editform.getFieldValue("expensePrice");
    setSummaryPrice(amount && price ? amount * price : 0);
  };
  return (
    <Modal
      open={editExpenseId ? true : false}
      title={"แก้ไขรายการขอเบิก"}
      onCancel={closeEditModal}
      footer={[]}
      maskClosable={false}
    >
      <Form
        form={editform}
        labelCol={{ sm: 5 }}
        onFinish={(value) => handleEditTicketExpense(editExpenseId, value)}
      >
        <Form.Item name={"formType"} label={"ประเภทการเบิก"}>
          <Select
            allowClear
            placeholder="Please Select"
            options={[
              { value: "normal", label: "Normal" },
              { value: "advance", label: "Advance" },
            ]}
          />
        </Form.Item>
        <Form.Item
          label={`รายการ`}
          name={`expenseCode`}
          rules={[{ required: true, message: "Please Select" }]}
        >
          <Select
            showSearch
            optionFilterProp="label"
            options={expenseType.map((data) => ({
              value: data.expenseCode,
              label: `${data.expenseCode} : ${data.expenseName}`,
            }))}
          />
        </Form.Item>
        <Form.Item label={`รายละเอียด`} name={`description`}>
          <Input />
        </Form.Item>
        <Form.Item
          label={`จำนวน`}
          name={`expenseAmount`}
          rules={[{ required: true, message: "Please Enter" }]}
        >
          <InputNumber
            onChange={() => onCalSummaryPrice()}
            // formatter={(value) =>
            //   `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            // }
            min={0}
            className=" w-full"
          />
        </Form.Item>
        <Form.Item
          label={`ราคา/หน่วย`}
          name={`expensePrice`}
          rules={[{ required: true, message: "Please Enter" }]}
        >
          <InputNumber
            precision={2}
            decimalSeparator={"."}
            onChange={() => onCalSummaryPrice()}
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
          <Button onClick={() => closeEditModal()}>Cancel</Button>
          <Button htmlType="submit" type="primary">
            Edit
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default TicketExpenseEdit;
