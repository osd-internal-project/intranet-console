"use client";
import { PaperClipOutlined } from "@ant-design/icons";
import { Button, Form, FormInstance, Input, Modal, Space, Tooltip } from "antd";
import React from "react";

export interface props {
  modalDataLeaveDetail: boolean;
  onCancelModalDetail: () => void;
  formDetail: FormInstance;
  downloadFile: (fileId: number, fileName: string) => void;
}

export const LeaveHistoryCalendarDetail: React.FC<props> = ({
  modalDataLeaveDetail,
  onCancelModalDetail,
  formDetail,
  downloadFile,
}): React.ReactElement => {
  return (
    <div>
      <Modal forceRender title="" open={modalDataLeaveDetail} footer={false} onCancel={() => onCancelModalDetail()} width={600}>
        <div className="w-full justify-center flex mb-2 font-bold text-lg">{`< รายละเอียดการลา >`}</div>
        <Form autoComplete="off" form={formDetail}>
          <div style={{ paddingLeft: "380px", margin: "10px  " }}>
            <div className=" col-span-3 md:col-span-1 ml-5">
              <Form.Item label={`วันที่ :`} name={`createAt`}>
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
            <Form.Item label={`ผู้ขอลา :`} name={`name`}>
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
          {Array.isArray(formDetail.getFieldValue("dataLeaveFiles")) && formDetail.getFieldValue("dataLeaveFiles").length > 0 && (
            <>
              {
                <div className=" col-span-3 md:col-span-1 ml-5">
                  <Form.Item label={`ไฟล์ `} name={`endDate`} layout={`horizontal`}>
                    {formDetail.getFieldValue("dataLeaveFiles").map((file: any, index: number) => (
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
          {formDetail.getFieldValue("userApproved") ? (
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
        </Form>
      </Modal>
    </div>
  );
};
