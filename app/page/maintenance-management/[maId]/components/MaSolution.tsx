import React, { useEffect, useState } from "react";
import type { BadgeProps, CalendarProps, TableColumnsType, TableColumnType } from "antd";
import { Badge, Button, Calendar, Card, DatePicker, Divider, Form, Input, Modal, Select, Space, Switch, Table, Tag, Image } from "antd";
import type { Dayjs } from "dayjs";
import { ColumnType } from "antd/es/table";
import { dateToStringTh, dateToStringThNoTime } from "@/app/utils/format";
import { ITMaDetail, ITMaTask, ITMaType, ITMaUpdateForm, ITMaTaskFiles } from "../../common";
import TextArea from "antd/es/input/TextArea";
import { PaperClipOutlined } from "@ant-design/icons";

export interface props {
  data: ITMaTask;
  downloadFile: (id: number, name: string) => void;
  getImageBlob: (id: number, name: string) => Promise<Blob | undefined>;
}

const MaDescriptionComponent: React.FC<props> = ({ data, downloadFile, getImageBlob }): React.ReactElement => {
  const [imagePreview, setImagePreview] = useState<any[]>([]);
  useEffect(() => {
    previewImage();
  }, [data]);

  async function previewImage() {
    const preview = await Promise.all(
      data.imageList.map(async (image) => {
        const fileData = await getImageBlob(image.id, image.fileName);
        return { ...image, fileData: fileData };
      }),
    );
    setImagePreview(preview);
  }

  return (
    <>
      <h2>ผลการดำเนินการ</h2>
      <div className="grid  grid-cols-1 md:grid-cols-3">
        <div className="grid  grid-cols-3 mb-2">
          <div className=" col-span-1 font-bold">วันที่ดำเนินการ :</div>
          <div className=" col-span-2"> {data.actionDate ? dateToStringThNoTime(data.actionDate) : ""}</div>
        </div>
        <div className="grid  grid-cols-3 mb-2">
          <div className=" col-span-1 font-bold">วันที่อัปเดต :</div>
          <div className=" col-span-2"> {data.updatedAt ? dateToStringThNoTime(data.updatedAt) : ""}</div>
        </div>
        <div className="grid  grid-cols-3 mb-2">
          <div className=" col-span-1 font-bold">ผู้อัปเดต :</div>
          <div className=" col-span-2"> {data.updatedByName}</div>
        </div>
        <div>
          <div className=" col-span-1 font-bold">สรุปผลการดำเนินการ :</div>
          <div className=" col-span-2">{data.solution}</div>
        </div>
      </div>
      {imagePreview.length > 0 ? (
        <div className="mt-4">
          <div className="font-bold">Images :</div>
          <div className=" flex gap-2">
            {imagePreview.map((image, index) => (
              <div key={index} className=" m-1">
                <Image height={50} preview={true} src={image.fileData ? URL.createObjectURL(image.fileData) : ""} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-2">{`Images : -`}</div>
      )}
      {data.fileList.length > 0 ? (
        <div className="mt-4">
          <div className="font-extrabold">Files :</div>
          <div>
            {data.fileList.map((file, index) => (
              <div key={index}>
                <Button type="link" onClick={() => downloadFile(file.id, file.fileName)}>
                  <Space>
                    <PaperClipOutlined />
                    {file.fileName}
                  </Space>
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-2">{`-`}</div>
      )}
    </>
  );
};

export default MaDescriptionComponent;
