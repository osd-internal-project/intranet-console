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
import { ITypetypeleave } from "../../common";
import "../../styles/style.css";
export interface props {
  typeLeaveTable: ITypetypeleave[];
  params: any;
  typeLeaveTableAll: any;
  rowClassName: any;
}

export const TableOnlineDetailLeave: React.FC<props> = ({
  typeLeaveTable,
  params,
  rowClassName,
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
        const rowClass = rowClassName(row);
        let color: string | undefined;
        const wholeDays = Math.floor(value);
        const totalHoursDecimal = parseFloat((value % 1).toFixed(2));
        const totalHours = Math.floor(totalHoursDecimal * 10);
        const totalMinutesRaw = (totalHoursDecimal * 10) % 1;
        let totalMinutes = Math.round(totalMinutesRaw * 10);
        let timeDisplay = `${totalHours} ชม.`;
        if (totalMinutes > 0) {
          timeDisplay = `${totalHours}.${totalMinutes} ชม.`;
        }
        if (rowClass === "disabled-row") {
          color = "#e0e0e0";
        }
        return (
          <div className="flex justify-center">
            <Tag className="w-full flex justify-center" color={color}>
              {`${wholeDays} วัน (${timeDisplay})`}
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
        const rowClass = rowClassName(row);
        let color: string | undefined;
        let wholeDays = Math.floor(value);
        const totalHoursDecimal = Number((value % 1).toFixed(2));
        let totalHours = Math.floor(totalHoursDecimal * 10);
        const totalMinutesRaw = totalHoursDecimal * 10;
        const totalMinutes = Math.round((totalMinutesRaw * 10) % 10);
        if (totalHours === 8) {
          wholeDays += 1;
          totalHours = 0;
        }
        let timeDisplay = `${totalHours} ชม.`;
        if (totalMinutes > 0) {
          timeDisplay = `${totalHours}.${totalMinutes} ชม.`;
        }
        if (rowClass === "disabled-row") {
          color = "#e0e0e0";
        }
        return (
          <div className="flex justify-center">
            <Tag className="w-full flex justify-center" color={color}>
              {`${wholeDays} วัน (${timeDisplay})`}{" "}
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
        const rowClass = rowClassName(row);
        let days = isSelected ? (params.lengthDate ? params.lengthDate : 0) : 0;
        let hours = isSelected
          ? params.lengthTime
            ? params.lengthTime
            : 0
          : 0;
        let color: string | undefined;
        days = days < 0 ? 1 : days;
        hours = hours < 0 ? 1 : hours;
        if (rowClass === "disabled-row") {
          color = "#e0e0e0";
        }
        return (
          <div className="flex justify-center">
            <Tag className="w-full flex justify-center" color={color}>
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
        const totalHoursDecimal = parseFloat((value % 1).toFixed(2));
        let totalDays = Math.floor(
          value + (isSelected ? params.lengthDate : 0)
        );
        let totalHours = Math.floor(totalHoursDecimal * 10);
        let lengthTime = params.lengthTime;
        let totalMinutesRaw = (totalHoursDecimal * 10) % 1;
        let totalMinutes = Math.round(totalMinutesRaw * 10);
        if (isSelected) {
          const lengthTimeHours = Math.floor(lengthTime);
          const lengthTimeMinutes = Math.round((lengthTime % 1) * 10);
          totalHours += lengthTimeHours;
          totalMinutes += lengthTimeMinutes;
        }
        if (totalMinutes >= 8 && totalMinutes <= 10) {
          totalHours += Math.floor(totalMinutes / 10);
          totalMinutes = totalMinutes % 10;
        }
        if (totalHours >= 8) {
          totalDays += Math.floor(totalHours / 8);
          totalHours = totalHours % 8;
        }
        const isOverLimit = totalDays > row.limitLeaveLastResult;
        const hasDateRange = params.startDate && params.endDate;
        const rowClass = rowClassName(row);
        let color: string | undefined;
        if (rowClass === "disabled-row") {
          color = "#e0e0e0";
        } else if (isSelected) {
          if (isOverLimit) {
            color = "orange-inverse";
          } else if (hasDateRange) {
            color = "green-inverse";
          }
        }
        let timeDisplay = `${totalHours} ชม.`;
        if (totalMinutes > 0) {
          timeDisplay = `${totalHours}.${totalMinutes} ชม.`;
        }
        return (
          <div className="flex justify-center">
            <Tag className="w-full flex justify-center" color={color}>
              {`${totalDays} วัน (${timeDisplay})`}
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
        return (
          <Typography style={{ textAlign: "center" }}>
            {row.typeId === 3 ? "3,6,10,12 วัน (ตามอายุงาน)" : `${values} วัน`}
          </Typography>
        );
      },
    },
    {
      key: "forwardLeave",
      dataIndex: "forwardLeave",
      title: "เงื่อนไขการลา",
      render: (values: number, row: ITypetypeleave, index: number) => {
        const isSpecialType = [6, 9, 11, 12].includes(row.typeId);
        return (
          <Typography>
            {values ? `ลาล่วงหน้า ${values} วัน` : "สามารถลาย้อนหลังได้"}
            {isSpecialType && <span style={{ color: "red" }}> *</span>}{" "}
          </Typography>
        );
      },
    },
  ];

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
          // size="small"
          columns={columns}
          dataSource={typeLeaveTable}
          rowKey={(e: ITypetypeleave) => e.id}
          pagination={{ pageSize: 13, position: ["none"] }}
          rowClassName={rowClassName}
          footer={() => (
            <>
              <div className="flex justify-center w-full">
                <Button
                  type="primary"
                  ghost
                  onClick={() => setIsModalOpen(true)}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ fontSize: "16px" }}>
                      {`เงื่อนไขในการลาตามแต่ละประเภท`}
                    </span>
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
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={columnsDetail.length}>
                <div style={{ textAlign: "left" }}>
                  หมายเหตุ : <span style={{ color: "red" }}>*</span>{" "}
                  ประเภทการลาที่รวมวันหยุด !
                </div>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      </Modal>
    </>
  );
};
