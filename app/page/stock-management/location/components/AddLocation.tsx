"use client";
import {
  useAxiosStock,
  useAxiosUser,
} from "@/app/lib/axios/hooks/userAxiosAuth";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Popover,
  Row,
  Select,
  Space,
  Switch,
  TreeSelect,
  Upload,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { LocationServices } from "../services/location.service";
import {
  ExclamationCircleFilled,
  FilterOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { RcFile, UploadProps } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";
// import ImgCrop from "antd-img-crop";
import {
  typeLocation,
  typeLocationFilter,
  typeInventory,
  typeuserGroup,
} from "../common";
import { validatesUploadfileImage } from "@/app/utils/validatefield";
import { checkRule } from "@/app/utils/rules";
import { UserServices } from "../services/user.service";
export interface props {
  setLoading: (value: boolean) => void;
  onFilter: (value: typeLocationFilter) => void;
  handleOpenFilter: (event: boolean) => void;
  openFilter: boolean;
}

export const AddLocation: React.FC<props> = ({
  setLoading,
  onFilter,
  handleOpenFilter,
  openFilter,
}): React.ReactElement => {
  const { RangePicker } = DatePicker;
  const stockAuth = useAxiosStock();
  const userAuth = useAxiosUser();
  const locationServices = LocationServices(stockAuth);
  const userServices = UserServices(userAuth);
  const addRule = checkRule("location-add");

  const [FORMCREATE] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [switchChecked, setSwitchChecked] = useState<boolean>(true);
  const [getInventory, setInventory] = useState<typeInventory[]>([]);
  const [getUserGroup, setUserGroup] = useState<typeuserGroup[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [previewTitle, setPreviewTitle] = useState<string>("");
  const [buttonLoading, setbuttonLoading] = useState<boolean>(false);
  const [buttonConfirm, setbuttonConfirm] = useState<boolean>(false);
  const [buttonAdd, setbuttonAdd] = useState<boolean>(false);
  const [buttontest, setbuttontest] = useState<boolean>(true);

  useEffect(() => {
    fecthData();
  }, [fileList]);
  // useEffect(() => {
  //   buttontest ? setbuttonConfirm(false) : setbuttonConfirm(true);
  // }, [buttonConfirm]);

  const fecthData = async () => {
    const dataresult = await locationServices.findInventoryAll();
    if (dataresult) {
      setInventory(dataresult);
    }
    const groups = await userServices.getUserGroupAll();
    const tree = createTree(groups.data, null);
    setUserGroup(tree);
  };

  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.thumbUrl || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.thumbUrl!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const handleChangePic: UploadProps["onChange"] = async ({
    fileList: newFileList,
  }) => {
    return await setFileList(newFileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>{`Upload`}</div>
    </div>
  );

  const handleChange = (checked: boolean) => {
    setSwitchChecked(checked);
  };

  const showModal = () => {
    setbuttonLoading(true);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    FORMCREATE.resetFields();
    setFileList([]);
    setIsModalOpen(false);
    setbuttonLoading(false);
  };

  const onfinish = async (event: typeLocation) => {
    setbuttonAdd(true);
    setbuttonConfirm(true);
    if (fileList.length === 0) {
      message.warning("โปรดใส่รูป location ทุกครั้งเวลาสร้างข้อมูลใหม่");
      return false;
    }
    const condition = {
      data: {
        locationName: event.locationName,
        description: event.description,
        locationPlace: event.locationPlace,
        status: switchChecked,
        numberOfInventory: String(event.numberOfInventory),
        locationUserGroupMap: {
          create: { userGroupId: event.userGroup.toString() },
        },
      },
      inventory: event.Inventory,
    };

    Modal.confirm({
      title: "Add Location",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to add this ?",
      okText: "Confirm",
      okButtonProps: {
        style: {
          backgroundColor: "#00a1df", // Change this to your desired color
          borderColor: "#00a1df", // Change this to your desired color
        },
      },
      cancelText: "Cancel",
      onOk: async () => {
        const result = await locationServices.create(condition);
        if (result) {
          if (fileList.length >= 1) {
            const formData: any = new FormData();
            formData.append("images", fileList[0].originFileObj);
            await locationServices
              .uploadNewImages(result.id, formData)
              .then(async (data) => {
                await delay(100);
                message.success(`Add success`);
                FORMCREATE.resetFields();
                setIsModalOpen(false);
                setFileList([]);
                setLoading(true);
              });
          } else {
            message.success(`Add success`);
            FORMCREATE.resetFields();
            setIsModalOpen(false);
            setFileList([]);
            setLoading(true);
          }
        }
        setbuttonLoading(false);
        setbuttonAdd(false);
      },
      onCancel() {
        setbuttonLoading(false);
        setbuttonAdd(false);
      },
    });
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

  const createTree = (obj: any[], parentId: string | null) => {
    const tree: any[] = [];
    obj.forEach((item) => {
      if (item.parentGroupId === parentId) {
        const children = createTree(obj, item.groupId);
        if (children.length > 0) {
          item.children = children;
        }
        tree.push({
          value: item.groupId,
          title: item.groupName,
          children: item.children,
        });
      }
    });

    return tree;
  };
  const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  const searchContent = (
    <Form layout="vertical" onFinish={onFilter} autoComplete="off">
      <div className="grid grid-cols-1 md:gap-4 md:grid-cols-4">
        <Form.Item label="Location" name="locationName">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="Location" name="locationPlace">
          <Input placeholder="Search Text" />
        </Form.Item>
        {/* <Form.Item label="Number Of Inventory" name="numberOfInventory">
          <Input placeholder="Search Text" />
        </Form.Item> */}
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
    <div>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img style={{ width: "100%" }} src={previewImage} />
      </Modal>
      <Row gutter={[8, 8]}>
        <Col span={12} style={{ justifyContent: "start", display: "flex" }}>
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
              <Button
                className="button-blue"
                type="primary"
                icon={<FilterOutlined />}
              >
                Filters
              </Button>
            </Popover>
          </Space>
        </Col>
        <Col span={12} style={{ justifyContent: "end", display: "flex" }}>
          <Space>
            {addRule ? (
              <Button
                className="button-blue"
                type="primary"
                onClick={showModal}
                disabled={buttonLoading}
              >{`Add Location`}</Button>
            ) : (
              <></>
            )}
          </Space>
        </Col>
      </Row>
      <Modal
        title="Add Location"
        footer={false}
        open={isModalOpen}
        onCancel={handleCancel}
      >
        <Form
          layout="vertical"
          onFinish={onfinish}
          form={FORMCREATE}
          style={{ marginTop: "20px", marginBottom: "-10px" }}
        >
          <Row gutter={[8, 8]}>
            <Col span={24}>
              <Form.Item
                name={"imagesLocation"}
                label={`Image :`}
                rules={[
                  { required: true, message: "Please upload image" },
                  { validator: validatesUploadfileImage },
                ]}
              >
                <Row gutter={[8, 8]}>
                  <Col>
                    <Upload
                      listType="picture-card"
                      fileList={fileList}
                      onPreview={handlePreview}
                      onChange={handleChangePic}
                      beforeUpload={beforeUpload}
                      maxCount={1}
                      accept=".jpg,.png,.gif"
                    >
                      {fileList.length >= 1 ? null : uploadButton}
                    </Upload>
                  </Col>
                  <Col
                    span={12}
                    style={{ justifyContent: "start", display: "flex" }}
                  >
                    <Row
                      style={{
                        textAlign: "center",
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      {fileList.length >= 1 ? null : (
                        <>
                          <Col span={24}>{`Drag image here`}</Col>
                          <Col span={24}>{`or`}</Col>
                        </>
                      )}

                      <Col span={24}>
                        <Upload
                          fileList={fileList}
                          onChange={handleChangePic}
                          beforeUpload={beforeUpload}
                          maxCount={1}
                          accept=".jpg,.png,.gif"
                        >
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
              <Form.Item
                name={"locationName"}
                label={`Location Name :`}
                rules={[
                  { required: true, message: "Please enter location name" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={"description"}
                label={`Company Detail :`}
                rules={[
                  { required: true, message: "Please enter company detail" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="userGroup"
                label={`User Group :`}
                rules={[{ required: true, message: "Please enter user group" }]}
              >
                <TreeSelect
                  showSearch={false}
                  style={{ width: "100%" }}
                  dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                  placeholder="Please Select"
                  allowClear
                  treeDefaultExpandAll
                  treeData={getUserGroup}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name={"locationPlace"}
                label={`Location :`}
                rules={[{ required: true, message: "Please enter location" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name={"Inventory"} label={`Choose Inventory :`}>
                <Select
                  showSearch={false}
                  allowClear
                  mode="multiple"
                  placeholder="Please Select"
                  options={getInventory
                    ?.filter(
                      (value: typeInventory) =>
                        value.status === true && value.locationId === null
                    )
                    .map((opt: typeInventory) => {
                      return {
                        key: opt.inventoryId,
                        value: opt.inventoryId,
                        label: opt.inventoryName,
                      };
                    })}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name={"status"} label={`Status :`}>
                <Switch
                  checkedChildren="Active"
                  unCheckedChildren="Inactive"
                  defaultChecked={true}
                  checked={switchChecked}
                  onChange={handleChange}
                  className={
                    switchChecked === true ? "active-switch" : "inactive-switch"
                  }
                />
              </Form.Item>
            </Col>
          </Row>
          <Row
            gutter={[8, 8]}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
            }}
          >
            <Col>
              <Button
                type="default"
                onClick={() => handleCancel()}
              >{`Cancel`}</Button>
            </Col>
            <Col>
              <Button
                htmlType="submit"
                type="default"
                className="button-blue"
                disabled={buttonAdd}
              >{`Add`}</Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};
