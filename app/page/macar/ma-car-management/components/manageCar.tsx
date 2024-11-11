import React, { useState, useEffect } from "react";
import { Table, Button, Row, Col, Space, Modal, Form, message, Popconfirm, TablePaginationConfig, Tooltip, Input } from "antd";
import { DeleteIcon, CancelMaCarIcon, CarApproveIcon } from "@/components/icon";
import type { TableProps, FormProps } from "antd";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManageCarServices } from "../services/manage-car.service";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { MaCarBookType, dataMaCarbook } from "../../common/index";
import TextArea from "antd/es/input/TextArea";
import { checkStatusMaCarApprove, checkStatusMaCarCancel, CheckStatusMaCarBookType, showStatus } from "@/app/utils/validatefield";
import { dateFormatTime } from "@/app/utils";
import { CarApproveForm } from "./carApproveForm";
import { CarReturnForm } from "./carReturnForm";
import { MaCarServices } from "@/app/services/ma-car.service";

export interface props {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  maCarBookData: dataMaCarbook[];
  pagination: TablePaginationConfig;
  changePagination: (pagination: TablePaginationConfig) => void;
}

const ManageCar: React.FC<props> = ({ setLoading, loading, maCarBookData, pagination, changePagination }: any): React.ReactElement => {
  const { data: session } = useSession();
  const intraAuth = useAxiosIntranet();
  const intraAuthService = ManageCarServices(intraAuth);
  const macarservice = MaCarServices(intraAuth);

  const [formReturn] = Form.useForm();
  const [form] = Form.useForm();
  const [formDisapProved] = Form.useForm();
  const [formCancel] = Form.useForm();
  const [modalApproveMa, setModalApproveMa] = useState(false);
  const [modalReturn, setModalReturn] = useState(false);
  const [carBookApprovedStatus, setMaCarBookStatus] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [currentMaId, setCurrentMaId] = useState<number | null>(null);
  const [maBookData, setMaBookData] = useState<MaCarBookType[]>([]);
  const { Search } = Input;
  const [modalDisapProved, setModalDisapProved] = useState(false);
  const [modalCancel, setModalCancel] = useState(false);
  const [columnId, setColumnId] = useState<number | undefined>(undefined);
  const [dataSource, setDataSource] = React.useState<any>([]);
  const [messages, messageHeader] = message.useMessage();

  useEffect(() => {
    setDataSource(maCarBookData.docs || []);
  }, [maCarBookData]);

  const onModelApprove = (record: any) => {
    setMaCarBookStatus(record.carBookApprovedStatus);
    showModalApproveBook(record);
  };

  const showModalApproveBook = (record: MaCarBookType) => {
    form.setFieldsValue({
      createdByName: record.createdByName,
      carName: record.maCar.carName,
      status: record.maCar.status,
      carBookTitle: record.carBookTitle,
      carBookPlace: record.carBookPlace,
      carBookProvince: record.carBookProvince,
      carBookUsers: record.carBookUsers,
      detail: record.detail,
      remark: record.remark,
      carBookStartDate: dayjs(record.carBookStartDate),
      carBookEndDate: dayjs(record.carBookEndDate),
    });
    formDisapProved.setFieldsValue({
      remarkApproved: record.remarkApproved,
      carId: record.carId,
    });
    setModalApproveMa(true);
    setCurrentMaId(record.id);
  };

  const handleApproveBook = () => {
    setModalApproveMa(false);
  };

  const showModalReturn = (record: MaCarBookType) => {
    setModalReturn(true);
    setMaCarBookStatus(record.carBookApprovedStatus);
    setCurrentMaId(record.id);
    formReturn.setFieldsValue({
      carName: record.maCar.carName,
      carMile: record.maCar.carMile,
      carPetrol: record.maCar.carPetrol,
      status: record.maCar.status,
      createdByName: record.createdByName,
      carId: record.carId,
    });
  };

  const handleReturn = () => {
    setModalReturn(false);
  };

  const handleDeleteMa = async (id: number) => {
    setSubmitLoading(true);
    try {
      await intraAuthService.deleteMaCarBook(id);
      setMaBookData(maBookData.filter((item) => item.id !== id));
      messages.success("ลบข้อมูลการจองสำเร็จ");
      setSubmitLoading(false);
    } catch (error) {
      messages.error("ลบข้อมูลการจองไม่สำเร็จ");
    }
    setLoading(true);
  };

  const onModelCancel = (record: any) => {
    checkStatusMaCarCancel(record);
    setColumnId(record.id);
    formCancel.setFieldsValue({
      remarkCancel: record.remarkCancel,
    });
    record.carBookApprovedStatus === "Process" || record.carBookApprovedStatus === "Approve" ? setModalCancel(true) : null;
  };

  const handleCancelMa: FormProps<MaCarBookType>["onFinish"] = async (values) => {
    try {
      const updatedCancelMa = {
        id: columnId,
        carBookApprovedStatus: "Cancel",
        remarkCancel: values.remarkCancel,
      };
      const dataCancel = await intraAuthService.updateMaCarBook(updatedCancelMa);
      if (dataCancel) {
        const updataStatusCar = { status: true };
        await macarservice.updateMaCar(formCancel.getFieldValue("carId"), updataStatusCar);
        messages.success("ยกเลิกการจองสำเร็จ");
        setSubmitLoading(false);
      }
    } catch (error) {
      messages.error("ยกเลิกการจองไม่สำเร็จ");
    } finally {
      setSubmitLoading(false);
    }
    setLoading(true);
  };

  const onFinishCancel: FormProps<MaCarBookType>["onFinish"] = async (values) => {
    setModalApproveMa(false);
    try {
      const updatedApproveMa = {
        id: currentMaId,
        carBookApprovedById: session?.user.userId,
        carBookApprovedByName: `${session?.user.firstNameTh} ${session?.user.lastNameTh}`,
        carBookApprovedStatus: "DisapProved",
        carBookApprovedDate: dayjs(),
        remarkApproved: values.remarkApproved,
      };
      const dataReject = await intraAuthService.updateMaCarBook(updatedApproveMa);
      if (dataReject) {
        const updataStatusCar = { status: true };
        await macarservice.updateMaCar(formDisapProved.getFieldValue("carId"), updataStatusCar);
        messages.success("ไม่อนุมัติการจองสำเร็จ");
        formDisapProved.resetFields;
        setModalApproveMa(false);
        setModalDisapProved(false);
        setSubmitLoading(false);
      }
    } catch (error) {
      messages.error("อนุมัติการจองไม่สำเร็จ");
    } finally {
      setSubmitLoading(false);
    }
    setLoading(true);
  };

  const onFinishApprove: FormProps<MaCarBookType>["onFinish"] = async () => {
    checkStatusMaCarApprove(carBookApprovedStatus);
    try {
      const updatedApproveMa = {
        id: currentMaId,
        carBookApprovedById: session?.user.userId,
        carBookApprovedByName: `${session?.user.firstNameTh} ${session?.user.lastNameTh}`,
        carBookApprovedStatus: "Approve",
        carBookApprovedDate: dayjs(),
      };
      await intraAuthService.updateMaCarBook(updatedApproveMa);
      setModalApproveMa(false);
      messages.success("อนุมัติการจองสำเร็จ");
      setSubmitLoading(false);
    } catch (error) {
      messages.error("อนุมัติการจองไม่สำเร็จ");
    } finally {
      setSubmitLoading(false);
    }
    setSubmitLoading(false);
    setLoading(true);
  };

  const onFinishReturn: FormProps<MaCarBookType>["onFinish"] = async () => {
    setSubmitLoading(true);
    try {
      const updatedReturn = {
        id: currentMaId,
        recipientId: session?.user.userId,
        recipientName: `${session?.user.firstNameTh} ${session?.user.lastNameTh}`,
        carBookApprovedStatus: "Completed",
        returnAt: dayjs(),
      };
      const dataReturn = await intraAuthService.updateMaCarBook(updatedReturn);
      if (dataReturn) {
        const updataStatusCar = { status: true };
        await macarservice.updateMaCar(formReturn.getFieldValue("carId"), updataStatusCar);
        setModalReturn(false);
        messages.success("รับคืนรถสำเร็จ");
        setSubmitLoading(false);
      }
    } catch (error) {
      messages.error("รับคืนรถไม่สำเร็จ");
    } finally {
      setSubmitLoading(false);
    }
    setLoading(true);
  };

  const onFinishFailed: FormProps<MaCarBookType>["onFinishFailed"] = (errorInfo) => {};

  const maCarBookSearch = (value: string) => {
    const filteredData =
      maCarBookData.docs?.filter(
        (item: any) => item.carName?.toLowerCase().includes(value.toLowerCase()) || item.createdByName?.toLowerCase().includes(value.toLowerCase()),
      ) || [];

    setDataSource(filteredData);
  };

  const columns: TableProps<MaCarBookType>["columns"] = [
    {
      title: "ลำดับ",
      align: "center",
      render: (event: number, row: any, index: number) => maCarBookData.total - (index + (pagination.current - 1) * pagination.pageSize),
    },
    {
      title: "ชื่อรถ",
      dataIndex: "carName",
      key: "carName",
      align: "center",
    },
    {
      key: "carBookStartDate",
      dataIndex: "carBookStartDate",
      title: "วันที่เริ่มจอง",
      align: "center",
      render: (value) => dateFormatTime(value),
    },
    {
      key: "carBookEndDate",
      dataIndex: "carBookEndDate",
      title: "วันที่สิ้นสุดการจอง",
      align: "center",
      render: (value) => dateFormatTime(value),
    },
    {
      title: "ชื่อผู้จอง",
      dataIndex: "createdByName",
      key: "createdByName",
      align: "center",
    },
    {
      title: "สถานะ",
      key: "carBookApprovedStatus",
      dataIndex: "carBookApprovedStatus",
      align: "center",
      render: (status: string) => CheckStatusMaCarBookType(status),
    },
    {
      title: "จัดการ",
      key: "note",
      dataIndex: "note",
      align: "center",
      render: (_: any, record: MaCarBookType) => (
        <Space>
          <Tooltip title="อนุมัติ">
            <a type="link" onClick={() => onModelApprove(record)} style={{ color: "green", width: "50px", textAlign: "center" }}>
              {CarApproveIcon}
            </a>
          </Tooltip>
          <Tooltip title="ยกเลิก">
            <Button type="link" onClick={() => onModelCancel(record)}>
              {CancelMaCarIcon}
            </Button>
          </Tooltip>
          <div style={{ width: "90px", textAlign: "center" }}>
            {record.carBookApprovedStatus === "Return" ? (
              <Button type="link" onClick={() => showModalReturn(record)}>
                รับคืนรถ
              </Button>
            ) : record.carBookApprovedStatus === "Completed" ? (
              <span style={{ color: "grey" }}>รับคืนแล้ว</span>
            ) : (
              <span style={{ color: "grey" }}>รอแจ้งคืนรถ</span>
            )}
          </div>

          <Popconfirm title="คุณแน่ใจหรือไม่ว่าต้องการลบการจองนี้?" onConfirm={() => handleDeleteMa(record.id)} okText="ใช่" cancelText="ไม่">
            <Tooltip title="ลบ">
              <a type="link" style={{ color: "red", width: "50px", textAlign: "center" }}>
                <DeleteIcon />
              </a>
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      {messageHeader}
      <Modal width={1000} title="การอนุมัติการจองรถ" open={modalApproveMa} onCancel={handleApproveBook} footer={null}>
        <CarApproveForm
          form={form}
          onFinishApprove={onFinishApprove}
          onFinishFailed={onFinishFailed}
          setModalDisapProved={setModalDisapProved}
          carBookApprovedStatus={carBookApprovedStatus}
          submitLoading={submitLoading}
        />
      </Modal>

      <Modal width={500} title="การรับคืนรถ" open={modalReturn} onCancel={handleReturn} footer={null}>
        <CarReturnForm
          formReturn={formReturn}
          onFinishReturn={onFinishReturn}
          handleReturn={handleReturn}
          carBookApprovedStatus={carBookApprovedStatus}
          submitLoading={submitLoading}
        />
      </Modal>

      <Modal width={300} title="หมายเหตุการไม่อนุมัติ" open={modalDisapProved} onCancel={() => setModalDisapProved(false)} footer={null}>
        <Form form={formDisapProved} onFinish={onFinishCancel} layout="vertical" name="disap_proved" size="small" autoComplete="off">
          <Form.Item name="remarkApproved" rules={[{ required: true, message: "กรุณากรอกหมายเหตุการไม่อนุมัติ" }]}>
            <TextArea />
          </Form.Item>
          <Row justify="end" gutter={16}>
            <div style={{ textAlign: "right" }}>
              <Button type="primary" htmlType="submit" loading={submitLoading} style={{ marginRight: "16px" }}>
                {`ตกลง`}
              </Button>
            </div>
          </Row>
        </Form>
      </Modal>

      <Modal title="ยกเลิกการจองรถ" open={modalCancel} onCancel={() => setModalCancel(false)} footer={null} width={400}>
        <Form form={formCancel} layout="vertical" name="cancel_ma" onFinish={handleCancelMa} size="small">
          <Col>
            <Form.Item name="remarkCancel" label="หมายเหตุยกเลิกการจองรถ" rules={[{ required: true, message: "กรุณากรอกหมายเหตุการยกเลิก" }]}>
              <Input placeholder="กรอกหมายเหตุการยกเลิก" />
            </Form.Item>
          </Col>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Row justify="end" gutter={16}>
              <Button type="primary" htmlType="submit" loading={submitLoading} style={{ marginRight: "16px" }}>
                ตกลง
              </Button>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
      <div style={{ marginTop: "14px", display: "flex" }}>
        {showStatus()}
        <div style={{ margin: "0 15px" }}>
          <Form size="small" layout="inline">
            <Form.Item label="Search">
              <Search placeholder="input search text" onSearch={maCarBookSearch} enterButton />
            </Form.Item>
          </Form>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={{ total: maCarBookData.total }}
        onChange={changePagination}
        size="small"
        style={{ marginTop: "10px" }}
        rowKey={"id"}
      />
    </>
  );
};

export default ManageCar;
