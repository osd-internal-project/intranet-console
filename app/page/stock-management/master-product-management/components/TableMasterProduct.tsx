import { ExclamationCircleFilled, FilterOutlined, MenuOutlined, PaperClipOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Card, Popover, Table, Image, Tag, Form, Input, Modal, message, Col, Divider, Row, Space, Typography } from "antd";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import MasterProductServices from "../services/master-product.service";
import { useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ColumnsType } from "antd/lib/table";
import { ITypeMasterProduct } from "../common";
import { dateToStringTh, numberWithCommas } from "@/app/utils/format";
import { deleteIcon, editIcon } from "@/components/icon";
import { typeImagesGHS } from "@/app/page/product-list/common";
import GhsServices from "../../../stock-management/ghs/services/ghs.service";
import { checkRule } from "@/app/utils/rules";

const TableMasterProduct: React.FC = () => {
  const stockAuth = useAxiosStock();
  const addRule = checkRule("m-product-add");
  const editRule = checkRule("m-product-edit");
  const deleteRule = checkRule("m-product-delete");
  const masterProductService = MasterProductServices(stockAuth);
  const ghsServices = GhsServices(stockAuth);
  const [dataTable, setDataTable] = useState<ITypeMasterProduct[]>([]);
  const [search, setSearch] = useState<object>({});
  const [loading, setLoading] = useState(true);
  const [openFilter, setOpenFilter] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [detail, setDetail] = useState<ITypeMasterProduct>();
  const [currentPage, setCurrentPage] = useState(1);
  const [buttonLoading, setbuttonLoading] = useState<boolean>(false);
  useEffect(() => {
    if (loading === true) loadData();
  }, [loading]);

  const loadData = async () => {
    const data = await masterProductService.getMasterProducts(search);
    if (data.length > 0) {
      const tranfers: ITypeMasterProduct[] = await Promise.all(
        data.map(async (event: ITypeMasterProduct) => {
          const images = await dataImages(event?.masterProductImages);
          const imagesGHS = await await dataImagesGHS(event?.masterProductGhsMap as any);
          const mapData = {
            ...event,
            images: images,
            imagesGhs: imagesGHS,
          };
          return mapData;
        })
      );
      setDataTable(tranfers);
    }
    setLoading(false);
  };

  const dataImages = async (
    e: {
      idfile?: string;
    }[]
  ) => {
    if (e?.length >= 1) {
      const getImages = await masterProductService.getImages(e[0]?.idfile);
      return getImages;
    } else {
      return null;
    }
  };

  const dataImagesGHS = async (event: typeImagesGHS[]) => {
    if (event.length > 0) {
      const data = await Promise.all(
        event?.map(async (r: typeImagesGHS, i: number) => {
          if (r?.masterGhsType?.imagesGhs.length !== 0) {
            const getImages = await ghsServices.getImages(r.masterGhsType.imagesGhs[0]?.idfile);
            const mapData = {
              imagefile: getImages,
            };
            return mapData;
          }
        })
      );
      return data;
    } else {
      return null;
    }
  };

  const onOpenDetail = (row: ITypeMasterProduct) => {
    setDetail(row);
    setOpenModal(true);
  };

  const columns: ColumnsType<ITypeMasterProduct> = [
    {
      title: "CAS NO.",
      width: "150px",
      dataIndex: "casNo",
      key: "id",
      render: (d: string, r: ITypeMasterProduct, i: number) => (
        <Space>
          <a onClick={() => onOpenDetail(r)}>
            <div className="text-blue">{d}</div>
          </a>
        </Space>
      ),
    },
    {
      title: "IMAGE",
      dataIndex: "masterProductDetails",
      key: "id",
      render: (d: { name: string }[], r: ITypeMasterProduct, i: number) => (
        <Space>
          {r.images ? (
            <Image src={URL.createObjectURL(r.images)} width={50} />
          ) : (
            <Image
              width={50}
              height={50}
              src="error"
              fallback="data:image/png;base64,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"
            />
          )}
        </Space>
      ),
    },
    {
      title: "PRODUCT NAME",
      dataIndex: "masterProductDetails",
      key: "masterProductDetails",
      // width: "200px",
      render: (d: { name: string }[], r: ITypeMasterProduct, i: number) => (
        <>
          {d?.map((text, index: number) => (
            <React.Fragment key={index}>
              <Tag color="blue" className=" mb-1">
                {text.name}
              </Tag>
              <br />
            </React.Fragment>
          ))}
        </>
      ),
    },
    { title: "DESCRIPTION", dataIndex: "description", key: "description" },
    { title: "CHEMICAL FORMULA", dataIndex: "chemicalFormula", key: "chemicalFormula" },

    { title: "GROUP", dataIndex: ["masterProductGroup", "groupName"], key: "masterProductGroup" },
    { title: "BRAND", dataIndex: "brandName", key: "brandName" },
    { title: "VENDER", dataIndex: "venderName", key: "venderName" },
    { title: "CATEGORY", dataIndex: ["masterProductGroup", "masterProductCategories", "categoryName"], key: "categoryName" },
    {
      title: "GHS",
      dataIndex: "masterProductGhsMap",
      key: "masterProductGhsMap",

      render: (data: string, row: ITypeMasterProduct, index: number) => (
        <div style={{ display: "flex", flexWrap: "wrap" }} className=" space-x-1">
          {row.imagesGhs?.map((value: { imagefile: Blob }, num: number) => {
            return (
              <div key={num}>
                <Image width={25} height={25} preview={false} src={value?.imagefile ? URL.createObjectURL(value?.imagefile) : ""} />
              </div>
            );
          })}
        </div>
      ),
    },
    { title: "UNIT", dataIndex: ["unit", "unitName"], key: "unit" },
    { title: "DATE OF RECEIPT", dataIndex: "createdAt", key: "createdAt", width: "10%", render: (d: Date) => (d ? dateToStringTh(d) : "-") },
    {
      title: "NOTI EXPIRY",
      dataIndex: "notiExpiry",
      key: "notiExpiry",
      render: (d: boolean, r: ITypeMasterProduct) =>
        r.notiExpiry ? (
          <>
            <Tag color="green">ON</Tag> {r.beforeExpiry}
          </>
        ) : (
          <Tag color="volcano">OFF</Tag>
        ),
    },
    {
      title: "ACTIVE",
      dataIndex: "id",
      key: "id",
      fixed: "right",
      align: "center",
      // width: 200,
      render: (d: number, r: ITypeMasterProduct) => (
        <div className="space-x-2">
          {editRule ? (
            <Link href={`/page/setting/master-product-management/${r.id}`}>
              <Button className="p-0" type="link" key={`group-edit-${d}`}>
                {editIcon}
              </Button>
            </Link>
          ) : (
            <></>
          )}
          {deleteRule ? (
            <Button
              className="p-0"
              key={`group-delete-${d}`}
              type="link"
              danger
              onClick={() => {
                onfinishDel(d);
              }}
              disabled={buttonLoading}
            >
              {deleteIcon}
            </Button>
          ) : (
            <></>
          )}
        </div>
      ),
    },
  ];
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const onfinishDel = (event: number) => {
    setbuttonLoading(true);
    Modal.confirm({
      title: "Delete this master product",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to delete this ?",
      okText: "Confirm",
      okButtonProps: { type: "primary", danger: true },
      cancelText: "Cancel",
      onOk: async () => {
        const dataResult = await masterProductService.remove(event);
        if (dataResult) {
          message.success(`Delete success`);
          setLoading(true);
          setbuttonLoading(false);
        }
      },
      onCancel() {
        setbuttonLoading(false);
      },
    });
  };
  const onFilter = async (value: { productCode: string; productName: string; chemicalFormula: string; casNo: string }) => {
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

    setSearch(search);
    setLoading(true);
    setOpenFilter(false);
  };
  const handleOpenFilter = (state: boolean) => {
    setOpenFilter(state);
  };

  const searchContent = (
    <Form layout="vertical" onFinish={onFilter} autoComplete="off">
      <div className="grid grid-cols-1 md:gap-4 md:grid-cols-4">
        <Form.Item className=" mb-0" label="Product Name" name="productName">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item className=" mb-0" label="Chemical Formula" name="chemicalFormula">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item className=" mb-0" label="Cas No." name="casNo">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item className=" mb-0  md:col-span-4 text-right">
          <Button type="primary" htmlType="submit">
            Search
          </Button>
        </Form.Item>
      </div>
    </Form>
  );

  const downloadFile = async (id: any, name: string) => {
    if (id) {
      const response = await masterProductService.downloadfile(id);
      const url = URL.createObjectURL(response);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-y-2">
        <div className=" col-span-4  flex justify-between">
          <div>
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
          </div>
          <div className=" space-x-2">
            {/* <RangePicker
                  format={dateFormat}
                  onChange={(val: any) => {
                    setDateRange(val);
                    propLoading(true, searchText);
                  }}
                /> */}
            {addRule ? (
              <Link href="/page/setting/master-product-management/add">
                <Button icon={<PlusCircleOutlined />} type="primary">
                  Add Master Product
                </Button>
              </Link>
            ) : (
              <></>
            )}
          </div>
        </div>
        <Card className="col-span-4 md:col-span-4">
          <Table
            scroll={{ x: "calc(800px + 90%)" }}
            pagination={{ onChange: handlePageChange, showSizeChanger: false }}
            size="small"
            rowKey={(e: ITypeMasterProduct) => e.id}
            loading={loading}
            columns={columns}
            dataSource={dataTable}
          />
        </Card>
      </div>
      <div>
        {openModal ? (
          <Modal title={<div className=" text-2xl">{"DETAIL"}</div>} open={openModal} onCancel={() => setOpenModal(false)} footer={false} width={1500}>
            <Row gutter={[8, 8]}>
              <Col span={24}>
                <Form
                  layout={"horizontal"}
                  labelAlign="left"
                  labelWrap
                  // wrapperCol={{ flex: 1 }}
                  labelCol={{ flex: "200px" }}
                  colon={false}
                >
                  <Row>
                    <Col span={24}>
                      <Form.Item className="mb-2" label={<div style={{ color: "#9E9E9E" }}>{`Product Image :`}</div>}>
                        {detail?.images ? (
                          <Image width={100} height={100} preview={false} src={detail.images ? URL.createObjectURL(detail.images) : ""} />
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
                      <Form.Item className="mb-2" label={<div style={{ color: "#9E9E9E" }}>{`Product Name :`}</div>}>
                        {detail?.masterProductDetails.map((d: { name: string }, index: number) => (
                          <div key={index + 1}>
                            <Tag color="blue" className=" text-sm" key={index + 1}>
                              {d.name}
                            </Tag>
                          </div>
                        ))}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item className="mb-2" label={<div style={{ color: "#9E9E9E" }}>{`CAS No. :`}</div>}>
                        {detail?.casNo}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item className="mb-2" label={<div style={{ color: "#9E9E9E" }}>{`Chemical Formula :`}</div>}>
                        {detail?.chemicalFormula}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item className="mb-2" label={<div style={{ color: "#9E9E9E" }}>{`Category :`}</div>}>
                        {detail?.masterProductGroup?.masterProductCategories?.categoryName}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item className="mb-2" label={<div style={{ color: "#9E9E9E" }}>{`Group :`}</div>}>
                        {detail?.masterProductGroup?.groupName}
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item className="mb-2" label={<div style={{ color: "#9E9E9E" }}>{`Hazard Type :`}</div>}>
                        {detail?.masterProductHazardtypeMap?.map((d) => (
                          <Tag>{d.masterHazardtype.nameHazard}</Tag>
                        ))}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item className="mb-2" label={<div style={{ color: "#9E9E9E" }}>{`GHS :`}</div>}>
                        {detail?.imagesGhs ? (
                          <div style={{ display: "flex", flexWrap: "wrap" }}>
                            {detail?.imagesGhs?.map((e: { imagefile: Blob }, index: number) => {
                              return (
                                <div key={index} className=" m-1">
                                  <Image
                                    width={35}
                                    height={35}
                                    preview={false}
                                    src={e?.imagefile !== undefined ? URL?.createObjectURL(e?.imagefile) : ""}
                                    fallback="data:image/png;base64,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"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <Image
                            width={25}
                            height={25}
                            src="error"
                            preview={false}
                            fallback="data:image/png;base64,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"
                          />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item className="mb-2" label={<div style={{ color: "#9E9E9E" }}>{`Brand :`}</div>}>
                        {detail?.brandName}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item className="mb-2" label={<div style={{ color: "#9E9E9E" }}>{`Vender :`}</div>}>
                        {detail?.venderName}
                      </Form.Item>
                    </Col>
                    {/* <Col span={8}>
                      <Form.Item className="mb-2" label={<div style={{ color: "#9E9E9E" }}>{`Type :`}</div>}>
                        {detail?.masterProductGroup?.masterProductGroupMapType ? (
                          <div style={{ display: "flex", flexWrap: "wrap" }}>
                            {detail?.masterProductGroup?.masterProductGroupMapType?.map((event: { typeName: string }, index: number) => {
                              return (
                                <div className="m-0.5" key={index}>
                                  <Tag>{event?.typeName}</Tag>
                                </div>
                              );
                            })}
                          </div>
                        ) : null}
                      </Form.Item>
                    </Col> */}
                  </Row>
                  <div style={{ marginBottom: "-10px", marginTop: "-20px" }}>
                    <Divider />
                  </div>
                  <Row gutter={[8, 8]}>
                    <Col span={8}>
                      <Form.Item className="mb-2" label={<div style={{ color: "#9E9E9E" }}>{`Unit :`}</div>}>
                        {detail?.unit?.unitName}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item className="mb-2" label={<div style={{ color: "#9E9E9E" }}>{`Min Stock :`}</div>}>
                        {numberWithCommas(detail?.minimumStock)}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item className="mb-2" label={<div style={{ color: "#9E9E9E" }}>{`Max Stock :`}</div>}>
                        {numberWithCommas(detail?.maximumStock)}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item className="mb-2" label={<div style={{ color: "#9E9E9E" }}>{`ผู้อัพเดตล่าสุด :`}</div>}>
                        {detail?.updatedByName}
                      </Form.Item>
                    </Col>
                    <Col span={16}>
                      <Form.Item className="mb-2" label={<div style={{ color: "#9E9E9E" }}>{`ลิงค์ภายนอก :`}</div>}>
                        <a href={`${detail?.hyperlink}`} target="_blank">
                          {detail?.hyperlink}
                        </a>
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item className="mb-2" label={<div style={{ color: "#9E9E9E" }}>{`Description :`}</div>}>
                        {detail?.description}
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item className="mb-2" label={<div style={{ color: "#9E9E9E" }}>{`Attach File :`}</div>}>
                        {detail?.masterProductFiles.map((data: any, index: number) => (
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
            </Row>
          </Modal>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default TableMasterProduct;
