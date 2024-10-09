import React, { useState } from "react";
import type { FormInstance, TableColumnsType } from "antd";
import { Button, ConfigProvider, Input, Modal, Table, Tag } from "antd";
import {
  ITBranch,
  ITBranchAddressForm,
  ITBranchContactForm,
  ITBranchDetail,
  ITBranchForm,
  ITCustomerSub,
  ITCustomerSubDetail,
  ITCustomerSubForm,
} from "../../common";
import CustomerSubModalAdd from "../components/branch-data-add";
import CustomerSubModalEdit from "./branch-data-edit";
import CustomerSubModalDetail from "../components/branch-data-detail";
import { deleteIcon, editIcon } from "@/components/icon";
import { ExclamationCircleFilled } from "@ant-design/icons";
import CustomerSubAddComponent from "./customer-sub-add";
import BranchComponent from "./customer-branch";
import CustomerSubEditComponent from "./customer-sub-edit";
export interface props {
  rules: any;
  branchs: ITBranch[];
  customerSubs: ITCustomerSubDetail[];
  showModalCustomerSubAdd: boolean;
  showModalCustomerSubEdit: boolean;
  onShowModalCustomerSubAdd: (status: boolean) => void;
  onShowModalCustomerSubEdit: (status: boolean) => void;
  onSaveCustomerSub: (form: ITCustomerSubForm) => void;
  onSaveCustomerSubEdit: (form: ITCustomerSubForm) => void;
  onDeleteCustomerSub: (id: number) => void;
  formBranchEdit: FormInstance;
  fetchBranchByCustomerSubId: (customerSubId: number) => void;
  formCustomerSubEdit: FormInstance;
  branchDetail?: ITBranchDetail;
  showModalBranchAdd: boolean;
  showModalBranchEdit: boolean;
  onShowModalBranchAdd: (status: boolean) => void;
  onShowModalBranchEdit: (status: boolean) => void;
  onShowModalBranchDetail: (id: number | undefined) => void;
  onSaveBranch: (form: ITBranchForm) => void;
  onSaveBranchEdit: (form: ITBranchForm) => void;
  onDeleteCustomerBranch: (id: number) => void;
  onSaveBranchAddress: (branchId: number, form: ITBranchAddressForm) => void;
  onDeleteCustomerBranchAddress: (branchId: number, addressId: number) => void;
  onSaveBranchContact: (branchId: number, form: ITBranchContactForm) => void;
  onDeleteCustomerBranchContact: (branchId: number, contactId: number) => void;
}

