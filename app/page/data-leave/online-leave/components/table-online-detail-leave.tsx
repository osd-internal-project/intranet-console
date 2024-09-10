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
  rowClassName: any;
}

export const TableOnlineDetailLeave: React.FC<props> = ({
  typeLeaveTable,
  params,
  typeLeaveTableAll,
  rowClassName,
}): React.ReactElement => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns: TableColumnsType<ITypetypeleave> = [
    {
      key: "typeName",
      dataIndex: "typeName",
      title: "ประเภทการลา",
    },
    // {
    //   key: "haveLeft",
    //   dataIndex: "haveLeft",
    //   title: "ลามาแล้ว",
    //   render: (value: number, row: ITypetypeleave) => {
    //     const calculateHours = (value: number): number => {
    //       if (value % 1 === 0.5) {
    //         return 4;
    //       }
    //       return row.haveLeftHours ?? 0;
    //     };

    //     const displayHours = calculateHours(value);
    //     const wholeDays = Math.floor(value);

    //     const rowClass = rowClassName(row);
    //     let color: string | undefined;
    //     if (rowClass === "disabled-row") {
    //       color = "#e0e0e0";
    //     }

    //     return (
    //       <div className="flex justify-center">
    //         <Tag className="w-full flex justify-center" color={color}>
    //           {`${wholeDays} วัน (${displayHours} ชม.)`}
    //         </Tag>
    //       </div>
    //     );
    //   },
    // },

    {
      key: "haveLeft",
      dataIndex: "haveLeft",
      title: "ลามาแล้ว",
      render: (value: number, row: ITypetypeleave) => {
        const wholeDays = Math.floor(value);
        const totalHoursDecimal = value % 1;
        const totalHours = Math.floor(totalHoursDecimal * 10);
        const totalMinutesRaw = (totalHoursDecimal * 10) % 1;
        let totalMinutes = Math.round(totalMinutesRaw * 6);

        if (totalMinutes === 5) {
          totalMinutes = 3;
        }
        let timeDisplay = `${totalHours} ชม.`;
        if (totalMinutes > 0) {
          timeDisplay = `${totalHours}.${totalMinutes} ชม.`;
        }

        const rowClass = rowClassName(row);
        let color: string | undefined;
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
    // {
    //   key: "limitLeaveLastResult",
    //   dataIndex: "limitLeaveLastResult",
    //   title: "คงเหลือ",
    //   render: (value: number, row: ITypetypeleave) => {
    //     const calculateHours = (value: number): number => {
    //       if (value % 1 === 0.5) {
    //         return value;
    //       }
    //       return row.limitLeaveHours ?? 0;
    //     };

    //     const displayHours = calculateHours(value);
    //     const wholeDays = Math.floor(value);

    //     const rowClass = rowClassName(row);
    //     let color: string | undefined;
    //     if (rowClass === "disabled-row") {
    //       color = "#e0e0e0";
    //     }

    //     return (
    //       <div className="flex justify-center">
    //         <Tag className="w-full flex justify-center" color={color}>
    //           {`${wholeDays} วัน (${displayHours} ชม.)`}
    //         </Tag>
    //       </div>
    //     );
    //   },
    // },

    {
      key: "limitLeaveLastResult",
      dataIndex: "limitLeaveLastResult",
      title: "คงเหลือ",
      render: (value: number, row: ITypetypeleave) => {
        const wholeDays = Math.floor(value); // Get the whole day part
        const totalHoursDecimal = value % 1; // Get the decimal part representing hours
        const totalHours = Math.floor(totalHoursDecimal * 10); // Convert decimal part to hours
        const totalMinutesRaw = (totalHoursDecimal * 10) % 1; // Get the remaining decimal part representing minutes
        let totalMinutes = Math.round(totalMinutesRaw * 6); // Convert decimal part to minutes

        // Custom rounding for minutes
        if (totalMinutes === 5) {
          totalMinutes = 3;
        }

        // Prepare the time display string (hours and minutes)
        let timeDisplay = `${totalHours} ชม.`;
        if (totalMinutes > 0) {
          timeDisplay = `${totalHours}.${totalMinutes} ชม.`;
        }

        const rowClass = rowClassName(row); // Determine the row class for styling
        let color: string | undefined;
        if (rowClass === "disabled-row") {
          color = "#e0e0e0"; // Set color for disabled row
        }

        return (
          <div className="flex justify-center">
            <Tag className="w-full flex justify-center" color={color}>
              {`${wholeDays} วัน (${timeDisplay})`}{" "}
              {/* Display the whole days and time */}
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

        const rowClass = rowClassName(row);
        let color: string | undefined;
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
    // {
    //   key: "total",
    //   dataIndex: "haveLeft",
    //   title: "รวม",
    //   render: (value: number, row: ITypetypeleave) => {
    //     const isSelected = row.typeId === params.typeId;
    //     let totalDays = Math.floor(
    //       value + (isSelected ? params.lengthDate : 0)
    //     );
    //     let totalHours = Math.floor(
    //       (row.haveLeftHours || 0) + (isSelected ? params.lengthTime : 0)
    //     );
    //     console.log(isSelected);
    //     console.log(totalDays);
    //     console.log(totalHours);

    //     const convertDaysToHours = (days: number): number => {
    //       const decimalPart = days % 1;
    //       return decimalPart > 0 ? 4 : 0;
    //     };

    //     const fractionalHours = convertDaysToHours(
    //       value + (isSelected ? params.lengthDate : 0)
    //     );
    //     let displayedHours = totalHours + fractionalHours;
    //     if (totalDays < 0) totalDays = Math.floor(value) + 1;
    //     if (displayedHours < 0) displayedHours = totalHours + 8;

    //     const isOverLimit = totalDays > row.limitLeaveLastResult;
    //     const hasDateRange = params.startDate && params.endDate;
    //     const rowClass = rowClassName(row);

    //     let color: string | undefined;
    //     if (rowClass === "disabled-row") {
    //       color = "#e0e0e0";
    //     } else if (isSelected) {
    //       if (isOverLimit) {
    //         color = "orange-inverse";
    //       } else if (hasDateRange) {
    //         color = "green-inverse";
    //       }
    //     }

    //     return (
    //       <div className="flex justify-center">
    //         <Tag className="w-full flex justify-center" color={color}>
    //           {`${totalDays} วัน (${displayedHours} ชม.)`}
    //         </Tag>
    //       </div>
    //     );
    //   },
    // },
    {
      key: "total",
      dataIndex: "haveLeft",
      title: "รวม",
      render: (value: number, row: ITypetypeleave) => {
        const isSelected = row.typeId === params.typeId;

        // คำนวณจำนวนวันเต็ม (Integer)
        let totalDays = Math.floor(
          value + (isSelected ? params.lengthDate : 0)
        );

        // ได้เฉพาะส่วนที่เป็นทศนิยม (ส่วนของชั่วโมงและนาที)
        let totalHoursDecimal = value % 1;

        // แปลงค่าทศนิยมเป็นชั่วโมงและนาที (เช่น 0.35 แปลงเป็น 3 ชั่วโมง 30 นาที)
        let totalHours = Math.floor(totalHoursDecimal * 10); // คำนวณชั่วโมง (เช่น 0.3 เป็น 3 ชั่วโมง)
        let totalMinutesRaw = (totalHoursDecimal * 10) % 1; // คำนวณนาที (เช่น 0.5 เป็น 30 นาที)

        // ถ้าทศนิยมส่วนที่ 3 มีค่าเป็น 5 ให้แสดงเป็น 3 (หมายถึง 30 นาที)
        let totalMinutes = Math.round(totalMinutesRaw * 6); // เปลี่ยนเป็นนาที

        if (totalMinutes === 5) {
          totalMinutes = 3; // ถ้าเป็น 5 ให้แสดงเป็น 30 นาที
        }

        // เพิ่ม lengthTime ถ้ามีการเลือก (assuming lengthTime เป็นชั่วโมง)
        if (isSelected) {
          totalHours = (totalHours + params.lengthTime) % 24; // กำหนดชั่วโมงสูงสุดเป็น 24 ชั่วโมง
          totalMinutes = params.lengthTime % 6; // อัพเดทนาทีถ้ามีการเลือกเวลา
        }

        // ลบเงื่อนไขเก่าเกี่ยวกับค่าติดลบ

        // กำหนดเงื่อนไขว่าจำนวนวันเกินจำนวนวันที่สามารถลาได้หรือไม่
        const isOverLimit = totalDays > row.limitLeaveLastResult;
        const hasDateRange = params.startDate && params.endDate;
        const rowClass = rowClassName(row);

        // กำหนดสีตามเงื่อนไข
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

        // แสดงเฉพาะชั่วโมง ถ้า totalMinutes เป็น 0
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
        if (row.typeId === 3) {
          return (
            <div className="flex justify-center">{`3,6,10,12 วัน(ตามอายุงาน)`}</div>
          );
        }
        return <div className="flex justify-center">{`${values} วัน`}</div>;
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
