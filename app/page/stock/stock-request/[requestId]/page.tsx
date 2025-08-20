"use client";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { Breadcrumb, Form, Modal, Spin } from "antd";
import { useParams, useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { ITRequestOrder } from "../../common/request-order";
import { loadAppConfig } from "@/app/config/app-config";
import MasterProductServices from "../../services/stock.service";
import RequestOrderServices from "../../services/request-order.service";
import { ISelect, ITpyeUser } from "@/app/page/leave-control-management/common";
import { UserContectType, UserContext } from "@/app/config/userContext";
import DataLeaveService from "../../../../services/leave-management.service";
import ManageRequestDetailPage from "./components/manage-request";
import dayjs, { Dayjs } from "dayjs";

const RequestOrderDetailPage: React.FC = (): React.ReactElement => {
  const navigate = useRouter();
  const { requestId } = useParams();
  const { user } = (useContext(UserContext) as UserContectType) || {
    user: null,
  };
  const [modal, contextHolder] = Modal.useModal();
  const [form] = Form.useForm<ITRequestOrder>();
  const { id24Axios } = useId24();
  const baseUrlUser = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_USER);
  const baseUrlInventory = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_INVENTORY);
  const dataleaveService = DataLeaveService(baseUrlUser);
  const masterproductServices = MasterProductServices(baseUrlInventory);
  const requestorderServices = RequestOrderServices(baseUrlInventory);
  const [getdataUser, setdataUser] = useState<ISelect[]>([]);
  const [optionsMasterData, setOptionsMasterData] = useState<ISelect[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [unitNames, setUnitNames] = useState<string[]>([]);

  useEffect(() => {
    masterData();
    if (loading && requestId) {
      fecthData();
    }
  }, [loading, requestId]);

  const fecthData = async () => {
    const reqId = requestId as string;
    const data = await requestorderServices.findOne(reqId);
    form.setFieldsValue({
      ...data,
      createdAt: data.createdAt ? dayjs(data.createdAt) : null,
      requestDate: data.requestDate ? dayjs(data.requestDate) : null,
    });
    setLoading(false);
  };

  const masterData = async () => {
    const resMasterproduct = await masterproductServices.findOptions();
    setOptionsMasterData(resMasterproduct);
    const resUser = await dataleaveService.getdataUserAll();
    const options = resUser.map((event: ITpyeUser) => ({
      value: `${event.firstNameTh} ${event.lastNameTh}`,
      label: `${event.firstNameTh} ${event.lastNameTh}`,
    }));
    setdataUser(options);
  };

  const onFinish = async (values: ITRequestOrder) => {
    console.log(values);
    const { requestId } = form.getFieldsValue(true);
    console.log(requestId);
    const data = { ...values, approvedBy: `${user?.firstNameTh} ${user?.lastNameTh}`, approvedDetail: values.approvedDetail, status: values.action };
    const response = await requestorderServices.update(requestId, data);
    if (response) {
      modal.success({
        title: "สำเร็จ",
        content: "การดำเนินการสำเร็จ",
        onOk: () => {
          navigate.push("/page/stock/stock-request");
          form.resetFields();
          setUnitNames([]);
          setLoading(true);
        },
      });
    }
  };
  return loading ? (
    <Spin></Spin>
  ) : (
    <div className="gap-2 flex flex-col ">
      <div>
        <Breadcrumb
          items={[
            {
              href: "/page/home",
              title: <span>{`หน้าหลัก`}</span>,
            },
            {
              href: "/page/stock",
              title: <span>{`การจัดการสินค้า`}</span>,
            },
            {
              href: "/page/stock/stock-request/",
              title: <span>{`การเบิกสินค้า`}</span>,
            },
            { href: "/page/stock/stock-request/manage", title: <span>{`รายละเอียดการขอเบิกสินค้า`}</span> },
          ]}
        />
      </div>
      <div>
        <ManageRequestDetailPage
          getdataUser={getdataUser}
          options={optionsMasterData}
          form={form}
          onFinish={onFinish}
          unitNames={unitNames}
          setUnitNames={setUnitNames}
        />
      </div>
    </div>
  );
};

export default RequestOrderDetailPage;
