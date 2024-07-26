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
  Switch,
  Tooltip
} from "antd";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManageCarServices } from "../../services/manage-car.service";
import { useForm } from "antd/es/form/Form";
import ExportExcel from "./ExportExcel";
import { useSession } from "next-auth/react";
import MaCar from "../../../ma-car/page";
import { Decimal } from "@prisma/client/runtime/library";
import dayjs from "dayjs";
import type { TableProps} from "antd";
import { DeleteIcon, ApproveIcon, EditIcon} from "@/components/icon";
import { log } from "console";
import { EyeOutlined } from '@ant-design/icons';
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
  carId:string;
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
  status: boolean;
}
const WarpupmaCar = () => {
  const intraAuth = useAxiosIntranet();
  const [form] = useForm();
  const [formchange] = useForm();
  const [formdetail] = useForm();
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
  const [Ismodlasubmit, setIsmodlasubmit] = useState(false);
  const [IsmodlaOpenupdate, setIsmodlaOpenupdate] = useState(false);
  const [Ismodladetail, setIsmodladetail] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [modalEditMaCarWarpup, setModalEditMaCarWarpup] = useState(false);
  const [maCar, setMaCar] = useState<MaCarwarpup[]>([]);
  const [selectedCar, setSelectedCar] = useState<string>("");
  const [mileage, setMileage] = useState<number | undefined>(undefined);

  
  useEffect(() => {
    fetchData();
    fetchDataType();
    fetchDataWarpup();
  }, []);

  const fetchData = async () => {
    try {
      const maresponse = await manageCarServices.getMaCarQuery();
      setMaCar(maresponse)
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

  const handleSelectChange = (value: string) => {
    setSelectedCar(value);
    const carmilesData = maData.find((car) => car.carId === value);
    setMileage(carmilesData?.carMile);
    form.setFieldsValue({ wrapupMiles: carmilesData?.carMile });
    console.log(carmilesData);
  };

  
  

  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMileage(Number(e.target.value));
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
  
  
  
  const createMaCarWarpup: FormProps<MaCarwarpup>["onFinish"] = async (values) => {
    const carIdData = maCar.findLast((car)=> car.carId === values.carId)
    console.log(`${carIdData}`);
    
    const maCarCreateDataWarpup = {

      data: {
        carId: values.carId,
        vender: values.vender,
        carWrapupId: values.carWrapupId,
        typeName: values.typeName,
        carName: carIdData?.carName,
        wrapupMiles: new String(values.wrapupMiles),
        detail: values.detail,
        cost: values.cost,
        dateStart: values.dateStart,
        dateEnd: values.dateEnd,
        remark: values.remark,
      },
    };
    try {
      const response = await manageCarServices.createMaCarWarpup(maCarCreateDataWarpup);
      if (response) {
        message.success("เพิ่มรถสำเร็จ");
        form.resetFields();
      } else {
        message.error("เพิ่มรถไม่สำเร็จ");
      }
      setSubmitLoading(false);
      fetchDataWarpup();
    } catch (error) {
      message.error("เพิ่มรถไม่สำเร็จ");
      setSubmitLoading(false);
    }
  };

  const updatedCarWrpup: FormProps<MaCarwarpup>["onFinish"] = async (values) => {
    setSubmitLoading(true);
    try {
      const updateMaCarWarpup = {
        vender: values.vender,
        typeName: values.typeName,
        carName: values.carName,
        wrapupMiles: new String(values.wrapupMiles),
        detail: values.detail,
        cost: values.cost,
        dateStart: new Date(values.dateStart),
        dateEnd: new Date(values.dateEnd),
        remark: values.remark,
      };
      await manageCarServices.updateMaCarWarpup(formchange.getFieldValue("carWrapupId"), updateMaCarWarpup);
      message.success("แก้ไขข้อมูลห้องสำเร็จ");
      fetchDataWarpup();
      handleEditMaCarCancelWarpup();
      setSubmitLoading(false);
    } catch (error) {
      message.error("แก้ไขข้อมูลห้องไม่สำเร็จ");
    }
  };

  const updatedchecksubmit: FormProps<MaCarwarpup>["onFinish"] = async (values) => {
    setSubmitLoading(true);
    try {
      const updateMaCarWarpup = {
        status: !values.status,
      };
      
      await manageCarServices.updateMaCarWarpup(formchange.getFieldValue("carWrapupId"), updateMaCarWarpup);
      message.success("การเช็คสำเร็จ");
      setSubmitLoading(false);
      setIsmodlasubmit(false);
    } catch (error) {
      message.error("การเช็คไม่สำเร็จ");
    }
  };

  const handleDeletemaCarWarpup = async (carWrapupId: string) => {
    try {
      await manageCarServices.deleteMaCarWarpup(carWrapupId);
      message.success("ลบการจองสำเร็จ");
    } catch (error) {
      message.error("ลบการจองไม่สำเร็จ");
    }
  };

  const handleEditMaCarCancelWarpup = () => {
    setModalEditMaCarWarpup(false);
    form.resetFields();
  };

  const detailswarpup = (record: MaCarwarpup) =>{
    formdetail.setFieldsValue({
      ...record,
      dateStart: dayjs(record.dateStart),
      dateEnd: dayjs(record.dateEnd),
    });
    setIsmodladetail(true);
  };

  const showModalEditMaCarWarpup = (record: MaCarwarpup) => {
    formchange.setFieldsValue({
      ...record,
      dateStart: dayjs(record.dateStart),
      dateEnd: dayjs(record.dateEnd),
    });
    setIsmodlaOpenupdate(true);
  };
  const modalopencreate = () => {
    setIsmodlaOpencreate(true);
  };
  const handleclosecreate = () => {
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
  };
  const handlecloseupdate = () => {
    setIsmodlaOpenupdate(false);
  };

  const handledetail = () => {
    setIsmodladetail(false);
  };

  const dataWithKey = maDataWarpup.map((item, index) => ({
    ...item,
    key: index + 1,
    index: index + 1,
  }));

  const columns : TableProps<MaCarwarpup>["columns"] = [
    {
      title: 'ลำดับ',
      dataIndex: 'index',
      key: 'index',
      align: "center",
      width: "20px",
    },
    {
      title: "ชื่อรถ",
      dataIndex: "carName",
      key: "carName",
      width: "180px",
    },
    {
      title: "ประเภทตรวจสภาพ",
      dataIndex: "typeName",
      key: "typeName",
      width: "140px",
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
      title: "เลขไมล์",
      dataIndex: "wrapupMiles",
      key: "wrapupMiles",
      align: "center",
      render: (textmiles: number) => new Intl.NumberFormat().format(textmiles),
    },
    {
      title: "ราคา",
      dataIndex: "cost",
      key: "cost",
      align: "center",
      render: (text: number) => new Intl.NumberFormat().format(text),
    },
    {
      title: "วันที่ระบุ",
      dataIndex: "dateStart",
      key: "dateStart",
      width: "40px",
      render: (createdAt: Date) => moment(createdAt).format("YYYY/MM/DD"),
    },
    {
      title: "วันตรวจสภาพ",
      dataIndex: "dateEnd",
      key: "dateEnd",
      width: "40px",
      render: (createdAt: Date) => moment(createdAt).format("YYYY/MM/DD"),
    },
    {
      title: "หมายเหตุ",
      dataIndex: "remark",
      key: "remark",
      align: "center",
      render:(_: any, record: MaCarwarpup)=>(
        <a onClick={() => detailswarpup(record)}>
           <Tooltip title="View">
            <EyeOutlined style={{ fontSize: '24px', color: '#08c', cursor: 'pointer' }} />
          </Tooltip>
        </a>
      )
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: "30px",
      render: (status: boolean) => (
            status 
            ? <Tag color="blue">รอการเช็ค</Tag> 
            : <Tag color="green">เช็คแล้ว</Tag>
        ),
    },
    {
      title: "ตัวเลือก",
      dataIndex: "",
      key: "x",
      width: "50px",
      align: "center",
      render: (_: any, record: MaCarwarpup) => (
        <Space size="middle">
          <Tooltip title="แก้ไข">
          <a onClick={() => showModalEditMaCarWarpup(record)}>
            <EditIcon />
         </a></Tooltip>
         <Popconfirm
            title="คุณแน่ใจหรือไม่ว่าต้องการลบการจองนี้?"
            onConfirm={() => handleDeletemaCarWarpup(record.carWrapupId)}
            okText="ยืนยัน"
            cancelText="ยกเลิก"
          ><a>
            <Tooltip title="ลบ">
          {" "}
          <DeleteIcon width="20" height="20" />{" "}</Tooltip>
        </a>
          </Popconfirm>
          <Tooltip title="การเช็ค">
          <a
            onClick={() => modalopensubmit(record)}
          >
            <ApproveIcon strokeColor="blue" width="1rem" height="1rem" />
          </a></Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <><div>
        <div>
          <Button style={{ float: 'left', margin: '10px',padding:" 20px 30px 20px 30px",fontSize:"16px" }} 
            type="primary"
            onClick={modalopencreate}
          >
            เพิ่มข้อมูลตรวจสภาพรถ
          </Button>
        
        <div style={{ float: 'right', margin: '10px' ,padding:" 20px 30px 20px 30px",fontSize:"16px" }}>
          <ExportExcel datamacar={dataWithKey} />
        </div>
        </div>
      </div>
      <Table 
        dataSource={dataWithKey} columns={columns}
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
            <Select placeholder="โปรดเลือกรถ" style={{ width: "100%" }} onChange={handleSelectChange}  >
              {maCar.map((car, index) => (
                <Select.Option 
                key={index} value={car.carId}>
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
            <Select>
            {maDataTypeOptions
              .filter(option => {
                const type = maDataType.find(type => type.typeName === option.label);
                return type && type.status;
              })
              .map(option => (
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
              { required: true, message: "กรุณากรอกเลขไมล์" },
              {
                validator: async (_, value) => {
                  const selectedCar = maData.find(
                    (car) => car.carName === form.getFieldValue("carId")
                  );
                  if (selectedCar && value < selectedCar.carMile) {
                    throw new Error("เลขไมล์ต้องไม่น้อยกว่าเลขไมล์เดิม");
                  }
                },
              },
            ]}
            
          >
            <InputNumber changeOnWheel value={mileage}/>
          </Form.Item>
          <Form.Item
            name="vender"
            label="สถานที่การเช็คสภาพ"
            rules={[{ required: true, message: "กรุณากรอกสถานที่การเช็คสภาพ" }]}
          >
            <Input />
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
              changeOnWheel
            />
          </Form.Item>
          <Form.Item
            name="detail"
            label="รายละเอียดการตรวจสภาพ"
            rules={[{ required: true, message: "กรุณากรอกรายละเอียดการตรวจสภาพ" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="dateStart"
            label="เวลาเริ่มต้น"
            rules={[{ required: true, message: "กรุณาเลือกเวลาเริ่มต้น" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="dateEnd"
            label="เวลาสิ้นสุด"
            rules={[{ required: true, message: "กรุณาเลือกเวลาสิ้นสุด" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="remark" label="หมายเหตุ">
            <Input.TextArea rows={2} />
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
            <Select options={maDataOptions} disabled/>
          </Form.Item>
          <Form.Item
            name="typeName"
            label="ประเภทการตรวจสภาพ"
            rules={[{ required: true, message: "กรุณาเลือกประเภทการตรวจสภาพ" }]}
          >
            <Select>
            {maDataTypeOptions
              .filter(option => {
                const type = maDataType.find(type => type.typeName === option.label);
                return type && type.status;
              })
              .map(option => (
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
              { required: true, message: "กรุณากรอกเลขไมล์" },
              {
                validator: async (_, value) => {
                  const selectedCar = maData.find(
                    (car) => car.carName === formchange.getFieldValue("carName")
                  );
                  if (selectedCar && value < selectedCar.carMile) {
                    throw new Error("เลขไมล์ต้องไม่น้อยกว่าเลขไมล์เดิม");
                  }
                },
              },
            ]}
          >
            <Input onChange={handleMileageChange} value={mileage !== undefined ? mileage : ""}  />
          </Form.Item>
          <Form.Item
            name="vender"
            label="สถานที่การเช็คสภาพ"
            rules={[{ required: true, message: "กรุณากรอกสถานที่การเช็คสภาพ" }]}
          >
            <Input />
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
              changeOnWheel
            />
          </Form.Item>
          <Form.Item
            name="detail"
            label="รายละเอียดการตรวจสภาพ"
            rules={[{ required: true, message: "กรุณากรอกรายละเอียดการตรวจสภาพ" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="dateStart"
            label="เวลาเริ่มต้น"
            rules={[{ required: true, message: "กรุณาเลือกเวลาเริ่มต้น" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="dateEnd"
            label="เวลาสิ้นสุด"
            rules={[{ required: true, message: "กรุณาเลือกเวลาสิ้นสุด" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="remark" label="หมายเหตุ">
            <Input.TextArea rows={2} />
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
        title="เพิ่มข้อมูลตรวจสภาพรถ"
        width={300}
        open={Ismodlasubmit}
        onCancel={handleclosesubmit}
        footer={null}
        destroyOnClose
        style={{textAlign:'center'}}
        ><div style={{fontSize:'18px',textAlign:'center'}}>
          เช็คสภาพแล้ว ใช่ หรือ ไม่ ? 
        </div>
          <Form
          form={formchange}
          onFinish={updatedchecksubmit}
        >
        <Form.Item name="carWrapupId" noStyle>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item name="status" valuePropName="checked">
          <Switch style={{visibility: 'hidden' }} />
        </Form.Item>
        <Form.Item>
        <Space style={{ margin:"-60px 0 -60px 0",padding:"10px 0 0 0",display: "flex", justifyContent: "center" }}>
              <Button onClick={handleclosesubmit}>ไม่</Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={submitLoading}
                >
                ใช่
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
        style={{textAlign:'center'}}
        >
          <Form
            form={formdetail}
            >
            <Form.Item<MaCarwarpup> name="remark" >
              <Input.TextArea style={{fontSize:"16px", userSelect: 'none', pointerEvents: 'none',}} rows={12}  readOnly/>
            </Form.Item>
        </Form>
      </Modal>
      
    </>
  );
};

export default WarpupmaCar;
