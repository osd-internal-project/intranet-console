import React, { useEffect, useState } from "react";
import type { FormInstance, TableColumnsType } from "antd";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  Modal,
  Select,
  Table,
  Tabs,
} from "antd";
import {
  ITBranch,
  ITBranchAddress,
  ITBranchAddressForm,
  ITBranchContactForm,
  ITBranchDetail,
  ITBranchForm,
} from "../../common";
import {
  CloseOutlined,
  ExclamationCircleFilled,
  PlusOutlined,
} from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import BranchAddressComponent from "../components/branch-address";
import BranchContactComponent from "../components/branch-contact";
import { deleteIcon } from "@/components/icon";
// const { RangePicker } = DatePicker;
const { TextArea } = Input;
const layout = {
  labelCol: {
    xs: { span: 5 },
  },
  wrapperCol: {
    md: { span: 19 },
  },
};
export interface props {
  rules: any;
  branchDetail?: ITBranchDetail;
  onShowModalBranchDetail: (id: number | undefined) => void;
  onSaveBranchAddress: (branchId: number, form: ITBranchAddressForm) => void;
  onDeleteCustomerBranchAddress: (branchId: number, addressId: number) => void;
  onSaveBranchContact: (branchId: number, form: ITBranchContactForm) => void;
  onDeleteCustomerBranchContact: (branchId: number, contactId: number) => void;
}

const BranchDetailComponent: React.FC<props> = ({
  rules,
  branchDetail,
  onShowModalBranchDetail,
  onSaveBranchAddress,
  onDeleteCustomerBranchAddress,
  onSaveBranchContact,
  onDeleteCustomerBranchContact,
}): React.ReactElement => {
  const [showModalAddressAdd, setShowModalAddressAdd] = useState(false);
  useEffect(() => {
    setShowModalAddressAdd(false);
  }, [branchDetail?.customerAddress]);

  return (
    <>
      <Modal
        open={branchDetail ? true : false}
        title={"ข้อมูลสาขา"}
        width={1500}
        footer={[]}
        onCancel={() => {
          // onShowModalBranchAdd(false);
          onShowModalBranchDetail(undefined);
        }}
        maskClosable={false}
      >
        <div className=" space-y-3">
          <div className=" grid grid-cols-1  md:grid-cols-4 ">
            <div>
              <b>Code :</b>
              {branchDetail?.branchCode}
            </div>
            <div>
              <b>Name :</b>
              {branchDetail?.branchName}
            </div>
          </div>
          <div className=" grid grid-cols-1">
            <b>Remark :</b>
            <TextArea readOnly rows={4} value={branchDetail?.remark} />
          </div>
          <Divider />
          <Tabs
            type="card"
            items={[
              {
                key: "1",
                label: "ที่อยู่",
                children: (
                  <BranchAddressComponent
                    rules={rules}
                    branchDetail={branchDetail}
                    onDeleteCustomerBranchAddress={
                      onDeleteCustomerBranchAddress
                    }
                    onSaveBranchAddress={onSaveBranchAddress}
                  />
                ),
              },
              {
                key: "2",
                label: "ผู้ติดต่อ",
                children: (
                  <BranchContactComponent
                    rules={rules}
                    branchDetail={branchDetail}
                    onDeleteCustomerBranchContact={
                      onDeleteCustomerBranchContact
                    }
                    onSaveBranchContact={onSaveBranchContact}
                  />
                ),
              },
            ]}
          />
        </div>
      </Modal>
    </>
  );
};

export default BranchDetailComponent;
