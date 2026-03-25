"use client";
import { useState } from "react";
import { ITypeOption, TCreateUserDto, TManageUserPageDto, TUpdateUserDto } from "../common";
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Popover,
  Select,
  Switch,
  Tag,
  TreeSelect,
  Upload,
  UploadFile,
  UploadProps,
  Image,
} from "antd";
import { CarryOutOutlined, CheckOutlined, CloseOutlined, FilterOutlined, PlusCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import { UsersServices } from "@/app/services/users.service";
import React from "react";
import { DataNode } from "antd/es/tree";
import { RcFile } from "antd/es/upload";
import { FormInstance } from "antd/lib";
import { intersection } from "lodash";
import { handleCompress } from "@/app/utils";

type TabType = {
  label: string;
  key: string;
};

interface Props {
  setManagePage: (event: TManageUserPageDto) => void;
  managePage: TManageUserPageDto;
  positionOption: ITypeOption[];
  treeData: DataNode[];
  optionsOrganize: TabType[];
  treeListDepartment: any;
  filterForm: FormInstance;
  createForm: FormInstance;
  setSelectUserType: (status: "ldap" | "local") => void;
  selectUserType: "ldap" | "local";
  getImage: any;
}

export const UserAction: React.FC<Props> = ({
  setManagePage,
  managePage,
  positionOption,
  treeData,
  filterForm,
  createForm,
  setSelectUserType,
  selectUserType,
}): React.ReactElement => {
  const { id24Axios, tokenAccess } = useId24();
  const sideMenuGroups =
    tokenAccess && tokenAccess.userAccess.length > 0 ? Array.from(new Set(tokenAccess?.userAccess.map((item) => item.roles).flat())) : [];
  const isHr = intersection(sideMenuGroups, ["hr", "admin"]).length > 0;
  const baseUrlUser = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_USER);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [imageFiles, setImageFiles] = useState<UploadFile[]>([]);
  const [image, setImage] = useState<any>();
  const value = createForm.getFieldsValue(true);

  const handleOpenFilter = (state: boolean) => {
    setOpenFilter(state);
  };

  const onSearch = async (value: object) => {
    setManagePage({ ...managePage, loading: true, search: value, pagination: { current: 1, pageSize: 10 } });
    setOpenFilter(false);
  };

  const onFinishSave = async (value: TCreateUserDto | TUpdateUserDto) => {
    if (managePage.modalTitle === "create") {
      if (selectUserType === "local") {
        const validationPassFailReason = await UsersServices(baseUrlUser).validatePassword(value.password);
        if (validationPassFailReason.length > 0) {
          return message.error({
            content: validationPassFailReason.map((error: string, index: number) => (
              <>
                <React.Fragment key={index}>{error}</React.Fragment>
                <br />
              </>
            )),
          });
        }
      }
      const validateUsername = { ...value, username: value.username.toLowerCase(), password: "P@ssw0rd" } as TCreateUserDto;
      const resCreate = await UsersServices(baseUrlUser).addUser(validateUsername);
      if (resCreate) {
        if (resCreate && imageFiles.length > 0) {
          imageFiles.forEach(async (file) => {
            const formData: any = new FormData();
            formData.append("type", "create-attend");
            formData.append("files", file.originFileObj);
            await UsersServices(baseUrlUser).uploadFiles(resCreate.userId, formData);
          });
        }
        message.success("Add Success");
        setImageFiles([]);
        setManagePage({ ...managePage, loading: true, modalStatus: false });
        createForm.resetFields();
      }
    } else if (managePage.modalTitle === "update") {
      const updateForm = value as TUpdateUserDto;
      if (updateForm.userId) {
        const { masterPositionId, ...formWithoutMasterPositionId } = updateForm;
        const userId = updateForm.userId;
        const resUpdate = await UsersServices(baseUrlUser).updateUser(userId, {
          ...formWithoutMasterPositionId,
          positionId: updateForm.masterPositionId,
        });
        if (resUpdate) {
          if (resUpdate && imageFiles.length > 0) {
            console.log(resUpdate && imageFiles.length > 0);
            imageFiles.forEach(async (file) => {
              const formData: any = new FormData();
              formData.append("type", "create-attend");
              formData.append("files", file.originFileObj);
              await UsersServices(baseUrlUser).uploadFiles(resUpdate.userId, formData);
            });
          }
          message.success("Update Success");
          setImageFiles([]);
          createForm.resetFields();
          setManagePage({ ...managePage, loading: true, modalStatus: false });
        }
      }
    }
  };

  const searchContent = (
    <Form layout="vertical" form={filterForm} onFinish={onSearch} autoComplete="off">
      <div className="grid grid-cols-1 md:gap-4 md:grid-cols-4">
        <Form.Item label="ยูสเซอร์เนม" name="username">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="รหัสพนักงาน" name="empId">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="ชื่อ - สกุล" name="fullname">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="ตำแหน่ง" name="positionName">
          <Select placeholder="กรุณาเลือก ตำแหน่ง" options={positionOption} allowClear showSearch optionFilterProp="label" />
        </Form.Item>
        <Form.Item className=" md:col-span-4  text-left">
          <Button type="primary" htmlType="submit">
            Search
          </Button>
        </Form.Item>
      </div>
    </Form>
  );

  const onChangeUserType = (event: "ldap" | "local") => {
    setSelectUserType(event);
    createForm.setFieldValue("username", null);
    createForm.setFieldValue("ldapQuery", null);
  };

  const validateNumber = (rule: any, value: any, callback: any) => {
    if (value === undefined) {
      callback();
    } else {
      if (/\s/.test(value)) {
        callback("Please do not enter space");
      } else if (isNaN(value)) {
        callback("Please enter numbers only");
      } else {
        callback();
      }
    }
  };

  const beforeUploadImageFiles = async (file: RcFile) => {
    // const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
    // if (file.size > maxSizeInBytes) {
    //   message.error(`ไฟล์ ${file.name} มีขนาดใหญ่เกิน 2MB`);
    //   return false;
    // }
    if (imageFiles.find((oneFile) => oneFile.name === file.name)) {
      message.warning(`ชื่อไฟล์ ${file.name} ซ้ำ`);
      return false;
    }
    const compressed = await handleCompress(file);
    return compressed;
  };

  const handleChangeImageFiles: UploadProps["onChange"] = async ({ fileList: newFileList }) => {
    if (newFileList && newFileList.length > 0) {
      const latestFile = newFileList[newFileList.length - 1];
      if (latestFile.originFileObj) {
        const previewUrl = await getBase64(latestFile.originFileObj);
        setImage(previewUrl);
      }
    } else {
      setImage(null);
    }

    return setImageFiles(newFileList);
  };

  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });

  const createTree = (obj: any[], parentId: string | null) => {
    const tree: any[] = [];
    obj.forEach((item) => {
      if (item.group.parentGroupId === parentId) {
        const children = createTree(obj, item.group.groupId);
        if (children.length > 0) {
          ((item.group.icon = <CarryOutOutlined />), (item.group.children = children));
        }
        tree.push({
          value: item.group.groupId,
          title: item.group.groupName,
          children: item.group.children,
        });
      }
    });
    return tree;
  };

  return (
    <>
      <div className=" col-span-4 flex justify-between pb-2">
        <div>
          <Popover onOpenChange={handleOpenFilter} open={openFilter} content={searchContent} placement="bottomLeft" title="Search" trigger="click">
            <Button type="primary" icon={<FilterOutlined />}>
              Filters
            </Button>
          </Popover>
        </div>
        {isHr ? (
          <div className=" space-x-2">
            <Button
              icon={<PlusCircleOutlined />}
              className="button-blue"
              onClick={() =>
                setManagePage({
                  ...managePage,
                  modalStatus: true,
                  modalTitle: "create",
                })
              }
            >
              สร้างผู้ใช้
            </Button>
          </div>
        ) : null}
      </div>

      <Modal
        title={`${managePage.modalTitle} user`}
        open={managePage.modalStatus}
        footer={[]}
        onCancel={() => {
          (setManagePage({ ...managePage, modalStatus: false }), createForm.resetFields());
        }}
        width={1200}
      >
        <Form form={createForm} name="create" wrapperCol={{ span: 24 }} onFinish={onFinishSave} autoComplete="off" layout="vertical">
          {imageFiles.length >= 1 ? (
            <div className=" flex justify-center">
              <Form.Item name="image">
                <Upload
                  accept="image/png, image/jpeg"
                  fileList={imageFiles}
                  onChange={handleChangeImageFiles}
                  beforeUpload={beforeUploadImageFiles}
                  multiple={false}
                  maxCount={1}
                  listType="picture"
                >
                  <Button icon={<UploadOutlined />}>Click to upload</Button>
                </Upload>
              </Form.Item>
            </div>
          ) : (
            <div className="grid grid-cols-1 justify-center p-1 gap-2 space-y-2">
              <div className="grid col-span-1 justify-center items-center">
                <Image
                  rootClassName="w-[100px] h-[100px] object-cover"
                  src={value.imageId ? `${process.env.NEXT_PUBLIC_API_BASE_URL_USER}/id24users/get-image-user/${value.imageId}` : ""}
                />
              </div>
              <div className="grid col-span-1 justify-center items-center">
                <Form.Item name="image">
                  <Upload
                    accept="image/png, image/jpeg"
                    fileList={imageFiles}
                    onChange={handleChangeImageFiles}
                    beforeUpload={beforeUploadImageFiles}
                    multiple={false}
                    maxCount={1}
                    listType="picture"
                  >
                    <Button className="w-full" icon={<UploadOutlined />}>
                      Click to upload
                    </Button>
                  </Upload>
                </Form.Item>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            {managePage.modalTitle === "update" && (
              <Form.Item label="userId" name="userId" hidden>
                <Input />
              </Form.Item>
            )}
            <Form.Item<TCreateUserDto> name={"userType"} label="ประเภทการสร้าง" initialValue={selectUserType}>
              <Select
                disabled={managePage.modalTitle === "update" ? true : false}
                onChange={onChangeUserType}
                options={[
                  { value: "ldap", label: "ldap" },
                  { value: "local", label: "local" },
                ]}
              />
            </Form.Item>
            <Form.Item<TCreateUserDto> label="ยูสเซอร์เนม" name="username">
              <Input />
            </Form.Item>
            <Form.Item<TCreateUserDto> label="อีเมล" name="email" style={{ marginBottom: "2px" }}>
              <Input />
            </Form.Item>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {managePage.modalTitle === "create" ? (
              selectUserType === "local" ? (
                <>
                  <div className=" col-span-1">
                    <Form.Item<TCreateUserDto>
                      name={"password"}
                      label="รหัสผ่าน"
                      rules={managePage.modalTitle === "create" ? [{ required: true }] : undefined}
                    >
                      <Input.Password autoComplete="new-password" />
                    </Form.Item>
                  </div>
                  <div className=" col-span-1">
                    <Form.Item<TCreateUserDto>
                      label="ยืนยันรหัสผ่าน"
                      name="cfpassword"
                      dependencies={["password"]}
                      rules={[
                        {
                          required: true,
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error("The new password that you entered do not match!"));
                          },
                        }),
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>
                  </div>
                </>
              ) : // <div className=" col-span-2">
              //   <Form.Item<TCreateUserDto> name={"ldapQuery"} label="LDAP Query" rules={[{ required: true }]}>
              //     <Input placeholder="CN=John Smith,OU=User,DC=example" />
              //   </Form.Item>
              // </div>
              null
            ) : (
              <></>
            )}

            <div className=" col-span-1">
              <Form.Item<TCreateUserDto> name={"activeStatus"} label="สถานะ" initialValue={true} className="p-0 mb-0">
                <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
              </Form.Item>
            </div>
          </div>
          <div className=" col-span-3">
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-200" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            <Form.Item<TCreateUserDto> label="ชื่อ(ภาษาไทย)" name="firstNameTh" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item<TCreateUserDto> label="นามสกุล(ภาษาไทย)" name="lastNameTh" rules={[{ required: true }]} style={{ marginBottom: "2px" }}>
              <Input />
            </Form.Item>
            <Form.Item<TCreateUserDto> label="ชื่อ(ภาษาอังกฤษ)" name="firstNameEn" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item<TCreateUserDto> label="นามสกุล(ภาษาอังกฤษ)" name="lastNameEn" rules={[{ required: true }]} style={{ marginBottom: "2px" }}>
              <Input />
            </Form.Item>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div className=" col-span-1">
              <Form.Item<TCreateUserDto> label="เบอร์โทรติดต่อ" name="phoneNumber" style={{ marginBottom: "2px" }}>
                <Input />
              </Form.Item>
            </div>
            <div className=" col-span-1">
              <Form.Item<TCreateUserDto> label="Extension" name={"extension"} style={{ marginBottom: "2px" }} rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </div>
            <div className=" col-span-1">
              <Form.Item<TCreateUserDto> label="ตำแหน่ง" name="masterPositionId" rules={[{ required: true }]}>
                <Select placeholder="กรุณาเลือก ตำแหน่ง" options={positionOption} allowClear showSearch optionFilterProp="label" />
              </Form.Item>
            </div>
            <div className=" col-span-1">
              <Form.Item<TCreateUserDto> label="วันที่เริ่มงาน" name="startWork" rules={[{ required: true }]}>
                <DatePicker className="w-full" />
              </Form.Item>
            </div>
            <div className=" col-span-1">
              <Form.Item<TCreateUserDto> label="รหัสพนักงาน" name="empId" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </div>
          </div>
          <div className=" col-span-3">
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-200" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div className=" col-span-2">
              <Form.Item<TCreateUserDto> name={"ownerGroupId"} label="สิทธิ์การใช้งาน" rules={[{ required: true }]}>
                <TreeSelect
                  allowClear
                  showSearch={false}
                  style={{ width: "100%" }}
                  treeDefaultExpandAll
                  placeholder="กรุณาเลือก ตำแหน่งการมองเห็นข้อมูล"
                  treeData={treeData}
                />
              </Form.Item>
            </div>
          </div>
          <div className=" w-full text-center space-x-4">
            <Button
              onClick={() => {
                setManagePage({ ...managePage, modalStatus: false });
                createForm.resetFields();
              }}
            >{`Cancel`}</Button>
            <Button type={"primary"} htmlType="submit">
              {`Save`}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};
