import { Table } from "antd";
import React from "react";

export interface props {
  dataSource: any[];
}

const EmployeeProfileList: React.FC<props> = ({ dataSource }): React.ReactElement => {
  const columns = [
    { title: "ชื่อ - สกุล", dataIndex: "", key: "" },
    { title: "ชื่อ - สกุล", dataIndex: "", key: "" },
    { title: "ชื่อ - สกุล", dataIndex: "", key: "" },
    { title: "ชื่อ - สกุล", dataIndex: "", key: "" },
    { title: "ชื่อ - สกุล", dataIndex: "", key: "" },
    { title: "ชื่อ - สกุล", dataIndex: "", key: "" },
    { title: "ชื่อ - สกุล", dataIndex: "", key: "" },
  ];
  return (
    <div>
      <Table rowKey={"id"} size="small" columns={columns} scroll={{ x: "max-content" }} dataSource={dataSource} />
    </div>
  );
};

export default EmployeeProfileList;
