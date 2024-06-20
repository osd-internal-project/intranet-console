import { Card, Modal, Table, TableColumnsType, Typography } from "antd";
import React, { useState } from "react";
import dayjs from "dayjs";
import { ITypetypeleave } from "../../common";

export interface props {
  typeLeaveTable: ITypetypeleave[];
  params: any;
}

export const TableOnlineDetailLeave: React.FC<props> = ({ typeLeaveTable, params }): React.ReactElement => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const columns: TableColumnsType<ITypetypeleave> = [
    { key: "typeName", dataIndex: "typeName", title: "ประเภทการลา" },
    {
      key: "haveLeft",
      dataIndex: "haveLeft",
      title: "ลามาแล้ว",
      render: (values: string, row: ITypetypeleave, index: number) => {
        return <>{`${values} วัน (${0} ชม.)`}</>;
      },
    },

    {
      key: "limitLeaveLastResult",
      dataIndex: "limitLeaveLastResult",
      title: "คงเหลือ",
      render: (values: string, row: ITypetypeleave, index: number) => {
        return <>{`${values} วัน (${0} ชม.)`}</>;
      },
    },
    {
      key: "id",
      dataIndex: "id",
      title: "ลาครั้งนี้",
      render: (values: string, row: ITypetypeleave, index: number) => {
        if (row.typeId === params.typeId) {
          return <>{`${params.lengthDate} วัน (${params.lengthTime} ชม.)`}</>;
        } else {
          return <>{`${Number(values).toString()} วัน (${params.lengthTime} ชม.)`}</>;
        }
      },
    },
    {
      key: "haveLeft",
      dataIndex: "haveLeft",
      title: "รวม",
      render: (values: string, row: any, index: number) => {
        if (row.typeId === params.typeId) {
          return <>{`${(Number(values) + params.lengthDate).toString()} วัน (${(Number(values) + params.lengthTime).toString()} ชม.)`}</>;
        } else {
          return <>{`${Number(values)} วัน (${params.lengthTime} ชม.)`}</>;
        }
      },
    },
  ];

  const columnsDetail: TableColumnsType<ITypetypeleave> = [
    { key: "id", dataIndex: "id", title: "ลำดับ", render: (values: string, row: ITypetypeleave, index: number) => index + 1 },
    { key: "typeName", dataIndex: "typeName", title: "ประเภทการลา" },
    {
      key: "limitLeave",
      dataIndex: "limitLeave",
      title: "ระยะเวลาในการลา (ตามอายุงาน)",
      render: (values: string, row: ITypetypeleave, index: number) => {
        return <div className="flex justify-center">{`${values} วัน `}</div>;
      },
    },
    {
      key: "forwardLeave",
      dataIndex: "forwardLeave",
      title: "เงื่อนไขการลา",
      render: (values: number, row: ITypetypeleave, index: number) => {
        return values ? <Typography>{`ลาล่วงหน้า ${values} วัน`} </Typography> : <Typography>{`สามารถลาย้อนหลังได้`}</Typography>;
      },
    },
  ];

  return (
    <>
      <Card
        className="w-full grid grid-cols-1 gap-y-2 mt-2"
        title={<div className="flex justify-center w-full">{`ประวัติการลาปี ${dayjs(new Date()).format("YYYY")}`}</div>}
      >
        <Table
          columns={columns}
          dataSource={typeLeaveTable}
          rowKey={(e: ITypetypeleave) => e.id}
          pagination={{ pageSize: 13, position: ["none"] }}
          footer={() => (
            <>
              <div className="flex justify-center w-full">
                <a type="primary" onClick={() => setIsModalOpen(true)}>
                  {`เงื่อนไขในการลาตามแต่ละประเภท`}
                </a>
              </div>
            </>
          )}
        />
      </Card>
      <Modal
        title="ระยะเวลาในการลาแต่ละประเภท"
        open={isModalOpen}
        onOk={() => setIsModalOpen(true)}
        onCancel={() => setIsModalOpen(false)}
        footer={false}
        width={700}
      >
        <Table
          columns={columnsDetail}
          dataSource={typeLeaveTable}
          rowKey={(e: ITypetypeleave) => e.id}
          pagination={{ pageSize: 13, position: ["none"] }}
        />
      </Modal>
    </>
  );
};
