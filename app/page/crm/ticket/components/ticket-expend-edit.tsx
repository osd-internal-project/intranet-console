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
import { ITExpendType, ITTicketExpend } from "./../common";
import { PlusOutlined } from "@ant-design/icons";
import { FormInstance } from "antd/lib";

export interface props {
  editform: FormInstance<ITTicketExpend>;
  ticketId: number;
  editExpendId: number;
  closeEditModal: () => void;
  expendType: ITExpendType[];
  handleEditTicketExpend: (expendId: number, value: ITTicketExpend) => void;
}

const TicketExpendEdit: React.FC<props> = ({
  editform,
  ticketId,
  editExpendId,
  closeEditModal,
  expendType,
  handleEditTicketExpend,
}): React.ReactElement => {
  const [summaryPrice, setSummaryPrice] = useState(0);
  useEffect(() => {
    onCalSummaryPrice();
  }, [editExpendId]);

  const onCalSummaryPrice = () => {
    const amount = editform.getFieldValue("expendAmount");
    const price = editform.getFieldValue("expendPrice");
    setSummaryPrice(amount && price ? amount * price : 0);
  };
  return (
    <Modal
      open={editExpendId ? true : false}
      title={"แก้ไขรายการขอเบิก"}
      onCancel={closeEditModal}
      footer={[]}
    >
      <Form
        form={editform}
        labelCol={{ sm: 5 }}
        onFinish={(value) => handleEditTicketExpend(editExpendId, value)}
      >
        <Form.Item label={`รายการ`} name={`expendCode`}>
          <Select
            showSearch
            optionFilterProp="label"
            options={expendType.map((data) => ({
              value: data.expendCode,
              label: `${data.expendCode} : ${data.expendName}`,
            }))}
          />
        </Form.Item>
        <Form.Item label={`จำนวน`} name={`expendAmount`}>
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
        <Form.Item label={`ราคา/หน่วย`} name={`expendPrice`}>
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

export default TicketExpendEdit;
