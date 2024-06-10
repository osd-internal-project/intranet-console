import { Card, Table } from "antd";
import React from "react";
import dayjs from "dayjs";

export const TableOnlineDetailLeave: React.FC = (): React.ReactElement => {
  const columns = [
    { key: "", dataIndex: "", title: "ประเภทการลา" },
    { key: "", dataIndex: "", title: "ลามาแล้ว" },
    { key: "", dataIndex: "", title: "คงเหลือ" },
    { key: "", dataIndex: "", title: "ลาครั้งนี้" },
    { key: "", dataIndex: "", title: "รวม" },
  ];
  return (
    <>
      <Card
        className="w-full grid grid-cols-1 gap-y-2 mt-2"
        title={<div className="flex justify-center w-full">{`ประวัติการลาปี ${dayjs(new Date()).format("YYYY")}`}</div>}
      >
        <Table columns={columns} />
      </Card>
    </>
  );
};