const CustomerSubDetailComponent: React.FC<props> = ({
  rules,
  branchs,
  customerSubs,
  formBranchEdit,
  showModalCustomerSubAdd,
  showModalCustomerSubEdit,
  onShowModalCustomerSubAdd,
  onShowModalCustomerSubEdit,
  onSaveCustomerSub,
  onSaveCustomerSubEdit,
  onDeleteCustomerSub,
  fetchBranchByCustomerSubId,
  formCustomerSubEdit,
  branchDetail,
  showModalBranchAdd,
  showModalBranchEdit,
  onShowModalBranchAdd,
  onShowModalBranchEdit,
  onShowModalBranchDetail,
  onSaveBranch,
  onSaveBranchEdit,
  onDeleteCustomerBranch,
  onSaveBranchAddress,
  onDeleteCustomerBranchAddress,
  onSaveBranchContact,
  onDeleteCustomerBranchContact,
}): React.ReactElement => {
  const [expandedKey, setExpandedKey] = useState<number | undefined>(undefined);
  const onExpand = async (open: boolean, key: ITCustomerSubDetail) => {
    if (open) {
      fetchBranchByCustomerSubId(key.id);
      setExpandedKey(key.id);
    } else {
      setExpandedKey(undefined);
    }
  };
  const showModalCustomerSubDelete = (id: number) => {
    Modal.confirm({
      title: "Delete this Customer",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to delete this ?",
      okText: "Confirm",
      okButtonProps: { type: "primary", danger: true },
      cancelText: "Cancel",
      onOk: async () => {
        onDeleteCustomerSub(id);
      },
    });
  };
  const columns: TableColumnsType<ITCustomerSubDetail> = [
    {
      key: "id",
      dataIndex: "id",
      title: "No.",
      width: "100px",
      align: "center",
      render: (id: number, record: ITCustomerSubDetail, index: number) =>
        index + 1,
    },
    {
      key: "code",
      dataIndex: "code",
      title: "รหัสลูกค้า",
      width: "200px",
    },
    {
      key: "name",
      dataIndex: "name",
      title: "ชื่อลูกค้า",
    },
    {
      key: "activeStatus",
      dataIndex: "activeStatus",
      title: "สถานะ",
      render: (status?: boolean) =>
        status ? (
          <Tag color="green">{`Active`}</Tag>
        ) : (
          <Tag color="volcano">{`Inactive`}</Tag>
        ),
    },
    // {
    //   key: "id",
    //   dataIndex: "id",
    //   title: "รายละเอียด",
    //   width: "100px",
    //   render: (id: number, record: ITCustomerSubDetail, index: number) => (
    //     <div className="space-x-1">
    //       <Button type="link">View</Button>
    //     </div>
    //   ),
    // },
    {
      key: "id",
      dataIndex: "id",
      title: "ดำเนินการ",
      width: "150px",
      align: "center",
      render: (id: number, record: ITCustomerSubDetail, index: number) => (
        <div className="space-x-1">
          {rules.ruleCustomerSubEdit && (
            <Button
              type="link"
              onClick={() => {
                onShowModalCustomerSubEdit(true);
                formCustomerSubEdit.setFieldsValue(record);
              }}
            >
              {editIcon}
            </Button>
          )}
          {rules.ruleCustomerSubDelete && (
            <Button
              type="link"
              onClick={() => showModalCustomerSubDelete(id)}
              danger
            >
              {deleteIcon}
            </Button>
          )}
        </div>
      ),
    },
  ];

  const renderBranchTable = () => {
    return (
      <BranchComponent
        rules={rules}
        branchs={branchs}
        branchDetail={branchDetail}
        showModalBranchAdd={showModalBranchAdd}
        showModalBranchEdit={showModalBranchEdit}
        onShowModalBranchAdd={onShowModalBranchAdd}
        onShowModalBranchEdit={onShowModalBranchEdit}
        onShowModalBranchDetail={onShowModalBranchDetail}
        onSaveBranch={onSaveBranch}
        onSaveBranchEdit={onSaveBranchEdit}
        onDeleteCustomerBranch={onDeleteCustomerBranch}
        onSaveBranchAddress={onSaveBranchAddress}
        onDeleteCustomerBranchAddress={onDeleteCustomerBranchAddress}
        onSaveBranchContact={onSaveBranchContact}
        onDeleteCustomerBranchContact={onDeleteCustomerBranchContact}
        formEdit={formBranchEdit}
      />
    );
  };
  return (
    <div className=" grid grid-cols-1 gap-3">
      <div className=" flex justify-end">
        {rules?.ruleCustomerSubAdd ? (
          <Button
            size="small"
            type="primary"
            onClick={() => {
              onShowModalCustomerSubAdd(true);
            }}
          >
            {`Add Customer`}
          </Button>
        ) : (
          <></>
        )}
      </div>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              rowExpandedBg: "#fff",
              borderColor: "#aaa",
            },
          },
        }}
      >
        <Table
          rowHoverable={false}
          size="small"
          columns={columns}
          dataSource={customerSubs}
          rowKey={(data: ITCustomerSubDetail) => data.id}
          expandable={{
            expandedRowRender: renderBranchTable,

            onExpand: onExpand,
            expandedRowKeys: expandedKey ? [expandedKey] : undefined,
            // rowExpandable: (record) => record.name !== "Not Expandable",
          }}
        />
      </ConfigProvider>
      <CustomerSubAddComponent
        showModalCustomerSubAdd={showModalCustomerSubAdd}
        onShowModalCustomerSubAdd={onShowModalCustomerSubAdd}
        onSaveCustomerSub={onSaveCustomerSub}
      />

      <CustomerSubEditComponent
        showModalCustomerSubEdit={showModalCustomerSubEdit}
        onShowModalCustomerSubEdit={onShowModalCustomerSubEdit}
        onSaveCustomerSubEdit={onSaveCustomerSubEdit}
        formCustomerSubEdit={formCustomerSubEdit}
      />
    </div>
  );
};

export default CustomerSubDetailComponent;
