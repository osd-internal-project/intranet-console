import { dateToStringTh } from "@/app/utils/format";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Input, Modal, Row, Select, Spin, Switch, Tag, Upload, UploadFile, UploadProps, message, Image } from "antd";
import { RcFile } from "antd/es/upload";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import {
  ITypeOption,
  ITypeDepartment,
  ITypeMasterGhsType,
  ITypeMasterProductCategory,
  ITypeMasterProductGroup,
  ITypeMasterProductFormEdit,
  ITypeUnit,
  ITypeMasterProductEdit,
  ITypeVender,
  ITypeBrand,
} from "../common/index";
import { useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import EditMasterProductService from "../services/edit-master-product.service";
import { useRouter } from "next/navigation";
import MasterProductServices from "../services/master-product.service";
import MasterHazardTypeService from "../../master-hazard-type/services/index.service";
export interface props {
  pid: string;
}
const EditMasterProduct: React.FC<props> = ({ pid }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();
  const [formadmasterproduct] = Form.useForm();
  const stockAuth = useAxiosStock();
  const editMasterProductService = EditMasterProductService(stockAuth);
  const masterProductService = MasterProductServices(stockAuth);
  const masterHazardTypeService = MasterHazardTypeService(stockAuth);
  const [imagesMasterProduct, setImagesMasterProduct] = useState<any>();
  // const [imageList, setImageList] = useState<any[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [categoriesOption, setCategoriesOption] = useState<ITypeOption[]>([]);
  const [groupOption, setGroupOption] = useState<ITypeOption[]>([]);
  const [disableGroup, setDisableGroup] = useState<boolean>(true);
  const [groupOfCategory, setGroupOfCategory] = useState<any[]>([]);
  // const [typeSelected, setTypeSelected] = useState<string[]>([]);
  const [ghsOption, setGhsOption] = useState<ITypeOption[]>([]);
  const [hazardOption, setHazardOption] = useState<ITypeOption[]>([]);
  const [departmentOption, setDepartmentOption] = useState<ITypeOption[]>([]);
  const [unitOption, setUnitOption] = useState<ITypeOption[]>([]);
  const [minimum, setMinimum] = useState<number>(0);
  const [maximum, setMaximum] = useState<number>(0);
  const [expire, setExpire] = useState<number>(0);
  const [buttonLoading, setbuttonLoading] = useState<boolean>(false);
  const [venderOption, setVenderOption] = useState<ITypeOption[]>([]);
  const [brandOption, setBrandOption] = useState<ITypeOption[]>([]);
  useEffect(() => {
    if (loading) loaddata();
  }, []);

  useEffect(() => {}, []);
  const loaddata = async () => {
    const data: ITypeMasterProductEdit = await masterProductService.getMasterProductById(pid);
    if (data) {
      const imagesMasterProduct = await dataImages(data?.masterProductImages as any);
      const gshSelected = data.masterProductGhsMap?.map((data) => data.masterGhsType.id);
      const hazardSelected = data.masterProductHazardtypeMap?.map((data) => data.masterHazardtype.id);
      formadmasterproduct.setFieldsValue({
        id: data.id,
        productNameList: data.masterProductDetails.map((d) => d.name),
        chemicalFormula: data.chemicalFormula,
        casNo: data.casNo,
        ghs: gshSelected,
        hazard: hazardSelected,
        groupCode: data.masterProductGroupId,
        undertaker: data.undertaker,
        description: data.description,
        hyperlink: data.hyperlink,
        unit: data.unitId,
        maximumStock: data.maximumStock,
        minimumStock: data.minimumStock,
        beforeExpiry: data.beforeExpiry,
        notiExpiry: data.notiExpiry,
        department: data.masterProductLocationMap.map((d) => d.locationId),
        categoryCode: data.masterProductGroup.masterProductCategories.id,
        venderId: data.venderId,
        brandId: data.brandId,
      });
      setImagesMasterProduct(imagesMasterProduct);
      setMinimum(data.minimumStock);
      setMaximum(data.maximumStock);
      await selectGroupOptionReady(data.masterProductGroup.masterProductCategories.id, data.masterProductGroupId);

      const getcategories = await editMasterProductService.getMasterProductCategoryAll();
      if (getcategories.length > 0) {
        const categories = getcategories.map((data: ITypeMasterProductCategory) => ({
          value: data.id,
          label: data.categoryName,
        }));
        setCategoriesOption(categories);
      }

      const getHazardtype = await masterHazardTypeService.getdataAllHazard();
      const datafilter = getHazardtype
        .filter((event: any) => event.status === true)
        .map((data: any) => ({
          value: data.id,
          label: data.nameHazard,
        }));
      setHazardOption(datafilter);
      //Set Option Data
      const getGhs = await editMasterProductService.getMasterGhs();
      if (getGhs.length > 0) {
        const ghs = getGhs.map((data: ITypeMasterGhsType) => ({
          value: data.id,
          label: data.nameGhs,
        }));
        setGhsOption(ghs);
      }
      const getDepartment = await editMasterProductService.getDepartment();
      if (getDepartment.length > 0) {
        const department = getDepartment.map((data: ITypeDepartment) => ({
          value: data.id,
          label: data.locationName,
        }));
        setDepartmentOption(department);
      }

      const getUnit = await editMasterProductService.getUnit();
      if (getUnit.length > 0) {
        const unit = getUnit.map((data: ITypeUnit) => {
          return {
            value: data.id,
            label: data.unitName,
          };
        });
        setUnitOption(unit);
      }

      const getVender = await editMasterProductService.getVender();
      if (getVender.length > 0) {
        const vender = getVender.map((data: ITypeVender) => ({
          value: data.id,
          label: data.venderName,
        }));
        setVenderOption(vender);
      }

      const getBrand = await editMasterProductService.getBrand();
      if (getVender.length > 0) {
        const brand = getBrand.map((data: ITypeBrand) => ({
          value: data.id,
          label: data.name,
        }));
        setBrandOption(brand);
      }
      setLoading(false);
    } else {
      message.success(`ไม่พบข้อมูล`);
      router.push("/page/setting/master-product-management");
    }
  };

  const dataImages = async (e: { idfile: string }[]) => {
    if (e?.length >= 1) {
      const getImages = await masterProductService.getImages(e[0]?.idfile);
      return getImages;
    } else {
      return null;
    }
  };

  const selectGroupOption = async (value: number) => {
    const getgroup = await editMasterProductService.getActiveMasterProductGroupByCategoryId(value);
    if (groupOfCategory.length !== getgroup.length) {
      formadmasterproduct.resetFields(["groupCode"]);
      // setTypeSelected([]);
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

  const selectGroupOptionReady = async (catId: number, groupId: number) => {
    const getgroup = await editMasterProductService.getActiveMasterProductGroupByCategoryId(catId);

    if (getgroup.length > 0) {
      const data = getgroup.map((data: ITypeMasterProductGroup) => ({
        value: data.id,
        label: data.groupName,
      }));
      setDisableGroup(false);
      setGroupOption(data);
      setGroupOfCategory(getgroup);
      // const group = getgroup.filter((d: any) => d.id === groupId);
      // const type: string[] = [];
      // group[0].masterProductGroupMapType.map((d: any) => {
      //   type.push(d.typeName);
      // });
      // setTypeSelected(type);
    }
  };

  //Imange
  const handleChangePic: UploadProps["onChange"] = async ({ fileList: newFileList }) => {
    return await setFileList(newFileList);
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

  // const uploadProps: UploadProps = {
  //   name: "file",
  //   headers: {
  //     authorization: "authorization-text",
  //   },
  //   onChange(info) {
  //     let fileList = [...info.fileList];
  //     // setFileList(fileList);
  //   },
  //   beforeUpload: beforeUpload,
  //   showUploadList: { showPreviewIcon: true, showRemoveIcon: true },
  //   // fileList: fileList,
  // };

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
    setLoading(true);
    setbuttonLoading(true);
    const departments = values.department.length > 0 ? values.department.map((id: number) => ({ locationId: id })) : [];
    const ghs = values.ghs.length > 0 ? values.ghs.map((id: number) => ({ ghsId: id })) : [];
    const hazard = values.hazard.length > 0 ? values.hazard.map((id: number) => ({ hazardId: id })) : [];
    const productNameList = values.productNameList.map((data: string) => ({
      name: data,
    }));
    let form: ITypeMasterProductFormEdit = {
      masterProductDetails: { deleteMany: {}, createMany: { data: productNameList } },
      chemicalFormula: values.chemicalFormula,
      hyperlink: values.hyperlink,
      undertaker: values.undertaker,
      description: values.description,
      masterProductGhsMap: {
        deleteMany: {},
        createMany: {
          data: ghs,
        },
      },
      masterProductHazardtypeMap: {
        deleteMany: {},
        createMany: {
          data: hazard,
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
      updatedById: session?.user.userId,
      updatedByName: `${session?.user.firstNameTh} ${session?.user.lastNameTh} `,
      masterProductLocationMap: {
        deleteMany: {},
        createMany: {
          data: departments,
        },
      },
    };
    if (values.venderId !== undefined) {
      const vender = venderOption.findLast((item) => item.value === values.venderId);
      form = { ...form, venderId: values.venderId, venderName: vender?.label };
    }
    if (values.brandId !== undefined) {
      const brand = brandOption.findLast((item) => item.value === values.brandId);
      form = { ...form, brandId: values.venderId, brandName: brand?.label };
    }
    const result = await editMasterProductService.update(pid, form);
    if (result) {
      if (fileList.length > 0) {
        const formData: any = new FormData();
        formData.append("images", fileList[0].originFileObj);
        const dataDeleteImage = await editMasterProductService.deleteImage(values.id);
        if (dataDeleteImage) {
          await editMasterProductService
            .uploadNewImages(values.id, formData)
            .then((data) => {
              message.success(`Edit success`);
              setFileList([]);
              setImagesMasterProduct("");
              setLoading(false);
            })
            .catch((err) => {
              message.error(`do not upload icon`);
              setFileList([]);
              setImagesMasterProduct("");
              setLoading(false);
            });
        }
      } else {
        message.success(`Edit success`);
        setFileList([]);
        setImagesMasterProduct("");
        setLoading(false);
      }
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
        <Form.Item name={"id"} hidden>
          <Input />
        </Form.Item>
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Card>
              <div className="space-y-4 grid grid-cols-1">
                <div className=" grid grid-cols-2 ">
                  <div>
                    {/* <span className="sub-title-page-font">{`${casNo}`}</span> */}
                    <br />
                    <div className=" text-slate-400">{`${dateToStringTh(new Date())} from ${session?.user.firstNameTh} ${session?.user.lastNameTh}`}</div>
                  </div>
                  <div>
                    <Form.Item name={`department`} label={<div className=" font-bold">Department</div>} rules={[{ required: true, message: "กรุณากรอก Department" }]}>
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
                        {fileList.length > 0 ? null : (
                          <Col>
                            <Image src={imagesMasterProduct ? URL.createObjectURL(imagesMasterProduct) : ""} width={100} />
                          </Col>
                        )}
                        <Col>
                          <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onChange={handleChangePic}
                            beforeUpload={beforeUpload}
                            onPreview={handlePreview}
                            accept=".jpg,.png,.gif"
                            maxCount={1}
                          >
                            {fileList.length >= 1 ? null : uploadButton}
                          </Upload>
                        </Col>
                        <Col span={12} style={{ justifyContent: "start", display: "flex" }}>
                          <Row style={{ textAlign: "center", alignItems: "center", display: "flex" }}>
                            {fileList.length >= 1 ? null : (
                              <>
                                <Col span={24}>{`Drag image here`}</Col>
                                <Col span={24}>{`or`}</Col>
                              </>
                            )}
                            <Col span={24}>
                              <Upload fileList={fileList} onChange={handleChangePic} beforeUpload={beforeUpload} accept=".jpg,.png,.gif" maxCount={1}>
                                {fileList.length >= 1 ? null : (
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
                    <Form.Item name={`productNameList`} label={<div className=" font-bold">Product Name</div>} rules={[{ required: true, message: "กรุณากรอก Product Name" }]}>
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
                      name={`chemicalFormula`}
                      label={<div className=" font-bold">Chemical Formula</div>}
                      rules={[{ required: true, message: "กรุณากรอก Chemical Formula" }]}
                    >
                      <Input />
                    </Form.Item>
                  </div>
                  <div className=" col-span-3 md:col-span-1 ml-5">
                    <Form.Item name={`casNo`} label={<div className=" font-bold">CAS No.</div>} rules={[{ required: true, message: "กรุณากรอก CAS No." }]}>
                      <Input disabled />
                    </Form.Item>
                  </div>
                  <div className=" col-span-3 md:col-span-1 ml-5">
                    <Form.Item className=" m-1 " name={`hazard`} label={<div className=" font-bold">Hazard Type</div>} rules={[{ required: true, message: "กรุณากรอก GHS" }]}>
                      <Select showSearch={false} options={hazardOption} placeholder="กรุณาเลือก Hazard Type" mode="multiple" allowClear />
                    </Form.Item>
                  </div>
                  <div className=" col-span-3 md:col-span-1 ml-5">
                    <Form.Item className=" m-1 " name={`ghs`} label={<div className=" font-bold">GHS</div>} rules={[{ required: true, message: "กรุณากรอก GHS" }]}>
                      <Select showSearch={false} options={ghsOption} placeholder="กรุณาเลือก GHS" mode="multiple" allowClear />
                    </Form.Item>
                  </div>

                  <div className=" col-span-3 md:col-span-1  ml-5">
                    <Form.Item name={`categoryCode`} label={<div className=" font-bold">Category</div>} rules={[{ required: true, message: "กรุณากรอก Category" }]}>
                      <Select options={categoriesOption} onSelect={selectGroupOption} placeholder="กรุณาเลือก Category" allowClear />
                    </Form.Item>
                  </div>
                  <div className=" col-span-3 md:col-span-1  ml-5">
                    <Form.Item name={`groupCode`} label={<div className=" font-bold">Group</div>} rules={[{ required: true, message: "กรุณากรอก Group" }]}>
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
                    <Form.Item label={<div className=" font-bold">Type</div>}>
                      {typeSelected?.map((d: string, i: number) => (
                        <Tag key={i}>{d}</Tag>
                      ))}
                    </Form.Item>
                  </div> */}
                  <div className=" col-span-3 md:col-span-1 ml-5">
                    <Form.Item className=" m-2" name={"brandId"} rules={[{ required: true, message: "please select brand" }]} label={<div className=" font-bold">Brand</div>}>
                      <Select placeholder="กรุณาเลือก Brand" options={brandOption} />
                    </Form.Item>
                  </div>
                  <div className=" col-span-3 md:col-span-1 ml-5">
                    <Form.Item className=" m-2" name={"venderId"} rules={[{ required: true, message: "please select vender" }]} label={<div className=" font-bold">Vender</div>}>
                      <Select placeholder="กรุณาเลือก Vender" options={venderOption} />
                    </Form.Item>
                  </div>
                  <div className=" col-span-3 md:col-span-3 ml-5">
                    <Form.Item name={`description`} label={<div className=" font-bold">Description</div>}>
                      <Input />
                    </Form.Item>
                  </div>
                  <div className=" col-span-3 md:col-span-1 ml-5">
                    <Form.Item name={`hyperlink`} label={<div className=" font-bold">Hyperlink</div>}>
                      <Input />
                    </Form.Item>
                  </div>
                  {/* <div className=" col-span-3 md:col-span-2 ml-5">
                    <Form.Item  name={`attachFile`} label={<div className=" font-bold">Attach File</div>}>
                      <Upload {...uploadProps}>
                        <Button icon={<UploadOutlined />}>Attach file</Button>
                      </Upload>
                    </Form.Item>
                  </div> */}
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
                    <Form.Item className="m-1" name={`unit`} label={<div className=" font-bold">Unit</div>} rules={[{ required: true, message: "กรุณากรอก Unit" }]}>
                      <Select options={unitOption} placeholder=" กรุณาเลือก Unit" />
                    </Form.Item>
                  </div>
                  <div className=" col-span-3 md:col-span-1 ml-5">
                    <Form.Item
                      className="m-1"
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
                  {/* <div className=" col-span-3 md:col-span-1 ml-5">
                    <Form.Item
                      
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
                    <Form.Item  name={`notiExpiry`} label={<div className=" font-bold">Noti expiry</div>}>
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
                  </div> */}
                  {/* <div className=" col-span-3 md:col-span-1 ml-5">
                    <Form.Item
                      
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
            <Button onClick={() => router.push("/page/setting/master-product-management")}>Cancel</Button>
            <Form.Item>
              <Button htmlType="submit" loading={buttonLoading} type="primary">
                Save Change
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

export default EditMasterProduct;
