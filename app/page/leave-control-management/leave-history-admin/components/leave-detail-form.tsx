import React, { useState } from "react";
import { Button, Form, Input, Space, Tooltip, Row, Col } from "antd";
import { PaperClipOutlined } from "@ant-design/icons";
import { intersection } from "lodash";
import { deleteIcon, CancelIcon, CheckIcon } from "@/components/icon";

interface props {
  formdetail: any;
  downloadFile: (id: number, filename: string) => void;
  statusById: string;
  sideMenuGroups: any;
  onFinishUpdate: (type: string, Id: number) => void;
  onFinishDelete: (type: string, Id: number) => void;
  setSubmitAction: (value: "approved" | "cancel") => void;
  submitAction: string;
}

export const LeaveDetailForm: React.FC<props> = ({
  formdetail,
  downloadFile,
  statusById,
  sideMenuGroups,
  onFinishUpdate,
  onFinishDelete,
  setSubmitAction,
  submitAction,
}) => {
  return (
    <>
      <div className="w-full justify-center flex mb-2 font-bold text-lg">{`< รายละเอียดการลา >`}</div>
      <Form
        autoComplete="off"
        form={formdetail}
        onFinish={() => onFinishUpdate(submitAction, formdetail.getFieldValue("id") ? formdetail.getFieldValue("id") : 0)}>
        <div style={{ paddingLeft: "380px", margin: "10px  " }}>
          <div className=" col-span-3 md:col-span-1 ml-1">
            <Form.Item label={`วันที่ :`} name={`createAt`} style={{ marginBottom: 0 }}>
              <Input disabled className="read-only-input" />
            </Form.Item>
          </div>
        </div>
        <div className=" col-span-3 md:col-span-1 ml-5">
          <Form.Item label={`เรียนถึง :`} name={`ownerName`}>
            <Input disabled className="read-only-input" />
          </Form.Item>
        </div>
        <div className=" col-span-3 md:col-span-1 ml-5">
          <Form.Item label={`เนื่องจาก :`} name={`detail`}>
            <Input disabled className="read-only-input" />
          </Form.Item>
        </div>
        <div className="w-full grid grid-cols-2 gap-y-2 mt-2">
          <div className=" col-span-3 md:col-span-1 ml-5">
            <Form.Item label={`จึงขอ :`} name={`typeLeave`}>
              <Input disabled className="read-only-input" />
            </Form.Item>
          </div>
          <div className=" col-span-3 md:col-span-1 ml-5">
            <Form.Item label={`เป็นเวลา :`} name={`leaveHour`}>
              <Input disabled className="read-only-input" />
            </Form.Item>
          </div>
        </div>
        <div className="w-full grid grid-cols-2 gap-y-2 mt-2">
          <div className=" col-span-3 md:col-span-1 ml-5">
            <Form.Item label={`ตั้งแต่วันที่ :`} name={`startDate`}>
              <Input disabled className="read-only-input" />
            </Form.Item>
          </div>
          <div className=" col-span-3 md:col-span-1 ml-5">
            <Form.Item label={`ถึงวันที่ :`} name={`endDate`}>
              <Input disabled className="read-only-input" />
            </Form.Item>
          </div>
        </div>
        <div className=" col-span-3 md:col-span-1 ml-5">
          <Form.Item label={`เบอร์ติดต่อระหว่างลา :`} name={`phoneNumber`}>
            <Input disabled className="read-only-input" />
          </Form.Item>
        </div>
        {Array.isArray(formdetail.getFieldValue("dataLeaveFiles")) && formdetail.getFieldValue("dataLeaveFiles").length > 0 && (
          <>
            {
              <div className=" col-span-3 md:col-span-1 ml-5">
                <Form.Item label={`ไฟล์ `} name={`endDate`} layout={`horizontal`}>
                  {formdetail.getFieldValue("dataLeaveFiles").map((file: any, index: number) => (
                    <div key={index}>
                      <Tooltip title={`ดาวน์โหลด`}>
                        <Button type="link" onClick={() => downloadFile(file.id, file.fileName)}>
                          <Space>
                            <PaperClipOutlined />
                            {file.fileName}
                          </Space>
                        </Button>
                      </Tooltip>
                    </div>
                  ))}
                </Form.Item>
              </div>
            }
          </>
        )}
        {formdetail.getFieldValue("userApproved") ? (
          <>
            <div className="w-full grid grid-cols-2 gap-y-2 mt-2">
              <div className=" col-span-3 md:col-span-1 ml-5">
                <Form.Item label={`ผู้อนุมัติ :`} name={`userApproved`}>
                  <Input disabled className="read-only-input" />
                </Form.Item>
              </div>
              <div className=" col-span-3 md:col-span-1 ml-5">
                <Form.Item label={`วันที่อนุมัติ :`} name={`approvedDate`}>
                  <Input disabled className="read-only-input" />
                </Form.Item>
              </div>
            </div>
          </>
        ) : null}
        <div className=" col-span-3 md:col-span-1 ml-5">
          <Form.Item label={`เหตุผล`} name={`detailApproved`}>
            <Input disabled={formdetail.getFieldValue("detailApproved") ? true : false} />
          </Form.Item>
        </div>
        <Form.Item hidden name={`id`}>
          <Input />
        </Form.Item>
        <Row gutter={[12, 12]} className="flex justify-center">
          <Col>
            <Tooltip title={`Approved`}>
              <Button
                htmlType="submit"
                size="small"
                type="primary"
                style={{ width: "60px", height: "30px" }}
                onClick={() => setSubmitAction("approved")}
                disabled={statusById === "cancel" || statusById === "approved"}>
                {CheckIcon}
              </Button>
            </Tooltip>
          </Col>
          <Col>
            <Tooltip title={`Cancel`}>
              <Button
                htmlType="submit"
                size="small"
                type="primary"
                style={{
                  width: "60px",
                  height: "30px",
                }}
                onClick={() => setSubmitAction("cancel")}
                disabled={statusById === "cancel"}
                danger>
                {CancelIcon}
              </Button>
            </Tooltip>
          </Col>
          <Col>
            {intersection(sideMenuGroups, ["admin"]).length ? (
              <Tooltip title={`Delete`}>
                <Button
                  size="small"
                  type="primary"
                  style={{ width: "60px", height: "30px" }}
                  danger
                  onClick={() => {
                    onFinishDelete("delete", formdetail.getFieldValue("id") ? formdetail.getFieldValue("id") : 0);
                  }}>
                  {deleteIcon}
                </Button>
              </Tooltip>
            ) : null}
          </Col>
        </Row>
      </Form>
    </>
  );
};
