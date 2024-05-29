"use client";
import { useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import { IconPluscircle, deleteIcon, successIcon } from "@/components/icon";
import { MenuOutlined, PlusOutlined, PaperClipOutlined, FilterOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Popover,
  Row,
  Select,
  Space,
  Spin,
  Switch,
  Table,
  Tag,
  Tooltip,
  Typography,
  Upload,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { InventoryStockServices } from "../../services/inventory-stock.service";
import GhsServices from "@/app/page/setting/ghs/services/ghs.service";
import { TableDetailLot } from "./TableDetailLot";
import { dateToStringTh, numberWithCommas } from "@/app/utils/format";
import type { UploadFile } from "antd/es/upload/interface";
import type { RcFile, UploadProps } from "antd/es/upload";
import { ITypeBrand, ITypeOption, ITypeVender, ITypeImagesGHS, ITypeInventory, filterproductlist } from "../../common";
import { v4 as uuidv4 } from "uuid";
import { ColumnsType } from "antd/es/table";
import { checkRule } from "@/app/utils/rules";
import { useSession } from "next-auth/react";

export interface props {
  inventoryId: string;
  location?: string;
  userId?: string;
  username?: string;
  inventoryName?: string | null;
  ownerGroup?: string | null;
}
type TFormValue = {
  brandId: number;
  detail: string;
  expiryDate: Date;
  productionDate: Date;
  qty: number;
  receiptDate: Date;
  totalPrice: number;
  uploadfile: File;
  venderId: string;
};
export const TableStock: React.FC<props> = ({ inventoryId, location, userId, username, inventoryName, ownerGroup }): React.ReactElement => {
  const { data: session } = useSession();
  const stockAuth = useAxiosStock();
  const addStockRule = checkRule("inventory-stock-add");
  const inventorystockservices = InventoryStockServices(stockAuth);
  const ghsServices = GhsServices(stockAuth);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalOpenAdd, setIsModalOpenAdd] = useState<boolean>(false);
  const [searchLot, setSearchLot] = useState<object>({});
  const [headermodalDetail, setheaderModalDetail] = useState<string>("");
  const [modalDetail, setModalDetail] = useState<ITypeInventory>();
  const [totalQty, setTotalQty] = useState<Number>(0);
  const [totalPrice, setTotalPrice] = useState<Number>(0);
  const [venderOption, setVenderOption] = useState<ITypeOption[]>([]);
  const [brandOption, setBrandOption] = useState<ITypeOption[]>([]);
  const [headerModalAdd, setHeaderModalAdd] = useState<{
    passNo: string;
    unitName: string;
    masterProductId: string;
    masterProductDetails: { name: string }[];
    count: number;
  }>({
    passNo: "",
    unitName: "",
    masterProductId: "",
    masterProductDetails: [],
    count: 0,
  });

  const [loading, setloading] = useState<boolean>(true);
  const [getId, setId] = useState<string>("");
  const [getUnit, setUnit] = useState<string>("");
  const [getMinStock, setMinStock] = useState<string>("");
  const [getdataResult, setdataResult] = useState<ITypeInventory[]>([]);
  const [getcount, setCount] = useState<number>(0);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [addForm] = Form.useForm();
  const [detailForm] = Form.useForm();
  const [formdetaillot] = Form.useForm();
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [getswitch, setSwitch] = useState<boolean>(false);
  const [search, setSearch] = useState<object>({});
  const [buttonLoading, setbuttonLoading] = useState<boolean>(false);

  useEffect(() => {
    getApibrandandvender();
    if (loading === true) loaddata();
  }, [inventoryId, loading, search, getId, getswitch]);
  const loaddata = async () => {
    const result = await inventorystockservices.getInventoryByInventoryID(inventoryId, search, getswitch);
    const data = await Promise.all(
      result?.map(async (event: ITypeInventory) => {
        let usableRemain = 0;
        let expiredRemain = 0;
        let reciepdate_last = 0;
        if (event.inventoryStock.length > 0) {
          const usable = await inventorystockservices.getUsableRemain(event.inventoryStock[0].id);
          const expired = await inventorystockservices.getExpiredRemain(event.inventoryStock[0].id);
          const reciepdateLast = await inventorystockservices.getreciepdateLast(event.inventoryStock[0].id);
          usableRemain = usable ? usable : 0;
          expiredRemain = expired ? expired : 0;
          reciepdate_last = reciepdateLast?.receiptDate ? reciepdateLast?.receiptDate : 0;
        }
        const imageData = await dataImages(event);
        const imageDataGHS = await dataImagesGHS(event.masterProductGhsMap);
        const countLot = await checkCountLot(event);
        const mapData = {
          ...event,
          imagefile: imageData ? imageData : "",
          imagefileGHS: imageDataGHS ? imageDataGHS : "",
          usableRemain: usableRemain,
          expiredRemain: expiredRemain,
          countlot: countLot,
          reciepdate_last: reciepdate_last,
        };
        return mapData;
      }),
    );
    setdataResult(data);
    setloading(false);
  };

  const getApibrandandvender = async () => {
    const getVender = await inventorystockservices.getVender();
    if (getVender.length > 0) {
      const vender = getVender.map((data: ITypeVender) => ({
        value: data.id,
        label: data.venderName,
      }));
      setVenderOption(vender);
    }

    const getBrand = await inventorystockservices.getBrand();
    if (getVender.length > 0) {
      const brand = getBrand.map((data: ITypeBrand) => ({
        value: data.id,
        label: data.name,
      }));
      setBrandOption(brand);
    }
    setloading(false);
  };

  const dataImages = async (event: ITypeInventory) => {
    if (event.masterProductImages.length > 0) {
      if (event?.masterProductImages.length !== 0) {
        const getImages = await inventorystockservices.getImages(event.masterProductImages[0]?.idfile);
        return getImages;
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

  const dataImagesGHS = async (event: ITypeImagesGHS[]) => {
    if (event.length > 0) {
      const data = await Promise.all(
        event.map(async (r: ITypeImagesGHS, i: number) => {
          if (r?.masterGhsType?.imagesGhs.length !== 0) {
            const getImages = await ghsServices.getImages(r.masterGhsType.imagesGhs[0]?.idfile);
            const mapData = {
              imagefile: getImages,
            };
            return mapData;
          } else {
            return null;
          }
        }),
      );
      return data;
    } else {
      return null;
    }
  };

  const checkCountLot = async (event: ITypeInventory) => {
    if (event.inventoryStock.length === 0) {
      return 0;
    }
  };

  const showModal = (event: string, value: ITypeInventory) => {
    setUnit(value?.unit?.unitName);
    setTotalQty(0);
    setTotalPrice(0);
    setMinStock(String(value?.minimumStock));
    if (value.inventoryStock.length !== 0) {
      setId(String(value?.inventoryStock[0].id));
    } else {
      setId("");
    }
    setheaderModalDetail(event);
    setModalDetail(value);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    formdetaillot.resetFields();
    setSearchLot([]);
  };

  const props: UploadProps = {
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    onChange: async ({ fileList: newFileList }) => {
      return await setFileList(newFileList);
    },
  };
  const showModalAdd = async (event: ITypeInventory) => {
    if (event?.id) {
      const result = await inventorystockservices.getcountInventoryStock(inventoryId, String(event?.id));
      setCount(result);
    }
    setTotalQty(0);
    setTotalPrice(0);
    setHeaderModalAdd({
      passNo: event.casNo,
      masterProductDetails: event.masterProductDetails,
      unitName: event?.unit?.unitName,
      masterProductId: String(event?.id),
      count: event?.countlot,
    });
    setFileList([]);
    addForm.resetFields();
    addForm.setFieldsValue({ data: [undefined] });
    setIsModalOpenAdd(true);
  };

  const handleCancelAdd = () => {
    setIsModalOpenAdd(false);
    addForm.resetFields();
  };

  const columns: ColumnsType<ITypeInventory> = [
    {
      key: "casNo",
      title: "CAS NO.",
      width: "40px",
      dataIndex: "casNo",
      render: (event: string, row: ITypeInventory) => (
        <div className=" text-blue cursor-pointer" onClick={() => showModal(row.casNo, row)}>
          {event}
        </div>
      ),
    },

    {
      title: "IMAGE",
      dataIndex: "masterProductDetails",
      key: "masterProductDetails",
      width: "50px",
      render: (d: { name: string }[], r: ITypeInventory, i: number) => {
        return (
          <>
            <Row gutter={[8, 8]}>
              <Col>
                {r.imagefile ? (
                  <Image src={URL.createObjectURL(r?.imagefile)} width={60} />
                ) : (
                  <Image
                    preview={false}
                    width={60}
                    src="error"
                    fallback="data:image/png;base64,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"
                  />
                )}
              </Col>
            </Row>
          </>
        );
      },
    },
    {
      key: "masterProductDetails",
      title: "PRODUCT NAME",
      dataIndex: "masterProductDetails",
      width: "80px",
      render: (event: { name: string }[], row: ITypeInventory, index: number) => {
        return (
          <Space>
            <div>
              {event.map((d, index) => (
                <React.Fragment key={index}>
                  <Tag color="blue" className=" mb-1">
                    {d.name}
                  </Tag>
                  <br />
                </React.Fragment>
              ))}
            </div>
          </Space>
        );
      },
    },
    {
      key: "group",
      title: "GROUP",
      width: "60px",
      dataIndex: "group",
      render: (event: string, row: ITypeInventory, index: number) => {
        return row?.masterProductGroup?.groupName;
      },
    },
    {
      key: "usableRemain",
      title: "QTY",
      width: "50px",
      dataIndex: "usableRemain",
      align: "right",
      render: (event: string, row: ITypeInventory, index: number) => {
        if (row?.inventoryStock.length <= 0) {
          return (
            <Space>
              {numberWithCommas(event)}
              <Tag color="volcano" key={index + 1}>{`Out of Stock `}</Tag>
            </Space>
          );
        } else {
          return formatQtypattern(Number(event), Number(row.minimumStock));
        }
      },
    },
    {
      key: "expiredRemain",
      title: "QTY(EXP)",
      dataIndex: "expiredRemain",
      width: "50px",
      align: "right",
      render: (event: number, row: ITypeInventory, index: number) => {
        return row?.inventoryStock.length === 0 ? numberWithCommas(0) : <>{numberWithCommas(event)}</>;
      },
    },
    {
      key: "unit",
      title: "UNIT",
      dataIndex: ["unit", "unitName"],
      width: "50px",
    },
    {
      key: "reciepdate_last",
      title: "RECEIPT DATE",
      width: "80px",
      dataIndex: "reciepdate_last",
      render: (event: Date, row: ITypeInventory, index: number) => {
        return event ? dateToStringTh(event) : "-";
      },
    },
    {
      key: "no",
      title: "ACTIVE",
      dataIndex: "no",
      align: "center",
      width: "50px",
      fixed: "right",
      render: (event: string, row: ITypeInventory, index: number) => {
        return (
          <>
            {addStockRule ? (
              <Button type="link" onClick={() => showModalAdd(row)}>
                <Space>
                  <div style={{ justifyContent: "center", alignItems: "center", display: "flex" }}> {IconPluscircle}</div>
                  <div style={{ justifyContent: "center", alignItems: "center", display: "flex", fontWeight: "bold" }}>{`Add Stock`}</div>
                </Space>
              </Button>
            ) : (
              <></>
            )}
          </>
        );
      },
    },
  ];
  const formatQtypattern = (qty: number, minimum: number) => {
    let stringQty = numberWithCommas(qty);
    if (Number(qty) < minimum && Number(qty) > 0) {
      return (
        <>
          <Space>
            {stringQty}
            <Tag color="yellow">{`Low`}</Tag>
          </Space>
        </>
      );
    } else if (Number(qty) <= 0) {
      return (
        <>
          <Space>
            {stringQty}
            <Tag color="volcano">{`Out of Stock `}</Tag>
          </Space>
        </>
      );
    } else {
      return (
        <>
          <Space>{stringQty}</Space>
        </>
      );
    }
  };

  const onFinish = async (event: { data: TFormValue[] }) => {
    let uploadfiles: any = [];
    const data = await event?.data?.map((value: any, index: number) => {
      const uuidc = uuidv4();
      const mapuploads = {
        ...value.uploadfile,
        InventorylotId: uuidc,
      };
      uploadfiles.push(mapuploads);
      let datacreateStock = { ...value, updateName: `${session?.user?.firstNameTh} ${session?.user?.lastNameTh}` };
      if (value.venderId !== undefined) {
        const vender = venderOption.filter((item) => item.value === value.venderId);
        datacreateStock = { ...datacreateStock, venderName: vender[0].label };
      }
      if (value.brandId !== undefined) {
        const brand = brandOption.filter((item) => item.value === value.brandId);
        datacreateStock = { ...datacreateStock, brandName: brand[0].label };
      }
      delete datacreateStock["uploadfile"];
      const mapdata = {
        ...datacreateStock,
        ownerGroup: ownerGroup,
        InventorylotId: uuidc,
      };
      return mapdata;
    });

    if (getcount === 0) {
      const condition = {
        data: {
          updateId: userId,
          updateName: `${session?.user?.firstNameTh} ${session?.user?.lastNameTh}`,
          inventoryId: Number(inventoryId),
          masterProductId: Number(headerModalAdd?.masterProductId),
          inventoryLot: {
            createMany: {
              data,
            },
          },
        },
        inventoryId: inventoryId,
        masterProductId: headerModalAdd?.masterProductId,
        inventoryName: inventoryName,
        uploadfiles: uploadfiles,
        casNo: headerModalAdd?.passNo,
      };

      const res = await inventorystockservices.createStock(condition);
      if (res) {
        const dataexport = await uploadfiles.map(async (value: any, index: number) => {
          if (value?.fileList) {
            const formData: any = new FormData();
            formData.append("images", value?.fileList[0].originFileObj);
            return await inventorystockservices.createFilerecieve(value.InventorylotId, formData);
          }
        });
        if (dataexport) {
          setloading(true);
          addForm.resetFields();
        }
        message.success(`Success`);
        setIsModalOpenAdd(false);
      }
    } else {
      const condition = {
        inventoryId: Number(inventoryId),
        productId: Number(headerModalAdd?.masterProductId),
        data: {
          updateId: userId,
          updateName: `${session?.user?.firstNameTh} ${session?.user?.lastNameTh}`,
          inventoryLot: {
            createMany: {
              data,
            },
          },
        },
        masterProductId: headerModalAdd?.masterProductId,
        inventoryName: inventoryName,
        casNo: headerModalAdd?.passNo,
      };
      const res = await inventorystockservices.updateStock(condition);
      if (res) {
        const dataexport = await uploadfiles?.map(async (value: any, index: number) => {
          if (value?.fileList) {
            const formData: any = new FormData();
            formData.append("images", value?.fileList[0].originFileObj);
            return await inventorystockservices.createFilerecieve(value.InventorylotId, formData);
          }
        });
        if (dataexport) {
          setloading(true);
          addForm.resetFields();
        }
        message.success(`Success`);
        setIsModalOpenAdd(false);
      }
    }
  };
  const handleOpenFilter = (state: boolean) => {
    setOpenFilter(state);
  };
  const downloadFile = async (id: any, name: string) => {
    if (id) {
      const response = await inventorystockservices.downloadfile(id);
      console.log(response);
      const url = URL.createObjectURL(response);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };
  const handleTotal = (_: TFormValue, values: { data: TFormValue[] }) => {
    let totalQty = 0;
    let totalPrice = 0;
    values.data.forEach((value: any, index: number) => {
      if (value) {
        if (value.qty && !isNaN(value.qty)) {
          totalQty = totalQty + value.qty;
        }
        if (value.totalPrice && !isNaN(value.qty)) {
          totalPrice = totalPrice + Number(value.totalPrice);
        }
      }
    });
    setTotalQty(totalQty);
    setTotalPrice(totalPrice);
  };
  const onFilter = (value: filterproductlist) => {
    let search = {};
    if (value.productName) {
      search = { ...search, masterProductDetails: { some: { name: { contains: value.productName } } } };
    }
    if (value.chemicalFormula) {
      search = { ...search, chemicalFormula: { contains: value.chemicalFormula } };
    }
    if (value.casNo) {
      search = { ...search, casNo: { contains: value.casNo } };
    }
    if (value.unitName) {
      search = { ...search, unit: { unitName: { contains: value.unitName } } };
    }
    if (getswitch) {
      getswitch === true ? setSwitch(getswitch) : setSwitch(!getswitch);
    }
    setSearch(search);
    setOpenFilter(false);
    setloading(true);
  };
  const searchContent = (
    <Form onFinish={onFilter} layout="vertical" autoComplete="off">
      <div className="grid grid-cols-1 md:gap-4 md:grid-cols-4">
        <Form.Item label="Product Name" name="productName">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="Chemical Formula" name="chemicalFormula">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="Cas No." name="casNo">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="Unit" name="unitName">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="Minimum" name="minumumStock">
          <Switch
            checkedChildren="Low"
            unCheckedChildren="All"
            defaultChecked={false}
            onChange={setSwitch}
            className={getswitch === true ? "active-switch" : "inactive-switch"}
          />
        </Form.Item>
        <div className=" md:col-span-4">
          <Form.Item style={{ justifyContent: "end", display: "flex", alignItems: "center" }}>
            <Button className=" mr-2">Reset</Button>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
          </Form.Item>
        </div>
      </div>
    </Form>
  );

  return (
    <div>
      {/* modal detail */}
      <Modal title={headermodalDetail} open={isModalOpen} onCancel={handleCancel} footer={false} width={1200}>
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Form layout={"horizontal"} form={detailForm}>
              <Row>
                <Col span={24}>
                  <Form.Item label={<div style={{ color: "#9E9E9E" }}>{`Inventory`}</div>}>
                    <Typography>{`${location}`}</Typography>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label={<div style={{ color: "#9E9E9E" }}>{`Product Image`}</div>}>
                    {modalDetail?.imagefile ? (
                      <Image width={100} height={100} preview={false} src={modalDetail.imagefile ? URL.createObjectURL(modalDetail.imagefile) : ""} />
                    ) : (
                      <Image
                        width={100}
                        height={100}
                        src="error"
                        preview={false}
                        fallback="data:image/png;base64,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"
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label={<div style={{ color: "#9E9E9E" }}>{`Product Name`}</div>}>
                    {modalDetail?.masterProductDetails.map((d: { name: string }, index: number) => (
                      <Tag key={index + 1} color="blue">
                        {d.name}
                      </Tag>
                    ))}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label={<div style={{ color: "#9E9E9E" }}>{`CAS No.`}</div>}>{modalDetail?.casNo}</Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label={<div style={{ color: "#9E9E9E" }}>{`Chemical Formula`}</div>}>{modalDetail?.chemicalFormula}</Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label={<div style={{ color: "#9E9E9E" }}>{`Group`}</div>}>{modalDetail?.masterProductGroup?.groupName}</Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label={<div style={{ color: "#9E9E9E" }}>{`GHS`}</div>}>
                    {modalDetail?.imagefileGHS ? (
                      <div style={{ display: "flex", flexWrap: "wrap" }}>
                        {modalDetail?.imagefileGHS?.map((e: { imagefile?: Blob }, index: number) => {
                          return (
                            <div key={index} className=" m-1">
                              <Image width={30} height={30} preview={false} src={e?.imagefile ? URL.createObjectURL(e.imagefile) : ""} />
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <Image
                        width={100}
                        height={100}
                        src="error"
                        preview={false}
                        fallback="data:image/png;base64,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"
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label={<div style={{ color: "#9E9E9E" }}>{`Category`}</div>}>
                    {modalDetail?.masterProductGroup?.masterProductCategories?.categoryName}
                  </Form.Item>
                </Col>
                {/* <Col span={8}>
                  <Form.Item label={<div style={{ color: "#9E9E9E" }}>{`Brand`}</div>}>{modalDetail?.brandName}</Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label={<div style={{ color: "#9E9E9E" }}>{`Vender`}</div>}>{modalDetail?.venderName}</Form.Item>
                </Col> */}
                <Col span={8}>
                  <Form.Item label={<div style={{ color: "#9E9E9E" }}>{`Type`}</div>}>
                    {modalDetail?.masterProductGroup?.masterProductGroupMapType ? (
                      <div style={{ display: "flex", flexWrap: "wrap" }}>
                        {modalDetail?.masterProductGroup?.masterProductGroupMapType?.map((event: { typeName: string }, index: number) => {
                          return (
                            <div className="m-0.5" key={index}>
                              <Tag>{event?.typeName}</Tag>
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                  </Form.Item>
                </Col>
              </Row>
              <Divider />
              <Row gutter={[8, 8]}>
                <Col span={8}>
                  <Form.Item label={<div style={{ color: "#9E9E9E" }}>{`Unit`}</div>}>{modalDetail?.unit?.unitName}</Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label={<div style={{ color: "#9E9E9E" }}>{`Min Stock`}</div>}>{numberWithCommas(modalDetail?.minimumStock)}</Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label={<div style={{ color: "#9E9E9E" }}>{`Max Stock`}</div>}>{numberWithCommas(modalDetail?.maximumStock)}</Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label={<div style={{ color: "#9E9E9E" }}>{`ผู้อัพเดตล่าสุด`}</div>}>{modalDetail?.updatedByName}</Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label={<div style={{ color: "#9E9E9E" }}>{`ลิงค์ภายนอก`}</div>}>
                    <a href={`${modalDetail?.hyperlink}`} target="_blank">
                      {modalDetail?.hyperlink}
                    </a>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label={<div style={{ color: "#9E9E9E" }}>{`Description`}</div>}>{modalDetail?.description}</Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label={<div style={{ color: "#9E9E9E" }}>{`Attach File`}</div>}>
                    {modalDetail?.masterProductFiles.map((data: any, index: number) => (
                      <div key={index}>
                        <Button type="link" onClick={() => downloadFile(data.id, data.namefile)}>
                          <Space>
                            <PaperClipOutlined />
                            {data.namefile}
                          </Space>
                        </Button>
                      </div>
                    ))}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
          <Col span={24}>
            <Card>
              <Typography style={{ fontWeight: "bold", marginBottom: "10px" }}>
                <Space>
                  <MenuOutlined />
                  {`Lot Lists`}
                </Space>
              </Typography>
              <TableDetailLot
                getId={getId}
                getUnit={getUnit}
                getMinStock={getMinStock}
                formdetaillot={formdetaillot}
                setSearchLot={(e: any) => setSearchLot(e)}
                searchLot={searchLot}
              />
            </Card>
          </Col>
        </Row>
      </Modal>
      {/* modal Add */}
      <Modal
        title={
          <>
            <Space>
              <div style={{ justifyContent: "center", alignItems: "center", display: "flex", fontWeight: "bold" }}> {IconPluscircle}</div>
              <div style={{ justifyContent: "center", alignItems: "center", display: "flex", fontWeight: "bold" }}>{`Add Stock`}</div>
            </Space>
          </>
        }
        open={isModalOpenAdd}
        onCancel={handleCancelAdd}
        footer={false}
        width={1500}
      >
        <Form form={addForm} name="dynamic_form_nest_item" onFinish={onFinish} onValuesChange={handleTotal} autoComplete="off">
          <Card>
            <Row gutter={[2, 2]}>
              <Col span={12}>
                <Space>
                  <span>{headerModalAdd?.passNo}</span>
                  <Tag>
                    <span>{headerModalAdd?.masterProductDetails.map((obj: { name: string }) => obj.name).join(", ")}</span>
                  </Tag>
                </Space>
              </Col>
              <Form.List name="data">
                {(fields, { add, remove }) => (
                  <>
                    <Col span={12} style={{ justifyContent: "right", display: "flex", alignItems: "center" }}>
                      <Space>
                        <Form.Item>
                          <Space>
                            <Button type="primary" onClick={() => add()} block icon={<PlusOutlined />} ghost>
                              {`Add`}
                            </Button>
                          </Space>
                        </Form.Item>
                      </Space>
                    </Col>

                    <Col span={24}>
                      <div className=" grid grid-cols-10 gap-0">
                        {/* <div>{<span style={{ color: "#9E9E9E", fontSize: "14px" }}>{`LOTS NO.`}</span>}</div> */}
                        <div>{<span style={{ color: "#9E9E9E", fontSize: "14px" }}>{`RECEIPT DATE`}</span>}</div>
                        <div>{<span style={{ color: "#9E9E9E", fontSize: "14px" }}>{`DETAIL`}</span>}</div>
                        <div>{<span style={{ color: "#9E9E9E", fontSize: "14px" }}>{`BRAND`}</span>}</div>
                        <div>{<span style={{ color: "#9E9E9E", fontSize: "14px" }}>{`VENDER`}</span>}</div>
                        <div>{<span style={{ color: "#9E9E9E", fontSize: "14px" }}>{`QTY`}</span>}</div>
                        <div style={{ textAlign: "center", fontSize: "14px" }}>
                          {<span style={{ color: "#9E9E9E", fontSize: "14px" }}>{`UNIT`}</span>}
                        </div>
                        <div>{<span style={{ color: "#9E9E9E", fontSize: "14px" }}>{`PRODUCTION DATE`}</span>}</div>
                        <div>{<span style={{ color: "#9E9E9E", fontSize: "14px" }}>{`EXPIRY DATE`}</span>}</div>
                        <div>{<span style={{ color: "#9E9E9E", fontSize: "14px" }}>{`TOTAL`}</span>}</div>
                        <div></div>
                      </div>
                    </Col>
                    <Divider style={{ marginTop: "0px", marginBottom: "2px" }}></Divider>
                    <Col span={24}>
                      <>
                        {fields?.map(({ key, name, ...restField }) => {
                          return (
                            <div key={name + 1}>
                              <div className=" grid  md:grid-cols-10  gap-1">
                                <div>
                                  <Form.Item
                                    {...restField}
                                    name={[name, "receiptDate"]}
                                    rules={[{ required: true, message: "please select receipt date" }]}
                                  >
                                    <DatePicker style={{ width: "100%" }} />
                                  </Form.Item>
                                </div>
                                <div>
                                  <Form.Item {...restField} name={[name, "detail"]} rules={[{ required: true, message: "please input detail" }]}>
                                    <Input placeholder="Detail" style={{ width: "100%", color: "#9E9E9E", fontSize: "14px" }} />
                                  </Form.Item>
                                </div>
                                <div>
                                  <Form.Item {...restField} name={[name, "brandId"]} rules={[{ required: true, message: "please select brand" }]}>
                                    <Select placeholder="Brand" style={{ width: "100%", color: "#9E9E9E", fontSize: "14px" }} options={brandOption} />
                                  </Form.Item>
                                </div>
                                <div>
                                  <Form.Item {...restField} name={[name, "venderId"]} rules={[{ required: true, message: "please select vender" }]}>
                                    <Select
                                      placeholder="Vender"
                                      style={{ width: "100%", color: "#9E9E9E", fontSize: "14px" }}
                                      options={venderOption}
                                    />
                                  </Form.Item>
                                </div>

                                <div>
                                  <Form.Item {...restField} name={[name, "qty"]} rules={[{ required: true, message: "please input qty" }]}>
                                    <InputNumber type="number" min={0} placeholder="QTY" style={{ width: "100%", color: "red", fontSize: "14px" }} />
                                  </Form.Item>
                                </div>
                                <div style={{ textAlign: "center" }}>
                                  <Typography style={{ color: "#9E9E9E" }}>{headerModalAdd.unitName}</Typography>
                                </div>
                                <div>
                                  <Form.Item
                                    {...restField}
                                    name={[name, "productionDate"]}
                                    rules={[{ required: true, message: "please select production date" }]}
                                  >
                                    <DatePicker style={{ width: "100%", fontSize: "14px" }} />
                                  </Form.Item>
                                </div>
                                <div>
                                  <Form.Item
                                    {...restField}
                                    name={[name, "expiryDate"]}
                                    rules={[{ required: true, message: "please select expiry date" }]}
                                  >
                                    <DatePicker style={{ width: "100%" }} />
                                  </Form.Item>
                                </div>
                                <div>
                                  <Form.Item
                                    {...restField}
                                    name={[name, "totalPrice"]}
                                    style={{ color: "#9E9E9E" }}
                                    rules={[{ required: true, message: "please input total price" }]}
                                  >
                                    <InputNumber min={0} placeholder="total" type="number" style={{ width: "100%", fontSize: "14px" }} />
                                  </Form.Item>
                                </div>
                                <div>
                                  <Row gutter={[8, 8]}>
                                    <Col span={8} style={{ textAlign: "center", paddingTop: "3px" }}>
                                      <Typography>{`THB`}</Typography>
                                    </Col>
                                    <Col span={10} style={{ width: "100px", justifyContent: "center", display: "flex", alignItems: "center" }}>
                                      <Form.Item {...restField} name={[name, "uploadfile"]} style={{ color: "#9E9E9E" }}>
                                        <Upload {...props} showUploadList={false} className=" flex ">
                                          <Tooltip
                                            placement="top"
                                            title={
                                              addForm.getFieldValue(["data", name, "uploadfile"])
                                                ? addForm.getFieldValue(["data", name, "uploadfile", "file", "name"])
                                                : undefined
                                            }
                                          >
                                            <Button
                                              icon={addForm.getFieldValue(["data", name, "uploadfile"]) ? successIcon : undefined}
                                              type="link"
                                              style={{ justifyContent: "center", display: "flex" }}
                                            >{`  Upload`}</Button>
                                          </Tooltip>
                                        </Upload>
                                      </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                      <Button type="link" onClick={() => remove(name)} danger>
                                        {deleteIcon}
                                      </Button>
                                    </Col>
                                  </Row>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </>

                      <div>
                        <Row gutter={[4, 4]} className=" bg-slate-200">
                          <Col span={8}>Total</Col>
                          <Col span={3} className=" text-right">
                            {numberWithCommas(totalQty)}
                          </Col>
                          <Col span={2} style={{ textAlign: "left", paddingLeft: "15px" }}>
                            <Typography>{headerModalAdd.unitName}</Typography>
                          </Col>
                          <Col span={7} className=" text-right">
                            {numberWithCommas(totalPrice)}
                          </Col>
                          <Col span={2}>
                            <Space>
                              <Typography>{`THB`}</Typography>
                            </Space>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </>
                )}
              </Form.List>
            </Row>
          </Card>
          <Row gutter={[8, 8]} style={{ marginTop: "10px", justifyContent: "right", display: "flex", alignItems: "center" }}>
            <Col>
              <Form.Item>
                <Button type="primary" ghost onClick={() => handleCancelAdd()}>{`Cancel `}</Button>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>
                <Button htmlType="submit" type="primary" loading={buttonLoading}>{`Add Product`}</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      {/* Table */}

      <Row gutter={[8, 8]}>
        <Col>
          <Popover
            onOpenChange={handleOpenFilter}
            open={openFilter}
            content={searchContent}
            placement="bottomLeft"
            title="Search"
            trigger="click"
            overlayStyle={{ width: "calc(100% - 240px)" }}
          >
            <Button type="primary" icon={<FilterOutlined />}>
              Filters
            </Button>
          </Popover>
        </Col>
        <Card>
          <Table columns={columns} size="small" dataSource={getdataResult} scroll={{ x: "calc(800px + 50%)" }} rowKey={(e: ITypeInventory) => e.id} />
        </Card>
      </Row>
    </div>
  );
};
