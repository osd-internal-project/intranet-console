import React, { useState } from "react";
import type {
  BadgeProps,
  CalendarProps,
  TableColumnsType,
  TableColumnType,
  UploadFile,
  UploadProps,
} from "antd";
import {
  Badge,
  Button,
  Calendar,
  Card,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Select,
  Switch,
  Table,
  Tag,
  Upload,
} from "antd";
import type { Dayjs } from "dayjs";
import { ColumnType } from "antd/es/table";
import { dateToStringTh, dateToStringThNoTime } from "@/app/utils/format";
import { ITMaDetail, ITMaTask, ITMaType, ITMaUpdateForm } from "../../common";
import TextArea from "antd/es/input/TextArea";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";

export interface props {
  updateMa: (
    data: ITMaUpdateForm,
    attendFiles: UploadFile[],
    imageFiles: UploadFile[]
  ) => void;
  maTypes: ITMaType[];
}

const MaDescriptionComponent: React.FC<props> = ({
  maTypes,
  updateMa,
}): React.ReactElement => {
  const [checkNextTask, setCheckNextTask] = useState<boolean>(false);
  const [imageFiles, setImageFiles] = useState<UploadFile[]>([]);
  const [attendFiles, setAttendFiles] = useState<UploadFile[]>([]);

  const beforeUploadImageFiles = (file: RcFile) => {
    if (imageFiles.find((oneFile) => oneFile.name === file.name)) {
      message.warning(`ชื่อไฟล์ ${file.name} ซ้ำ`);
      return false;
    }
    return false;
  };
  const handleChangeImageFiles: UploadProps["onChange"] = async ({
    fileList: newFileList,
  }) => {
    return setImageFiles(newFileList);
  };
  const beforeUploadAttendFiles = (file: RcFile) => {
    if (attendFiles.find((oneFile) => oneFile.name === file.name)) {
      message.warning(`ชื่อไฟล์ ${file.name} ซ้ำ`);
      return false;
    }
    return false;
  };
  const handleChangeAttendFiles: UploadProps["onChange"] = async ({
    fileList: newFileList,
  }) => {
    return setAttendFiles(newFileList);
  };
  function handleUpdateMa(values: ITMaUpdateForm): void {
    updateMa(values, attendFiles, imageFiles);
  }

  return (
    <>
      <h2>ผลการดำเนินการ</h2>
      <Form layout="vertical" onFinish={handleUpdateMa}>
        <div className=" grid grid-cols-3">
          <Form.Item
            name={"actionDate"}
            label={"วันที่ดำเนินการ"}
            rules={[{ required: true, message: "กรุณาเลือก วันที่ดำเนินการ" }]}
          >
            <DatePicker
              className=" w-10/12"
              showTime={true}
              format={"DD/MM/YYYY HH:mm"}
            />
          </Form.Item>
          <Form.Item
            name={"maStatus"}
            label={"สถานะการดำเนินการ"}
            rules={[
              { required: true, message: "กรุณาเลือก สถานะการดำเนินการ" },
            ]}
          >
            <Select
              options={[
                { label: "ดำเนินการเสร็จสิ้น", value: "success" },
                { label: "ยกเลิก", value: "cancel" },
              ]}
              placeholder="กรุณาเลือก สถานะการดำเนินการ"
            />
          </Form.Item>
          <Form.Item
            name={"solution"}
            label={"สรุปผลการดำเนินการ"}
            className=" col-span-3"
          >
            <TextArea
              rows={4}
              // placeholder="maxLength is 255"
              maxLength={255}
              showCount={true}
            />
          </Form.Item>

          <Form.Item
            className="md:col-span-3"
            label="Upload Images"
            valuePropName="fileList"
            extra="เฉพาะ PNG และ JPEG "
          >
            <Upload
              accept="image/png, image/jpeg"
              fileList={imageFiles}
              onChange={handleChangeImageFiles}
              beforeUpload={beforeUploadImageFiles}
              multiple={true}
              maxCount={10}
              listType="picture"
            >
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            className="md:col-span-3"
            label="Upload Attach Files"
            valuePropName="fileList"
          >
            <Upload
              fileList={attendFiles}
              onChange={handleChangeAttendFiles}
              beforeUpload={beforeUploadAttendFiles}
              multiple={true}
              maxCount={10}
            >
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>
        </div>
        {/* <Button type="primary">Save</Button> */}
        {/* </Form> */}
        {/* <Form labelCol={{ span: 8 }} layout="vertical"> */}
        <Switch
          checkedChildren="ดำเนินการต่อ"
          unCheckedChildren="ไม่มีดำเนินการต่อ"
          checked={checkNextTask}
          className=" mb-2 "
          onChange={() => {
            setCheckNextTask(!checkNextTask);
          }}
        />
        {checkNextTask ? (
          <Card className=" mb-2">
            <div className="grid  grid-cols-1 md:grid-cols-3 gap-2">
              <Form.Item
                name={["nextTask", "maTypeId"]}
                label={"ประเภท MA"}
                rules={[{ required: true, message: "กรุณาเลือก ประเภท MA" }]}
              >
                <Select
                  options={
                    maTypes
                      ? maTypes.map((type) => ({
                          value: type.id,
                          label: type.name,
                        }))
                      : []
                  }
                />
              </Form.Item>

              <Form.Item
                name={["nextTask", "maName"]}
                label={"ชื่อ MA"}
                rules={[{ required: true, message: "กรุณากรอกชื่อ MA" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={["nextTask", "maDate"]}
                label={"วันนัดหมาย"}
                rules={[{ required: true, message: "กรุณาเลือกวันนัดหมาย" }]}
              >
                <DatePicker
                  showTime={true}
                  className=" w-full"
                  format={"DD/MM/YYYY HH:mm"}
                />
              </Form.Item>
              <Form.Item name={["nextTask", "contact"]} label={"ผู้นัดหมาย"}>
                <Input />
              </Form.Item>
              <Form.Item
                labelCol={{}}
                name={["nextTask", "detail"]}
                label={"เนื้อหา"}
                className="md:col-span-3"
              >
                <TextArea
                  placeholder="maxLength is 255"
                  maxLength={255}
                  showCount={true}
                />
              </Form.Item>
            </div>
          </Card>
        ) : (
          ""
        )}
        <Form.Item className=" text-right">
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default MaDescriptionComponent;
