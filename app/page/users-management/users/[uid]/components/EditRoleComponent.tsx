"use client";
import React, { useEffect, useState } from "react";
import RolesServices from "../../services/role.service";
import { Button, Card, Form, Select, Tag, Tree, message } from "antd";
import type { DataNode } from "antd/es/tree";

// import "../../style.css";
import TextArea from "antd/es/input/TextArea";
import UserServices from "../../services/user.service";
import { useForm } from "antd/es/form/Form";
import { useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
export interface props {
  userid: string;
}

type optionType = {
  label: string;
  value: string;
};
const EditRoleComponent: React.FC<props> = ({ userid }): React.ReactElement => {
  // const useAuth = useAxiosUser();

  const { id24Axios } = useId24();
  const baseUrlUser = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_USER);
  const rolesServices = RolesServices(baseUrlUser);
  const userServices = UserServices(baseUrlUser);
  const [roleForm] = useForm();
  const [optionList, setOptionList] = useState<optionType[]>([]);
  const [ruleShowList, setRuleShowList] = useState<any>(null);
  const [buttonLoading, setbuttonLoading] = useState<boolean>(false);
  useEffect(() => {
    loaddata();
  }, [userid]);

  const loaddata = async () => {
    const roles = await rolesServices.getUserRoleAll();

    const options = roles.map((role: any) => ({
      label: role.roleName,
      value: role.roleId,
    }));
    setOptionList(options);
    const getRoles = await userServices.getRoleIdmapByUserId(userid);
    const userRoles = getRoles?.userRoleMap;
    if (userRoles) {
      const roleslist = userRoles.map((item: any) => item.userRoleId) as string[];
      roleForm.setFieldValue("roles", roleslist);
      onChangeRole(roleslist);
    }
  };
  const onChangeRole = async (roles: string[]) => {
    if (roles.length > 0) {
      const rules = await rolesServices.getRulesByRoleId(roles);
      const element = rules.data?.ruleList.map((item: string, index: number) => <Tag key={index}>{item}</Tag>);
      setRuleShowList(element);
    } else {
      setRuleShowList(null);
    }
  };
  const onFinish = async (value: any) => {
    setbuttonLoading(true);
    const roles = value.roles;
    if (roles.length > 0) {
      await userServices
        .setUserRolesMap(userid, value.roles)
        .then(() => {
          message.success(`Success`);
          setbuttonLoading(false);
        })
        .catch((err) => {
          message.error(`ผิดพลาด`);
          console.log(err);
          setbuttonLoading(false);
        });
    } else {
      message.error("ผิดพลาด");
    }
  };

  return (
    <Card className="mx-2 my-2 md:my-0" style={{ minHeight: "500px" }}>
      <Form form={roleForm} onFinish={onFinish} layout="vertical">
        <div className="grid grid-cols-1 gap-0 ">
          <div className=" mb-5">
            <div className=" text-2xl  font-semibold ">User Roles</div>
          </div>
          <div className="grid grid-cols-1 ">
            <Form.Item label="Roles" name="roles" rules={[{ required: true, message: "Please select roles" }]}>
              <Select allowClear mode="multiple" options={optionList} onChange={onChangeRole} placeholder={`Please Select`} showSearch={false} />
            </Form.Item>
          </div>
          <div className="flex justify-between  ">
            <div>{`สิทธิในการใช้งาน (Rules)`} </div>
            <div>{ruleShowList ? `${ruleShowList.length} Rules` : ``}</div>
          </div>
          <div className="grid grid-cols-1 mb-5" style={{ marginTop: "8px" }}>
            <Card className=" overflow-x-auto border" style={{ maxHeight: "200px" }}>
              {ruleShowList}
            </Card>
          </div>
          <div className="flex justify-end">
            <Form.Item>
              <Button htmlType="submit" type="primary" className="button-blue" loading={buttonLoading}>
                Save User Roles
              </Button>
            </Form.Item>
          </div>
        </div>
      </Form>
    </Card>
  );
};

export default EditRoleComponent;
