import React from "react";
import type { FormInstance } from "antd";
import { Button, Input, Table } from "antd";
import { ITCustomerForm } from "../../common";
import AddBranchModal from "../components/branch-data-add";
// const { RangePicker } = DatePicker;
const { TextArea } = Input;
export interface props {
  showModalBranchAdd: boolean;
  onShowModalBranchAdd: (status: boolean) => void;
}

const BranchComponent: React.FC<props> = ({
  showModalBranchAdd,
  onShowModalBranchAdd,
}): React.ReactElement => {
  return (
    <div className=" grid grid-cols-1 gap-3">
      <div className=" flex justify-end">
        <Button
          type="primary"
          onClick={() => {
            onShowModalBranchAdd(true);
          }}
        >
          Add Branch
        </Button>
      </div>
      <Table />
      <AddBranchModal
        showModalBranchAdd={showModalBranchAdd}
        onShowModalBranchAdd={(status) => onShowModalBranchAdd(status)}
      />
    </div>
  );
};

export default BranchComponent;
