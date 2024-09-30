"use client";
import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  Table,
  Input,
  Button,
  Modal,
  Select,
  Space,
  Popconfirm,
  message,
  Form,
  FormProps,
  DatePicker,
  InputNumber,
  Tag,
  Tooltip,
  Upload,
  Image,
} from "antd";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManageCarServices } from "../../services/manage-car.service";
import { useForm } from "antd/es/form/Form";
import ExportExcel from "./components/ExportExcel";
import MaCar from "../../../ma-car/page";
import { Decimal } from "@prisma/client/runtime/library";
import dayjs from "dayjs";
import type { TableProps, UploadFile, UploadProps } from "antd";
import { DeleteIcon, ApproveIcon, EditIcon } from "@/components/icon";
import { EyeOutlined, UploadOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import { UploadFileStatus } from "antd/es/upload/interface";
import { useSession } from "next-auth/react";
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
  dateStart: Date | string;
  dateEnd: Date | string;
  remark: string;
  createdAt: string;
  updatedAt: string;
  status?: boolean;
  createbyName?: string;
  maCarWrapupImage: MaCarWrapupImage[];
}

export interface MaCarWrapupImage {
  [x: string]: any;
  idwarpupImage?: number;
  maName: String;
  mafileNameImage?: String;
  mafilePart?: String;
  createdAt?: String;
  updatedAt?: String;
  carWrapupId: string | undefined;
}

