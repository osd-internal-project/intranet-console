"use client";
import React from "react";
import {
  Button,
  Descriptions,
  Drawer,
  Empty,
  Popconfirm,
  Spin,
  Tag,
  Timeline,
} from "antd";
import {
  DeleteOutlined,
  FileOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  CarLite,
  DocType,
  MaCarDocumentFile,
  MaCarDocumentType,
} from "../../common";
import { DOC_TYPE_LABEL, LEVEL_TAG_COLOR } from "../../common/doc-status";
import { DateShortTH } from "@/app/utils/time-convertor";
import { numberFormat } from "@/app/utils";

interface DocHistoryDrawerProps {
  open: boolean;
  car: CarLite | null;
  docType: DocType | null;
  history: MaCarDocumentType[];
  loading: boolean;
  onClose: () => void;
  onRenew: (current: MaCarDocumentType) => void;
  onCreate: () => void;
  onEdit: (doc: MaCarDocumentType) => void;
  onVoid: (doc: MaCarDocumentType) => void;
  onDownloadFile: (file: MaCarDocumentFile) => void;
  /** สิทธิ์ลบไฟล์ */
  canDelete?: boolean;
  /** ลบไฟล์แนบ 1 รายการ */
  onDeleteFile?: (id: number) => void;
}

/**
 * ประวัติเอกสารของรถ 1 คัน + 1 ประเภท
 *
 * เพราะการต่ออายุคือการเพิ่มแถวใหม่ ประวัติจึงคือตัวตารางเอง
 * ไม่ต้องมีตาราง log แยก และย้อนดูได้ว่าปีไหนต่อกับใคร จ่ายเท่าไหร่
 */
export default function DocHistoryDrawer({
  open,
  car,
  docType,
  history,
  loading,
  onClose,
  onRenew,
  onCreate,
  onEdit,
  onVoid,
  onDownloadFile,
  canDelete = false,
  onDeleteFile,
}: DocHistoryDrawerProps) {
  // เอกสารปัจจุบัน = งวดที่ยังไม่ถูกยกเลิกและหมดอายุช้าที่สุด (history เรียง expireDate desc มาแล้ว)
  const current = history.find((doc) => doc.status) ?? null;

  const title = car
    ? `${car.licensePlate || car.carName} · ${docType ? DOC_TYPE_LABEL[docType] : ""}`
    : "";

  return (
    <Drawer
      title={title}
      open={open}
      onClose={onClose}
      placement="right"
      width={560}
      extra={
        current ? (
          <Button type="primary" icon={<ReloadOutlined />} onClick={() => onRenew(current)}>
            ต่ออายุ
          </Button>
        ) : (
          <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
            เพิ่มเอกสาร
          </Button>
        )
      }
    >
      {loading ? (
        <div className="flex justify-center py-10">
          <Spin />
        </div>
      ) : history.length === 0 ? (
        <Empty description="ยังไม่มีข้อมูลเอกสารประเภทนี้" />
      ) : (
        <>
          {current && (
            <Descriptions
              title="เอกสารปัจจุบัน"
              column={1}
              size="small"
              bordered
              className="mb-6"
            >
              <Descriptions.Item label="สถานะ">
                <Tag color={LEVEL_TAG_COLOR[current.level]}>
                  {current.level === "expired"
                    ? `เกินกำหนด ${Math.abs(current.daysLeft ?? 0)} วัน`
                    : `เหลืออีก ${current.daysLeft ?? 0} วัน`}
                </Tag>
              </Descriptions.Item>
              {current.vender && (
                <Descriptions.Item label="บริษัท">{current.vender}</Descriptions.Item>
              )}
              {current.insuranceType && (
                <Descriptions.Item label="ชั้นประกัน">
                  {current.insuranceType}
                </Descriptions.Item>
              )}
              {current.policyNo && (
                <Descriptions.Item label="เลขที่เอกสาร">
                  {current.policyNo}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="คุ้มครอง">
                {DateShortTH(new Date(current.startDate))} –{" "}
                {DateShortTH(new Date(current.expireDate))}
              </Descriptions.Item>
              {current.cost !== null && (
                <Descriptions.Item label="ค่าใช้จ่าย">
                  {numberFormat(current.cost)} บ.
                </Descriptions.Item>
              )}
              {current.remark && (
                <Descriptions.Item label="หมายเหตุ">{current.remark}</Descriptions.Item>
              )}
            </Descriptions>
          )}

          <div className="font-semibold mb-3">ประวัติการต่ออายุ</div>
          <Timeline
            items={history.map((doc) => ({
              color: doc.status ? LEVEL_TAG_COLOR[doc.level] : "gray",
              children: (
                <div className={doc.status ? "" : "opacity-50"}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">
                      {DateShortTH(new Date(doc.startDate))} –{" "}
                      {DateShortTH(new Date(doc.expireDate))}
                    </span>
                    {!doc.status && <Tag color="default">ยกเลิก</Tag>}
                  </div>

                  <div className="text-xs text-gray-500 mt-1 leading-5">
                    {doc.vender && <div>บริษัท: {doc.vender}</div>}
                    {doc.insuranceType && <div>ชั้นประกัน: {doc.insuranceType}</div>}
                    {doc.policyNo && <div>เลขที่: {doc.policyNo}</div>}
                    {doc.cost !== null && <div>ค่าใช้จ่าย: {numberFormat(doc.cost)} บ.</div>}
                    {doc.remark && <div>หมายเหตุ: {doc.remark}</div>}
                    {doc.createdByName && <div>บันทึกโดย: {doc.createdByName}</div>}
                    {doc.updatedByName && doc.updatedAt && (
                      <div className="text-orange-600">
                        แก้ไขล่าสุดโดย: {doc.updatedByName} เมื่อ{" "}
                        {DateShortTH(new Date(doc.updatedAt))}
                      </div>
                    )}
                  </div>

                  {doc.files?.length > 0 && (
                    <div className="mt-2 flex flex-col gap-1">
                      {doc.files.map((file) => (
                        <div key={file.id} className="flex items-center gap-2">
                          <div
                            onClick={() => onDownloadFile(file)}
                            className="text-xs text-blue-600 cursor-pointer hover:underline flex items-center gap-1"
                          >
                            <FileOutlined />
                            {file.name ?? file.fileName}
                          </div>
                          {canDelete && onDeleteFile && (
                            <Popconfirm
                              title="ลบไฟล์นี้?"
                              okText="ลบ"
                              cancelText="ยกเลิก"
                              onConfirm={() => onDeleteFile(file.id)}
                            >
                              <DeleteOutlined className="text-xs text-red-500 cursor-pointer" />
                            </Popconfirm>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {doc.status && (
                    <div className="mt-2 flex gap-3">
                      <Button type="link" size="small" className="!p-0" onClick={() => onEdit(doc)}>
                        แก้ไข
                      </Button>
                      <Popconfirm
                        title="ยกเลิกเอกสารนี้?"
                        description="เอกสารจะไม่ถูกลบ แต่จะไม่นับเป็นตัวปัจจุบันอีกต่อไป"
                        okText="ยกเลิกเอกสาร"
                        cancelText="ไม่"
                        onConfirm={() => onVoid(doc)}
                      >
                        <Button type="link" size="small" danger className="!p-0">
                          ยกเลิก
                        </Button>
                      </Popconfirm>
                    </div>
                  )}
                </div>
              ),
            }))}
          />
        </>
      )}
    </Drawer>
  );
}
