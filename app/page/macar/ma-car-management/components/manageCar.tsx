import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Row,
  Col,
  Space,
  Modal,
  Form,
  message,
  Popconfirm,
  TablePaginationConfig,
  Tooltip,
  Select,
  InputNumber,
  Divider,
  Input,
  TimePicker,
  DatePicker,
} from "antd";
import { DeleteIcon, ApproveIcon, CancelMaCarIcon } from "@/components/icon";
import type { TableProps, FormProps } from "antd";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManageCarServices } from "../services/manage-car.service";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import isBetween from "dayjs/plugin/isBetween";
import { MaCarBookType } from "../../common/index";
import TextArea from "antd/es/input/TextArea";

dayjs.extend(isBetween);

export interface props {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  maCarBookData: any[];
  pagination: TablePaginationConfig;
}

const ManageCar: React.FC<props> = ({
  setLoading,
  loading,
  maCarBookData,
  pagination,
}: any): React.ReactElement => {
  const intraAuth = useAxiosIntranet();
  const [formReturn] = Form.useForm();
  const [form] = Form.useForm();
  const [modalApproveMa, setModalApproveMa] = useState(false);
  const [modalReturn, setModalReturn] = useState(false);
  const [carBookApprovedStatus, setMaCarBookStatus] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [currentMaId, setCurrentMaId] = useState<number | null>(null);
  const [maBookData, setMaCarBookData] = useState<MaCarBookType[]>([]);
  const manageCarServices = ManageCarServices(intraAuth);
  const { data: session } = useSession();
  const [modalDisapProved, setModalDisapProved] = useState(false);
  const [formDisapProved] = Form.useForm();
  const [formCancel] = Form.useForm();
  const [modalCancel, setModalCancel] = useState(false);
  const [columnId, setColumnId] = useState<number | undefined>(undefined);

  const columns: TableProps<MaCarBookType>["columns"] = [
    {
      title: "ลำดับ",
      width: "50px",
      align: "center",
      render: (_: any, __: any, index: number) =>
        pagination.current && pagination.pageSize
          ? (pagination.current - 1) * pagination.pageSize + (index + 1)
          : "",
    },
    {
      title: "ชื่อรถ",
      dataIndex: "carName",
      key: "carName",
      width: "200px",
      align: "center",
    },
    {
      key: "carBookStartDate",
      title: "วันที่เริ่มจอง",
      width: "150px",
      align: "center",
      render: (_, record) => (
        <span>
          {dayjs(record.carBookStartDate).format("DD-MM-YYYY HH:mm:ss")}
        </span>
      ),
    },
    {
      key: "carBookEndDate",
      title: "วันที่สิ้นสุดการจอง",
      width: "150px",
      align: "center",
      render: (_, record) => (
        <span>
          {dayjs(record.carBookEndDate).format("DD-MM-YYYY HH:mm:ss")}
        </span>
      ),
    },
    {
      title: "ชื่อผู้จอง",
      dataIndex: "createdByName",
      key: "createdByName",
      width: "150px",
      align: "center",
    },
    {
      title: "สถานะ",
      key: "carBookApprovedStatus",
      dataIndex: "carBookApprovedStatus",
      width: "100px",
      align: "center",
      render: (status: string) => (
        <Tag
          color={
            status === "Process"
              ? "DodgerBlue"
              : status === "Cancel"
              ? "silver"
              : status === "Approve"
              ? "LimeGreen"
              : status === "DisapProved"
              ? "OrangeRed"
              : status === "Return"
              ? "Gold"
              : status === "Completed"
              ? "MediumPurple"
              : undefined
          }
        >
          {status === "Process"
            ? "กำลังรออนุมัติ"
            : status === "Cancel"
            ? "ยกเลิกการจอง"
            : status === "Approve"
            ? "อนุมัติแล้ว"
            : status === "DisapProved"
            ? "ไม่อนุมัติ"
            : status === "Return"
            ? "แจ้งคืนรถแล้ว"
            : status === "Completed"
            ? "รับคืนรถสำเร็จ"
            : ""}
        </Tag>
      ),
    },
    {
      title: "จัดการ",
      key: "note",
      dataIndex: "note",
      width: "280px",
      align: "center",
      render: (_: any, record: MaCarBookType) => (
        <Space
          size="middle"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Tooltip title="อนุมัติ">
            <a
              onClick={() => {
                // console.log(record.carBookApprovedStatus);
                // if (record.carBookApprovedStatus === "Approve") {
                //   message.warning("อนุมัติการจองนี้ไปแล้ว");
                //   return;
                // }
                if (record.carBookApprovedStatus === "Return") {
                  message.warning("ไม่สามารถอนุมัติการจองที่แจ้งคืนรถได้");
                  return;
                }
                if (record.carBookApprovedStatus === "Completed") {
                  message.warning("ไม่สามารถอนุมัติการจองที่คืนรถได้");
                  return;
                }
                if (record.carBookApprovedStatus === "Cancel") {
                  message.warning("ไม่สามารถอนุมัติการจองที่ยกเลิกได้ได้");
                  return;
                }
                showModalApproveBook(record);
              }}
              style={{ color: "green", width: "50px", textAlign: "center" }}
            >
              {ApproveIcon}
            </a>
          </Tooltip>
          <a
            onClick={() => {
              if (record.carBookApprovedStatus === "Return") {
                message.warning("ไม่สามารถยกเลิกการจองที่แจ้งคืนรถได้");
                return;
              }
              if (record.carBookApprovedStatus === "Completed") {
                message.warning("ไม่สามารถยกเลิกการจองที่คืนรถได้");
                return;
              }
              if (record.carBookApprovedStatus === "DisapProved") {
                message.warning("ไม่สามารถยกเลิกการจองที่ไม่อนุมัติได้");
                return;
              }
              if (record.carBookApprovedStatus === "Cancel") {
                message.warning("ยกเลิกการจองนี้ไปแล้ว");
                return;
              }
              setModalCancel(true);
              setColumnId(record.id);
              formCancel.setFieldsValue({ remarkCancel: record.remarkCancel });
            }}
          >
            {CancelMaCarIcon}
          </a>

          <div style={{ width: "90px", textAlign: "center" }}>
            {" "}
            {record.carBookApprovedStatus === "Return" ? (
              <a onClick={() => showModalReturn(record)}>รับคืนรถ</a>
            ) : record.carBookApprovedStatus === "Completed" ? (
              <span style={{ color: "grey" }}>รับคืนแล้ว</span>
            ) : (
              <span style={{ color: "grey" }}>รอแจ้งคืนรถ</span>
            )}
          </div>

          <Popconfirm
            title="คุณแน่ใจหรือไม่ว่าต้องการลบการจองนี้?"
            onConfirm={() => handleDeleteMa(record.id)}
            okText="ใช่"
            cancelText="ไม่"
          >
            <Tooltip title="ลบ">
              <a style={{ color: "red", width: "50px", textAlign: "center" }}>
                <DeleteIcon />
              </a>
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

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
    });

    setModalApproveMa(true);
    setMaCarBookStatus(record.carBookApprovedStatus);
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
    });
  };

  const handleReturn = () => {
    setModalReturn(false);
  };

  const handleDeleteMa = async (id: number) => {
    setSubmitLoading(true);
    try {
      await manageCarServices.deleteMaCarBook(id);
      setMaCarBookData(maBookData.filter((item) => item.id !== id));

      message.success("ลบข้อมูลการจองสำเร็จ");
      setSubmitLoading(false);
    } catch (error) {
      message.error("ลบข้อมูลการจองไม่สำเร็จ");
    }
    setLoading(true);
  };

  // const handleCancelMa = async (record: MaCarBookType) => {
  //   setSubmitLoading(false);

  const handleCancelMa: FormProps<MaCarBookType>["onFinish"] = async (
    values
  ) => {
    console.log(values);
    // formCancel.getFieldValue({ remarkCancel: remarkCancel });
    // if (record.carBookApprovedStatus === "Return") {
    //   message.warning("ไม่สามารถยกเลิกการจองที่แจ้งคืนรถได้");
    //   return;
    // }
    // if (record.carBookApprovedStatus === "Completed") {
    //   message.warning("ไม่สามารถยกเลิกการจองที่คืนรถได้");
    //   return;
    // }
    // if (record.carBookApprovedStatus === "Cancel") {
    //   message.warning("ยกเลิกการจองนี้ไปแล้ว");
    //   return;
    // }

    try {
      const updatedCancelMa = {
        id: columnId,
        carBookApprovedStatus: "Cancel",
        remarkCancel: values.remarkCancel,
      };
      await manageCarServices.updateMaCarBook(updatedCancelMa);
      message.success("ยกเลิกการจองสำเร็จ");
      setSubmitLoading(false);
    } catch (error) {
      message.error("ยกเลิกการจองไม่สำเร็จ");
    } finally {
      setSubmitLoading(false);
    }
    setLoading(true);
  };

  const onFinishCancel: FormProps<MaCarBookType>["onFinish"] = async (
    values
  ) => {
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
      await manageCarServices.updateMaCarBook(updatedApproveMa);
      message.success("ไม่อนุมัติการจองสำเร็จ");
      formDisapProved.resetFields;
      setModalApproveMa(false);
      setModalDisapProved(false);
      setSubmitLoading(false);
    } catch (error) {
      message.error("อนุมัติการจองไม่สำเร็จ");
    } finally {
      setSubmitLoading(false);
    }
    setLoading(true);
  };

  const onFinishApprove: FormProps<MaCarBookType>["onFinish"] = async () => {
    setSubmitLoading(false);
    if (carBookApprovedStatus === "Approve") {
      message.warning("อนุมัติการจองนี้ไปแล้ว");
      return;
    }
    if (carBookApprovedStatus === "Return") {
      message.warning("ไม่สามารถอนุมัติการจองที่แจ้งคืนรถได้");
      return;
    }
    if (carBookApprovedStatus === "Completed") {
      message.warning("ไม่สามารถอนุมัติการจองที่คืนรถได้");
      return;
    }
    if (carBookApprovedStatus === "Cancel") {
      message.warning("ไม่สามารถอนุมัติการจองที่ยกเลิกได้ได้");
      return;
    }

    try {
      const updatedApproveMa = {
        id: currentMaId,
        carBookApprovedById: session?.user.userId,
        carBookApprovedByName: `${session?.user.firstNameTh} ${session?.user.lastNameTh}`,
        carBookApprovedStatus: "Approve",
        carBookApprovedDate: dayjs(),
      };

      await manageCarServices.updateMaCarBook(updatedApproveMa);

      setModalApproveMa(false);
      message.success("อนุมัติการจองสำเร็จ");
      setSubmitLoading(false);
    } catch (error) {
      message.error("อนุมัติการจองไม่สำเร็จ");
    } finally {
      setSubmitLoading(false);
    }
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

      await manageCarServices.updateMaCarBook(updatedReturn);
      setModalReturn(false);
      message.success("รับคืนรถสำเร็จ");
      setSubmitLoading(false);
    } catch (error) {
      message.error("รับคืนรถไม่สำเร็จ");
    } finally {
      setSubmitLoading(false);
    }
    setLoading(true);
  };

  const onFinishFailed: FormProps<MaCarBookType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Modal
        width={800}
        title="การอนุมัติการจองรถ"
        open={modalApproveMa}
        onCancel={handleApproveBook}
        footer={null}
      >
        <Form
          form={form}
          onFinish={onFinishApprove}
          onFinishFailed={onFinishFailed}
          layout="vertical"
          size="small"
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item<MaCarBookType> name="createdByName" label="ชื่อผู้จอง">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Divider orientation="left">ข้อมูลการจองรถ</Divider>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item<MaCarBookType>
                name="carName"
                label="ชื่อรถ"
                rules={[{ required: true, message: "กรุณาเลือกรถ" }]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<MaCarBookType>
                name="carBookTitle"
                label="วัตถุประสงค์การใช้งาน"
                rules={[
                  { required: true, message: "กรุณากรอกวัตถุประสงค์การใช้งาน" },
                ]}
              >
                <Input placeholder="กรอกวัตถุประสงค์การใช้งาน" disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<MaCarBookType>
                name="carBookPlace"
                label="สถานที่ไป"
                rules={[{ required: true, message: "กรุณากรอกสถานที่ไป" }]}
              >
                <Input placeholder="กรอกสถานที่ไป" disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<MaCarBookType>
                name="carBookProvince"
                label="จังหวัด"
                rules={[{ required: true, message: "กรุณากรอกจังหวัด" }]}
              >
                <Input placeholder="กรอกจังหวัด" disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<MaCarBookType>
                name="carBookUsers"
                label="จำนวนผู้ใช้"
                rules={[{ required: true, message: "กรุณากรอกจำนวนผู้ใช้" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="กรอกจำนวนผู้ใช้"
                  min={1}
                  max={12}
                  disabled
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item name="detail" label="รายยละเอียด">
                <TextArea placeholder="กรอกรายยละเอียด" rows={2} disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="remark" label="หมายเหตุการจองรถ">
                <TextArea
                  placeholder="กรอกหมายเหตุการจองรถ"
                  rows={2}
                  disabled
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item
                name="carBookStartDate"
                label="วันที่เริ่มการจอง"
                rules={[
                  { required: true, message: "กรุณาเลือกวันที่เริ่มจอง!" },
                ]}
              >
                <DatePicker
                  disabled
                  format="DD-MM-YYYY"
                  placeholder="กรอกวันที่เริ่มการจอง"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="carBookStartDate"
                label="เวลาเริ่มการจอง"
                rules={[{ required: true, message: "กรุณาเลือกเวลาเริ่มจอง!" }]}
              >
                <TimePicker
                  disabled
                  format="HH:mm"
                  placeholder="กรอกเวลาเริ่มการจอง"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="carBookEndDate"
                label="วันที่สิ้นสุดการจอง"
                rules={[
                  { required: true, message: "กรุณาเลือกวันที่สิ้นสุดการจอง!" },
                ]}
              >
                <DatePicker
                  disabled
                  format="DD-MM-YYYY"
                  placeholder="กรอกวันที่สิ้นสุดการจอง"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="carBookEndDate"
                label="เวลาสิ้นสุดการจอง"
                rules={[
                  { required: true, message: "กรุณาเลือกเวลาสิ้นสุดการจอง!" },
                ]}
              >
                <TimePicker
                  disabled
                  format="HH:mm"
                  placeholder="กรอกเวลาสิ้นสุดการจอง"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end">
            <Button
              type="default"
              onClick={() => setModalDisapProved(true)}
              disabled={carBookApprovedStatus === "DisapProved"}
              loading={submitLoading}
              style={{ marginRight: "16px", marginTop: "16px" }}
            >
              ไม่อนุมัติ
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              disabled={carBookApprovedStatus === "Approve"}
              loading={submitLoading}
              style={{ marginTop: "16px" }}
            >
              อนุมัติ
            </Button>
          </Row>
        </Form>
      </Modal>

      <Modal
        width={500}
        title="การรับคืนรถ"
        open={modalReturn}
        onCancel={handleReturn}
        footer={null}
      >
        <Form
          form={formReturn}
          onFinish={onFinishReturn}
          layout="vertical"
          autoComplete="off"
          size="small"
        >
          <Divider orientation="left">ข้อมูลการคืนรถ</Divider>

          <Col span={24}>
            <Form.Item
              name="carName"
              label="ชื่อรถ"
              rules={[{ required: true, message: "กรุณากรอกชื่อรถ" }]}
            >
              <Input disabled placeholder="กรอกชื่อรถ" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="createdByName" label="ชื่อผู้คืนรถ">
              <Input disabled placeholder="กรอกชื่อ" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="carMile" label="เลขไมล์รถ">
              <InputNumber
                disabled
                style={{ width: "100%" }}
                placeholder="กรอกเลขไมล์รถ"
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="ระดับน้ำมันรถ"
              name="carPetrol"
              rules={[{ required: true, message: "กรุณาเลือกระดับน้ำมัน!" }]}
            >
              <Select placeholder="เลือกระดับน้ำมัน" disabled>
                <Select.Option value="high">มาก</Select.Option>
                <Select.Option value="medium">ปานกลาง</Select.Option>
                <Select.Option value="low">น้อย</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="สถานะของรถ"
              name="status"
              rules={[{ required: true, message: "กรุณาเลือกสถานะรถ!" }]}
            >
              <Select placeholder="เลือกสถานะรถ" disabled>
                <Select.Option value={true}>ใช้งานได้ปกติ</Select.Option>
                <Select.Option value={false}>ไม่สามารถใช้งานได้</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Row justify="end" gutter={16}>
              <Button
                type="default"
                onClick={handleReturn}
                style={{ marginRight: "16px" }}
              >
                ยกเลิก
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                disabled={carBookApprovedStatus === "Completed"}
                loading={submitLoading}
              >
                รับคืนรถ
              </Button>
            </Row>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        width={300}
        title="หมายเหตุการไม่อนุมัติ"
        open={modalDisapProved}
        onCancel={() => setModalDisapProved(false)}
        footer={null}
      >
        {" "}
        <Form
          form={formDisapProved}
          onFinish={onFinishCancel}
          layout="vertical"
          name="disap_proved"
          size="small"
          autoComplete="off"
        >
          <Form.Item
            name="remarkApproved"
            rules={[
              { required: true, message: "กรุณากรอกหมายเหตุการไม่อนุมัติ" },
            ]}
          >
            <TextArea />
          </Form.Item>
          <Row justify="end" gutter={16}>
            <div style={{ textAlign: "right" }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitLoading}
                style={{ marginRight: "16px" }}
              >
                {`ตกลง`}
              </Button>
            </div>
          </Row>
        </Form>
      </Modal>

      <Modal
        title="ยกเลิกการจองรถ"
        open={modalCancel}
        onCancel={() => setModalCancel(false)}
        footer={null}
        width={400}
      >
        <Form
          form={formCancel}
          layout="vertical"
          name="cancel_ma"
          onFinish={handleCancelMa}
          autoComplete="off"
          size="small"
        >
          <Col>
            <Form.Item
              name="remarkCancel"
              label="หมายเหตุยกเลิกการจองรถ"
              rules={[
                { required: true, message: "กรุณากรอกหมายเหตุการยกเลิก" },
              ]}
            >
              <Input placeholder="กรอกหมายเหตุการยกเลิก" />
            </Form.Item>
          </Col>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Row justify="end" gutter={16}>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitLoading}
                style={{ marginRight: "16px" }}
              >
                ตกลง
              </Button>
            </Row>
          </Form.Item>
        </Form>
      </Modal>

      <Table columns={columns} dataSource={maCarBookData} loading={loading} />
    </>
  );
};

export default ManageCar;
