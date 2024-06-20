"use client";
import { useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ExclamationCircleFilled, FilterOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row, Switch, Upload, message, UploadProps, DatePicker, Popover, Space } from "antd";
// import ImgCrop from "antd-img-crop";
// import Search from "antd/es/input/Search";
import { RcFile, UploadFile } from "antd/es/upload";
import React, { useEffect, useState } from "react";
import GhsServices from "../services/ghs.service";
import { typeGHS } from "../common";
import { checkRule } from "@/app/utils/rules";

export interface props {
  propLoading: (value: boolean) => void;
  loading: boolean;
  handleOpenFilter: (event: boolean) => void;
  openFilter: boolean;
  onFilter: (value: typeGHS) => void;
}

export const CreateGhs: React.FC<props> = ({ propLoading, loading, handleOpenFilter, openFilter, onFilter }) => {
  const stockAuth = useAxiosStock();
  const addRule = checkRule("sm-ghs-a");
  const ghsServices = GhsServices(stockAuth);
  const { RangePicker } = DatePicker;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [switchChecked, setSwitchChecked] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [buttonLoading, setbuttonLoading] = useState<boolean>(false);
  const [buttonAdd, setbuttonAdd] = useState<boolean>(false);

  const [form] = Form.useForm();
  useEffect(() => {}, [switchChecked, fileList]);

  const showModal = () => {
    setbuttonLoading(true);
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setbuttonLoading(false);
    setIsModalOpen(false);
    setFileList([]);
    form.resetFields();
  };

  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.thumbUrl || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.thumbUrl!.substring(file.url!.lastIndexOf("/") + 1));
  };

  const handleChangePic: UploadProps["onChange"] = async ({ fileList: newFileList }) => {
    return await setFileList(newFileList);
  };

  const handleChange = (checked: boolean) => {
    setSwitchChecked(checked);
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

  const finishAdd = async (values: typeGHS) => {
    setbuttonAdd(true);
    if (fileList.length === 0) {
      message.warning("Upload icon before confirm");
      return false;
    }
    setbuttonLoading(true);
    const condition = {
      detail: values.detail,
      nameGhs: values.nameGhs,
      status: switchChecked,
    };
    Modal.confirm({
      title: "Add GHS ",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to add this ?",
      okText: "Confirm",
      okButtonProps: {
        style: {
          backgroundColor: "#00a1df",
          borderColor: "#00a1df",
        },
      },
      cancelText: "Cancel",
      onOk: async () => {
        const result: typeGHS = await ghsServices.addMasterGhs(condition);
        if (result) {
          if (fileList.length >= 1) {
            const formData: any = new FormData();
            formData.append("images", fileList[0].originFileObj);
            await ghsServices
              .uploadNewImages(result.ghsId, formData)
              .then((data) => {
                message.success(`Add success`);
              })
              .catch((err) => {
                message.error(`do not add icon`);
              });
          } else {
            message.success(`Add success`);
          }
        }
        propLoading(true);
        setIsModalOpen(false);
        form.resetFields();
        setFileList([]);
        setSwitchChecked(false);
        setbuttonLoading(false);
        setbuttonAdd(false);
      },
      onCancel() {
        propLoading(false);
        setbuttonLoading(false);
        setbuttonAdd(false);
      },
    });
  };

  const searchContent = (
    <Form layout="vertical" onFinish={onFilter} autoComplete="off">
      <div className="grid grid-cols-1 md:gap-4 md:grid-cols-4">
        <Form.Item label="GHS Name" name="nameGhs">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="Created" name="createdAt">
          <RangePicker className=" w-full" />
        </Form.Item>
        <Form.Item style={{ marginTop: "30px" }}>
          <Button type="primary" htmlType="submit" className="button-blue">
            Search
          </Button>
        </Form.Item>
      </div>
    </Form>
  );

  return (
    <>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
        <img style={{ width: "100%" }} src={previewImage} />
      </Modal>
      <Modal title="Add New GHS" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={false}>
        <Form layout="vertical" form={form} onFinish={finishAdd}>
          <Row gutter={[8, 8]}>
            <Col span={24}>
              <Form.Item
                className=" mb-0"
                label="Icon :"
                name="icon"
                rules={[
                  {
                    required: true,
                    message: "Please upload  Icon",
                  },
                ]}
              >
                <Row>
                  <Col>
                    <Upload
                      listType="picture-card"
                      fileList={fileList}
                      onChange={handleChangePic}
                      onPreview={handlePreview}
                      beforeUpload={beforeUpload}
                      accept=".jpg,.png,.gif"
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
                        <Upload fileList={fileList} onChange={handleChangePic} beforeUpload={beforeUpload} accept=".jpg,.png,.gif">
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
                  checked={switchChecked}
                  onChange={handleChange}
                  className={switchChecked === true ? "active-switch" : "inactive-switch"}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Detail :" name="detail" rules={[{ required: true, message: "Please enter detail" }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <div className=" flex justify-end space-x-4">
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit" disabled={buttonAdd}>
                Add
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      <div className=" flex justify-end pb-4">
        <Space>
          <Popover
            onOpenChange={handleOpenFilter}
            open={openFilter}
            content={searchContent}
            placement="bottomLeft"
            title="Search"
            trigger="click"
            overlayStyle={{ width: "calc(100% - 240px)" }}
          >
            <Button className="button-blue" type="primary" icon={<FilterOutlined />}>
              Filters
            </Button>
          </Popover>

          {addRule ? (
            <Button className="button-blue" type="primary" onClick={showModal} disabled={buttonLoading}>
              {`Add New GHS`}
            </Button>
          ) : (
            <></>
          )}
        </Space>
      </div>
    </>
  );
};
