"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Divider,
  Input,
  Row,
  Segmented,
  message,
} from "antd";
import type { TablePaginationConfig, UploadFile } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import { UserContectType, UserContext } from "@/app/config/userContext";
import {
  CarDocMatrixRow,
  CarLite,
  DocChartData,
  DocSuggestions,
  DocSummary,
  DocType,
  MaCarDocumentFile,
  MaCarDocumentType,
  MatrixStatusFilter,
} from "../common";
import { MaCarDocumentServices } from "./services/ma-car-document.service";
import { macarFileUrl } from "../common/macar-file";
import DocSummaryCards from "./components/doc-summary-cards";
import DocMatrixTable from "./components/doc-matrix-table";
import DocHistoryDrawer from "./components/doc-history-drawer";
import DocManageModal, { ManageMode } from "./components/doc-manage-modal";
import DocCharts from "./components/doc-charts";
import DocExportPanel from "./components/doc-export-panel";
import DocLogTable from "./components/doc-log-table";

const FILTER_OPTIONS = [
  { label: "ทั้งหมด", value: "all" },
  { label: "หมดอายุแล้ว", value: "expired" },
  { label: "≤ 30 วัน", value: "warning" },
  { label: "≤ 60 วัน", value: "warning60" },
  { label: "ยังไม่มีข้อมูล", value: "none" },
];

