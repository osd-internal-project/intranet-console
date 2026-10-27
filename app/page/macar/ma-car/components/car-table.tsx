import React, { useContext, useState } from "react";
import { Table, Button, Row, Col, Space, Modal, Form, Input, message, TablePaginationConfig, Tooltip } from "antd";
import type { FormInstance, FormProps, TableProps } from "antd";
import dayjs from "dayjs";
import ShareMaCarBook from "../../common/export-excel";
import { MaCarServices } from "../../../../services/ma-car.service";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { MaCarBookType, MaCarType, dataMaCarbook, MaCarBookFilter } from "../../common/index";
import ManagementCarFilterPage from "../../ma-car-management/components/management-car-booking/components/management-car-filter";
import { checkStatus, CheckStatusMaCarBookType, isSelectDisabled, showStatus } from "@/app/utils/validatefield";
import { dateFormatTime } from "@/app/utils";
import { CarForm } from "./car-form";
import { UserContectType, UserContext } from "@/app/config/userContext";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";

import { notifyError, notifySuccess } from "@/app/utils/message";
interface props {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  maCarBookData: dataMaCarbook[];
  pagination: TablePaginationConfig;
  changePagination: (pagination: TablePaginationConfig) => void;
  maCarData: MaCarType[];
  dataProvinces: { value: string; label: string }[];
  filters: MaCarBookFilter;
  openFilter: boolean;
  handleOpenFilter: (value: boolean) => void;
  filterForm: FormInstance;
  onSearch: (value: MaCarBookFilter) => void;
}

