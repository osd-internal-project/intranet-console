import {
  Button,
  Card,
  Modal,
  Table,
  TableColumnsType,
  Tag,
  Typography,
} from "antd";
import React, { useState } from "react";
import dayjs from "dayjs";
import { IDataUser, ITypetypeleave } from "../../common";
import { MouseIcon } from "@/components/icon";

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

  const columns: TableColumnsType<ITypetypeleave> = [
    {
      key: "typeName",
      dataIndex: "typeName",
      title: "ประเภทการลา",
    },
    {
      key: "haveLeft",
      dataIndex: "haveLeft",
      title: "ลามาแล้ว",
      render: (value: number, row: ITypetypeleave) => {
        const calculateHours = (value: number): number => {
          if (value % 1 === 0.5) {
            return 4;
          }
          return row.haveLeftHours ?? 0;
        };

        const displayHours = calculateHours(value);
        const wholeDays = Math.floor(value);

        return (
          <div className="flex justify-center">
            <Tag className="w-full flex justify-center">
              {`${wholeDays} วัน (${displayHours} ชม.)`}
            </Tag>
          </div>
        );
      },
    },
    {
      key: "limitLeaveLastResult",
      dataIndex: "limitLeaveLastResult",
      title: "คงเหลือ",
      render: (value: number, row: ITypetypeleave) => {
        const calculateHours = (value: number): number => {
          if (value % 1 === 0.5) {
            return 4;
          }
          return row.limitLeaveHours ?? 0;
        };

        const displayHours = calculateHours(value);
        const wholeDays = Math.floor(value);
        return (
          <div className="flex justify-center">
            <Tag className="w-full flex justify-center">
              {`${wholeDays} วัน (${displayHours} ชม.)`}
            </Tag>
          </div>
        );
      },
    },
    {
      key: "id",
      dataIndex: "id",
      title: "ลาครั้งนี้",
      render: (value: string, row: ITypetypeleave) => {
        const isSelected = row.typeId === params.typeId;
        let days = isSelected ? params.lengthDate : 0;
        let hours = isSelected ? params.lengthTime : 0;
        days = days < 0 ? 1 : days;
        hours = hours < 0 ? 1 : hours;
        return (
          <div className="flex justify-center">
            <Tag className="w-full flex justify-center">
              {`${days} วัน (${hours} ชม.)`}
            </Tag>
          </div>
        );
      },
    },
    {
      key: "total",
      dataIndex: "haveLeft",
      title: "รวม",
      render: (value: number, row: ITypetypeleave) => {
        const isSelected = row.typeId === params.typeId;
        let totalDays = Math.floor(
          value + (isSelected ? params.lengthDate : 0)
        );
        let totalHours = Math.floor(
          (row.haveLeftHours || 0) + (isSelected ? params.lengthTime : 0)
        );

        const convertDaysToHours = (days: number): number => {
          const decimalPart = days % 1;
          return decimalPart > 0 ? 4 : 0;
        };

        const fractionalHours = convertDaysToHours(
          value + (isSelected ? params.lengthDate : 0)
        );
        let displayedHours = totalHours + fractionalHours;
        if (totalDays < 0) totalDays = Math.floor(value) + 1;
        if (displayedHours < 0) displayedHours = totalHours + 8;
        const isOverLimit = totalDays > row.limitLeaveLastResult;
        const hasDateRange = params.startDate && params.endDate;
        let color: string | undefined;

        if (isSelected) {
          if (isOverLimit) {
            color = "orange-inverse";
          } else if (hasDateRange) {
            color = "green-inverse";
          }
        }

        return (
          <div className="flex justify-center">
            <Tag className="w-full flex justify-center" color={color}>
              {`${totalDays} วัน (${displayedHours} ชม.)`}
            </Tag>
          </div>
        );
      },
    },
  ];

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
      title: "ระยะเวลาในการลา",
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
                {/* <a
                  type="primary"
                  onClick={() => setIsModalOpen(true)}
                  // style={{ fontSize: "16px" }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ marginRight: "8px", fontSize: "18px" }}>
                      {`เงื่อนไขในการลาตามแต่ละประเภท`}
                    </span>
                    {MouseIcon}
                  </div>
                </a> */}
                <Button
                  type="primary"
                  ghost
                  onClick={() => setIsModalOpen(true)}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ fontSize: "16px" }}>
                      {`เงื่อนไขในการลาตามแต่ละประเภท`}
                    </span>
                    {/* {MouseIcon} */}
                  </div>
                </Button>
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
