import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  Table,
  DatePicker,
  Input,
  Button,
  Modal,
  Select,
  Space,
  Popconfirm,
  message,
  Form,
  FormProps,
} from "antd";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManageCarServices } from "../../services/manage-car.service";
import { useForm } from "antd/es/form/Form";
import ExportExcel from "./ExportExcel";
import { useSession } from "next-auth/react";
import MaCar from "../../../ma-car/page";
import { Anybody } from "next/font/google";
import { render } from "react-dom";
import data from "@iconify/icons-icon-park-outline/setting-two";
import { Decimal } from "@prisma/client/runtime/library";

import dayjs, { Dayjs } from "dayjs";
import { dateToStringThNoTime } from "@/app/utils/format";

export interface MaCarType {
  id: number;
  typeName: string;
  detail: string;
  status: boolean;
  createdAt: string;
  createdById: string;
  createdByName: string;
}

export interface MaCar {
  id: number;
  carId: string;
  carName: string;
  carPetrol: string;
  carMile: number;
  detail: string;
  status: boolean;
  createdAt: Date;
  createdById?: string;
  createdByName?: string;
  updatedAt?: Date;
  updatedById?: string;
  updatedByName?: string;
}

export interface MaCarwarpup {
  id: number;
  carWrapupId: string;
  carId?: string;
  carName: string;
  typeId?: number;
  typeName: string;
  vender: string;
  cost: Decimal;
  detail: string;
  wrapupMiles: number;
  dateStart: Date;
  dateEnd: Date;
  remark: string;
  createdAt: string;
  updatedAt: string;
}
const WarpupmaCar = () => {
  const intraAuth = useAxiosIntranet();
  const [form] = useForm();
  const [formchange] = useForm();
  const manageCarServices = ManageCarServices(intraAuth);
  const [maData, setMaData] = useState<MaCar[]>([]);
  const [maDataOptions, setMaDataOptions] = useState<
    {
      value: number;
      label: string;
    }[]
  >([]);
  const [maDataType, setMaDataType] = useState<MaCarType[]>([]);
  const [maDataTypeOptions, setMaDataTypeOptions] = useState<
    {
      value: number;
      label: string;
    }[]
  >([]);

  const [maDataWarpup, setMaDataWarpup] = useState<MaCarwarpup[]>([]);
  const [IsmodlaOpencreate, setIsmodlaOpencreate] = useState(false);
  const [IsmodlaOpenupdate, setIsmodlaOpenupdate] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [modalEditMaCarWarpup, setModalEditMaCarWarpup] = useState(false);
  const { data: session } = useSession();
  const [timedate , setTimedate] = useState<Date>()

  useEffect(() => {
    fetchData();
    fetchDataType();
    fetchDataWarpup();
  }, []);

  const fetchData = async () => {
    try {
      const maresponse = await manageCarServices.getMaCarQuery();
      const optionsmaResponsema = maresponse.map((event: MaCar) => {
        return {
          value: event.carName,
          label: event.carName,
        };
      });
      setMaDataOptions(optionsmaResponsema);
      setMaData(maresponse);
    } catch (error) {
      message.error("Failed to fetch car data");
    }
  };

  const fetchDataType = async () => {
    try {
      const maresponse = await manageCarServices.getMaCarQueryType();
      const optionsmaResponse = maresponse.map((event: MaCarType) => {
        return {
          value: event.typeName,
          label: event.typeName,
        };
      });
      setMaDataTypeOptions(optionsmaResponse);
      setMaDataType(maresponse);
    } catch (error) {
      message.error("Failed to fetch car data");
    }
  };

  // console.log(maDataTypeOptions);

  const fetchDataWarpup = async () => {
    try {
      const maresponse = await manageCarServices.getMaCarQueryWarpup();
      const MaCarWarpup: MaCarwarpup[] = maresponse.map(
        (item: any, index: number) => ({
          ...item,

          key: index.toString(),
        })
      );
      setMaDataWarpup(MaCarWarpup);
    } catch (error) {
      message.error("Failed to fetch car data");
    }
  };

  const createMaCarWarpup: FormProps<MaCarwarpup>["onFinish"] = async (
    values
  ) => {
    console.log(values);

    const maCarCreateDataWarpup = {
      data: {
        vender: values.vender,
        carWrapupId: values.carWrapupId,
        typeName: values.typeName,
        carName: values.carName,
        wrapupMiles: values.wrapupMiles,
        detail: values.detail,
        cost: values.cost,
        dateStart: values.dateStart,
        dateEnd: values.dateEnd,
        remark: values.remark,
      },
    };
    try {
      const response = await manageCarServices.createMaCarWarpup(
        maCarCreateDataWarpup
      );
      if (response) {
        message.success("เพิ่มรถสำเร็จ");
        form.resetFields();
      } else {
        message.error("เพิ่มรถไม่สำเร็จ");
      }

      setSubmitLoading(false);
      fetchData();
    } catch (error) {
      message.error("เพิ่มรถไม่สำเร็จ");
      setSubmitLoading(false);
    }
  };

  const updatedCarWrpup: FormProps<MaCarwarpup>["onFinish"] = async (
    values
  ) => {
    setSubmitLoading(true);
    console.log(values);

    try {
      const updateMaCarWarpup = {
        // id: formchange.getFieldValue('id'),
        data: {
          vender: values.vender,
          carWrapupId: values.carWrapupId,
          typeName: values.typeName,
          carName: values.carName,
          wrapupMiles: values.wrapupMiles,
          detail: values.detail,
          cost: values.cost,
          dateStart: values.dateStart,
          dateEnd: values.dateEnd,
          remark: values.remark,
        },
      };
      await manageCarServices.updateMaCarType(updateMaCarWarpup);
      message.success("แก้ไขข้อมูลห้องสำเร็จ");

      fetchData();
      handleEditMaCarCancelType();
      setSubmitLoading(false);
    } catch (error) {
      message.error("แก้ไขข้อมูลห้องไม่สำเร็จ");
    }
  };

  const handleDeletemaCarWarpup = async (carWrapupId: number) => {
    console.log(carWrapupId);

    try {
      await manageCarServices.deleteMaCarWarpup(carWrapupId);
      message.success("ลบการจองสำเร็จ");
    } catch (error) {
      message.error("ลบการจองไม่สำเร็จ");
    }
  };

  const handleEditMaCarCancelType = () => {
    setModalEditMaCarWarpup(false);
    form.resetFields();
  };

  const showModalEditMaCarWarpup = (record: MaCarwarpup) => {
    console.log(record);
    setTimedate(record?.dateStart)
    formchange.setFieldsValue(record);

    setIsmodlaOpenupdate(true);
  };

  const modalopencreate = () => {
    setIsmodlaOpencreate(true);
  };
  const handleclosecreate = () => {
    setIsmodlaOpencreate(false);
  };

  const modalopenupdate = () => {
    setIsmodlaOpenupdate(true);
  };
  const handlecloseupdate = () => {
    setIsmodlaOpenupdate(false);
  };

  const columns = [
    {
      title: "ลำดับ",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "ชื่อรถ",
      dataIndex: "carName",
      key: "carName",
    },
    {
      title: "ประเภทการตรวจสภาพ",
      dataIndex: "typeName",
      key: "typeName",
    },
    {
      title: "รายละเอียดการตรวจสภาพ",
      dataIndex: "detail",
      key: "detail",
    },
    {
      title: "สถานที่การเช็คสภาพ",
      dataIndex: "vender",
      key: "vender",
    },
    {
      title: "ราคา",
      dataIndex: "cost",
      key: "cost",
      render: (text: number) => new Intl.NumberFormat().format(text),
    },
    {
      title: "เวลาเริ่มต้น",
      dataIndex: "dateStart",
      key: "dateStart",
      render: (createdAt: Date) => moment(createdAt).format("YYYY-MM-DD"),
    },
    {
      title: "เวลาต่อไป",
      dataIndex: "dateEnd",
      key: "dateEnd",
      render: (createdAt: Date) => moment(createdAt).format("YYYY-MM-DD"),
    },
    {
      title: "การอนุมัติ",
      dataIndex: "vender",
      key: "vender",
    },
    {
      title: "การจัดการ",
      dataIndex: "manage",
      key: "manage",
      render: (record: number, row: any, index: number) => (
        <Space size="middle">
          <Button onClick={() => showModalEditMaCarWarpup(row)}>แก้ไข</Button>
          <Popconfirm
            title="คุณแน่ใจหรือไม่ว่าต้องการลบการจองนี้?"
            onConfirm={() => handleDeletemaCarWarpup(row.carWrapupId)}
            okText="ใช่"
            cancelText="ไม่"
          >
            <Button type="link" danger>
              ลบ
            </Button>
          </Popconfirm>
          <Popconfirm
            title="เมื้่อกดอนุมัติแล้วคุณจะไม่สามารถแก้ไขได้อีก ยืนยันหรือยกเลิก ?"
            // onConfirm={() => handleDeletemaCarWarpup(row.carWrapupId)}
            okText="อนุมิตื"
            cancelText="ยกเลิก"
          >
            <Button type="link">อนุมัติ</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // const feustion = [ ...maData, ...maDataType ]
  return (
    <div>
      <h1>
        <ExportExcel datamacar={maDataType} />
      </h1>

      <Button type="primary" onClick={modalopencreate}>
        สร้างการตรวจสภาพรถ
      </Button>

      <Modal
        width={1000}
        title="สร้างการตรวจสภาพรถ"
        open={IsmodlaOpencreate}
        onOk={handleclosecreate}
        onCancel={handleclosecreate}
        footer={null}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={createMaCarWarpup}
          autoComplete="off"
          layout="vertical"
          form={form}
        >
          <Form.Item<MaCarwarpup> label="หมายเลขการตรวจบำรุง" name="typeId">
            <Input placeholder="" />
          </Form.Item>
          <Form.Item<MaCarwarpup>
            label="ประเภทการบำรุงตรวจสภาพ"
            name="typeName"
          >
            <Select placeholder="เลือกการแสดง" options={maDataTypeOptions} />
          </Form.Item>
          <Form.Item<MaCarwarpup> label="ชื่อรถ :" name="carName">
            <Select placeholder="เลือกการแสดง" options={maDataOptions} />
          </Form.Item>
          <Form.Item<MaCarwarpup> label="เลขไมล์ตรวจสภาพ :" name="wrapupMiles">
            <Input placeholder="ระบุเลขไมล์รถ" />
          </Form.Item>
          <Form.Item<MaCarwarpup> label="หมายเหตุ :" name="detail">
            <Input placeholder="" />
          </Form.Item>
          <Form.Item<MaCarwarpup> label="สถานที่ :" name="vender">
            <Input placeholder="" />
          </Form.Item>
          <Form.Item<MaCarwarpup> label="ราคา :" name="cost">
            <Input placeholder="" />
          </Form.Item>
          <Form.Item<MaCarwarpup> label="วันที่บันทึก :" name="dateStart">
            <DatePicker />
          </Form.Item>
          <Form.Item<MaCarwarpup> label="วันตรวจสภาพ :" name="dateEnd">
            <DatePicker />
          </Form.Item>
          <Form.Item<MaCarwarpup> label="รายละเอียดรถ(พิเศษ)" name="remark">
            <Input placeholder="" />
          </Form.Item>
          <div className="flex justify-end w-full">
            <Form.Item>
              <Button
                type="default"
                onClick={handleclosecreate}
                style={{ marginRight: 8 }}
              >
                ยกเลิก
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={submitLoading}>
                ตกลง
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>

      <Modal
        width={1000}
        title="สร้างการตรวจสภาพรถ"
        open={IsmodlaOpenupdate}
        onOk={modalopenupdate}
        onCancel={handlecloseupdate}
        footer={null}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          // initialValues={{ remember: true }}
          onFinish={updatedCarWrpup}
          autoComplete="off"
          layout="vertical"
          form={formchange}
        >
          <Form.Item<MaCarwarpup> label="หมายเลขการตรวจบำรุง" name="typeId">
            <Input placeholder="" />
          </Form.Item>
          <Form.Item<MaCarwarpup>
            label="ประเภทการบำรุงตรวจสภาพ"
            name="typeName"
          >
            <Select placeholder="เลือกการแสดง" options={maDataTypeOptions} />
          </Form.Item>
          <Form.Item<MaCarwarpup> label="ชื่อรถ :" name="carName">
            <Select placeholder="เลือกการแสดง" options={maDataOptions} />
          </Form.Item>
          <Form.Item<MaCarwarpup> label="เลขไมล์ตรวจสภาพ :" name="wrapupMiles">
            <Input placeholder="ระบุเลขไมล์รถ" />
          </Form.Item>
          <Form.Item<MaCarwarpup> label="หมายเหตุ :" name="detail">
            <Input placeholder="" />
          </Form.Item>
          <Form.Item<MaCarwarpup> label="สถานที่ :" name="vender">
            <Input placeholder="" />
          </Form.Item>
          <Form.Item<MaCarwarpup> label="ราคา :" name="cost">
            <Input placeholder="" />
          </Form.Item>
          <Form.Item<MaCarwarpup> label="วันที่บันทึก :" name="dateStart">
            <DatePicker value={moment(timedate)}/>
          </Form.Item>
          <Form.Item<MaCarwarpup> label="วันตรวจสภาพ :" name="dateEnd">
            {/* <DatePicker
              value={dateToStringThNoTime(formchange.getFieldValue("dateEnd"))}
            /> */}
          </Form.Item>
          <Form.Item<MaCarwarpup> label="รายละเอียดรถ(พิเศษ)" name="remark">
            <Input placeholder="" />
          </Form.Item>
          <div className="flex justify-end w-full">
            <Form.Item>
              <Button
                type="default"
                onClick={handleclosecreate}
                style={{ marginRight: 8 }}
              >
                ยกเลิก
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={submitLoading}>
                ตกลง
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
      <Table columns={columns} dataSource={maDataWarpup} />
    </div>
  );
};
export default WarpupmaCar;
