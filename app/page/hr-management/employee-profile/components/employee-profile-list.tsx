import { Avatar, Table, TablePaginationConfig, Tag } from "antd";
import React from "react";

export interface props {
  dataSource: any[];
  pagination: TablePaginationConfig;
  changePagination: (pagination: TablePaginationConfig) => void;
}

const EmployeeProfileList: React.FC<props> = ({ dataSource, pagination, changePagination }): React.ReactElement => {
  const columns: any = [
    { title: "รหัสพนักงาน ", dataIndex: "empId", key: "empId" },
    { title: "Username", dataIndex: "username", key: "username" },
    {
      title: "ชื่อพนักงาน",
      dataIndex: "id",
      key: "id",
      render: (value: number, records: any, index: number) => {
        return (
          <div key={index} className="flex gap-3 ">
            <div className="flex justify-center items-center">
              <Avatar size={40} src={records.image ? URL.createObjectURL(records.image ? records.image : "") : ""} />
            </div>
            <div>
              <div>
                <div> {`${records.firstNameTH} ${records.lastNameTH}`}</div>
                <div> {`${records.firstNameEN} ${records.lastNameEN}`}</div>
                <div className="text-gray-400">{`${records?.masterPosition?.nameTh}`}</div>
              </div>
            </div>
          </div>
        );
      },
    },
    { title: "Telephone No.", dataIndex: "phoneNumber", key: "phoneNumber" },
    { title: "Extension No.", dataIndex: "extensionNumber", key: "extensionNumber" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      render: (value: boolean, records: any, index: number) => (
        <>{value === true ? <Tag color="green">{`Active`}</Tag> : <Tag color="red">{`InActive`}</Tag>}</>
      ),
    },
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
