import { Table } from "antd";
import React from "react";

interface props {
  dataSource: any[];
  loading: boolean;
}

const EmailTemplateTable: React.FC<props> = ({ dataSource, loading }): React.ReactElement => {
  const columns = [
    { key: "id", dataIndex: "id", title: "Template ID" },
    { key: "name", dataIndex: "name", title: "Name" },
    { key: "type", dataIndex: "type", title: "Type" },
    { key: "htmlTemplate", dataIndex: "htmlTemplate", title: "html Template" },
    { key: "createAt", dataIndex: "createAt", title: "createAt" },
    { key: "updateAt", dataIndex: "updateAt", title: "updateAt" },
    { key: "id", dataIndex: "id", title: "Action" },
  ];
  return (
    <div>
      <Table rowKey={(e: any) => e.id} loading={loading} dataSource={dataSource} columns={columns} />
    </div>
  );
};

export default EmailTemplateTable;
