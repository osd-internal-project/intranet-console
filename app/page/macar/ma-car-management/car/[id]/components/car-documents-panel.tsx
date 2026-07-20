"use client";
import React, { useEffect, useState } from "react";
import { Button, Card, Drawer, Empty, Skeleton, Tag, Timeline } from "antd";
import { FileOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import {
  DocType,
  MaCarDocumentFile,
  MaCarDocumentType,
} from "../../../../common";
import {
  DOC_TYPES,
  DOC_TYPE_LABEL,
  LEVEL_TAG_COLOR,
} from "../../../../common/doc-status";
import { MaCarDocumentServices } from "../../../../ma-car-insurance/services/ma-car-document.service";
import { macarFileUrl } from "../../../../common/macar-file";
import DocStatusChip from "../../../../ma-car-insurance/components/doc-status-chip";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import { DateShortTH } from "@/app/utils/time-convertor";
import { numberFormat } from "@/app/utils";

export interface CarDocumentsPanelProps {
  carId: string;
}

interface DrawerState {
  open: boolean;
  docType: DocType | null;
}

/**
 * เลือกเอกสารปัจจุบันของแต่ละประเภท = แถวที่ยังไม่ถูกยกเลิก (status) และหมดอายุช้าที่สุด
 * @param rows เอกสารทั้งหมดของรถ (flat)
 * @param docType ประเภทที่ต้องการ
 */
const pickCurrent = (
  rows: MaCarDocumentType[],
  docType: DocType,
): MaCarDocumentType | null => {
  const candidates = rows
    .filter((doc) => doc.docType === docType && doc.status)
    .sort(
      (a, b) => new Date(b.expireDate).getTime() - new Date(a.expireDate).getTime(),
    );
  return candidates[0] ?? null;
};

/**
 * แผงเอกสารรถ (ประกัน / พ.ร.บ. / ภาษี) ด้านซ้าย — อ่านอย่างเดียว
 * ดึงเอกสารทั้งหมดของรถผ่าน getLog({ carId }) แล้วสรุปสถานะปัจจุบันของแต่ละประเภท
 * คลิก "ดูประวัติ" เพื่อเปิด drawer ไล่ดูประวัติการต่ออายุของประเภทนั้น
 * @param carId รหัสรถ
 */
const CarDocumentsPanel: React.FC<CarDocumentsPanelProps> = ({
  carId,
}): React.ReactElement => {
  const { id24Axios } = useId24();
  const appConfig = loadAppConfig();
  const baseUrIntranet = id24Axios(appConfig.NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const documentServices = MaCarDocumentServices(baseUrIntranet);

  const [rows, setRows] = useState<MaCarDocumentType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [drawer, setDrawer] = useState<DrawerState>({ open: false, docType: null });
  const [history, setHistory] = useState<MaCarDocumentType[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);

  // เอกสารทั้งหมดของรถคันนี้ (ไม่ส่ง take = ได้ทุกแถว) — โหลดใหม่เมื่อ carId เปลี่ยน
  useEffect(() => {
    let active = true;
    const fetchDocs = async () => {
      setLoading(true);
      const res = await documentServices.getLog({ carId });
      if (active) {
        setRows((res.data ?? []) as MaCarDocumentType[]);
        setLoading(false);
      }
    };
    fetchDocs();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carId]);

  /** เปิด drawer ประวัติของเอกสาร 1 ประเภท */
  const openHistory = async (docType: DocType) => {
    setDrawer({ open: true, docType });
    setHistoryLoading(true);
    const data = await documentServices.getHistory(carId, docType);
    setHistory((data ?? []) as MaCarDocumentType[]);
    setHistoryLoading(false);
  };

  /** โหลดไฟล์เอกสารจาก MinIO (ใช้ชื่อไฟล์เดิมตอนดาวน์โหลด) */
  const downloadFile = (file: MaCarDocumentFile) => {
    const url = macarFileUrl(
      file.filePath,
      file.name ?? file.fileName,
      "attachment",
    );
    if (url) window.open(url, "_blank");
  };

  return (
    <Card
      className="shadow-sm border border-gray-200"
      styles={{ body: { padding: 16 } }}
      title={
        <div className="flex items-center gap-2">
          <SafetyCertificateOutlined style={{ color: "var(--primary-blue)" }} />
          <span className="text-base font-semibold">เอกสารรถ</span>
        </div>
      }
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (
        <div className="flex flex-col gap-3">
          {DOC_TYPES.map((docType) => {
            const current = pickCurrent(rows, docType);
            return (
              <div
                key={docType}
                className="rounded-lg border border-gray-200 p-3 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {DOC_TYPE_LABEL[docType]}
                  </span>
                  <Button
                    type="link"
                    size="small"
                    className="!px-0"
                    onClick={() => openHistory(docType)}
                  >
                    ดูประวัติ
                  </Button>
                </div>
                {/* onClick ปิดไว้ (อ่านอย่างเดียว) — ไม่มี "เพิ่มข้อมูล" ในหน้านี้ */}
                {current ? (
                  <DocStatusChip doc={current} />
                ) : (
                  <span className="text-xs text-gray-400">ยังไม่มีข้อมูล</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Drawer
        title={
          drawer.docType
            ? `ประวัติ${DOC_TYPE_LABEL[drawer.docType]}`
            : "ประวัติเอกสาร"
        }
        open={drawer.open}
        onClose={() => setDrawer({ open: false, docType: null })}
        placement="right"
        width={480}
      >
        {historyLoading ? (
          <Skeleton active paragraph={{ rows: 8 }} />
        ) : history.length === 0 ? (
          <Empty description="ยังไม่มีข้อมูลเอกสารประเภทนี้" />
        ) : (
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
                    {doc.cost !== null && (
                      <div>ค่าใช้จ่าย: {numberFormat(doc.cost)} บ.</div>
                    )}
                    {doc.remark && <div>หมายเหตุ: {doc.remark}</div>}
                    {doc.createdByName && <div>บันทึกโดย: {doc.createdByName}</div>}
                  </div>
                  {doc.files?.length > 0 && (
                    <div className="mt-2 flex flex-col gap-1">
                      {doc.files.map((file) => (
                        <div
                          key={file.id}
                          onClick={() => downloadFile(file)}
                          className="text-xs text-blue-600 cursor-pointer hover:underline flex items-center gap-1"
                        >
                          <FileOutlined />
                          {file.name ?? file.fileName}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ),
            }))}
          />
        )}
      </Drawer>
    </Card>
  );
};

export default CarDocumentsPanel;
