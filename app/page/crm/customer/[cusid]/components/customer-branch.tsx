import React from "react";
import type { FormInstance, TableColumnsType } from "antd";
import { Button, Input, Modal, Table } from "antd";
import { ITBranch, ITBranchAddressForm, ITBranchContactForm, ITBranchDetail, ITBranchForm } from "../../common";
import BranchModalAdd from "../components/branch-data-add";
import BranchModalEdit from "./branch-data-edit";
import BranchModalDetail from "../components/branch-data-detail";
import { deleteIcon, editIcon } from "@/components/icon";
import { ExclamationCircleFilled } from "@ant-design/icons";
export interface props {
  branchs: ITBranch[];
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
  formEdit: FormInstance;
}

const BranchComponent: React.FC<props> = ({
  branchs,
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
  formEdit,
}): React.ReactElement => {
  const showModalBranchDelete = (id: number) => {
    Modal.confirm({
      title: "Delete this  Branch",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to delete this ?",
      okText: "Confirm",
      okButtonProps: { type: "primary", danger: true },
      cancelText: "Cancel",
      onOk: async () => {
        onDeleteCustomerBranch(id);
      },
    });
  };
  const columns: TableColumnsType<ITBranch> = [
    {
      key: "id",
      dataIndex: "id",
      title: "No",
      width: "100px",
      render: (id: number, record: ITBranch, index: number) => index + 1,
    },
    {
      key: "branchCode",
      dataIndex: "branchCode",
      title: "รหัสสาขา",
      width: "200px",
    },
    {
      key: "branchName",
      dataIndex: "branchName",
      title: "ชื่อสาขา",
    },
    {
      key: "id",
      dataIndex: "id",
      title: "รายละเอียด",
      width: "100px",
      render: (id: number, record: ITBranch, index: number) => (
        <div className="space-x-1">
          <Button type="link" onClick={() => onShowModalBranchDetail(id)}>
            View
          </Button>
        </div>
      ),
    },
    {
      key: "id",
      dataIndex: "id",
      title: "ดำเนินการ",
      width: "150px",
      align: "center",
      render: (id: number, record: ITBranch, index: number) => (
        <div className="space-x-1">
          <Button
            type="link"
            onClick={() => {
              onShowModalBranchEdit(true), formEdit.setFieldsValue(record);
            }}
          >
            {editIcon}
          </Button>
          <Button type="link" onClick={() => showModalBranchDelete(id)} danger>
            {deleteIcon}
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div className=" grid grid-cols-1 gap-3">
      <div className=" flex justify-end">
        <Button
          type="primary"
          onClick={() => {
            onShowModalBranchAdd(true);
          }}
        >
          {`Add Branch`}
        </Button>
      </div>
      <Table columns={columns} dataSource={branchs} rowKey={(data: ITBranch) => data.id} />
      <BranchModalAdd onSaveBranch={onSaveBranch} showModalBranchAdd={showModalBranchAdd} onShowModalBranchAdd={onShowModalBranchAdd} />
      <BranchModalEdit
        onSaveBranchEdit={onSaveBranchEdit}
        showModalBranchEdit={showModalBranchEdit}
        onShowModalBranchEdit={onShowModalBranchEdit}
        formEdit={formEdit}
      />
      {branchDetail ? (
        <BranchModalDetail
          branchDetail={branchDetail}
          onDeleteCustomerBranchAddress={onDeleteCustomerBranchAddress}
          onShowModalBranchDetail={onShowModalBranchDetail}
          onSaveBranchAddress={onSaveBranchAddress}
          onSaveBranchContact={onSaveBranchContact}
          onDeleteCustomerBranchContact={onDeleteCustomerBranchContact}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default BranchComponent;
