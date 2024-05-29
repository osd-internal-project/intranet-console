"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Modal,
  Row,
  Space,
  Table,
  Tag,
  message,
  Image,
  Form,
  Input,
  Switch,
  Select,
  Popover,
  DatePicker,
  Upload,
  TreeSelect,
} from "antd";
import { ExclamationCircleFilled, FilterOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useAxiosStock, useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
import { LocationServices } from "../services/location.service";
import Link from "next/link";
import { deleteIcon, editIcon } from "@/components/icon";
// import ImgCrop from "antd-img-crop";
import type { RcFile, UploadProps } from "antd/es/upload";
import { UploadFile } from "antd/lib/upload/interface";
import { typeDepartment, typeInventory, typeuserGroup, TreeNode } from "../common";
import { StringDecoder } from "string_decoder";
import { ColumnsType } from "antd/es/table";
import { checkRule } from "@/app/utils/rules";
import { dateToStringTh } from "@/app/utils/format";
import { UserServices } from "../services/user.service";
import { validatesUploadfileImage } from "@/app/utils/validatefield";

export interface props {
  loading: boolean;
  getdataAll: typeDepartment[];
  setLoading: (value: boolean) => void;
}
const locationTable: React.FC<props> = ({ loading, getdataAll, setLoading }): React.ReactElement => {
  const stockAuth = useAxiosStock();
  const userAuth = useAxiosUser();
  const editRule = checkRule("department-edit");
  const deleteRule = checkRule("department-delete");
  const locationServices = LocationServices(stockAuth);
  const userServices = UserServices(userAuth);
  const [form] = Form.useForm();
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [switchChecked, setSwitchChecked] = useState<boolean>();
  const [locationId, setlocationId] = useState<number>(0);
  const [getUserGroup, setUserGroup] = useState<typeuserGroup[]>([]);
  const [getInventory, setInventory] = useState<typeInventory[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [getImage, setImage] = useState<Blob>();
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [buttonLoading, setbuttonLoading] = useState<boolean>(false);
  useEffect(() => {
    if (locationId) {
      fecthData();
    }
  }, [locationId, getdataAll]);

  const fecthData = async () => {
    const dataresult = await locationServices.findinventoryNoOwner(Number(locationId));
    if (dataresult) {
      setInventory(dataresult);
    }
    const groups = await userServices.getUserGroupAll();
    const tree = createTree(groups.data, null);
    setUserGroup(tree);
  };

  const handleChange = (checked: boolean) => {
    setSwitchChecked(checked);
  };
  const createTree = (obj: TreeNode[], parentId: string | null) => {
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
  const showModal = (row: typeDepartment) => {
    setFileList([]);
    let dataInventoryId: number[] = [];
    row.inventory.map((event: typeInventory, row: number) => {
      dataInventoryId.push(event?.id);
    });
    setlocationId(row.id);
    setImage(row.imagefile);
    form.setFieldValue("id", row.id);
    form.setFieldValue("numberOfInventory", row.numberOfInventory);
    form.setFieldValue("imagefile", row.imagefile);
    form.setFieldValue("locationName", row.locationName);
    form.setFieldValue("description", row.description);
    form.setFieldValue("locationPlace", row.locationPlace);
    form.setFieldValue("inventory", dataInventoryId);
    form.setFieldValue("status", row.status);
    let userGroup: { userGroupId: string }[] = [];
    if (row?.locationUserGroupMap?.length > 0) {
      userGroup = row?.locationUserGroupMap.map((group: any) => {
        return group?.userGroupId;
      });
      form.setFieldValue("userGroup", userGroup);
    }
    setSwitchChecked(row.status);
    setOpenEdit(true);
  };
  const handleCancel = () => {
    setOpenEdit(false);
    form.resetFields();
    setbuttonLoading(false);
  };
  const columns: ColumnsType<typeDepartment> = [
    {
      title: "DEPARTMENT",
      dataIndex: "locationName",
      key: "locationName",
      render: (event: string, row: typeDepartment, index: number) => {
        return (
          <>
            <Row gutter={[8, 8]}>
              <Space>
                <Col>
                  <Image
                    src={row.imagefile ? URL.createObjectURL(row.imagefile) : "error"}
                    width={80}
                    fallback="data:image/png;base64,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"
                  />
                </Col>
                <Col style={{ display: "flex", alignItems: "center", justifyContent: "start" }}>
                  <Row gutter={[8, 8]}>
                    <Col span={24} style={{ fontWeight: "bold" }}>
                      {row.locationName}
                    </Col>
                    <Col span={24} style={{ color: "#858D9D" }}>
                      {row.description}
                    </Col>
                  </Row>
                </Col>
              </Space>
            </Row>
          </>
        );
      },
    },
    {
      title: "LOCATION",
      dataIndex: "locationPlace",
      key: "locationPlace",
    },
    {
      title: "NUMBER OF INVENTORY",
      dataIndex: "numberOfInventory",
      key: "numberOfInventory",
    },
    {
      title: "CREATED",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: Date, row: typeDepartment, index: number) => dateToStringTh(value),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (event: boolean, row: typeDepartment, index: number) =>
        event === true ? <Tag color="green">{`Active`}</Tag> : <Tag color="volcano">{`Inactive`}</Tag>,
    },
    {
      title: "ACTIVE",
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (event: number, row: typeDepartment, index: number) => (
        <Space>
          <Link href={`/page/setting/inventory?locationId=${row.id}`}>
            <Button type="link">{`View Inventory`}</Button>
          </Link>
          {editRule ? (
            <Button type="link" onClick={() => showModal(row)}>
              {editIcon}
            </Button>
          ) : (
            <></>
          )}
          {deleteRule ? (
            <Button type="link" danger onClick={() => onfinishDel(Number(event))} disabled={buttonLoading}>
              {deleteIcon}
            </Button>
          ) : (
            <></>
          )}
        </Space>
      ),
    },
  ];

  const onfinishDel = (event: number) => {
    setbuttonLoading(true);
    Modal.confirm({
      title: "Delete this department",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to delete this ?",
      okText: "Confirm",
      okButtonProps: {
        type: "primary",
        danger: true,
      },
      cancelText: "Cancel",
      onOk: async () => {
        setbuttonLoading(true);
        const dataResult = await locationServices.remove(locationId, event);
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

  const onfinishEdit = async (event: typeDepartment) => {
    if (!getImage) {
      if (fileList.length === 0) {
        message.warning("Please upload image");
        return false;
      }
    }
    setbuttonLoading(true);
    let inventory: any[] = [];
    if (event?.inventory?.length > 0) {
      inventory = event?.inventory?.map((inventory: any) => ({ id: inventory }));
    }

    const dataUpdate = {
      id: event.id,
      data: {
        numberOfInventory: event.numberOfInventory,
        locationName: event.locationName,
        description: event.description,
        locationPlace: event.locationPlace,
        status: switchChecked,
        updatedAt: new Date().toISOString(),
        locationUserGroupMap: {
          deleteMany: {},
          createMany: { data: { userGroupId: event.userGroup.toString() } },
        },
        inventory: {
          set: [],
          connect: inventory,
        },
      },
    };

    const dataResult = await locationServices.update(dataUpdate);
    if (dataResult) {
      if (fileList.length >= 1) {
        const dataDeleteImage = await locationServices.deleteImage(locationId);
        if (dataDeleteImage) {
          const formData: any = new FormData();
          formData.append("images", fileList[0].originFileObj);
          await locationServices
            .uploadNewImages(locationId, formData)
            .then(async (data) => {
              await delay(100);
              message.success(`Edit success`);
              setLoading(true);
              setOpenEdit(false);
              form.resetFields();
              setbuttonLoading(false);
            })
            .catch(() => {
              message.success(`do not upload image`);
              setLoading(true);
              setOpenEdit(false);
              form.resetFields();
              setbuttonLoading(false);
            });
        }
      } else {
        message.success(`Edit success`);
        setLoading(true);
        setOpenEdit(false);
        form.resetFields();
        setbuttonLoading(false);
      }
    }
  };

  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.thumbUrl || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.thumbUrl!.substring(file.url!.lastIndexOf("/") + 1));
  };

  const handleChangePic: UploadProps["onChange"] = async ({ fileList: newFileList }) => {
    return await setFileList(newFileList);
  };

  const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
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
  return (
    <>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
        <img style={{ width: "100%" }} src={previewImage} />
      </Modal>
      <Card>
        <div className=" col-span-1 space-y-5">
          <div className=" overflow-auto md:overflow-hidden">
            <Table size="small" columns={columns} dataSource={getdataAll} loading={loading} rowKey="id" scroll={{ x: 1000 }} />
          </div>
        </div>
      </Card>

      {openEdit ? (
        <Modal title="Edit Department" open={openEdit} onCancel={handleCancel} footer={false}>
          <Form style={{ width: "100%" }} name="edit" autoComplete="off" layout="vertical" form={form} onFinish={onfinishEdit}>
            <Form.Item name={`id`} hidden />
            <Row gutter={[8, 8]}>
              <Col span={24}>
                <Form.Item name={"imagesLocation"} label={`Image :`}>
                  <Row gutter={[8, 8]}>
                    <Space>
                      {getImage === null ? (
                        <></>
                      ) : fileList.length >= 1 ? null : (
                        <Col>
                          <Image src={getImage ? URL.createObjectURL(getImage) : ""} width={100} />
                        </Col>
                      )}
                      <Col>
                        <Upload
                          action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
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
                      <Col style={{ justifyContent: "start", display: "flex" }}>
                        <Row style={{ textAlign: "center", alignItems: "center", display: "flex" }}>
                          {fileList.length >= 0 || getImage ? null : (
                            <>
                              <Col span={24}>{`Drag image here`}</Col>
                              <Col span={24}>{`or`}</Col>
                            </>
                          )}
                          <Col span={24}>
                            <Upload
                              action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                              fileList={fileList}
                              onChange={handleChangePic}
                              beforeUpload={beforeUpload}
                              maxCount={1}
                              accept=".jpg,.png,.gif"
                            >
                              {fileList ? null : (
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
                <Form.Item name={"locationName"} label={`Department Name :`} rules={[{ required: true, message: "Please enter department name" }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={"description"} label={`Company Detail :`} rules={[{ required: true, message: "Please enter company detail" }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="userGroup" label={`User Group :`} rules={[{ required: true, message: "Please enter user group" }]}>
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
                <Form.Item name={"locationPlace"} label={`Location :`} rules={[{ required: true, message: "Please enter location" }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name={"inventory"} label={`Choose Inventory :`}>
                  <Select
                    showSearch={false}
                    allowClear
                    mode="multiple"
                    placeholder="Please Select"
                    options={getInventory
                      .filter((value: typeInventory) => value.status === true)
                      .map((opt) => {
                        return {
                          key: opt.id,
                          value: opt.id,
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
                    checked={switchChecked}
                    onChange={handleChange}
                    className={switchChecked === true ? "active-switch" : "inactive-switch"}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Row gutter={[8, 8]} style={{ justifyContent: "end", display: "flex" }}>
                  <Col>
                    <Button
                      type="default"
                      onClick={() => {
                        setOpenEdit(false);
                        form.resetFields();
                        setbuttonLoading(false);
                      }}
                    >{`Cancel`}</Button>
                  </Col>
                  <Col>
                    <Button htmlType="submit" type="default" className="button-blue" loading={buttonLoading}>{`Save Change`}</Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Modal>
      ) : (
        <></>
      )}
    </>
  );
};
export default locationTable;
