import { Card, Modal, Table, TableColumnsType, Tag, Typography } from "antd";
import React, { useState } from "react";
import dayjs from "dayjs";
import { IDataUser, ITypetypeleave } from "../../common";

export interface props {
  typeLeaveTable: ITypetypeleave[];
  params: any;
  typeLeaveTableAll: any;
}

export const TableOnlineDetailLeave: React.FC<props> = ({
  typeLeaveTable,
  params,
  typeLeaveTableAll,
}): React.ReactElement => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const columns: TableColumnsType<ITypetypeleave> = [
  //   { key: "typeName", dataIndex: "typeName", title: "ประเภทการลา" },
  //   {
  //     key: "haveLeft",
  //     dataIndex: "haveLeft",
  //     title: "ลามาแล้ว",
  //     render: (values: string, row: ITypetypeleave, index: number) => {
  //       return (
  //         <div className="flex justify-center">
  //           <Tag className="w-full flex justify-center">{`${values} วัน (${0} ชม.)`}</Tag>
  //         </div>
  //       );
  //     },
  //   },

  //   {
  //     key: "limitLeaveLastResult",
  //     dataIndex: "limitLeaveLastResult",
  //     title: "คงเหลือ",
  //     render: (values: string, row: ITypetypeleave, index: number) => {
  //       return (
  //         <div className="flex justify-center">
  //           <Tag className="w-full flex justify-center">{`${values} วัน (${0} ชม.)`}</Tag>
  //         </div>
  //       );
  //     },
  //   },
  //   {
  //     key: "id",
  //     dataIndex: "id",
  //     title: "ลาครั้งนี้",
  //     render: (values: string, row: ITypetypeleave, index: number) => {
  //       if (row.typeId === params.typeId) {
  //         console.log(params.lengthTime);

  //         return (
  //           <div className="flex justify-center">
  //             <Tag className="w-full flex justify-center">{`${params.lengthDate} วัน (${params.lengthTime} ชม.)`}</Tag>
  //           </div>
  //         );
  //       } else {
  //         return (
  //           <div className="flex justify-center">
  //             <Tag className="w-full flex justify-center">{`${0} วัน (${0} ชม.)`}</Tag>
  //           </div>
  //         );
  //       }
  //     },
  //   },
  //   {
  //     key: "haveLeft",
  //     dataIndex: "haveLeft",
  //     title: "รวม",
  //     render: (values: string, row: any, index: number) => {
  //       if (row.typeId === params.typeId) {
  //         return Number(values) + params.lengthDate >
  //           row.limitLeaveLastResult ? (
  //           <div className="flex justify-center">
  //             <Tag
  //               className="w-full flex justify-center"
  //               color="orange-inverse"
  //             >{`${(row.haveLeft + params.lengthDate).toString()} วัน (${(
  //               Number(values) + params.lengthTime
  //             ).toString()} ชม.)`}</Tag>
  //           </div>
  //         ) : (
  //           <div className="flex justify-center">
  //             <Tag
  //               className="w-full flex justify-center"
  //               color={
  //                 params.startDate && params.endDate
  //                   ? "green-inverse"
  //                   : undefined
  //               }
  //             >{`${(row.haveLeft + params.lengthDate).toString()} วัน (${(
  //               Number(values) + params.lengthTime
  //             ).toString()} ชม.)`}</Tag>
  //           </div>
  //         );
  //       } else {
  //         return (
  //           <div className="flex justify-center">
  //             <Tag className="w-full flex justify-center">{`${row.haveLeft} วัน (${params.lengthTime} ชม.)`}</Tag>
  //           </div>
  //         );
  //       }
  //     },
  //   },
  // ];

  const columns: TableColumnsType<ITypetypeleave> = [
    { key: "typeName", dataIndex: "typeName", title: "ประเภทการลา" },
    {
      key: "haveLeft",
      dataIndex: "haveLeft",
      title: "ลามาแล้ว",
      render: (values: string, row: ITypetypeleave, index: number) => (
        <div className="flex justify-center">
          <Tag className="w-full flex justify-center">{`${values} วัน (${0} ชม.)`}</Tag>
        </div>
      ),
    },
    {
      key: "limitLeaveLastResult",
      dataIndex: "limitLeaveLastResult",
      title: "คงเหลือ",
      render: (values: string, row: ITypetypeleave, index: number) => (
        <div className="flex justify-center">
          <Tag className="w-full flex justify-center">{`${values} วัน (${0} ชม.)`}</Tag>
        </div>
      ),
    },
    {
      key: "id",
      dataIndex: "id",
      title: "ลาครั้งนี้",
      render: (values: string, row: ITypetypeleave, index: number) => {
        const isSelected = row.typeId === params.typeId;
        const days = isSelected ? params.lengthDate : 0;
        const hours = isSelected ? params.lengthTime : 0;
        return (
          <div className="flex justify-center">
            <Tag className="w-full flex justify-center">{`${days} วัน (${hours} ชม.)`}</Tag>
          </div>
        );
      },
    },
    {
      key: "total",
      dataIndex: "total",
      title: "รวม",
      render: (values: string, row: ITypetypeleave, index: number) => {
        const haveLeft = Number(row.haveLeft) || 0;
        const isSelected = row.typeId === params.typeId;
        const totalDays = haveLeft + (isSelected ? params.lengthDate : 0);
        const totalHours =
          (Number(values) || 0) + (isSelected ? params.lengthTime : 0);
        const color =
          totalDays > row.limitLeaveLastResult
            ? "orange-inverse"
            : params.startDate && params.endDate
            ? "green-inverse"
            : undefined;

        return (
          <div className="flex justify-center">
            <Tag className="w-full flex justify-center" color={color}>
              {`${totalDays} วัน (${totalHours} ชม.)`}
            </Tag>
          </div>
        );
      },
    },
  ];

  //********************************************************************************** */

  const columnsDetail: TableColumnsType<ITypetypeleave> = [
    {
      key: "id",
      dataIndex: "id",
      title: "ลำดับ",
      render: (values: string, row: ITypetypeleave, index: number) => index + 1,
    },
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
        return values ? (
          <Typography>{`ลาล่วงหน้า ${values} วัน`} </Typography>
        ) : (
          <Typography>{`สามารถลาย้อนหลังได้`}</Typography>
        );
      },
    },
  ];

  const rowClassName = (record: any) => {
    return typeLeaveTableAll.some((e: any) => record.id === e.masterTypeleaveId)
      ? "disabled-row"
      : "";
  };
  return (
    <>
      <Card
        className="w-full grid grid-cols-1 gap-y-2 mt-2"
        title={
          <div className="flex justify-center w-full">{`ประวัติการลาปี ${dayjs(
            new Date()
          ).format("YYYY")}`}</div>
        }
      >
        <Table
          size="small"
          columns={columns}
          dataSource={typeLeaveTable}
          rowKey={(e: ITypetypeleave) => e.id}
          pagination={{ pageSize: 13, position: ["none"] }}
          rowClassName={rowClassName}
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
          size="small"
          columns={columnsDetail}
          dataSource={typeLeaveTable}
          rowKey={(e: ITypetypeleave) => e.id}
          pagination={{ pageSize: 13, position: ["none"] }}
        />
      </Modal>
    </>
  );
};
