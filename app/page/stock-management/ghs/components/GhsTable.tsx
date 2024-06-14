"use client";
import React, { useEffect, useState } from "react";
import { Button, Card, Table, Tag, Image, DatePicker, Form, UploadProps, message, Modal, Row, Input, Col, Switch, Space, Spin } from "antd";
import { deleteIcon, editIcon } from "@/components/icon";
import { RcFile, UploadFile } from "antd/es/upload";
import { useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import GhsServices from "../services/ghs.service";
import { InfoCircleOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import Upload from "antd/lib/upload";
// import ImgCrop from "antd-img-crop";
import { typeGHS, typeImagetoEdit } from "../common";
import type { TableColumnsType } from "antd";
import { checkRule } from "@/app/utils/rules";
import { dateToStringTh } from "@/app/utils/format";

export interface props {
  propLoading: (loading: boolean) => void;
  loading: boolean;
  dataTable: typeGHS[];
  paginationConfig: number;
  filter: { current: number; pageSize: number; skip: number };
  handlerPaginationTable: (e: any) => void;
  setPagination: any;
}
const GhsTable: React.FC<props> = ({
  loading,
  dataTable,
  propLoading,
  paginationConfig,
  handlerPaginationTable,
  filter,
  setPagination,
}): React.ReactElement => {
  const stockAuth = useAxiosStock();
  const editRule = checkRule("sm-ghs-e");
  const deleteRule = checkRule("sm-ghs-d");
  const ghsServices = GhsServices(stockAuth);
  const [form] = Form.useForm();
  const [switchChecked, setSwitchChecked] = useState<boolean>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [getImage, setImage] = useState<any>();
  const [buttonLoading, setbuttonLoading] = useState<boolean>(false);
  const [getGhsnumber, setGhsnumber] = useState<typeImagetoEdit>({
    id: 0,
    ghsId: "",
    nameGhs: "",
    status: false,
    detail: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    imagesGhs: [],
    imagefile: undefined,
  });
  const [isModalOpenEdit, setIsModalOpenEdit] = useState<boolean>(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState<boolean>(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  useEffect(() => {}, [switchChecked, getImage, fileList, getGhsnumber]);
  const handleChangePic: UploadProps["onChange"] = async ({ fileList: newFileList }) => {
    return await setFileList(newFileList);
  };
  const handleChange = (checked: boolean) => {
    setSwitchChecked(checked);
  };
  const showModaledit = (event: typeImagetoEdit) => {
    if (event) {
      setImage(event?.imagefile as any);
      setSwitchChecked(event.status);
      form.setFieldValue("id", event.id);
      form.setFieldValue("nameGhs", event.nameGhs);
      form.setFieldValue("status", event.status);
      form.setFieldValue("detail", event.detail);
      form.setFieldValue("ghsId", event.ghsId);
    }
    setIsModalOpenEdit(true);
  };
  const handleOkedit = () => {
    setIsModalOpenEdit(false);
  };
  const handleCanceledit = () => {
    form.resetFields();
    setFileList([]);
    setIsModalOpenEdit(false);
  };
  const showModaldelete = (event: typeImagetoEdit) => {
    setGhsnumber(event);
    setIsModalOpenDelete(true);
  };
  const handleCanceldelete = () => {
    setIsModalOpenDelete(false);
    setbuttonLoading(false);
  };
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>{`Upload`}</div>
    </div>
  );

  const beforeUpload = (file: RcFile) => {
    const isLt2M = file.size / 1024 / 1024 < 20;
    if (!isLt2M) {
      message.error("Image must smaller than 20MB!");
      return Upload.LIST_IGNORE;
    } else {
      return false;
    }
  };

  const columns: TableColumnsType<typeGHS> = [
    {
      title: "NO.",
      dataIndex: "id",
      key: "id",
      render: (event: string, row: typeImagetoEdit, index: number) => {
        let skip = (filter.current - 1) * filter.pageSize;
        return index + skip + 1;
      },
    },
    {
      title: "ICON",
      dataIndex: "iconImage",
      key: "iconImage",
      render: (event: string, row: typeImagetoEdit, index: number) => {
        return (
          <>
            <Image src={row?.imagefile ? URL.createObjectURL(row?.imagefile) : ""} width={40} />
          </>
        );
      },
    },
    {
      title: "GHS NAME",
      dataIndex: "nameGhs",
      key: "nameGhs",
    },
    {
      title: "DETAILS",
      dataIndex: "detail",
      key: "detail",
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (event: boolean, row: typeImagetoEdit, index: number) =>
        event === true ? <Tag color="green">{`Active`}</Tag> : <Tag color="volcano">{`Inactive`}</Tag>,
    },
    {
      title: "CREATED",
      dataIndex: "createdAt",
      width: "18%",
      key: "createdAt",
      render: (event: Date, row: typeImagetoEdit, index: number) => {
        return `${dateToStringTh(event)} น.`;
      },
    },
    {
      title: "ACTIVE",
      dataIndex: "ghsId",
      key: "ghsId",
      width: "15%",
      align: "center",
      render: (text: string, record: typeImagetoEdit, index: number) => (
        <div className="space-x-2">
          {editRule ? (
            <Button type="link" onClick={() => showModaledit(record)}>
              {editIcon}
            </Button>
          ) : (
            <></>
          )}
          {deleteRule ? (
            <Button type="link" onClick={() => showModaldelete(record)} danger disabled={buttonLoading}>
              {deleteIcon}
            </Button>
          ) : (
            <></>
          )}
        </div>
      ),
    },
  ];

  const finishEdit = async (values: typeGHS) => {
    setbuttonLoading(true);
    const dataUpdate = {
      id: values.id,
      data: {
        nameGhs: values.nameGhs,
        detail: values.detail,
        status: switchChecked,
        updatedAt: new Date().toISOString(),
      },
    };
    const dataupdateRes = await ghsServices.updateMasterGhs(dataUpdate);
    if (dataupdateRes) {
      if (fileList.length >= 1) {
        const formData: any = new FormData();
        formData.append("images", fileList[0].originFileObj);
        const dataDeleteImage = await ghsServices.deleteImageGhs(values.ghsId);
        if (dataDeleteImage) {
          await ghsServices
            .uploadNewImages(values.ghsId, formData)
            .then((data) => {
              message.success(`Edit success`);
              propLoading(true);
              setIsModalOpenEdit(false);
            })
            .catch((err) => {
              message.error(`do not upload icon`);
              propLoading(true);
              setIsModalOpenEdit(false);
            });
        }
      } else {
        message.success(`Edit success`);
        propLoading(true);
        setIsModalOpenEdit(false);
      }
    }
    setbuttonLoading(false);
  };

  const finishDelete = async () => {
    setbuttonLoading(true);
    const deleteData = await ghsServices.remove(getGhsnumber?.id, getGhsnumber?.ghsId);
    if (deleteData) {
      setPagination({
        current: 1,
        pageSize: 10,
        skip: 0,
      });
      message.success(`Delete success`);
      propLoading(true);
      setIsModalOpenDelete(false);
      setbuttonLoading(false);
    }
    propLoading(true);
  };

  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.thumbUrl || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.thumbUrl!.substring(file.url!.lastIndexOf("/") + 1));
  };

  return loading === true ? (
    <Spin></Spin>
  ) : (
    <div className=" grid grid-cols-1 gap-y-2">
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
        <img style={{ width: "100%" }} src={previewImage} />
      </Modal>
      <div>
        <Card>
          <div className=" col-span-1 space-y-5">
            <div className=" overflow-auto md:overflow-hidden">
              <Table
                loading={loading}
                columns={columns}
                dataSource={dataTable}
                rowKey={(e: typeGHS) => e.id}
                pagination={{ total: paginationConfig, current: filter?.current, showSizeChanger: false }}
                onChange={handlerPaginationTable}
              />
            </div>
          </div>
        </Card>
      </div>
      <Modal title="Edit GHS" open={isModalOpenEdit} onOk={handleOkedit} onCancel={handleCanceledit} footer={false}>
        <Form layout="vertical" form={form} onFinish={finishEdit}>
          <Form.Item className=" mb-0" name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item className=" mb-0" name="ghsId" hidden>
            <Input />
          </Form.Item>
          <Row gutter={[8, 8]}>
            <Col span={24}>
              <Form.Item className=" mb-0" name={"imagefile"} label={`Icon :`}>
                <Row gutter={[8, 8]}>
                  <Space>
                    {fileList.length > 0 ? null : (
                      <Col>
                        <Image src={getImage ? URL.createObjectURL(getImage) : ""} width={100} />
                      </Col>
                    )}
                    <Col>
                      <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChangePic}
                        beforeUpload={beforeUpload}
                        onRemove={() => setFileList([])}
                        accept=".jpg,.png,.gif"
                        multiple={false}
                        maxCount={1}
                      >
                        {fileList.length > 1 || getImage > 1 ? null : uploadButton}
                      </Upload>
                    </Col>
                    <Col style={{ justifyContent: "start", display: "flex" }}>
                      <Row style={{ textAlign: "center", alignItems: "center", display: "flex" }}>
                        {fileList.length >= 0 || getImage ? (
                          <></>
                        ) : (
                          <>
                            <Col span={24}>{`Drag image here`}</Col>
                            <Col span={24}>{`or`}</Col>
                          </>
                        )}

                        <Col span={24}>
                          <Upload fileList={fileList} onChange={handleChangePic} beforeUpload={beforeUpload} maxCount={1} accept=".jpg,.png,.gif">
                            {fileList.length >= 0 || getImage ? (
                              <></>
                            ) : (
                              <Button type="link" icon={<UploadOutlined />}>
                                Browse image
                              </Button>
                            )}
                          </Upload>
                        </Col>
                      </Row>
                    </Col>
                  </Space>
                </Row>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item className=" mb-0" label="GHS Name :" name="nameGhs" rules={[{ required: true, message: "Please enter GHS name" }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item className=" mb-0" name={"status"} label={`Status :`}>
                <Switch
                  checkedChildren="Active"
                  unCheckedChildren="Inactive"
                  defaultChecked
                  checked={switchChecked}
                  onChange={(e: boolean) => handleChange(e)}
                  className={switchChecked === true ? "active-switch" : "inactive-switch"}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="detail" label="Detail :" rules={[{ required: true, message: "Please enter detail" }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <div className=" flex justify-end space-x-4">
              <Button onClick={handleCanceledit}>Cancel</Button>
              <Button className="button-blue" loading={buttonLoading} type="primary" htmlType="submit">
                Save Change
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={
          <>
            <Space>
              <InfoCircleOutlined style={{ color: "orange", fontSize: "18px" }} />
              {"Delete this GHS"}
            </Space>
          </>
        }
        open={isModalOpenDelete}
        onCancel={handleCanceldelete}
        footer={false}
      >
        <div className=" col-span-1">
          <div>{`Are you sure you want to delete this ?`}</div>
          <div className=" flex justify-end space-x-4">
            <Button onClick={handleCanceldelete}>Cancel</Button>
            <Button type="primary" loading={buttonLoading} onClick={finishDelete} danger>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default GhsTable;
