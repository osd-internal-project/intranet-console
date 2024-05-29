import { dateToStringTh } from "@/app/utils/format";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Input, Modal, Row, Select, Spin, Switch, Tag, Upload, UploadFile, UploadProps, message } from "antd";
import { RcFile } from "antd/es/upload";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import {
  ITypeOption,
  ITypeDepartment,
  ITypeMasterGhsType,
  ITypeMasterProductCategory,
  ITypeMasterProductGroup,
  ITypeMasterProductForm,
  ITypeUnit,
  ITypeMasterProduct,
} from "../common/index";
import { useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import AddMasterProductService from "../services/add-master-product.service";
import { useRouter } from "next/navigation";
import MasterProductServices from "../services/master-product.service";
import MasterHazardTypeService from "../../master-hazard-type/services/index.service";

const AddMasterProduct: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();
  const [formadmasterproduct] = Form.useForm();
  const stockAuth = useAxiosStock();
  const addMasterProductService = AddMasterProductService(stockAuth);
  const masterProductService = MasterProductServices(stockAuth);
  const masterHazardTypeService = MasterHazardTypeService(stockAuth);
  const [addDate, setAddDate] = useState<Date>(new Date());
  const [imageList, setImageList] = useState<UploadFile[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [categoriesOption, setCategoriesOption] = useState<ITypeOption[]>([]);
  const [groupOption, setGroupOption] = useState<ITypeOption[]>([]);
  const [disableGroup, setDisableGroup] = useState<boolean>(true);
  const [groupOfCategory, setGroupOfCategory] = useState<any>([]);
  const [typeSelected, setTypeSelected] = useState<string[]>([]);
  const [ghsOption, setGhsOption] = useState<ITypeOption[]>([]);
  const [hazardOption, setHazardOption] = useState<ITypeOption[]>([]);
  const [departmentOption, setDepartmentOption] = useState<ITypeOption[]>([]);
  const [unitOption, setUnitOption] = useState<ITypeOption[]>([]);
  // const [ghsSelected, setGhsSelected] = useState<ITypeMasterGhsType>();
  const [switchChecked, setSwitchChecked] = useState<boolean>(false);
  const [minimum, setMinimum] = useState<number>(0);
  const [maximum, setMaximum] = useState<number>(0);
  const [expire, setExpire] = useState<number>(0);
  const [buttonLoading, setbuttonLoading] = useState<boolean>(false);

  useEffect(() => {
    loaddata();
  }, []);

  useEffect(() => {}, []);
  const loaddata = async () => {
    const getcategories = await addMasterProductService.getMasterProductCategoryAll();
    if (getcategories.length > 0) {
      const categories = getcategories.map((data: ITypeMasterProductCategory) => ({
        value: data.id,
        label: data.categoryName,
      }));
      setCategoriesOption(categories);
    }
    const getGhs = await addMasterProductService.getMasterGhs();
    if (getGhs.length > 0) {
      const ghs = getGhs.map((data: ITypeMasterGhsType) => ({
        value: data.id,
        label: data.nameGhs,
      }));
      setGhsOption(ghs);
    }

    const getHazardtype = await masterHazardTypeService.getdataAllHazard();
    const datafilter = getHazardtype
      .filter((event: any) => event.status === true)
      .map((data: any) => ({
        value: data.id,
        label: data.nameHazard,
      }));
    setHazardOption(datafilter);

    const getDepartment = await addMasterProductService.getDepartment();
    if (getDepartment.length > 0) {
      const department = getDepartment.map((data: ITypeDepartment) => ({
        value: data.id,
        label: data.locationName,
      }));
      setDepartmentOption(department);
    }

    const getUnit = await addMasterProductService.getUnit();
    if (getUnit.length > 0) {
      const unit = getUnit.map((data: ITypeUnit) => {
        return {
          value: data.id,
          label: data.unitName,
        };
      });
      setUnitOption(unit);
    }
    setLoading(false);
  };

  const selectGroupOption = async (value: number) => {
    const getgroup = await addMasterProductService.getActiveMasterProductGroupByCategoryId(value);
    if (groupOfCategory.length !== getgroup.length) {
      formadmasterproduct.resetFields(["groupCode"]);
      setTypeSelected([]);
    }
    if (getgroup.length > 0) {
      const data = getgroup.map((data: ITypeMasterProductGroup) => ({
        value: data.id,
        label: data.groupName,
      }));
      setDisableGroup(false);
      setGroupOption(data);
      setGroupOfCategory(getgroup);
    }
  };

  // const selectTypeOption = async (value: number) => {
  //   const group = groupOfCategory.filter((d: any) => d.id === value);
  //   const type: string[] = [];
  //   group[0].masterProductGroupMapType.map((d: any) => {
  //     type.push(d.typeName);
  //   });
  //   setTypeSelected(type);
  // };

  //Imange
  const handleChangePic: UploadProps["onChange"] = async ({ fileList: newFileList }) => {
    return await setImageList(newFileList);
  };

  const beforeUpload = (file: RcFile) => {
    const isLt2M = file.size / 1024 / 1024 < 20;
    if (!isLt2M) {
      message.error("Image must smaller than 20MB!");
      return Upload.LIST_IGNORE;
    } else {
      return false;
    }
  };
  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.thumbUrl || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.thumbUrl!.substring(file.url!.lastIndexOf("/") + 1));
  };

  const uploadProps: UploadProps = {
    name: "file",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      let fileList = [...info.fileList];
      setFileList(fileList);
    },
    beforeUpload: beforeUpload,
    showUploadList: { showPreviewIcon: true, showRemoveIcon: true },
    fileList: fileList,
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>{`Upload`}</div>
    </div>
  );

  const handleMinIncrease = async () => {
    setMinimum(minimum + 1);
    formadmasterproduct.setFieldValue("minimumStock", minimum + 1);
  };

  const handleMinDecrement = async () => {
    if (minimum <= 0) {
      setMinimum(0);
      formadmasterproduct.setFieldValue("minimumStock", 0);
    } else {
      setMinimum(minimum - 1);
      formadmasterproduct.setFieldValue("minimumStock", minimum - 1);
    }
  };

  const handleMaxIncrease = async () => {
    setMaximum(maximum + 1);
    formadmasterproduct.setFieldValue("maximumStock", maximum + 1);
  };

  const handleMaxDecrement = async () => {
    if (maximum <= 0) {
      setMaximum(0);
      formadmasterproduct.setFieldValue("maximumStock", 0);
    } else {
      setMaximum(maximum - 1);
      formadmasterproduct.setFieldValue("maximumStock", maximum - 1);
    }
  };

  const handleExpireIncrease = async () => {
    console.log(Number.isNaN(expire));

    if (Number.isNaN(expire)) {
      setExpire(0);
      formadmasterproduct.setFieldValue("beforeExpiry", expire + 1);
      setExpire(expire + 1);
    } else {
      formadmasterproduct.setFieldValue("beforeExpiry", expire + 1);
      setExpire(expire + 1);
    }
  };

  const handleExpireDecrement = async () => {
    if (Number.isNaN(expire)) {
      setExpire(0);
    }
    if (expire <= 0) {
      setExpire(0);
      formadmasterproduct.setFieldValue("beforeExpiry", 0);
    } else {
      setExpire(expire - 1);
      formadmasterproduct.setFieldValue("beforeExpiry", expire - 1);
    }
  };
  const onFinish = async (values: any) => {
    const checkData = await masterProductService.getMasterProducts({ casNo: values?.casNo });
    if (checkData.length >= 1) {
      message.warning("มี CasNo นี่อยู่แล้วโปรดตรวจสอบข้อมูลในส่วนนี้ใหม่");
      return false;
    }
    if (values?.casNo.length > 20) {
      message.warning("จำนวน CasNo ที่ท่านกรอกเกิน 20 ตัวอักษร ระบบรองรับ CasNo ได้ 20 อักษรโปรดกรอกข้อมูลใหม่");
      return false;
    }
    setLoading(true);
    setbuttonLoading(true);
    const departments = values.department.length > 0 ? values.department.map((id: number) => ({ locationId: id })) : [];
    const ghs = values.ghs.length > 0 ? values.ghs.map((id: number) => ({ ghsId: id })) : [];
    const hazards = values.nameHazard.length > 0 ? values.nameHazard.map((id: number) => ({ hazardId: id })) : [];

    const productNameList = values.productNameList.map((data: string) => ({
      name: data,
    }));
    const form: ITypeMasterProductForm = {
      masterProductDetails: { createMany: { data: productNameList } },
      chemicalFormula: values.chemicalFormula,
      casNo: values.casNo,
      hyperlink: values.hyperlink,
      undertaker: "",
      description: values.description,
      masterProductGhsMap: {
        createMany: {
          data: ghs,
        },
      },
      masterProductHazardtypeMap: {
        createMany: {
          data: hazards,
        },
      },
      masterProductGroup: {
        connect: {
          id: values.groupCode,
        },
      },
      unit: { connect: { id: values.unit } },
      minimumStock: Number(values.minimumStock ? values.minimumStock : 0),
      maximumStock: Number(values.maximumStock ? values.maximumStock : 0),
      beforeExpiry: Number(values.beforeExpiry ? values.beforeExpiry : 0),
      notiExpiry: switchChecked,
      updatedById: session?.user.userId,
      updatedByName: `${session?.user.firstNameTh} ${session?.user.lastNameTh} `,
      masterProductLocationMap: {
        createMany: {
          data: departments,
        },
      },
    };

    const result = await addMasterProductService.create(form);
    if (result) {
      if (imageList.length > 0) {
        const formData: any = new FormData();
        formData.append("images", imageList[0].originFileObj);
        await addMasterProductService.uploadNewImages(result.id, formData);
      }
      if (fileList.length > 0) {
        fileList.map(async (file, index) => {
          const formData: any = new FormData();
          formData.append("files", file.originFileObj);
          await addMasterProductService.uploadNewFiles(result.id, formData);
        });
      }
      setLoading(false);
      message.success(`Add success`);
      router.push("/page/setting/master-product-management");
    } else {
      message.error(`ผิดพลาด ไม่สามารถสร้าง Master Product ได้`);
    }
    setbuttonLoading(false);
  };
  const validateMinMaxStock = (_: any, value: any, callback: any) => {
    const min = formadmasterproduct.getFieldValue("minimumStock");
    const max = formadmasterproduct.getFieldValue("maximumStock");
    const expire = formadmasterproduct.getFieldValue("beforeExpiry");

    if (isNaN(min)) {
      formadmasterproduct.resetFields(["minimumStock"]);
    }
    if (isNaN(max)) {
      formadmasterproduct.resetFields(["maximumStock"]);
    }
    if (isNaN(expire)) {
      formadmasterproduct.resetFields(["beforeExpiry"]);
    }
    if (value !== null && value !== undefined) {
      if (Number(min) > Number(max)) {
        callback("กรุณากรอก Minimum Stock ให้น้อยกว่า Maximum Stock");
      }
    }
    callback();
  };

  const validateExpire = (_: any, value: any, callback: any) => {
    const expire = formadmasterproduct.getFieldValue("beforeExpiry");
    if (isNaN(expire)) {
      formadmasterproduct.resetFields(["beforeExpiry"]);
    }
    callback();
  };

  const handleSelectAllDepartmeny = (values: string[]) => {
    if (values && values.length && values.includes("all")) {
      if (departmentOption.length > 0) {
        const data = departmentOption.map((dep) => dep.value);
        formadmasterproduct.setFieldValue("department", data);
      }
    }
  };

  return (
    <Spin spinning={loading}>
      <Form form={formadmasterproduct} layout="horizontal" wrapperCol={{ span: 24 }} labelCol={{ flex: "150px" }} labelAlign="left" onFinish={onFinish} autoComplete="off">
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Card>
              <div className="space-y-4 grid grid-cols-1">
                <div className=" grid grid-cols-2 ">
                  <div>
                    <span className="sub-title-page-font">{`Add Master Product`}</span>
                    <br />
                    <div className=" text-slate-400">{`${dateToStringTh(addDate)} from ${session?.user.firstNameTh} ${session?.user.lastNameTh}`}</div>
                  </div>
                  <div className="">
                    <Form.Item
                      // className=" m-2"
                      name={`department`}
                      label={<div className=" font-bold">Department</div>}
                      rules={[{ required: true, message: "กรุณากรอก Department" }]}
                    >
                      <Select
                        options={[{ label: "Select all Department", value: "all" }, ...departmentOption]}
                        mode="multiple"
                        showSearch={false}
                        allowClear
                        onChange={handleSelectAllDepartmeny}
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className=" grid grid-cols-3">
                  <div className=" col-span-3 md:col-span-2 ml-5">
                    <Form.Item label={<div className=" font-bold">Image</div>}>
                      <Row gutter={[8, 8]}>
                        <Col>
                          <Upload
                            listType="picture-card"
                            fileList={imageList}
                            onChange={handleChangePic}
                            beforeUpload={beforeUpload}
                            onPreview={handlePreview}
                            accept=".jpg,.png,.gif"
                            maxCount={1}
                          >
                            {imageList.length >= 1 ? null : uploadButton}
                          </Upload>
                        </Col>
                        <Col span={12} style={{ justifyContent: "start", display: "flex" }}>
                          <Row style={{ textAlign: "center", alignItems: "center", display: "flex" }}>
                            {imageList.length >= 1 ? null : (
                              <>
                                <Col span={24}>{`Drag image here`}</Col>
                                <Col span={24}>{`or`}</Col>
                              </>
                            )}

                            <Col span={24}>
                              <Upload fileList={imageList} onChange={handleChangePic} beforeUpload={beforeUpload} accept=".jpg,.png,.gif" maxCount={1}>
                                {imageList.length >= 1 ? null : (
                                  <Button type="link" icon={<UploadOutlined />}>
                                    Browse image
                                  </Button>
                                )}
                              </Upload>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Form.Item>
                  </div>

                  <div className=" col-span-3"></div>
                  <div className=" col-span-3 md:col-span-1 ml-5">
                    <Form.Item
                      className=" m-2"
                      name={`productNameList`}
                      label={<div className=" font-bold">Product Name</div>}
                      rules={[{ required: true, message: "กรุณากรอก Product Name" }]}
                    >
                      <Select
                        suffixIcon={null}
                        filterOption={false}
                        placeholder="กรุณากรอก Product Name กด comma เพื่อเพิ่มชื่อ"
                        mode="tags"
                        style={{ width: "100%" }}
                        tokenSeparators={[","]}
                      />
                    </Form.Item>
                  </div>
                  <div className=" col-span-3 md:col-span-1 ml-5">
                    <Form.Item
                      className=" m-2"
                      name={`chemicalFormula`}
                      label={<div className=" font-bold">Chemical Formula</div>}
                      rules={[{ required: true, message: "กรุณากรอก Chemical Formula" }]}
                    >
                      <Input />
                    </Form.Item>
                  </div>
                  <div className=" col-span-3 md:col-span-1 ml-5">
                    <Form.Item className=" m-2" name={`casNo`} label={<div className=" font-bold">CAS No.</div>} rules={[{ required: true, message: "กรุณากรอก CAS No." }]}>
                      <Input />
                    </Form.Item>
                  </div>
                  <div className=" col-span-3 md:col-span-1 ml-5">
                    <Form.Item
                      className=" m-2 "
                      name={`nameHazard`}
                      label={<div className=" font-bold">Hazard Type</div>}
                      rules={[{ required: true, message: "กรุณากรอก Hazard Type" }]}
                    >
                      <Select showSearch={false} options={hazardOption} placeholder="กรุณาเลือก Hazard Type" mode="multiple" allowClear />
                    </Form.Item>
                  </div>

                  <div className=" col-span-3 md:col-span-1 ml-5">
                    <Form.Item className=" m-2 " name={`ghs`} label={<div className=" font-bold">GHS</div>} rules={[{ required: true, message: "กรุณากรอก GHS" }]}>
                      <Select showSearch={false} options={ghsOption} placeholder="กรุณาเลือก GHS" mode="multiple" allowClear />
                    </Form.Item>
                  </div>

                  <div className=" col-span-3 md:col-span-1  ml-5">
                    <Form.Item
                      className=" m-2"
                      name={`categoryCode`}
                      label={<div className=" font-bold">Category</div>}
                      rules={[{ required: true, message: "กรุณากรอก Category" }]}
                    >
                      <Select options={categoriesOption} onSelect={selectGroupOption} placeholder="กรุณาเลือก Category" allowClear />
                    </Form.Item>
                  </div>
                  <div className=" col-span-3 md:col-span-1  ml-5">
                    <Form.Item className=" m-2" name={`groupCode`} label={<div className=" font-bold">Group</div>} rules={[{ required: true, message: "กรุณากรอก Group" }]}>
                      <Select
                        options={groupOption}
                        disabled={disableGroup}
                        // onSelect={selectTypeOption}
                        placeholder="กรุณาเลือก Group"
                        allowClear
                      />
                    </Form.Item>
                  </div>
                  {/* <div className=" col-span-3 md:col-span-1  ml-5">
                    <Form.Item className=" m-2" label={<div className=" font-bold">Type</div>}>
                      {typeSelected?.map((d: string, i: number) => (
                        <Tag key={i}>{d}</Tag>
                      ))}
                    </Form.Item>
                  </div> */}

                  {/* <div className=" col-span-3 md:col-span-1 ml-5">
                    <Form.Item
                      className=" m-2"
                      name={`undertaker`}
                      label={<div className=" font-bold"> Undertaker </div>}
                      rules={[{ required: true, message: "กรุณากรอก Undertaker" }]}
                    >
                      <Input />
                    </Form.Item>
                  </div> */}
                  <div className=" col-span-3 md:col-span-3 ml-5">
                    <Form.Item className=" m-2" name={`description`} label={<div className=" font-bold">Description</div>}>
                      <Input />
                    </Form.Item>
                  </div>
                  <div className=" col-span-3 md:col-span-1 ml-5">
                    <Form.Item className=" m-2" name={`hyperlink`} label={<div className=" font-bold">Hyperlink</div>}>
                      <Input />
                    </Form.Item>
                  </div>
                  <div className=" col-span-3 md:col-span-2 ml-5">
                    <Form.Item className=" m-2" name={`attachFile`} label={<div className=" font-bold">Attach File</div>}>
                      <Upload {...uploadProps}>
                        <Button icon={<UploadOutlined />}>Attach file</Button>
                      </Upload>
                    </Form.Item>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={24}>
            <Card>
              <div className=" space-y-4">
                <div>
                  <span className="sub-title-page-font">{`Parameter`}</span>
                </div>
                <div className=" grid grid-cols-3 gap-2">
                  <div className=" col-span-3 md:col-span-1 ml-5">
                    <Form.Item className="m-2" name={`unit`} label={<div className=" font-bold">Unit</div>} rules={[{ required: true, message: "กรุณากรอก Unit" }]}>
                      <Select options={unitOption} placeholder=" กรุณาเลือก Unit" />
                    </Form.Item>
                  </div>
                  <div className=" col-span-3 md:col-span-1 ml-5">
                    <Form.Item
                      className="m-2"
                      name={`minimumStock`}
                      label={<div className=" font-bold">Minimum Stock</div>}
                      rules={[{ required: true, message: "กรุณากรอก Minimum Stock" }, { validator: validateMinMaxStock }]}
                    >
                      <Input
                        min={0}
                        value={String(minimum)}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || /^\d+$/.test(value)) {
                            setMinimum(parseInt(value) || 0);
                          }
                        }}
                        addonAfter={<Button size="small" type="link" style={{ color: "black" }} onClick={handleMinIncrease}>{`+`}</Button>}
                        addonBefore={<Button size="small" type="link" style={{ color: "black" }} onClick={handleMinDecrement}>{`-`}</Button>}
                      />
                    </Form.Item>
                  </div>
                  <div className=" col-span-3 md:col-span-1 ml-5">
                    <Form.Item
                      className=" m-2"
                      name={`maximumStock`}
                      label={<div className=" font-bold">Maximum Stock </div>}
                      rules={[{ required: true, message: "กรุณากรอก Maximum Stock" }, { validator: validateMinMaxStock }]}
                    >
                      <Input
                        min={0}
                        value={String(maximum)}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || /^\d+$/.test(value)) {
                            setMaximum(parseInt(value) || 0);
                          }
                        }}
                        addonAfter={<Button size="small" type="link" style={{ color: "black" }} onClick={handleMaxIncrease}>{`+`}</Button>}
                        addonBefore={<Button size="small" type="link" style={{ color: "black" }} onClick={handleMaxDecrement}>{`-`}</Button>}
                      />
                    </Form.Item>
                  </div>
                  <div className=" col-span-3 md:col-span-1 ml-5">
                    <Form.Item
                      className=" m-2"
                      name={`beforeExpiry`}
                      label={<div className=" font-bold">Noti before (Expiry)</div>}
                      rules={[{ required: false, message: "กรุณากรอก Noti before (Expiry)" }, { validator: validateExpire }]}
                    >
                      <Input
                        min={0}
                        value={String(expire)}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || /^\d+$/.test(value)) {
                            setExpire(parseInt(value) || 0);
                          }
                        }}
                        addonAfter={<Button size="small" style={{ color: "black" }} type="link" onClick={handleExpireIncrease}>{`+`}</Button>}
                        addonBefore={<Button size="small" style={{ color: "black" }} type="link" onClick={handleExpireDecrement}>{`-`}</Button>}
                      />
                    </Form.Item>
                  </div>
                  <div className=" col-span-3 md:col-span-1 ml-5">
                    <Form.Item className=" m-2" name={`notiExpiry`} label={<div className=" font-bold">Noti expiry</div>}>
                      <Switch
                        checkedChildren="On"
                        unCheckedChildren="Off"
                        onChange={() => {
                          setSwitchChecked(!switchChecked);
                        }}
                        checked={switchChecked}
                        defaultChecked={switchChecked}
                        className={switchChecked === true ? "active-switch" : "inactive-switch"}
                      />
                    </Form.Item>
                  </div>
                  {/* <div className=" col-span-3 md:col-span-1 ml-5">
                    <Form.Item
                      className=" m-2"
                      name={`updatedBy`}
                      label={<div className=" font-bold">ผู้อัพเดตล่าสุด </div>}
                      rules={[{ required: true, message: "กรุณากรอก ผู้อัพเดตล่าสุด" }]}
                    >
                      <Input />
                    </Form.Item>
                  </div> */}
                </div>
              </div>
            </Card>
          </Col>
          <Col span={24} className="  flex justify-end space-x-2">
            <Button className=" m-2" onClick={() => router.push("/page/setting/master-product-management")}>
              Cancel
            </Button>
            <Form.Item className=" m-2">
              <Button htmlType="submit" loading={buttonLoading} type="primary">
                Add
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => {
          setPreviewOpen(false);
        }}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </Spin>
  );
};

export default AddMasterProduct;
