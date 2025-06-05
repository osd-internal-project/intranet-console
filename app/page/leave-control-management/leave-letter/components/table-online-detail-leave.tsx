import { Card, Modal, Space, Table, TableColumnsType, Tag, Tooltip, Typography } from "antd";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { ITypetypeleave } from "../../common";
import "../../styles/style.css";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { showDataLeave, validateCheckNumberLeave, validateSgowAllHourLeave } from "@/app/utils/validatefield";
import { FormInstance } from "antd/lib";
export interface props {
  typeLeaveTable: ITypetypeleave[];
  createdataleaveForm: FormInstance;
  typeLeaveTableAll: any;
  rowClassName: any;
  createdataleaveFormValues: any;
}

export const TableOnlineDetailLeave: React.FC<props> = ({
  typeLeaveTable,
  createdataleaveForm,
  rowClassName,
  createdataleaveFormValues,
}): React.ReactElement => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns: TableColumnsType<ITypetypeleave> = [
    {
      key: "typeName",
      dataIndex: "typeName",
      title: "ประเภทการลา",
    },
    {
      key: "haveLeave",
      dataIndex: "haveLeave",
      title: "ลามาแล้ว",
      render: (value: number, row: ITypetypeleave) => showDataLeave(value),
    },
    {
      key: "limitLeaveLastResult",
      dataIndex: "limitLeaveLastResult",
      title: "คงเหลือ",
      render: (value: number, row: ITypetypeleave) => showDataLeave(value),
    },
    {
      key: "id",
      dataIndex: "id",
      title: "ลาครั้งนี้",
      render: (value: string, row: ITypetypeleave) => validateCheckNumberLeave(row, createdataleaveFormValues),
    },
    {
      key: "haveLeave",
      dataIndex: "haveLeave",
      title: "รวม",
      render: (value: number, row: ITypetypeleave) => validateSgowAllHourLeave(value, row, createdataleaveFormValues, rowClassName),
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
        return <Typography style={{ textAlign: "center" }}>{row.typeId === 3 ? "3,6,10,12 วัน (ตามอายุงาน)" : `${values} วัน`}</Typography>;
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
          <div className="flex justify-center w-full">
            <Space>
              {`ประวัติการลาปี ${dayjs(new Date()).format("YYYY")}`}
              <Tooltip title={`เงื่อนไขในการลาตามแต่ละประเภท`}>
                <a onClick={() => setIsModalOpen(true)} style={{ color: "red" }}>
                  <ExclamationCircleOutlined />
                </a>
              </Tooltip>
            </Space>
          </div>
        }
        styles={{ body: { padding: 10 } }}>
        <Table
          size="small"
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
          title="ระยะเวลาในการลาแต่ละประเภท"
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
