import { ITUserPermissionType } from "@/app/common/user-permission-type";
import { Button, Switch, Table, TableProps, Tag } from "antd";

interface Props {
  userPermissionTypes: ITUserPermissionType[];
  openModal: (state: string, record: ITUserPermissionType | undefined) => void;
}
export const UserPermissionTypeTable: React.FC<Props> = ({
  userPermissionTypes,
  openModal,
}) => {
  const columns: TableProps["columns"] = [
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
      <Table columns={columns} dataSource={userPermissionTypes} />
    </>
  );
};
