import { ITUserModule } from "@/app/common/user-module";
import { Button, Switch, Table, TableProps, Tag } from "antd";

interface Props {
  userModules: ITUserModule[];
  openModal: (state: string, record: ITUserModule | undefined) => void;
}
export const UserModuleTable: React.FC<Props> = ({
  userModules,
  openModal,
}) => {
  const columns: TableProps<ITUserModule>["columns"] = [
    { key: "code", title: "Code", dataIndex: "code" },
    { key: "name", title: "Name", dataIndex: "name" },
    { key: "description", title: "Description", dataIndex: "description" },
    {
      key: "status",
      title: "Status",
      dataIndex: "status",
      align: "center",
      render: (data: boolean) =>
        data ? <Tag color="blue">Used</Tag> : <Tag>Not Used</Tag>,
    },
    {
      key: "id",
      title: "Action",
      dataIndex: "id",
      align: "center",
      render: (value, record, index) => (
        <>
          <Button type="link" onClick={() => openModal("edit", record)}>
            Edit
          </Button>
          <Button
            type="link"
            danger
            onClick={() => openModal("delete", record)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];
  return (
    <>
      <Table size="small" columns={columns} dataSource={userModules} />
    </>
  );
};