const MaCarBookTable: React.FC<props> = ({
  changePagination,
  pagination,
  maCarBookData,
  setLoading,
  loading,
  maCarData,
  dataProvinces,
  filters,
  openFilter,
  handleOpenFilter,
  filterForm,
  onSearch,
}: any): React.ReactElement => {
  const { user } = (useContext(UserContext) as UserContectType) || { user: null };
  const [form] = Form.useForm();
  const [formCancel] = Form.useForm();
  const { id24Axios } = useId24();
  // const baseUrlUser = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_USER);
  const baseUrlIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const intraAuthService = MaCarServices(baseUrlIntranet);
  const [modalEditMaCarBook, setModalEditMa] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [modalCancel, setModalCancel] = useState(false);
  const [editState, setEditState] = useState<boolean>(false);
  const [columnId, setColumnId] = useState<number | undefined>(undefined);
  const [currentMaCarBookId, setCurrentMaCarBookId] = useState<number | null>(null);
  const [carBookApprovedStatus, setcarBookApprovedStatus] = useState<string | undefined>(undefined);

  const showModalEditMaCarBook = (record: MaCarBookType) => {
    setCurrentMaCarBookId(record.id);
    form.setFieldsValue({
      ...record,
      carBookStartDate: dayjs(record.carBookStartDate),
      carBookEndDate: dayjs(record.carBookEndDate),
    });
    setModalEditMa(true);
    setLoading(true);
  };

  const onModalEdit = (record: any) => {
    if (!canManageBooking(record)) return;
    showModalEditMaCarBook(record);
    setcarBookApprovedStatus(record.carBookApprovedStatus);
    isSelectDisabled(record.carBookApprovedStatus) ? setEditState(true) : setEditState(false);
  };

  const handleEditMaCancel = () => {
    setModalEditMa(false);
  };

  /** แก้ไข/ยกเลิกได้เฉพาะใบจองของตนเองที่ยังรออนุมัติ — ตารางนี้แสดงใบจองของทุกคน */
  const canManageBooking = (record: MaCarBookType) =>
    record.carBookApprovedStatus === "Process" && record.createdById === user?.userId;

  const onModalCancel = (record: any) => {
    if (!canManageBooking(record)) return;
    checkStatus(record);
    setColumnId(record.id);
    formCancel.setFieldsValue({
      remarkCancel: record.remarkCancel,
      carId: record.carId,
    });
    setModalCancel(true);
  };

  const updatedMaCarBook: FormProps<MaCarBookType>["onFinish"] = async (values) => {
    if (currentMaCarBookId === null) {
      message.error("กรุณาเลือกรายการที่ต้องการแก้ไข");
      return;
    }
    const carSelected = maCarData.findLast((car: any) => car.carId === values.carId);
    try {
      const { carBookStartDate, carBookEndDate } = values;
      const updatedStartDate = carBookStartDate.toISOString();
      const updatedEndDate = carBookEndDate.toISOString();
      const today = new Date();
      if (dayjs(updatedStartDate).format("DD/MM/YYYY") < dayjs(today).format("DD/MM/YYYY")) {
        message.error("ไม่สามารถจองในวันที่ผ่านมาได้");
        setSubmitLoading(false);
        return;
      }
      if (dayjs(updatedEndDate).format("DD/MM/YYYY") < dayjs(updatedStartDate).format("DD/MM/YYYY")) {
        message.error("วันที่สิ้นสุดการจองต้องหลังวันที่เริ่มการจอง");
        setSubmitLoading(false);
        return;
      }
      const selectedOptionProvinces = dataProvinces.find((option: { value: string; label: string }) => option.value === values.carBookProvince);
      const maCarBookData = {
        id: currentMaCarBookId,
        carName: carSelected.carName,
        carBookStartDate: updatedStartDate,
        carBookEndDate: updatedEndDate,
        carBookTitle: values.carBookTitle,
        carBookUsers: Number(values.carBookUsers),
        carBookPlace: values.carBookPlace,
        carBookProvince: selectedOptionProvinces ? selectedOptionProvinces.label : undefined,
        detail: values.detail,
        remark: values.remark || null,
        updatedAt: dayjs().toISOString(),
        updatedById: user?.userId,
        updatedByName: `${user?.firstNameTh} ${user?.lastNameTh}`,
      };
      await intraAuthService.updateMaCarBook(maCarBookData);
      notifySuccess("booking.car.update");
      setSubmitLoading(false);
      setModalEditMa(false);
    } catch (error) {
      notifyError(error, "booking.car.update");
      setSubmitLoading(false);
    }
    setLoading(true);
  };

  const handleCancelMa: FormProps<MaCarBookType>["onFinish"] = async (values) => {
    try {
      const updatedApproveMa = {
        id: columnId,
        carBookApprovedStatus: "Cancel",
        remarkCancel: values.remarkCancel,
        carBookApprovedDate: dayjs().toISOString(),
        carBookApprovedById: user?.userId,
        carBookApprovedByName: `${user?.firstNameTh} ${user?.lastNameTh}`,
      };
      const dataUpdate = await intraAuthService.updateMaCarBook(updatedApproveMa);
      if (dataUpdate) {
        const updataStatusCar = { status: true };
        await intraAuthService.updateMaCar(formCancel.getFieldValue("carId"), updataStatusCar);
        notifySuccess("booking.car.cancel");
        setModalCancel(false);
      }
    } catch (error) {
      notifyError(error, "booking.car.cancel");
    } finally {
      setSubmitLoading(false);
    }
    setLoading(true);
  };

  const columns: TableProps<MaCarBookType>["columns"] = [
    {
      title: "ลำดับ",
      align: "center",
      render: (event: number, row: any, index: number) => maCarBookData.total - (index + (pagination.current - 1) * pagination.pageSize),
    },
    {
      key: "carName",
      title: "ชื่อรถ",
      dataIndex: "carName",
      align: "center",
    },
    {
      key: "carBookStartDate",
      dataIndex: "carBookStartDate",
      title: "เวลาที่ใช้งาน",
      align: "center",
      render: (event: number, row: MaCarBookType, index: number) => {
        return `${dateFormatTime(String(row.carBookStartDate))} ถึง ${dateFormatTime(String(row.carBookEndDate))}`;
      },
    },
    {
      key: "createdByName",
      title: "ชื่อผู้จอง",
      dataIndex: "createdByName",
      align: "center",
    },
    {
      key: "carBookApprovedStatus",
      title: "สถานะ",
      dataIndex: "carBookApprovedStatus",
      align: "center",
      render: (status: string) => CheckStatusMaCarBookType(status),
    },
    {
      key: "carBookApprovedByName",
      title: "ผู้อนุมัติ",
      dataIndex: "carBookApprovedByName",
      align: "center",
      render: (value: string) => (value ? value : "-"),
    },
    {
      title: "จัดการ",
      key: "note",
      dataIndex: "note",
      align: "center",
      render: (_, record) => (
        <Space>
          <Tooltip title="แก้ไข">
            <Button
              disabled={!canManageBooking(record)}
              type="link"
              onClick={() => {
                onModalEdit(record);
              }}>
              {`แก้ไข`}
            </Button>
          </Tooltip>
          <Tooltip title="ยกเลิก">
            <Button
              type="link"
              disabled={!canManageBooking(record)}
              onClick={() => {
                onModalCancel(record);
              }}
              danger>
              {`ยกเลิก`}
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Modal title="แก้ไขข้อมูลการจอง" open={modalEditMaCarBook} onCancel={handleEditMaCancel} footer={null} width={1000}>
        <CarForm
          form={form}
          updatedMaCarBook={updatedMaCarBook}
          editState={editState}
          isSelectDisabled={isSelectDisabled}
          carBookApprovedStatus={carBookApprovedStatus}
          maCarData={maCarData}
          dataProvinces={dataProvinces}
          handleEditMaCancel={handleEditMaCancel}
          submitLoading={submitLoading}
        />
      </Modal>
      <Modal title="ยกเลิกการจองรถ" open={modalCancel} onCancel={() => setModalCancel(false)} footer={null} width={400}>
        <Form form={formCancel} layout="vertical" name="cancel_ma" onFinish={handleCancelMa} autoComplete="off" size="small">
          <Form.Item name="remarkCancel" label="หมายเหตุยกเลิกการจองรถ" rules={[{ required: true, message: "กรุณากรอกหมายเหตุการยกเลิก" }]}>
            <Input placeholder="กรอกหมายเหตุการยกเลิก" />
          </Form.Item>
          <Row justify="end">
            <Button type="primary" htmlType="submit" loading={submitLoading} danger>
              ยกเลิก
            </Button>
          </Row>
        </Form>
      </Modal>
      <Row gutter={[8, 8]} className="flex justify-between">
        <Col style={{ justifyContent: "start", display: "flex", alignItems: "center" }}>{showStatus()}</Col>
        <Col>
          <Space align="start">
            <ManagementCarFilterPage handleOpenFilter={handleOpenFilter} openFilter={openFilter} filterForm={filterForm} onSearch={onSearch} />
            {/* shortcut: ดึงทุกแถวในครั้งเดียว (take=total) — ถ้าข้อมูลหลักหมื่นแถวให้ย้ายไปสร้างไฟล์ที่ backend */}
            <ShareMaCarBook
              disabled={!maCarBookData.total}
              fetchAll={() => intraAuthService.findMaCarBook(0, maCarBookData.total, filters).then((res: dataMaCarbook) => res.docs)}
            />
          </Space>
        </Col>
      </Row>
      <div>
        <Table
          columns={columns}
          scroll={{ x: "max-content" }}
          dataSource={maCarBookData.docs}
          rowKey={(e: any) => e.id}
          onChange={changePagination}
          pagination={{ total: maCarBookData.total }}
          loading={loading}
          style={{ marginTop: "10px" }}
          size="small"
        />
      </div>
    </>
  );
};

export default MaCarBookTable;
