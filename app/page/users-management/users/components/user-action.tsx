"use client";
import { useContext, useState } from "react";
import { ITypeOption, TCreateUserDto, TManageUserPageDto, TUpdateUserDto, TUserAllDto } from "../common";
import {
  Avatar,
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Popover,
  Select,
  SelectProps,
  Switch,
  Tag,
  TreeSelect,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { CarryOutOutlined, CheckOutlined, CloseOutlined, FilterOutlined, PlusCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import { UsersServices } from "@/app/services/users.service";
import React from "react";
import { DataNode } from "antd/es/tree";
import { RcFile } from "antd/es/upload";
import UserGroupServices from "@/app/services/usergroup.service";
import Loading from "@/components/Loading";
import { FormInstance } from "antd/lib";
import { UserContectType, UserContext } from "@/app/config/userContext";

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
}

const { RangePicker } = DatePicker;

export const UserAction: React.FC<Props> = ({
  setManagePage,
  managePage,
  positionOption,
  treeData,
  optionsOrganize,
  treeListDepartment,
  filterForm,
  createForm,
  setSelectUserType,
  selectUserType,
}): React.ReactElement => {
  const { user } = (useContext(UserContext) as UserContectType) || {
    user: null,
  };
  const { id24Axios } = useId24();
  const baseUrlUser = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_USER);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [buttonLoading, setbuttonLoading] = useState<boolean>(false);
  const [imageFiles, setImageFiles] = useState<UploadFile[]>([]);
  const [image, setImage] = useState<any>();
  const [loadTree, setLoadTree] = useState<boolean>(false);
  const [valueTreeSelect, setValueTreeSelect] = useState<string>();
  const [groupOption, setGroupOption] = useState<any[]>([]);
  const [organizeId, setOrganizeId] = useState<string>("");
  // const [userGroupSelect, setUserGroupSelect] = useState<SelectProps["options"]>([]);

  const handleOpenFilter = (state: boolean) => {
    setOpenFilter(state);
  };

  const onSearch = async (value: object) => {
    setManagePage({ ...managePage, loading: true, search: value });
    setOpenFilter(false);
  };

  const onValidateUserName = async (username: string): Promise<string | undefined> =>
    UsersServices(baseUrlUser).validateUsername(username, selectUserType);

  const onValidateEmail = async (email: string, userType: "ldap" | "local"): Promise<string | undefined> =>
    UsersServices(baseUrlUser).validateEmail(email, userType);

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
      const resCreate = await UsersServices(baseUrlUser).addUser(value);
      if (resCreate) {
        message.success("Add Success");
        setManagePage({ ...managePage, loading: true, modalStatus: false });
        createForm.resetFields();
      }
    } else if (managePage.modalTitle === "update") {
      const updateForm = value as TUpdateUserDto;

      if (updateForm?.userId) {
        const userId = updateForm?.userId;
        const resUpdate = await UsersServices(baseUrlUser).updateUser(userId, updateForm);
        if (resUpdate) {
          message.success("Update Success");
          createForm.resetFields();
          setManagePage({ ...managePage, loading: true, modalStatus: false });
        }
      }
    }
  };

  const searchContent = (
    <Form layout="vertical" form={filterForm} onFinish={onSearch} autoComplete="off">
      <div className="grid grid-cols-1 md:gap-4 md:grid-cols-4">
        <Form.Item label="User Id" name="userId">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="Name" name="userName">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input placeholder="Search Text" />
        </Form.Item>
        {/* <Form.Item label="Position" name="positionId">
          <Select placeholder="Please Select" options={positionOption} allowClear />
        </Form.Item> */}
        <Form.Item label="First Name" name="firstNameTh">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="Last Name" name="lastNameTh">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="Phone Number" name="phoneNumber">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="Status" name="activeStatus">
          <Select
            placeholder="All"
            allowClear
            options={[
              { value: true, label: <Tag color="green">Active</Tag> },
              { value: false, label: <Tag color="red">Inactive</Tag> },
            ]}
          />
        </Form.Item>
        <Form.Item label="Created" name="created">
          <RangePicker className=" w-full" />
        </Form.Item>
        <Form.Item className=" md:col-span-4  text-right">
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

  const beforeUploadImageFiles = (file: RcFile) => {
    if (imageFiles.find((oneFile) => oneFile.name === file.name)) {
      message.warning(`ชื่อไฟล์ ${file.name} ซ้ำ`);
      return false;
    }
    return false;
  };

  const handleChangeImageFiles: UploadProps["onChange"] = async ({ fileList: newFileList }) => {
    return setImageFiles(newFileList);
  };

  const selectOrganize = async (organizeId: string) => {
    setLoadTree(true);
    setOrganizeId(organizeId);
    const groups = await UserGroupServices(baseUrlUser).getUserGroupByOrganizedGroupId(organizeId);
    const tree = createTree(groups.organizeMapGroup, null) as any;
    createForm.setFieldsValue({ groupList: undefined });
    // const assignGroup = await UsersServices(baseUrlUser).findAssignGroup(userid, organizeId);
    // const assignOwnerGroup = await UsersServices(baseUrlUser).findOwnerGroupByOrganizeId(userid, organizeId);
    // if (assignGroup.length > 0) {
    //   const groupActiveIds = assignGroup.map((item: { id: number; usersId: string; organizedId: string; groupId: string }) => item.groupId);
    //   createForm.setFieldsValue({ groupList: groupActiveIds });
    // }
    // createForm.setFieldsValue({ groupOwnerId: assignOwnerGroup.ownerGroupId });
    setGroupOption(tree);
    setLoadTree(false);
  };

  const onChange = (value: string) => {
    setValueTreeSelect(value);
  };

  const onChangeGroupOwner = async (value: string) => {
    console.log(value);
  };

  const createTree = (obj: any[], parentId: string | null) => {
    const tree: any[] = [];
    obj.forEach((item) => {
      if (item.group.parentGroupId === parentId) {
        const children = createTree(obj, item.group.groupId);
        if (children.length > 0) {
          (item.group.icon = <CarryOutOutlined />), (item.group.children = children);
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
          <Popover
            onOpenChange={handleOpenFilter}
            open={openFilter}
            content={searchContent}
            placement="bottomLeft"
            title="Search"
            trigger="click"
            overlayStyle={{ width: "calc(100% - 240px)" }}>
            <Button type="primary" icon={<FilterOutlined />}>
              Filters
            </Button>
          </Popover>
        </div>
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
            }>
            สร้างผู้ใช้
          </Button>
        </div>
      </div>
      <Modal
        title={`${managePage.modalTitle} user`}
        open={managePage.modalStatus}
        footer={[]}
        onCancel={() => {
          setManagePage({ ...managePage, modalStatus: false }), createForm.resetFields();
        }}
        width={1200}>
        <Form form={createForm} name="create" wrapperCol={{ span: 24 }} onFinish={onFinishSave} autoComplete="off" layout="vertical">
          <div className=" flex justify-center p-1">
            <Avatar size={128} src={image ? URL.createObjectURL(image) : ""} />
          </div>
          <div className=" flex justify-center">
            <Form.Item name="image">
              <Upload
                accept="image/png, image/jpeg"
                fileList={imageFiles}
                onChange={handleChangeImageFiles}
                beforeUpload={beforeUploadImageFiles}
                multiple={false}
                maxCount={1}
                listType="picture">
                <Button icon={<UploadOutlined />}>Click to upload</Button>
              </Upload>
            </Form.Item>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {managePage.modalTitle === "update" && (
              <Form.Item label="userId" name="userId" hidden>
                <Input />
              </Form.Item>
            )}
            <Form.Item<TCreateUserDto>
              name={"userType"}
              label="ประเภทการสร้าง"
              // rules={
              //   managePage.modalTitle === "create"
              //     ? [
              //         { required: true },
              //         {
              //           validator: async (_, value) => {
              //             if (value) {
              //               const validationFailReason =
              //                 await onValidateUserName(value);
              //               if (validationFailReason) {
              //                 throw new Error(validationFailReason);
              //               }
              //             }
              //           },
              //         },
              //       ]
              //     : undefined
              // }
              initialValue={selectUserType}>
              <Select
                disabled={managePage.modalTitle === "update" ? true : false}
                onChange={onChangeUserType}
                options={[
                  { value: "ldap", label: "ldap" },
                  { value: "local", label: "local" },
                ]}
              />
            </Form.Item>
            <Form.Item<TCreateUserDto>
              label="ยูสเซอร์เนม"
              name="username"
              // rules={[
              //   { required: true },
              //   {
              //     validator: async (_, value) => {
              //       if (value) {
              //         const validationFailReason = await onValidateUserName(
              //           value
              //         );
              //         if (validationFailReason) {
              //           throw new Error(validationFailReason);
              //         }
              //       }
              //     },
              //   },
              // ]}
            >
              <Input />
            </Form.Item>
            <Form.Item<TCreateUserDto>
              label="อีเมล"
              name="email"
              // rules={[
              //   { required: true, type: "email" },
              //   {
              //     required: true,
              //     validator: async (_, value) => {
              //       if (value) {
              //         const validationFailReason = await onValidateEmail(
              //           value,
              //           "local"
              //         );
              //         if (validationFailReason) {
              //           throw new Error(validationFailReason);
              //         }
              //       }
              //     },
              //   },
              // ]}
              style={{ marginBottom: "2px" }}>
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
                      rules={managePage.modalTitle === "create" ? [{ required: true }] : undefined}>
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
                      ]}>
                      <Input.Password />
                    </Form.Item>
                  </div>
                </>
              ) : (
                <div className=" col-span-2">
                  <Form.Item<TCreateUserDto> name={"ldapQuery"} label="LDAP Query" rules={[{ required: true }]}>
                    <Input placeholder="CN=John Smith,OU=User,DC=example" />
                  </Form.Item>
                </div>
              )
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
              <Form.Item<TCreateUserDto>
                label="เบอร์โทรติดต่อ"
                name="phoneNumber"
                rules={[{ required: true }, { validator: validateNumber }]}
                style={{ marginBottom: "2px" }}>
                <Input />
              </Form.Item>
            </div>
            <div className=" col-span-1">
              <Form.Item<TCreateUserDto>
                label="ตำแหน่ง"
                name="masterPositionId"
                // rules={[{ required: true }]}
              >
                <Select placeholder="กรุณาเลือก ตำแหน่ง" options={positionOption} />
              </Form.Item>
            </div>
            <div className=" col-span-1">
              <Form.Item<TCreateUserDto> label="วันที่เริ่มงาน" name="startWork">
                <DatePicker className="w-full" />
              </Form.Item>
            </div>
            {/* <div className=" col-span-1">
              <Form.Item label="แผนก" name="departmentId" required>
                <TreeSelect
                  showSearch
                  style={{ width: "100%" }}
                  dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                  placeholder="กรุณาเลือก แผนก"
                  allowClear
                  treeDefaultExpandAll
                  treeData={treeListDepartment}
                />
              </Form.Item>
            </div> */}
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
                  value={valueTreeSelect}
                  style={{ width: "100%" }}
                  treeDefaultExpandAll
                  placeholder="กรุณาเลือก ตำแหน่งการมองเห็นข้อมูล"
                  treeData={treeData}
                />
              </Form.Item>
            </div>
            {/* <div className=" col-span-2">
              <Form.Item name="organizeId" label="องค์กร" rules={[{ required: true }]}>
                <Select placeholder="กรุณาเลือก องค์กร" options={optionsOrganize} onSelect={selectOrganize} style={{ width: "100%" }} />
              </Form.Item>
            </div> */}
          </div>
          {/* <div className="grid grid-cols-4 gap-2">
            <div className=" col-span-2"></div>
            <div className=" col-span-2" hidden={organizeId === ""}>
              {loadTree ? (
                <Loading />
              ) : (
                <>
                  <Form.Item name="groupList" label="การมองเห็นข้อมูล" rules={[{ required: true }]}>
                    <TreeSelect
                      multiple
                      allowClear
                      showSearch={false}
                      value={valueTreeSelect}
                      style={{ width: "100%" }}
                      treeDefaultExpandAll
                      placeholder="กรุณาเลือก การมองเห็นข้อมูล"
                      onChange={onChange}
                      treeData={groupOption}
                    />
                  </Form.Item>
                  <Form.Item name="groupOwnerId" label="ตำแหน่งการมองเห็นข้อมูล" rules={[{ required: true }]}>
                    <TreeSelect
                      allowClear
                      showSearch={false}
                      value={valueTreeSelect}
                      style={{ width: "100%" }}
                      treeDefaultExpandAll
                      placeholder="กรุณาเลือก ตำแหน่งการมองเห็นข้อมูล"
                      onChange={onChangeGroupOwner}
                      treeData={groupOption}
                    />
                  </Form.Item>
                </>
              )}
            </div>
          </div> */}
          <div className=" w-full text-center space-x-4">
            <Button
              onClick={() => {
                setManagePage({ ...managePage, modalStatus: false });
                createForm.resetFields();
                setOrganizeId("");
              }}>{`Cancel`}</Button>
            <Button type={"primary"} htmlType="submit" loading={buttonLoading}>
              {`Save`}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};
