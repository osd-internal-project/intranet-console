import React, { useState } from "react";
import type { FormInstance } from "antd";
import {
  Button,
  Collapse,
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  Select,
  Switch,
} from "antd";
import { ITCustomerDetailSubContact, ITProject } from "../../common";

import "../../style.css";
import { dateToStringThNoTime } from "@/app/utils/format";
// const { RangePicker } = DatePicker;
const { TextArea } = Input;
export interface props {
  // descriptionForm: FormInstance<ITProject>;
  projectDescription: ITProject;
  contactDescription: ITCustomerDetailSubContact | undefined;
  isEdit: boolean;
  setIsEdit: (isEdit: boolean) => void;
  onFinishEdit: (form: ITProject) => void;
}

const layout = {
  labelCol: {},
  wrapperCol: {
    md: { span: 22 },
  },
};

const DescriptionCustomerForm: React.FC<props> = ({
  projectDescription,
  contactDescription,
  isEdit,
  setIsEdit,
  onFinishEdit,
}): React.ReactElement => {
  return (
    <Collapse
      destroyInactivePanel
      bordered={true}
      defaultActiveKey={1}
      style={{ backgroundColor: "#fff" }}
      items={[
        {
          key: 1,
          label: (
            <div className=" md:col-span-3 font-bold">ข้อมูลเบื้องต้น </div>
          ),
          children: (
            <>
              {projectDescription ? (
                <div>
                  <div className=" grid  grid-cols-3 md:grid-cols-6 gap-2 pr-10">
                    <div className=" font-bold pl-3  pr-3 text-right ">
                      Project Name :
                    </div>
                    <div className=" col-span-2 md:col-span-5 text-slate-500">
                      {projectDescription.projectName}
                    </div>
                    <div className=" font-bold pl-3  pr-3 text-right ">
                      Product Name :
                    </div>
                    <div className=" col-span-2 md:col-span-5 text-slate-500">
                      {projectDescription.productName}
                    </div>
                    <div className=" font-bold pl-3 pr-3 text-right">
                      Start Date :{" "}
                    </div>
                    <div className=" col-span-2 md:col-span-1 text-slate-500">
                      {projectDescription.startDate
                        ? dateToStringThNoTime(projectDescription.startDate)
                        : "-"}
                    </div>
                    <div className=" font-bold pl-3 pr-3 text-right">
                      End Date :{" "}
                    </div>
                    <div className=" col-span-2 md:col-span-1 text-slate-500">
                      {projectDescription.endDate
                        ? dateToStringThNoTime(projectDescription.endDate)
                        : "-"}
                    </div>
                    <div className=" font-bold pl-3 pr-3 text-right">
                      Duration :
                    </div>
                    <div className=" col-span-2 md:col-span-1 text-slate-500">
                      {projectDescription.duration
                        ? projectDescription.duration
                        : "-"}
                    </div>
                    <div className=" font-bold pl-3 pr-3 text-right">
                      ออกโดย :
                    </div>
                    <div className=" col-span-2 md:col-span-1 text-slate-500">
                      {projectDescription.contractCompany?.name
                        ? `${projectDescription.contractCompany.name}`
                        : "-"}
                    </div>
                    <div className=" font-bold pl-3 pr-3 text-right">
                      Customer Group :
                    </div>
                    <div className=" col-span-2 md:col-span-1 text-slate-500">
                      {projectDescription.customerDetailSub.customerDetail
                        .customerNameTh
                        ? projectDescription.customerDetailSub.customerDetail
                            .customerNameTh
                        : ""}
                    </div>
                    <div className=" font-bold pl-3 pr-3 text-right">
                      Customer :
                    </div>
                    <div className=" col-span-2 md:col-span-1 text-slate-500">
                      {projectDescription?.customerDetailSub?.customerDetail
                        ?.customerNameTh
                        ? `${projectDescription.customerDetailSub.customerDetail.customerNameTh}`
                        : "-"}
                    </div>
                    <div className=" font-bold pl-3 pr-3 text-right">
                      Sub Customer / Branch :
                    </div>
                    <div className=" col-span-2 md:col-span-1 text-slate-500">
                      {projectDescription.customerDetailSub.name
                        ? projectDescription.customerDetailSub.name
                        : "-"}
                    </div>
                    {contactDescription ? (
                      <div className=" grid  grid-cols-3 md:grid-cols-6 gap-2  md:col-span-6">
                        <div className=" font-bold pl-3 pr-3 text-right">
                          ชื่อผู้ติดต่อ :{" "}
                        </div>
                        <div className="  col-span-2 md:col-span-1 text-slate-500">
                          {contactDescription.name}
                          {contactDescription.nickName
                            ? `(${contactDescription.nickName})`
                            : ``}
                        </div>
                        <div className=" font-bold pl-3 pr-3 text-right">
                          ตำแหน่ง :{" "}
                        </div>
                        <div className="  col-span-2 md:col-span-1 text-slate-500">
                          {contactDescription.position}
                        </div>
                        <div className=" font-bold pl-3 pr-3 text-right">
                          เบอร์มือถือ :{" "}
                        </div>
                        <div className="  col-span-2 md:col-span-1 text-slate-500">
                          {contactDescription.phone}
                        </div>
                        <div className=" font-bold pl-3 pr-3 text-right">
                          เบอร์ออฟฟิศ :{" "}
                        </div>
                        <div className="  col-span-2 md:col-span-1 text-slate-500">
                          {contactDescription.officePhone}
                        </div>
                        <div className=" font-bold pl-3 pr-3 text-right">
                          เบอร์แฟกซ์ :{" "}
                        </div>
                        <div className="  col-span-2 md:col-span-1 text-slate-500">
                          {contactDescription.officePhone}
                        </div>
                        <div className=" font-bold pl-3 pr-3 text-right">
                          อีเมล :{" "}
                        </div>
                        <div className="  col-span-2 md:col-span-1 text-slate-500">
                          {contactDescription.email}
                        </div>
                      </div>
                    ) : (
                      <div className=" grid  grid-cols-3 md:grid-cols-6 gap-2  md:col-span-6"></div>
                    )}
                  </div>
                  <div className=" grid  grid-cols-3 md:grid-cols-6 gap-2 pr-10">
                    <div className="font-bold pl-3 pr-3 text-right">
                      ที่อยู่ใบกำกับภาษี :
                    </div>
                    <div className=" col-span-2 md:col-span-5 text-slate-500">
                      {projectDescription.taxAddressText}
                    </div>
                    <div className="font-bold pl-3 pr-3 text-right">
                      ที่อยู่การจัดส่งบริการ :
                    </div>
                    <div className=" col-span-2 md:col-span-5 text-slate-500">
                      {projectDescription.deliveryAddressText}
                    </div>
                    <div className="font-bold pl-3 pr-3 text-right">
                      ที่อยู่จัดส่งใบแจ้งบริการ :
                    </div>
                    <div className=" col-span-2 md:col-span-5 text-slate-500">
                      {projectDescription.notiAddressText}
                    </div>
                    <div className="font-bold pl-3 pr-3 text-right mb-5">
                      รายละเอียด :
                    </div>
                    <div className=" col-span-2 md:col-span-5 text-slate-500  mb-5">
                      <TextArea
                        readOnly
                        value={projectDescription.description}
                      />
                    </div>
                    <div className=" font-bold pl-3  pr-3 text-right ">
                      Project Manager :
                    </div>
                    <div className=" col-span-2 md:col-span-1 text-slate-500">
                      {projectDescription.projectManagerName}
                    </div>
                    <div className=" font-bold pl-3  pr-3 text-right ">
                      Sale :
                    </div>
                    <div className=" col-span-2 md:col-span-1 text-slate-500">
                      {projectDescription.saleName}
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </>
          ),
        },
      ]}
    />
  );
};

export default DescriptionCustomerForm;
