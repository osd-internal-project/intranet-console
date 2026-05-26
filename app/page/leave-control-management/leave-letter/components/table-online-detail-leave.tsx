import { Card, Modal, Space, Table, TableColumnsType, Tooltip, Typography } from "antd";
import React, { useState } from "react";
import dayjs from "dayjs";
import { ITypetypeleave } from "../../common";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { showDataHaveLeave, showDataLeave, validateCheckNumberLeave, validateSgowAllHourLeave } from "@/app/utils/validatefield";
import { FormInstance } from "antd/lib";
export interface props {
  typeLeaveTable: ITypetypeleave[];
  createdataleaveForm: FormInstance;
  typeLeaveTableAll: any;
  rowClassName: any;
  createdataleaveFormValues: any;
  dataHolidayDay: any;
}

export const TableOnlineDetailLeave: React.FC<props> = ({
  typeLeaveTable,
  rowClassName,
  createdataleaveFormValues,
  dataHolidayDay,
}): React.ReactElement => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const columns: TableColumnsType<ITypetypeleave> = [
    {
      key: "typeName",
      dataIndex: "typeName",
      title: "ประเภทการลา",
      align: "left",
      className: "font-bold ",
      render: (_, rows) => {
        return (
          <Tooltip
            overlayInnerStyle={{
              width: 600,
              whiteSpace: "pre-wrap",
              backgroundColor: "#ED9121",
              color: "white",
            }}
            title={<div dangerouslySetInnerHTML={{ __html: rows.descriptionLeave }} />}>
            {_}
          </Tooltip>
        );
      },
    },
    {
      key: "haveLeaveDays",
      dataIndex: "haveLeaveDays",
      title: "ลามาแล้ว",
      align: "center",
      render: (value, row) => showDataLeave(row),
    },
    {
      key: "limitLeaveLastResult",
      dataIndex: "limitLeaveLastResult",
      title: "คงเหลือ",
      align: "center",
      render: (value, row) => showDataHaveLeave(row),
    },
    {
      key: "id",
      dataIndex: "id",
      title: "ลาครั้งนี้",
      align: "center",
      render: (value, row) => validateCheckNumberLeave(row, createdataleaveFormValues, dataHolidayDay),
    },
    {
      key: "haveLeaveDays",
      dataIndex: "haveLeaveDays",
      title: "รวม",
      align: "center",
      render: (value, row) => validateSgowAllHourLeave(row, createdataleaveFormValues, rowClassName, dataHolidayDay),
    },
  ];
  const columnsDetail: TableColumnsType<ITypetypeleave> = [
    {
      key: "id",
      dataIndex: "id",
      title: "ลำดับ",
      render: (values, row, index) => index + 1,
    },
    { key: "typeName", dataIndex: "typeName", title: "ประเภทการลา" },
    {
      key: "limitLeave",
      dataIndex: "limitLeave",
      title: "ระยะเวลาในการลา",
      render: (values, row) => {
        return <Typography style={{ textAlign: "center" }}>{`${values} วัน`}</Typography>;
      },
    },
    {
      key: "forwardLeave",
      dataIndex: "forwardLeave",
      title: "เงื่อนไขการลา",
      render: (values, row) => {
        const isSpecialType = [6, 9, 11, 12].includes(row.typeId);
        return (
          <Typography>
            {values ? `ลาล่วงหน้า ${values} วัน` : "สามารถลาย้อนหลังได้"}
            {isSpecialType && <span style={{ color: "red" }}> *</span>}
          </Typography>
        );
      },
    },
  ];
  return (
    <>
      <Card className="w-full grid grid-cols-1 gap-2" styles={{ body: { padding: 5 } }}>
        <div className="flex justify-center w-full mb-2">
          <Space>
            {`ประวัติการลาปี ${dayjs(new Date()).format("YYYY")}`}
            <Tooltip title={`เงื่อนไขในการลาตามแต่ละประเภท`}>
              <a onClick={() => setIsModalOpen(true)} style={{ color: "red" }}>
                <ExclamationCircleOutlined />
              </a>
            </Tooltip>
          </Space>
        </div>
        <Table
          size="small"
          sticky
          bordered
          columns={columns}
          dataSource={typeLeaveTable}
          rowKey={(e: ITypetypeleave) => e.id}
          pagination={{ pageSize: 13, position: ["none"] }}
          scroll={{ x: "max-content" }}
          rowClassName={rowClassName}
        />
      </Card>
      {isModalOpen ? (
        <Modal
          title={
            <>
              {`ระยะเวลาในการลาแต่ละประเภท`}{" "}
              <div style={{ textAlign: "left", fontWeight: "bold" }}>
                <span style={{ color: "red", fontSize: "12px" }}>ลาพักผ่อนประจำปี จำนวนวันลาตามอายุงาน</span>
              </div>
            </>
          }
          open={isModalOpen}
          onOk={() => setIsModalOpen(true)}
          onCancel={() => setIsModalOpen(false)}
          footer={false}
          width={700}>
          <Table
            size="small"
            columns={columnsDetail}
            dataSource={typeLeaveTable}
            rowKey={(e: ITypetypeleave) => e.id}
            pagination={{ pageSize: 13, position: ["none"] }}
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={columnsDetail.length}>
                  <div style={{ textAlign: "left", fontWeight: "bold" }}>
                    หมายเหตุ : <span style={{ color: "red" }}>*</span> ประเภทการลาที่รวมวันหยุด !
                  </div>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
        </Modal>
      ) : null}
    </>
  );
};