export default function MaCarInsuarace() {
  const { user, accessRole } = (useContext(UserContext) as UserContectType) || {
    user: null,
    accessRole: () => false,
  };
  // สิทธิ์ลบไฟล์ของโมดูล macar — เฉพาะ admin หรือ ma-user
  const canDelete = accessRole(["admin", "maUser"]);
  const { id24Axios } = useId24();
  const appConfig = loadAppConfig();
  const baseUrIntranet = id24Axios(appConfig.NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const documentServices = MaCarDocumentServices(baseUrIntranet);

  const [matrix, setMatrix] = useState<CarDocMatrixRow[]>([]);
  const [total, setTotal] = useState<number>(0);
  // รถทุกคัน (ย่อ) — เลี้ยง Select + เปิด drawer เพราะ matrix มีแค่หน้าปัจจุบัน
  const [allCars, setAllCars] = useState<CarLite[]>([]);
  const [summary, setSummary] = useState<DocSummary | null>(null);
  const [chart, setChart] = useState<DocChartData | null>(null);
  const [suggestions, setSuggestions] = useState<DocSuggestions>({
    vender: [],
    insuranceType: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  // bump เพื่อ refetch ทั้งหน้า (matrix + summary/chart) หลัง mutation
  const [reloadKey, setReloadKey] = useState<number>(0);

  const [statusFilter, setStatusFilter] = useState<MatrixStatusFilter>("all");
  const [keyword, setKeyword] = useState<string>(""); // ค่าในช่อง input
  const [appliedKeyword, setAppliedKeyword] = useState<string>(""); // ค่าที่ยิง server (กด Enter)
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
  });

  const [drawer, setDrawer] = useState<{
    open: boolean;
    car: CarLite | null;
    docType: DocType | null;
  }>({ open: false, car: null, docType: null });
  const [history, setHistory] = useState<MaCarDocumentType[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);

  const [modal, setModal] = useState<{
    open: boolean;
    mode: ManageMode;
    carId?: string;
    docType?: DocType;
    record?: MaCarDocumentType | null;
  }>({ open: false, mode: "create" });

  // matrix (แบ่งหน้า) — ยิงใหม่เมื่อเปลี่ยนหน้า/ตัวกรอง/keyword หรือหลัง mutation
  useEffect(() => {
    let active = true;
    const fetchMatrix = async () => {
      setLoading(true);
      const take = pagination.pageSize ?? 20;
      const skip = ((pagination.current ?? 1) - 1) * take;
      const res = await documentServices.getMatrix({
        skip,
        take,
        keyword: appliedKeyword || undefined,
        status: statusFilter,
      });
      if (active) {
        setMatrix(res.data ?? []);
        setTotal(res.count ?? 0);
        setAllCars(res.cars ?? []);
        setLoading(false);
      }
    };
    fetchMatrix();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, appliedKeyword, statusFilter, reloadKey]);

  // summary/chart/suggestions — สแกนทั้งชุด ไม่ผูกกับหน้า/ตัวกรอง refetch แค่หลัง mutation
  useEffect(() => {
    const fetchAncillary = async () => {
      try {
        const [summaryData, chartData, suggestionData] = await Promise.all([
          documentServices.getSummary(),
          documentServices.getChart(),
          documentServices.getSuggestions(),
        ]);
        setSummary(summaryData);
        setChart(chartData);
        setSuggestions(suggestionData ?? { vender: [], insuranceType: [] });
      } catch (error) {
        console.error("Failed to fetch data", error);
        message.error("โหลดข้อมูลไม่สำเร็จ");
      }
    };
    fetchAncillary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadKey]);

  /** สั่ง refetch ทั้งหน้าหลัง mutation */
  const reloadAll = () => setReloadKey((key) => key + 1);

  const resetToFirstPage = () =>
    setPagination((prev) => ({ ...prev, current: 1 }));

  /** เปลี่ยนตัวกรองสถานะ = กลับหน้า 1 (ตัวกรองเป็น server param แล้ว) */
  const handleStatusChange = (value: MatrixStatusFilter) => {
    setStatusFilter(value);
    resetToFirstPage();
  };

  const openDrawer = async (car: CarLite, docType: DocType) => {
    setDrawer({ open: true, car, docType });
    setHistoryLoading(true);
    const data = await documentServices.getHistory(car.carId, docType);
    setHistory(data ?? []);
    setHistoryLoading(false);
  };

  /** เปิด Drawer จาก carId (ปฏิทิน/log/ตาราง) — หาใน allCars เพราะ matrix มีแค่หน้าปัจจุบัน */
  const openDrawerByCarId = (carId: string, docType: DocType) => {
    const car = allCars.find((c) => c.carId === carId);
    if (car) openDrawer(car, docType);
  };

  const refreshDrawer = async () => {
    if (!drawer.car || !drawer.docType) return;
    const data = await documentServices.getHistory(
      drawer.car.carId,
      drawer.docType
    );
    setHistory(data ?? []);
  };

  const closeModal = () => setModal({ open: false, mode: "create" });

  /**
   * บันทึกฟอร์ม — เพิ่ม/ต่ออายุ = insert แถวใหม่, แก้ไข = update แถวเดิม
   * แนบไฟล์หลังบันทึกสำเร็จ เพราะต้องรู้ documentId ก่อนถึงจะผูกไฟล์เข้ากับเอกสารได้
   */
  const handleSubmit = async (values: any, files: UploadFile[]) => {
    const payload = {
      carId: values.carId,
      carName: allCars.find((c) => c.carId === values.carId)?.carName,
      docType: values.docType,
      // ล้างค่าที่ไม่เกี่ยวกับประเภทนี้ทิ้ง กันข้อมูลค้างจากตอนสลับประเภทในฟอร์ม
      insuranceType:
        values.docType === "insurance" ? values.insuranceType ?? null : null,
      vender: values.docType === "tax" ? null : values.vender ?? null,
      policyNo: values.policyNo ?? null,
      cost: values.cost ?? null,
      startDate: values.startDate.toISOString(),
      expireDate: values.expireDate.toISOString(),
      paidDate: values.paidDate ? values.paidDate.toISOString() : null,
      remark: values.remark ?? null,
    };

    const userName = `${user?.firstNameTh} ${user?.lastNameTh}`;
    let saved: MaCarDocumentType | null = null;

    if (modal.mode === "edit" && modal.record) {
      saved = await documentServices.updateDocument(modal.record.documentId, {
        ...payload,
        updatedById: user?.userId,
        updatedByName: userName,
      });
    } else {
      saved = await documentServices.createDocument({
        ...payload,
        createdById: user?.userId,
        createdByName: userName,
      });
    }

    if (!saved?.documentId) {
      message.error("บันทึกไม่สำเร็จ");
      return;
    }

    if (files.length > 0) {
      const formData = new FormData();
      files.forEach((file) => {
        if (file.originFileObj) {
          formData.append("files", file.originFileObj as Blob);
        }
      });
      await documentServices.uploadFiles(saved.documentId, formData);
    }

    message.success(
      modal.mode === "renew"
        ? "ต่ออายุสำเร็จ"
        : modal.mode === "edit"
        ? "แก้ไขสำเร็จ"
        : "เพิ่มเอกสารสำเร็จ"
    );
    closeModal();
    await refreshDrawer();
    reloadAll();
  };

  const handleVoid = async (doc: MaCarDocumentType) => {
    const result = await documentServices.voidDocument(doc.documentId, {
      updatedById: user?.userId,
      updatedByName: `${user?.firstNameTh} ${user?.lastNameTh}`,
    });
    if (!result) {
      message.error("ยกเลิกไม่สำเร็จ");
      return;
    }
    message.success("ยกเลิกเอกสารแล้ว");
    await refreshDrawer();
    reloadAll();
  };

  /** โหลดไฟล์เอกสารจาก MinIO (ใช้ชื่อไฟล์เดิมตอนดาวน์โหลด) */
  const handleDownloadFile = (file: MaCarDocumentFile) => {
    const url = macarFileUrl(
      file.filePath,
      file.name ?? file.fileName,
      "attachment"
    );
    if (url) window.open(url, "_blank");
  };

  /** ลบไฟล์เอกสาร 1 รายการ (เฉพาะผู้มีสิทธิ์) แล้ว refetch หน้า/drawer */
  const handleDeleteFile = async (id: number) => {
    const result = await documentServices.deleteFile(id);
    if (result === null) {
      message.error("ลบไฟล์ไม่สำเร็จ");
      return;
    }
    message.success("ลบไฟล์แล้ว");
    await refreshDrawer();
    reloadAll();
  };

  return (
    <Row>
      <Col span={24}>
        <Breadcrumb
          items={[
            { href: "/page/home", title: <span>หน้าหลัก</span> },
            { title: <span>เอกสารรถยนต์</span> },
          ]}
        />
      </Col>

      <Divider orientation="left" orientationMargin="0">
        <div
          className="title-page-font"
          style={{ display: "flex", alignItems: "left" }}
        >
          <span style={{ marginRight: "8px" }}>
            เอกสารรถยนต์ (ประกัน / พ.ร.บ. / ภาษี)
          </span>
        </div>
      </Divider>

      <Col span={24}>
        <div className="grid-span-1 space-y-2">
          <DocSummaryCards
            summary={summary}
            loading={loading}
            statusFilter={statusFilter}
            onFilterChange={handleStatusChange}
          />

          <Card>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <Segmented
                options={FILTER_OPTIONS}
                value={statusFilter}
                onChange={(value) =>
                  handleStatusChange(value as MatrixStatusFilter)
                }
              />
              <div className="flex items-center gap-2">
                <Input.Search
                  allowClear
                  placeholder="ค้นหาทะเบียน / ชื่อรถ (Enter)"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  onSearch={(value) => {
                    setAppliedKeyword(value.trim());
                    resetToFirstPage();
                  }}
                  style={{ width: 240 }}
                />
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setModal({ open: true, mode: "create" })}
                >
                  เพิ่มเอกสาร
                </Button>
              </div>
            </div>

            <DocMatrixTable
              data={matrix}
              loading={loading}
              pagination={pagination}
              total={total}
              onChange={setPagination}
              onCellClick={openDrawer}
            />
          </Card>

          <DocCharts
            chart={chart}
            loading={loading}
            cars={allCars}
            onSelectDocument={openDrawerByCarId}
          />

          <DocExportPanel axios={baseUrIntranet} cars={allCars} />

          <DocLogTable
            axios={baseUrIntranet}
            cars={allCars}
            onRowClick={openDrawerByCarId}
          />
        </div>
      </Col>

      <DocHistoryDrawer
        open={drawer.open}
        car={drawer.car}
        docType={drawer.docType}
        history={history}
        loading={historyLoading}
        onClose={() => setDrawer({ open: false, car: null, docType: null })}
        onRenew={(current) =>
          setModal({
            open: true,
            mode: "renew",
            carId: drawer.car?.carId,
            docType: drawer.docType ?? undefined,
            record: current,
          })
        }
        onCreate={() =>
          setModal({
            open: true,
            mode: "create",
            carId: drawer.car?.carId,
            docType: drawer.docType ?? undefined,
          })
        }
        onEdit={(doc) =>
          setModal({
            open: true,
            mode: "edit",
            carId: drawer.car?.carId,
            docType: drawer.docType ?? undefined,
            record: doc,
          })
        }
        onVoid={handleVoid}
        onDownloadFile={handleDownloadFile}
        canDelete={canDelete}
        onDeleteFile={handleDeleteFile}
      />

      <DocManageModal
        open={modal.open}
        mode={modal.mode}
        cars={matrix}
        suggestions={suggestions}
        presetCarId={modal.carId}
        presetDocType={modal.docType}
        record={modal.record}
        canDelete={canDelete}
        onDeleteFile={handleDeleteFile}
        onCancel={closeModal}
        onSubmit={handleSubmit}
      />
    </Row>
  );
}
