import { Table, TablePaginationConfig } from "antd";
import React from "react";

export interface props {
  dataSource: any[];

  pagination: TablePaginationConfig;
  changePagination: (pagination: TablePaginationConfig) => void;
}

const EmployeeProfileList: React.FC<props> = ({ dataSource, pagination, changePagination }): React.ReactElement => {
  const columns: any = [
    { title: "username", dataIndex: "", key: "" },
    { title: "รหัสพนักงาน (Employee ID)", dataIndex: "", key: "" },
    { title: "ชื่อ (ภาษาไทย)", dataIndex: "", key: "" },
    { title: "นามสกุล (ภาษาไทย)", dataIndex: "", key: "" },
    { title: "Name (English)", dataIndex: "", key: "" },
    { title: "Surname (English)", dataIndex: "", key: "" },
    { title: "หมายเลขติตด่อ (Telephone No.)", dataIndex: "", key: "" },
    { title: "อีเมล์ (Email)", dataIndex: "", key: "" },
    { title: "สถานะ", dataIndex: "", key: "" },
  ];
  return (
    <div>
      <Table
        rowKey={"id"}
        size="small"
        columns={columns}
        dataSource={dataSource}
        onChange={changePagination}
        pagination={pagination}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default EmployeeProfileList;
