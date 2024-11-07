"use client";
import { CancelIcon } from "@/components/icon";
import { PaperClipOutlined } from "@ant-design/icons";
import { Button, Col, Form, FormInstance, Input, Modal, Row, Space, Tooltip } from "antd";
import React from "react";

export interface props {
  openModalDetail: boolean;
  setOpenModalDetail: (value: boolean) => void;
  formdetail: FormInstance;
  downloadFile: (fileId: number, fileName: string) => void;
  onFinishUpdate: (status: string, id: number) => void;
  dataById: number | undefined;
  statusById: string;
}

export const LeaveHistoryDetail: React.FC<props> = ({
  openModalDetail,
  setOpenModalDetail,
  formdetail,
  downloadFile,
  onFinishUpdate,
  dataById,
  statusById,
}): React.ReactElement => {
  return (
    <div>
      <Modal title="" open={openModalDetail} footer={false} onCancel={() => setOpenModalDetail(false)}>
        <div className="w-full justify-center flex mb-2 font-bold text-lg">{`< รายละเอียดการลา >`}</div>
        <Form autoComplete="off" form={formdetail}>
          <div>
            <p />
          </div>
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
          <Form.Item hidden name={`id`}>
            <Input />
          </Form.Item>
          <Form.Item hidden name={`approvedDate`}>
            <Input />
          </Form.Item>
          <Form.Item hidden name={`status`}>
            <Input />
          </Form.Item>
        </Form>
        <>
          <Row gutter={[8, 8]} className="flex justify-center">
            <Col>
              <Button
                size="small"
                type="primary"
                className="pt-1 justify-center flex align-middle"
                onClick={() => {
                  onFinishUpdate("cancel", dataById ? dataById : 0);
                }}
                disabled={statusById !== "waitting"}
                danger>
                <Space>
                  {`ยกเลิกวันลา`}
                  {CancelIcon}
                </Space>
              </Button>
            </Col>
          </Row>
        </>
      </Modal>
    </div>
  );
};
