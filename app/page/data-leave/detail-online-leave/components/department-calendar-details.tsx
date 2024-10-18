import React, { useState } from "react";
import { Modal, Form, Input, Button, Space, Tooltip } from "antd";
import {
  Calendar,
  momentLocalizer,
  Event as RbcEvent,
} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { useForm } from "antd/es/form/Form";
import { ITypeDataLeave } from "../../common";
import { dateToStringThNoTime } from "@/app/utils/format";
import { PaperClipOutlined } from "@ant-design/icons";
import "../../common/style.css";

interface CustomEvent extends RbcEvent {
  id: number | undefined;
  title: string;
  status: string;
  start: Date;
  end: Date;
  description: string;
  userName: string | undefined;
}

export interface Props {
  departmentId: ITypeDataLeave[];
  downloadFile: (id: number, filename: string) => void;
}

export const DepartmentCalendarDetail: React.FC<Props> = ({
  departmentId,
  downloadFile,
}: any) => {
  const localizer = momentLocalizer(moment);
  const [modalDataLeaveDetail, setModalDataLeaveDetail] = useState(false);
  const [formDetail] = Form.useForm();
  const onCancelModalDetail = () => {
    setModalDataLeaveDetail(false);
  };

  const onSelectEventCalendar = (event: CustomEvent) => {
    const dataLeaveCalendar = departmentId.find((b: any) => b.id === event.id);
    if (dataLeaveCalendar) {
      formDetail.setFieldsValue({
        ...dataLeaveCalendar,
        name: `${dataLeaveCalendar.firstName} ${dataLeaveCalendar.lastName}`,
        detail: dataLeaveCalendar.detail,
        typeLeave: dataLeaveCalendar.typeName,
        leaveHour: dataLeaveCalendar.leaveHour
          ? dataLeaveCalendar.leaveHour % 8 === 0
            ? `${dataLeaveCalendar.leaveHour / 8} วัน`
            : `${dataLeaveCalendar.leaveHour} ชม.`
          : "ไม่มีข้อมูล",
        startDate: dataLeaveCalendar.startDate
          ? dateToStringThNoTime(dataLeaveCalendar.startDate)
          : "-",
        endDate: dataLeaveCalendar.endDate
          ? dateToStringThNoTime(dataLeaveCalendar.endDate)
          : "-",
        createAt: dataLeaveCalendar.createdAt
          ? dateToStringThNoTime(dataLeaveCalendar.createdAt)
          : "-",
        approvedDate: dataLeaveCalendar.approvedDate
          ? dateToStringThNoTime(dataLeaveCalendar.approvedDate)
          : "-",
        phoneNumber: dataLeaveCalendar.phoneNumber,
        userApproved: dataLeaveCalendar.userApproved,
        dataLeaveFiles: dataLeaveCalendar.dataLeaveFiles,
        ownerId: dataLeaveCalendar.ownerId,
        ownerName: dataLeaveCalendar.ownerName,
      });
      setModalDataLeaveDetail(true);
    }
  };

  return (
    <div>
      <Calendar<CustomEvent>
        localizer={localizer}
        events={departmentId.map((dataLeaveCalendar: ITypeDataLeave) => ({
          id: dataLeaveCalendar.id,
          title: dataLeaveCalendar.firstName,
          start: new Date(dataLeaveCalendar.startDate),
          end: new Date(dataLeaveCalendar.endDate),
          status: dataLeaveCalendar.status,
          description: dataLeaveCalendar?.description || "",
          userName: dataLeaveCalendar.typeName,
        }))}
        style={{ height: 500 }}
        onSelectEvent={onSelectEventCalendar}
        eventPropGetter={(event: CustomEvent) => {
          const backgroundColor =
            event.status === "approved"
              ? "DodgerBlue"
              : event.status === "cancel"
              ? "silver"
              : "DodgerBlue";

          return {
            style: { backgroundColor, color: "#fff", fontSize: 10 },
          };
        }}
      />

      <Modal
        title=""
        open={modalDataLeaveDetail}
        footer={false}
        onCancel={() => onCancelModalDetail()}
        width={600}
      >
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
          {Array.isArray(formDetail.getFieldValue("dataLeaveFiles")) &&
            formDetail.getFieldValue("dataLeaveFiles").length > 0 && (
              <>
                {
                  <div className=" col-span-3 md:col-span-1 ml-5">
                    <Form.Item
                      label={`ไฟล์ `}
                      name={`endDate`}
                      layout={`horizontal`}
                    >
                      {formDetail
                        .getFieldValue("dataLeaveFiles")
                        .map((file: any, index: number) => (
                          <div key={index}>
                            <Tooltip title={`ดาวน์โหลด`}>
                              <Button
                                type="link"
                                onClick={() =>
                                  downloadFile(file.id, file.fileName)
                                }
                              >
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
