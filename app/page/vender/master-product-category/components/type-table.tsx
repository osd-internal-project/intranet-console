import { dateFormatTime } from "@/app/utils";
import { Button, Table, TableProps } from "antd";

interface props {}
export const TypeTable: React.FC<props> = ({}): React.ReactElement => {
  function openEditCategory(row: any): void {
    throw new Error("Function not implemented.");
  }
  function deleteCategory(row: any): void {
    throw new Error("Function not implemented.");
  }

  const columns: TableProps["columns"] = [
    { title: "No.", key: "no", dataIndex: "no" },
    { title: "Name", key: "name", dataIndex: "name" },
    {
      title: "Created Date",
      key: "createdAt",
      dataIndex: "createdAt",
      render: (data) => dateFormatTime(data),
    },
    {
      title: "Updated Date",
      key: "updatedAt",
      dataIndex: "updatedAt",
      render: (data) => dateFormatTime(data),
    },
    {
      title: "Action",
      key: "id",
      dataIndex: "id",
      render: (data, row) => (
        <div className=" space-x-2">
          <Button onClick={() => openEditCategory(row)}>Edit</Button>
          <Button onClick={() => deleteCategory(row)}>Delete</Button>
        </div>
      ),
    },
  ];
  return (
    <>
      <div className=" mb-2 flex justify-between">
        <div className=" font-bold text-lg">Type</div>
        <div>
          <Button type="primary">Add</Button>
        </div>
      </div>
      <div>
        <Table columns={columns} />
      </div>
    </>
  );
};
