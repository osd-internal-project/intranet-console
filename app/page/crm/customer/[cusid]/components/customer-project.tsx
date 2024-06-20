import React from "react";
import type { FormInstance } from "antd";
import { Input, Table } from "antd";
import { ITCustomerForm } from "../../common";

// const { RangePicker } = DatePicker;
const { TextArea } = Input;
export interface props {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const layout = {
  labelCol: {},
  wrapperCol: {
    md: { span: 22 },
  },
};

const BranchComponent: React.FC = ({}): React.ReactElement => {
  return <Table />;
};

export default BranchComponent;
