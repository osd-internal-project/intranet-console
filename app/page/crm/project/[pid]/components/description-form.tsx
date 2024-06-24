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
import { ITBranchContact, ITCustomerProject } from "../../common";

import "../../style.css";
import { dateToStringThNoTime } from "@/app/utils/format";
// const { RangePicker } = DatePicker;
const { TextArea } = Input;
export interface props {
  // descriptionForm: FormInstance<ITCustomerProject>;
  projectDescription: ITCustomerProject;
  contactDescription: ITBranchContact | undefined;
  isEdit: boolean;
  setIsEdit: (isEdit: boolean) => void;
  onFinishEdit: (form: ITCustomerProject) => void;
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
  console.log(contactDescription);
  return (
    <Collapse
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
                <div className=" grid  grid-cols-3 md:grid-cols-6 gap-2 pr-10">
                  <div className=" font-bold pl-3  pr-3 text-right ">
                    Project Name :
                  </div>
                  <div className=" col-span-2 md:col-span-5 text-slate-500">
                    {projectDescription.projectName}
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
                    Duration :{" "}
                  </div>
                  <div className=" col-span-2 md:col-span-1 text-slate-500">
                    {projectDescription.duration
                      ? projectDescription.duration
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
                    ""
                  )}
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
                </div>
              ) : (
                ""
              )}
            </>
            // <Form
            //   style={{ color: "#000" }}
            //   form={descriptionForm}
            //   size="small"
            //   layout="vertical"
            //   onFinish={onFinishEdit}
            //   disabled={!isEdit}
            //   autoComplete="off"
            //   variant={isEdit ? "outlined" : "borderless"}
            //   className="custom-disabled-form"
            //   {...layout}
            // >
            //   <div className="fix-form grid md:ml-4 grid-cols-2 md:grid-cols-3 md:mb-0 md:mt-0">
            //     <div className=" col-span-2 md:col-span-3 flex  justify-end">
            //       {/* {isEdit ? (
            //         <div className=" space-x-2">
            //           <Button type="primary" htmlType="submit">
            //             Save
            //           </Button>
            //           <Button
            //             onClick={() => setIsEdit(!isEdit)}
            //             type="primary"
            //             ghost
            //             disabled={false}
            //           >
            //             Cancel
            //           </Button>
            //         </div>
            //       ) : (
            //         <Button onClick={() => setIsEdit(!isEdit)} disabled={false}>
            //           Edit
            //         </Button>
            //       )} */}
            //     </div>
            //     <Form.Item
            //       // label={<b>Project Name</b>}
            //       name={"projectName"}
            //       className=" col-span-3"
            //     >
            //       <Input readOnly className=" text-2xl font-bold " />
            //     </Form.Item>
            //     <Form.Item label={<b>Start Date</b>} name={"startDate"}>
            //       <Input readOnly />
            //     </Form.Item>
            //     <Form.Item label={<b>End Date</b>} name={"endDate"}>
            //       <Input readOnly />
            //     </Form.Item>
            //     <Form.Item label={<b>Duration (Day)</b>} name={"duration"}>
            //       <Input placeholder="Enter Text" maxLength={200} />
            //     </Form.Item>
            //     <Form.Item label={<b>Customer</b>} name={"customer"}>
            //       <Input readOnly />
            //     </Form.Item>
            //     <Form.Item label={<b>Branch</b>} name={"branch"}>
            //       <Input readOnly />
            //     </Form.Item>
            //     <div className=" md:col-span-3">
            //       <Form.Item
            //         label={<b>ที่อยู่ใบกำกับภาษี</b>}
            //         name={"taxAddressText"}
            //       >
            //         <Input readOnly />
            //       </Form.Item>
            //       <Form.Item
            //         label={<b>ที่อยู่การจัดส่งบริการ</b>}
            //         name={"deliveryAddressText"}
            //       >
            //         <Input readOnly />
            //       </Form.Item>
            //       <Form.Item
            //         label={<b>ที่อยู่จัดส่งใบแจ้งบริการ</b>}
            //         name={"notiAddressText"}
            //       >
            //         <Input readOnly />
            //       </Form.Item>
            //     </div>
            //   </div>
            // </Form>
          ),
        },
      ]}
    />
  );
};

export default DescriptionCustomerForm;