const WarpupmaCar = () => {
  const intraAuth = useAxiosIntranet();
  const [form] = useForm();
  const [formchange] = useForm();
  const [formdetail] = useForm();
  const handleSubmit = (status: boolean | null) => {
    formchange.setFieldsValue({ status });
    formchange.submit();
  };
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
  const [maDataWarpupImage, setMaDataWarpupImage] = useState<
    MaCarWrapupImage[]
  >([]);
  const [selectedMaCarwarpup, setSelectedMaCarwarpup] =
    useState<MaCarwarpup | null>(null);
  const [IsmodlaOpencreate, setIsmodlaOpencreate] = useState(false);
  const [Ismodlasubmit, setIsmodlasubmit] = useState(false);
  const [IsmodlaOpenupdate, setIsmodlaOpenupdate] = useState(false);
  const [Ismodladetail, setIsmodladetail] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [modalEditMaCarWarpup, setModalEditMaCarWarpup] = useState(false);
  const [maCar, setMaCar] = useState<MaCarwarpup[]>([]);
  const [selectedCar, setSelectedCar] = useState<string>("");
  const [mileage, setMileage] = useState<number | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [attendFiles, setAttendFiles] = useState<UploadFile[]>([]);
  const [existingFiles, setExistingFiles] = useState<UploadFile[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    fetchData();
    fetchDataType();
    fetchDataWarpup();
  }, []);

  const fetchData = async () => {
    try {
      const maresponse = await manageCarServices.getMaCarQuery();
      setMaCar(maresponse);
      const optionsmaResponsema = maresponse.map((event: MaCar) => {
        return {
          value: event.carName,
          label: event.carName,
        };
      });
      setMaDataOptions(optionsmaResponsema);
      setMaData(maresponse);
    } catch (error) {
      message.error("ไม่สามารถโหลดข้อมูลได้");
    }
  };

  const handleSelectChange = (value: string) => {
    setSelectedCar(value);
    const carmilesData = maData.find((car) => car.carId === value);
    setMileage(carmilesData?.carMile);
    form.setFieldsValue({ wrapupMiles: carmilesData?.carMile });
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
      message.error("ไม่สามารถโหลดข้อมูลได้");
    }
  };

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
      setSubmitLoading(false);
    } catch (error) {
      message.error("ไม่สามารถโหลดข้อมูลได้");
    }
  };

  const createMaCarWarpup: FormProps<
    MaCarwarpup & MaCarWrapupImage
  >["onFinish"] = async (values) => {
    const carIdData = maCar.findLast((car) => car.carId === values.carId);
    console.log(`${carIdData}`);
    setSubmitLoading(true);

    const maCarCreateDataWarpup = {
      data: {
        carId: values.carId,
        vender: values?.vender,
        carWrapupId: values?.carWrapupId,
        typeName: values?.typeName,
        carName: carIdData?.carName,
        wrapupMiles: new String(values?.wrapupMiles),
        detail: values?.detail ?? "",
        cost: values?.cost ?? 0,
        dateStart: values.dateStart,
        dateEnd: values.dateEnd,
        createbyName: `${session?.user.firstNameTh} ${session?.user.lastNameTh}`,
        remark: values?.remark ?? "",
        status: null,
      },
    };
    try {
      const response = await manageCarServices.createMaCarWarpup(
        maCarCreateDataWarpup
      );

      if (response && attendFiles.length > 0) {
        await Promise.all(
          attendFiles.map(async (file) => {
            console.log(`${response.carWrapupId}`);
            const formData = new FormData();
            formData.append("file", file.originFileObj as RcFile);
            await manageCarServices.uploadFiles(
              response.idwarpupImage,
              formData
            );
          })
        );
      }
      if (response) {
        message.success("เพิ่มการตรวจสภาพรถสำเร็จ");
        fetchDataWarpup();
      } else {
        message.error("เพิ่มการตรวจสภาพรถไม่สำเร็จ");
      }
      setIsmodlaOpencreate(false);
      setAttendFiles([]);
      form.resetFields();
      setSubmitLoading(false);
    } catch (error) {
      message.error("เพิ่มการตรวจสภาพรถไม่สำเร็จ");

      fetchDataWarpup();
      setAttendFiles([]);
      form.resetFields();
      setSubmitLoading(false);
    }
  };

  const updatedCarWrpup: FormProps<
    MaCarwarpup & MaCarWrapupImage
  >["onFinish"] = async (values) => {
    setSubmitLoading(true);
    const updateMaCarWarpup = {
      vender: values.vender,
      typeName: values.typeName,
      carName: values.carName,
      wrapupMiles: new String(values.wrapupMiles),
      detail: values.detail,
      cost: values.cost,
      createbyName: `${session?.user.firstNameTh} ${session?.user.lastNameTh}`,
      dateStart: new Date(values.dateStart),
      dateEnd: new Date(values.dateEnd),
      remark: values.remark,
    };
    try {
      const response = await manageCarServices.updateMaCarWarpup(
        formchange.getFieldValue("carWrapupId"),
        updateMaCarWarpup
      );
      if (response && attendFiles.length > 0) {
        await Promise.all(
          attendFiles.map(async (file) => {
            console.log(`${response.carWrapupId}`);
            const formData = new FormData();
            formData.append("file", file.originFileObj as RcFile);
            await manageCarServices.uploadFiles(response.carWrapupId, formData);
          })
        );
      }
      message.success("แก้ไขข้อมูลการตรวจสภาพรถสำเร็จ");
      formchange.resetFields();
      setMaCar([]);
      setAttendFiles([]);
      fetchDataWarpup();
      handleEditMaCarCancelWarpup();
      setIsmodlaOpenupdate(false);
      setSubmitLoading(false);
    } catch (error) {
      message.error("แก้ไขข้อมูลการตรวจสภาพรถไม่สำเร็จ");
      formchange.resetFields();
      setAttendFiles([]);
      setMaCar([]);
    }
  };

  const updatedchecksubmit: FormProps<MaCarwarpup>["onFinish"] = async (
    values
  ) => {
    setSubmitLoading(true);
    console.log(values.status);

    try {
      const updateMaCarWarpup = {
        status: values.status,
      };
      console.log(updateMaCarWarpup);

      await manageCarServices.updateMaCarWarpup(
        formchange.getFieldValue("carWrapupId"),
        updateMaCarWarpup
      );
      message.success("การตรวจสภาพรถสำเร็จ");
      setSubmitLoading(false);
      setIsmodlasubmit(false);
      fetchDataWarpup();
    } catch (error) {
      message.error("การตรวจสภาพรถไม่สำเร็จ");
    }
  };

  const handleDeletemaCarWarpup = async (carWrapupId: string) => {
    try {
      await manageCarServices.deleteMaCarWarpup(carWrapupId);
      message.success("ลบการตรวจสภาพรถสำเร็จ");
      fetchDataWarpup();
    } catch (error) {
      message.error("ลบการตรวจสภาพรถไม่สำเร็จ");
    }
  };
  const handleDeleteImage = async (file: UploadFile) => {
    const idwarpupImage = file.uid;
    console.log(idwarpupImage);

    try {
      const response = await manageCarServices.deleteMaCarWarpupimage(
        +idwarpupImage
      );

      if (response) {
        const updatedFiles = existingFiles.filter(
          (existingFile) => existingFile.uid !== idwarpupImage
        );
        setExistingFiles(updatedFiles);
        message.success("ลบข้อมูลภาพการตรวจสภาพรถสำเร็จ");
        fetchDataWarpup();
      } else {
        message.error("ลบข้อมูลภาพการตรวจสภาพรถไม่สำเร็จ");
      }
    } catch {
      message.error("ลบข้อมูลภาพการตรวจสภาพรถไม่สำเร็จ");
    }
  };
  const handleEditMaCarCancelWarpup = () => {
    setModalEditMaCarWarpup(false);
    form.resetFields();
  };

  const detailswarpup = (record: MaCarwarpup) => {
    formdetail.setFieldsValue({
      ...record,
      dateStart: dayjs(record.dateStart),
      dateEnd: dayjs(record.dateEnd),
    });
    console.log(record.maCarWrapupImage);
    const existingFilesList: UploadFile[] = record.maCarWrapupImage.map(
      (image) => ({
        uid: String(image.idwarpupImage),
        name: image.maName as string,
        status: "done" as UploadFileStatus,
        url: `http://localhost:4003/api/public/ma-car-wrapup-image/${image.maName}`,
      })
    );
    setExistingFiles(existingFilesList);
    setSelectedMaCarwarpup(record);
    setIsmodladetail(true);
  };

  const showModalEditMaCarWarpup = (record: MaCarwarpup) => {
    formchange.setFieldsValue({
      ...record,
      dateStart: dayjs(record.dateStart),
      dateEnd: dayjs(record.dateEnd),
    });
    console.log(record.maCarWrapupImage);
    const existingFilesListedit: UploadFile[] = record.maCarWrapupImage.map(
      (image) => ({
        uid: String(image.idwarpupImage),
        name: image.maName as string,
        status: "done" as UploadFileStatus,
        url: `http://localhost:4003/api/public/ma-car-wrapup-image/${image.maName}`,
      })
    );
    setExistingFiles(existingFilesListedit);
    setSelectedMaCarwarpup(record);
    setIsmodlaOpenupdate(true);
  };

  const modalopencreate = () => {
    setIsmodlaOpencreate(true);
  };
  const handleclosecreate = () => {
    setMileage(undefined);
    form.resetFields();
    setAttendFiles([]);
    setIsmodlaOpencreate(false);
  };

  const modalopensubmit = (record: MaCarwarpup) => {
    formchange.setFieldsValue({
      ...record,
      dateStart: dayjs(record.dateStart),
      dateEnd: dayjs(record.dateEnd),
    });
    setIsmodlasubmit(true);
  };
  const handleclosesubmit = () => {
    setIsmodlasubmit(false);
    formchange.resetFields();
    setAttendFiles([]);
  };
  const handlecloseupdate = () => {
    setMileage(undefined);
    formchange.resetFields();
    setAttendFiles([]);

    setIsmodlaOpenupdate(false);
  };

  const handledetail = () => {
    setMileage(undefined);
    formdetail.resetFields();
    setAttendFiles([]);

    setIsmodladetail(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = maDataWarpup.filter((MaCarwarpup) =>
    MaCarwarpup.carName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleChangeAttendFiles: UploadProps["onChange"] = async ({
    fileList: newFileList,
  }) => {
    console.log(newFileList);

    if (newFileList.length > 3) {
      message.warning("คุณไม่สามารถอัปโหลดภาพเกิน 3 ภาพ");
      return Upload.LIST_IGNORE;
    }
    return setAttendFiles(newFileList);
  };

  const beforeUploadAttendFiles = (file: RcFile) => {
    if (attendFiles.find((oneFile) => oneFile.name === file.name)) {
      message.warning(`ชื่อไฟล์ ${file.name} ซ้ำ`);
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const sortedData = filteredData.sort((a, b) => b.id - a.id);

  const dataWithKey = sortedData.map((item, index) => ({
    ...item,
    key: index,
    index: sortedData.length - index, // เรียงจากมากไปน้อย
  }));

  const columns: TableProps<MaCarwarpup>["columns"] = [
    {
      title: "ลำดับ",
      dataIndex: "index",
      key: "index",
      align: "center",
      width: "60px",
      fixed: "left",
    },
    {
      title: "ชื่อรถ",
      dataIndex: "carName",
      key: "carName",
      fixed: "left",
      width: "250px",
    },
    {
      title: "ประเภทการตรวจสภาพ",
      dataIndex: "typeName",
      key: "typeName",
      width: "170px",
    },
    {
      title: "รายละเอียดการตรวจ",
      dataIndex: "detail",
      key: "detail",
      width: "200px",
    },
    {
      title: "สถานที่เช็คสภาพ",
      dataIndex: "vender",
      key: "vender",
      width: "200px",
    },
    {
      title: "เลขไมล์ตรวจสภาพ",
      dataIndex: "wrapupMiles",
      key: "wrapupMiles",
      align: "center",
      width: "100px",
      render: (textmiles: number) => new Intl.NumberFormat().format(textmiles),
    },
    {
      title: "ราคา",
      dataIndex: "cost",
      key: "cost",
      align: "center",
      width: "100px",
      render: (text: number) => (
        <div style={{ textAlign: "right" }}>
          {new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(text)}
        </div>
      ),
    },
    {
      title: "วันที่ตรวจสภาพ",
      dataIndex: "dateStart",
      key: "dateStart",
      align: "center",
      width: "140px",
      render: (createdAt: Date) => moment(createdAt).format("DD/MM/YYYY"),
    },
    {
      title: "วันตรวจสภาพครั้งถัดไป",
      dataIndex: "dateEnd",
      key: "dateEnd",
      align: "center",
      width: "140px",
      render: (updateAT: Date | null) =>
        updateAT ? moment(updateAT).format("DD/MM/YYYY") : "-",
    },
    {
      title: "หมายเหตุ",
      dataIndex: "remark",
      key: "remark",
      align: "center",
      render: (_: any, record: MaCarwarpup) => (
        <a onClick={() => detailswarpup(record)}>
          <Tooltip title="View">
            <EyeOutlined
              style={{ fontSize: "24px", color: "#08c", cursor: "pointer" }}
            />
          </Tooltip>
        </a>
      ),
    },
    {
      title: "ชื่อ - นามสกุล",
      dataIndex: "createbyName",
      key: "createbyName",
      width: "200px",
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: "30px",
      render: (status: boolean) =>
        status === null ? (
          <Tag color="blue">รอตรวจสภาพ</Tag>
        ) : status === true ? (
          <Tag color="green">เช็คแล้ว</Tag>
        ) : (
          <Tag color="red">ยกเลิกการเช็ค</Tag>
        ),
    },
    {
      title: "ตัวเลือก",
      dataIndex: "",
      key: "x",
      width: "50px",
      align: "center",
      render: (_: any, record: MaCarwarpup) => {
        const isEditable = record.status === null;
        return (
          <Space size="middle">
            <Tooltip title="แก้ไข">
              <a
                onClick={() => isEditable && showModalEditMaCarWarpup(record)}
                style={{
                  pointerEvents: isEditable ? "auto" : "none",
                  visibility: isEditable ? "visible" : "hidden",
                  color: isEditable ? "inherit" : "gray",
                }}
              >
                {EditIcon}
              </a>
            </Tooltip>
            <Popconfirm
              title="คุณแน่ใจหรือไม่ว่าต้องการลบการตรวจสภาพนี้ ?"
              onConfirm={() => handleDeletemaCarWarpup(record.carWrapupId)}
              okText="ยืนยัน"
              cancelText="ยกเลิก"
            >
              <Tooltip title="ลบ">
                <a>
                  <DeleteIcon width="20" height="20" />
                </a>
              </Tooltip>
            </Popconfirm>
            <Tooltip title="การเช็ค">
              <a
                onClick={() => isEditable && modalopensubmit(record)}
                style={{
                  pointerEvents: isEditable ? "auto" : "none",
                  visibility: isEditable ? "visible" : "hidden",
                  color: isEditable ? "inherit" : "gray",
                }}
              >
                {ApproveIcon}
              </a>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <div>
        <div>
          <Button
            style={{
              float: "left",
              margin: "13px 10px 0 10px ",
              padding: " 18px 30px 20px 30px",
              fontSize: "16px",
            }}
            type="primary"
            onClick={modalopencreate}
          >
            เพิ่มข้อมูลตรวจสภาพรถ
          </Button>
          <Input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="ค้นหารถ"
            style={{
              float: "left",
              width: "300px",
              margin: "16px 0",
              fontSize: "16px",
            }}
          />
          <div
            style={{
              float: "right",
              margin: "10px",
              padding: " 20px 30px 20px 30px",
              fontSize: "16px",
            }}
          >
            <ExportExcel datamacar={dataWithKey} />
          </div>
        </div>
      </div>
      <Table
        dataSource={dataWithKey}
        columns={columns}
        scroll={{ x: "max-content" }}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title="เพิ่มข้อมูลตรวจสภาพรถ"
        open={IsmodlaOpencreate}
        onCancel={handleclosecreate}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          onFinish={createMaCarWarpup}
          layout="vertical"
          initialValues={{ wrapupMiles: mileage }}
        >
          <Form.Item
            name="carId"
            label="ชื่อรถ"
            rules={[{ required: true, message: "กรุณาเลือกชื่อรถ" }]}
          >
            <Select
              placeholder="โปรดเลือกรถ"
              style={{ width: "100%" }}
              onChange={handleSelectChange}
            >
              {maCar.map((car, index) => (
                <Select.Option key={index} value={car.carId}>
                  {car.carName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="typeName"
            label="ประเภทการตรวจสภาพ"
            rules={[{ required: true, message: "กรุณาเลือกประเภทการตรวจสภาพ" }]}
          >
            <Select placeholder="โปรดเลือกประเภทการตรวจสภาพ">
              {maDataTypeOptions
                .filter((option) => {
                  const type = maDataType.find(
                    (type) => type.typeName === option.label
                  );
                  return type && type.status;
                })
                .map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="wrapupMiles"
            label="เลขไมล์"
            rules={[
              {
                required: true,
                validator: async (_, value) => {
                  if (value === undefined || value === "") {
                    // การตรวจสอบนี้จะถูกจัดการโดยกฎ required
                    return Promise.resolve();
                  }

                  const selectedCar = maData.find(
                    (car) => car.carName === formchange.getFieldValue("carName")
                  );

                  if (selectedCar) {
                    if (value === undefined || value === "" || value === null) {
                      throw new Error(`กรุณากรอกเลขไมล์`);
                    }
                    if (value < 0) {
                      throw new Error(`กรุณากรอกเลขไมล์`);
                    }
                    if (value < selectedCar.carMile) {
                      throw new Error(
                        `เลขไมล์ต้องไม่น้อยกว่าเลขไมล์ของรถ ${selectedCar.carMile}`
                      );
                    }
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber value={mileage} min={mileage || 0} />
          </Form.Item>
          <Form.Item
            name="vender"
            label="สถานที่การตรวจสภาพ"
            rules={[{ required: true, message: "กรุณากรอกสถานที่การตรวจสภาพ" }]}
          >
            <Input placeholder="โปรดเลือกสถานที่การตรวจสภาพ" />
          </Form.Item>
          <Form.Item
            name="cost"
            label="ราคา"
            rules={[{ required: true, message: "กรุณากรอกราคา" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                `฿ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value!.replace(/\฿\s?|(,*)/g, "") as any}
              min={0}
            />
          </Form.Item>

          <Form.Item
            name="detail"
            label="รายละเอียดการตรวจสภาพ"
            // rules={[
            //   { required: true, message: "กรุณากรอกรายละเอียดการตรวจสภาพ" },
            // ]}
          >
            <Input.TextArea
              placeholder="รายละเอียดการตรวจสภาพ"
              rows={4}
              showCount
              maxLength={150}
            />
          </Form.Item>
          <Form.Item
            name="dateStart"
            label="วันที่ตรวจสภาพ"
            rules={[{ required: true, message: "กรุณาเลือกเวลาเริ่มต้น" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              disabledDate={(current) =>
                current && current < moment().startOf("day")
              }
            />
          </Form.Item>
          <Form.Item
            name="dateEnd"
            label="วันที่่ตรวจสภาพครั้งถัดไป ( ** สามารถแก้ไขย้อนหลังได้ )"
            // rules={[{ required: true, message: "กรุณาเลือกเวลาสิ้นสุด" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              disabledDate={(current) =>
                current && current < moment().startOf("day")
              }
            />
          </Form.Item>
          <Form.Item name="remark" label="หมายเหตุ">
            <Input.TextArea rows={2} showCount maxLength={150} />
          </Form.Item>
          <Form.Item valuePropName="filelist">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
                width: "150px",
              }}
            >
              <Upload
                listType="picture"
                fileList={attendFiles}
                onChange={handleChangeAttendFiles}
                beforeUpload={beforeUploadAttendFiles}
                multiple={true}
                accept=".png,.jpg,.jpeg,.pdf"
                showUploadList={{
                  showPreviewIcon: false,
                  showRemoveIcon: true,
                  showDownloadIcon: false,
                }}
              >
                <Button icon={<UploadOutlined />}>
                  อัปโหลดรูปภาพและเอกสาร
                </Button>
              </Upload>
            </div>
          </Form.Item>
          <Form.Item>
            <Space style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={handleclosecreate}>ยกเลิก</Button>
              <Button type="primary" htmlType="submit" loading={submitLoading}>
                บันทึก
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="แก้ไขข้อมูลตรวจสภาพรถ"
        open={IsmodlaOpenupdate}
        onCancel={handlecloseupdate}
        footer={null}
        destroyOnClose
      >
        <Form
          form={formchange}
          onFinish={updatedCarWrpup}
          layout="vertical"
          initialValues={{
            wrapupMiles: 0,
            cost: 0,
          }}
        >
          <Form.Item
            name="carName"
            label="ชื่อรถ"
            rules={[{ required: true, message: "กรุณาเลือกชื่อรถ" }]}
          >
            <Select options={maDataOptions} disabled />
          </Form.Item>
          <Form.Item
            name="typeName"
            label="ประเภทการตรวจสภาพ"
            rules={[{ required: true, message: "กรุณาเลือกประเภทการตรวจสภาพ" }]}
          >
            <Select>
              {maDataTypeOptions
                .filter((option) => {
                  const type = maDataType.find(
                    (type) => type.typeName === option.label
                  );
                  return type && type.status;
                })
                .map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="wrapupMiles"
            label="เลขไมล์"
            rules={[
              {
                required: true,
                validator: async (_, value) => {
                  if (value === undefined || value === "") {
                    // การตรวจสอบนี้จะถูกจัดการโดยกฎ required
                    return Promise.resolve();
                  }

                  const selectedCar = maData.find(
                    (car) => car.carName === formchange.getFieldValue("carName")
                  );

                  if (selectedCar) {
                    if (value === undefined || value === "" || value === null) {
                      throw new Error(`กรุณากรอกเลขไมล์`);
                    }
                    if (value < 0) {
                      throw new Error(`กรุณากรอกเลขไมล์`);
                    }
                    if (value < selectedCar.carMile) {
                      throw new Error(
                        `เลขไมล์ต้องไม่น้อยกว่าเลขไมล์ของรถ ${selectedCar.carMile}`
                      );
                    }
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber value={mileage} min={mileage || 0} />
          </Form.Item>

          <Form.Item
            name="vender"
            label="สถานที่การตรวจสภาพ"
            rules={[{ required: true, message: "กรุณากรอกสถานที่การตรวจสภาพ" }]}
          >
            <Input placeholder="โปรดเลือกสถานที่การตรวจสภาพ" />
          </Form.Item>
          <Form.Item
            name="cost"
            label="ราคา"
            rules={[{ required: true, message: "กรุณากรอกราคา" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                `฿ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value!.replace(/\฿\s?|(,*)/g, "") as any}
              min={0}
            />
          </Form.Item>
          <Form.Item
            name="detail"
            label="รายละเอียดการตรวจสภาพ"
            rules={[
              { required: true, message: "กรุณากรอกรายละเอียดการตรวจสภาพ" },
            ]}
          >
            <Input.TextArea rows={4} showCount maxLength={150} />
          </Form.Item>
          <Form.Item
            name="dateStart"
            label="วันที่ตรวจสภาพ"
            rules={[{ required: true, message: "กรุณาเลือกวันที่ตรวจสภาพ" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="dateEnd"
            label="วันที่่ตรวจสภาพครั้งถัดไป"
            rules={[
              {
                required: true,
                message: "กรุณาเลือกวันที่่ตรวจสภาพครั้งถัดไป",
              },
            ]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="remark" label="หมายเหตุ">
            <Input.TextArea rows={2} showCount maxLength={150} />
          </Form.Item>
          <Form.Item label="รูปภาพปัจจุบัน:">
            {existingFiles.map((file, index) => (
              <div
                key={index}
                style={{ marginBottom: "20px", position: "relative" }}
              >
                <Image
                  preview={false}
                  crossOrigin="anonymous"
                  src={file.url}
                  style={{ width: "470px", height: "460px" }}
                  alt="news"
                />
                <Button
                  type="primary"
                  danger
                  style={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                  }}
                  onClick={() => handleDeleteImage(file)}
                >
                  ลบรูปภาพ
                </Button>
              </div>
            ))}
          </Form.Item>
          <Form.Item valuePropName="filelist">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
                width: "150px",
              }}
            >
              <Upload
                listType="picture"
                fileList={attendFiles}
                onChange={handleChangeAttendFiles}
                beforeUpload={beforeUploadAttendFiles}
                multiple={true}
                accept=".png,.jpg,.jpeg,.pdf"
              >
                <Button icon={<UploadOutlined />}>
                  อัปโหลดรูปภาพและเอกสาร
                </Button>
              </Upload>
            </div>
          </Form.Item>
          <Form.Item>
            <Space style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={handlecloseupdate}>ยกเลิก</Button>
              <Button type="primary" htmlType="submit" loading={submitLoading}>
                บันทึก
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="ยืนยันข้อมูลตรวจสภาพรถ"
        width={410}
        open={Ismodlasubmit}
        onCancel={handleclosesubmit}
        footer={null}
        destroyOnClose
        style={{ textAlign: "center" }}
      >
        <div style={{ fontSize: "18px", textAlign: "center" }}>
          โปรดเลือกการตรวจเช็คสภาพรถ
        </div>
        <Form form={formchange} onFinish={updatedchecksubmit}>
          <Form.Item name="carWrapupId" noStyle>
            <Input type="hidden" />
          </Form.Item>

          <Form.Item name="status">
            <Space
              style={{
                margin: "0px 0 -60px 0",
                padding: "10px 0 0 0",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button danger type="primary" onClick={() => handleSubmit(false)}>
                ยกเลิกการตรวจ
              </Button>
              <Button
                type="primary"
                style={{ background: "green" }}
                onClick={() => handleSubmit(true)}
              >
                เช็คสภาพแล้ว
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="หมายเหตุ (รายละเอียด)"
        width={600}
        open={Ismodladetail}
        onCancel={handledetail}
        footer={null}
        destroyOnClose
        style={{ textAlign: "center" }}
      >
        <Form form={formdetail}>
          <Form.Item<MaCarwarpup> name="remark" label="">
            <Input.TextArea
              style={{
                fontSize: "16px",
                userSelect: "none",
                pointerEvents: "none",
                border: "none",
                outline: "none",
                resize: "none",
                boxShadow: "none",
              }}
              rows={12}
              readOnly
            />
          </Form.Item>
          <Form.Item>
            {existingFiles.map((file, index) => (
              <div
                key={index}
                style={{ marginBottom: "20px", position: "relative" }}
              >
                <Image
                  preview={false}
                  crossOrigin="anonymous"
                  src={file.url}
                  style={{ width: "475px", height: "400px" }}
                  alt="news"
                />
              </div>
            ))}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default WarpupmaCar;
