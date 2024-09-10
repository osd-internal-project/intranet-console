import React, { useState } from "react";
import {
  Table,
  Tag,
  Button,
  Row,
  Col,
  Space,
  Modal,
  Form,
  Input,
  Divider,
  message,
  Select,
  DatePicker,
  TablePaginationConfig,
  InputNumber,
  TimePicker,
  Tooltip,
  Popconfirm,
} from "antd";
import type { FormProps, TableProps } from "antd";
import { EditIcon, CancelMaCarIcon } from "@/components/icon";
import dayjs from "dayjs";
import ShareMaCarBook from "../share-ma-car-book/share-xlsx";
import { MaCarServices } from "../services/ma-car.service";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { useSession } from "next-auth/react";
import { MaCarBookType } from "../../common/index";

export interface props {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  maCarBookData: any[];
  pagination: TablePaginationConfig;
  changePagination: (pagination: TablePaginationConfig) => void;
  maCarData: any[];
}

const MaCarBookTable: React.FC<props> = ({
  changePagination,
  pagination,
  maCarBookData,
  setLoading,
  loading,
  maCarData,
}: any): React.ReactElement => {
  const { data: session } = useSession();
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const [formCancel] = Form.useForm();
  const intraAuth = useAxiosIntranet();
  const maCarServices = MaCarServices(intraAuth);
  const [modalEditMaCarBook, setModalEditMa] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [currentMaCarBookId, setCurrentMaCarBookId] = useState<number | null>(
    null
  );
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
      key: "carName",
      title: "ชื่อรถ",
      dataIndex: "carName",
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
      key: "createdByName",
      title: "ชื่อผู้จอง",
      dataIndex: "createdByName",
      width: "150px",
      align: "center",
    },
    {
      key: "carBookApprovedStatus",
      title: "สถานะ",
      dataIndex: "carBookApprovedStatus",
      width: "100px",
      align: "center",
      render: (status: string) => {
        let color = "";
        let text = "";
        switch (status) {
          case "Process":
            color = "DodgerBlue";
            text = "กำลังรออนุมัติ";
            break;
          case "Cancel":
            color = "silver";
            text = "ยกเลิกการจอง";
            break;
          case "Approve":
            color = "LimeGreen";
            text = "อนุมัติแล้ว";
            break;
          case "DisapProved":
            color = "OrangeRed";
            text = "ไม่อนุมัติ";
            break;
          case "Return":
            color = "Gold";
            text = "แจ้งคืนรถแล้ว";
            break;
          case "Completed":
            color = "MediumPurple";
            text = "คืนรถสำเร็จ";
            break;
          default:
            color = "default";
            text = "Unknown Status";
            break;
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      key: "carBookApprovedByName",
      title: "ผู้อนุมัติ",
      dataIndex: "carBookApprovedByName",
      width: "130px",
      align: "center",
      render: (value: string) => (value ? value : "-"),
    },
    {
      key: "remarkApproved",
      title: "หมายเหตุการยกเลิก",
      dataIndex: "remarkApproved",
      width: "100px",
      align: "center",
      render: (value: string) => (value ? value : "-"),
    },
    {
      title: "จัดการ",
      key: "note",
      dataIndex: "note",
      width: "150px",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="แก้ไข">
            <a
              onClick={() => showModalEditMaCarBook(record)}
              role="button"
              aria-label="Edit"
              style={{ cursor: "pointer" }}
            >
              {EditIcon}
            </a>
          </Tooltip>
          {/* <Tooltip title="ยกเลิกการจอง">
            <p
              onClick={() => {
                setModalCancel(true);
                setColumnId(record.id);
              }}
            >
              {CancelMaCarIcon}
            </p>
          </Tooltip> */}

          <Tooltip title="ยกเลิกการจอง">
            <p
              onClick={() => {
                if (record.carBookApprovedStatus === "Approve") {
                  message.warning("ไม่สามารถยกเลิกการจองที่อนุมัติได้");
                  return;
                }
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
              }}
              // style={{ cursor: "pointer", color: "red" }}
            >
              {CancelMaCarIcon}
            </p>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const showModalEditMaCarBook = (record: MaCarBookType) => {
    if (record.carBookApprovedStatus === "Approve") {
      message.warning("ไม่สามารถแก้ไขการจองที่อนุมัติได้");
      return;
    }
    if (record.carBookApprovedStatus === "Return") {
      message.warning("ไม่สามารถแก้ไขการจองที่แจ้งคืนรถได้");
      return;
    }
    if (record.carBookApprovedStatus === "Completed") {
      message.warning("ไม่สามารถแก้ไขการจองที่คืนรถได้");
      return;
    }
    if (record.carBookApprovedStatus === "DisapProved") {
      message.warning("ไม่สามารถแก้ไขการจองที่ไม่อนุมัติได้");
      return;
    }
    if (record.carBookApprovedStatus === "Cancel") {
      message.warning("ไม่สามารถแก้ไขการจองที่ยกเลิกได้");
      return;
    }

    setCurrentMaCarBookId(record.id);
    form.setFieldsValue({
      ...record,
      carBookStartDate: dayjs(record.carBookStartDate),
      carBookEndDate: dayjs(record.carBookEndDate),
    });
    setModalEditMa(true);
    setLoading(true);
  };

  const handleCancelMa: FormProps<MaCarBookType>["onFinish"] = async (
    values
  ) => {
    
    try {
      const updatedApproveMa = {
        id: columnId,
        carBookApprovedStatus: "Cancel",
        remarkApproved: values.remarkApproved,
        carBookApprovedDate: dayjs().toISOString(),
        carBookApprovedById: session?.user.userId,
        carBookApprovedByName: `${session?.user.firstNameTh} ${session?.user.lastNameTh}`,
      };
      await maCarServices.updateMaCarBook(updatedApproveMa);
      message.success("ยกเลิกการจองสำเร็จ");
      setModalCancel(false);
    } catch (error) {
      message.error("ยกเลิกการจองไม่สำเร็จ");
    } finally {
      setSubmitLoading(false);
    }
    setLoading(true);
  };

  const handleEditMaCancel = () => {
    setModalEditMa(false);
  };

  const updatedMaCarBook: FormProps<MaCarBookType>["onFinish"] = async (
    values
  ) => {
    setSubmitLoading(true);
    if (currentMaCarBookId === null) {
      message.error("No ma selected for update");
      return;
    }

    const carSelected = maCarData.findLast(
      (car: any) => car.carId === values.carId
    );

    try {
      const { carBookStartDate, carBookEndDate, carName, ...restValues } =
        values;

      const updatedStartDate = carBookStartDate.toISOString();

      const updatedEndDate = carBookEndDate.toISOString();

      const today = new Date();
      if (new Date(updatedStartDate) < today) {
        message.error("ไม่สามารถจองในวันที่ผ่านมาได้");
        setSubmitLoading(false);
        return;
      }

      if (new Date(updatedEndDate) < new Date(updatedStartDate)) {
        message.error("วันที่สิ้นสุดการจองต้องหลังวันที่เริ่มการจอง");
        setSubmitLoading(false);
        return;
      }

      const maCarBookData = {
        ...restValues,
        id: currentMaCarBookId,
        carName: carSelected.carName,
        carBookStartDate: updatedStartDate,
        carBookEndDate: updatedEndDate,
        carBookTitle: values.carBookTitle,
        carBookUsers: Number(values.carBookUsers),
        detail: values.detail,
        remark: values.remark || null,
        updatedAt: dayjs().toISOString(),
        updatedById: session?.user.userId,
        updatedByName: `${session?.user.firstNameTh} ${session?.user.lastNameTh}`,
      };
      await maCarServices.updateMaCarBook(maCarBookData);
      message.success("แก้ไขการจองสำเร็จ");
      setSubmitLoading(false);
      setModalEditMa(false);
    } catch (error) {
      message.error("แก้ไขการจองไม่สำเร็จ");
      setSubmitLoading(false);
    }
    setLoading(true);
  };

  return (
    <>
      <Modal
        title="แก้ไขข้อมูลการจอง"
        open={modalEditMaCarBook}
        onCancel={handleEditMaCancel}
        footer={null}
        width={1000}
      >
        <Form
          form={form}
          layout="vertical"
          name="edit_ma"
          onFinish={updatedMaCarBook}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item<MaCarBookType>
                name="createdByName"
                label="ชื่อผู้จอง"
                rules={[{ required: true, message: "กรุณากรอกชื่อผู้จอง" }]}
              >
                <Input disabled placeholder="กรอกชื่อผู้จอง" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">ข้อมูลการจองรถ</Divider>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item<MaCarBookType>
                name="carId"
                label="ชื่อรถ"
                rules={[{ required: true, message: "กรุณาเลือกรถ" }]}
              >
                <Select placeholder="โปรดเลือกรถ" style={{ width: "100%" }}>
                  {maCarData.map((car: any, index: any) => (
                    <Select.Option key={index} value={car.carId}>
                      {car.carName}
                    </Select.Option>
                  ))}
                </Select>
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
                <Input placeholder="กรอกวัตถุประสงค์การใช้งาน" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<MaCarBookType>
                name="carBookPlace"
                label="สถานที่ไป"
                rules={[{ required: true, message: "กรุณากรอกสถานที่ไป" }]}
              >
                <Input placeholder="กรอกสถานที่ไป" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<MaCarBookType>
                name="carBookProvince"
                label="จังหวัด"
                rules={[{ required: true, message: "กรุณากรอกจังหวัด" }]}
              >
                <Input placeholder="กรอกจังหวัด" />
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
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item name="detail" label="รายยละเอียด">
                <TextArea placeholder="กรอกรายยละเอียด" rows={2} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="remark" label="หมายเหตุการจองรถ">
                <TextArea placeholder="กรอกหมายเหตุการจองรถ" rows={2} />
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
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Row justify="end" gutter={16}>
              <Button
                type="default"
                onClick={handleEditMaCancel}
                style={{ marginRight: "16px" }}
              >
                ยกเลิก
              </Button>
              <Button type="primary" htmlType="submit" loading={submitLoading}>
                ตกลง
              </Button>
            </Row>
          </Form.Item>
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
        >
          <Col>
            <Form.Item
              name="remarkApproved"
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
              <Button type="primary" htmlType="submit" loading={submitLoading}>
                ตกลง
              </Button>
            </Row>
          </Form.Item>
        </Form>
      </Modal>

      <Row gutter={[18, 18]}>
        <Col md={18}>
          <ShareMaCarBook data={maCarBookData} />
        </Col>
        <Col
          md={6}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        ></Col>
      </Row>

      <Table
        columns={columns}
        dataSource={maCarBookData}
        sortDirections={["descend", "ascend"]}
        rowKey="id"
        onChange={changePagination}
        pagination={pagination}
        loading={loading}
        style={{ marginTop: "15px" }}
      />
    </>
  );
};

export default MaCarBookTable;
