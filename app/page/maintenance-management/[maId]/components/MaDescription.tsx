import React, { useState } from "react";
import type { BadgeProps, CalendarProps, TableColumnsType, TableColumnType, UploadFile } from "antd";
import { Badge, Button, Calendar, Card, DatePicker, Divider, Form, Input, Modal, Select, Switch, Table, Tag } from "antd";
import type { Dayjs } from "dayjs";
import { ColumnType } from "antd/es/table";
import { dateToStringTh, dateToStringThNoTime } from "@/app/utils/format";
import { ITMaDetail, ITMaTask, ITMaType, ITMaUpdateForm } from "../../common";
import TextArea from "antd/es/input/TextArea";
import MaSubmitForm from "./MaSubmitForm";
import MaSolution from "./MaSolution";
import Link from "next/link";

export interface props {
  data: ITMaTask;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  updateMa: (data: ITMaUpdateForm, attendFiles: UploadFile[], imageFiles: UploadFile[]) => void;
  maTypes: ITMaType[];
  downloadFile: (id: number, name: string) => void;
  getImageBlob: (id: number, name: string) => Promise<Blob | undefined>;
}

const MaDescriptionComponent: React.FC<props> = ({
  data,
  loading,
  setLoading,
  maTypes,
  updateMa,
  downloadFile,
  getImageBlob,
}): React.ReactElement => {
  return (
    <Card styles={{ body: { padding: "10px" } }}>
      <div className="grid grid-cols-1 md:grid-cols-3">
        <div className="  grid  grid-cols-3 mb-2">
          <div className=" col-span-1 font-bold">สถานะ :</div>
          <div className=" col-span-2">
            {data.maStatus ? (
              data.maStatus === "process" ? (
                <Tag key={data.maStatus} color="blue" bordered={true}>
                  รอดำเนินการ
                </Tag>
              ) : data.maStatus === "success" ? (
                <Tag key={data.maStatus} color="green" bordered={true}>
                  สำเร็จ
                </Tag>
              ) : data.maStatus === "cancel" ? (
                <Tag key={data.maStatus} color="red" bordered={true}>
                  ยกเลิก
                </Tag>
              ) : (
                ""
              )
            ) : (
              ""
            )}
          </div>
        </div>
        <div className=" md:col-span-2 flex justify-end">
          {data?.refTask ? (
            <Link href={`/page/maintenance-management/${data.refTask.id}`}>
              <Button type="link">งานก่อนหน้า</Button>
            </Link>
          ) : (
            ""
          )}
          {data?.nextTask ? (
            <Link href={`/page/maintenance-management/${data.nextTask.id}`}>
              <Button type="link">งานถัดไป</Button>
            </Link>
          ) : (
            ""
          )}
        </div>
        <div className="grid grid-cols-3 mb-2">
          <div className=" col-span-1 font-bold">ประเภท MA :</div>
          <div className=" col-span-2">{data.maCategory}</div>
        </div>
        <div className="grid grid-cols-3 mb-2">
          <div className=" col-span-1 font-bold">เรื่อง MA :</div>
          <div className=" col-span-2">{data.maTypeName}</div>
        </div>
        <div className="grid  grid-cols-3 mb-2 ">
          <div className=" col-span-1 font-bold">หัวข้อ MA :</div>
          <div className=" col-span-2">{data.maName}</div>
        </div>
        <div className="grid  grid-cols-3  mb-2">
          <div className=" col-span-1 font-bold">วันนัดหมาย :</div>
          <div className=" col-span-2">{data.maDate ? dateToStringTh(data.maDate) : ""}</div>
        </div>
        <div className="grid  grid-cols-3 mb-2 ">
          <div className=" col-span-1 font-bold">ผู้นัดหมาย :</div>
          <div className=" col-span-2">{data.contact}</div>
        </div>
        <div className="grid  grid-cols-3  mb-2">
          <div className=" col-span-1 font-bold">วันที่สร้าง :</div>
          <div className=" col-span-2">{data.createdAt ? dateToStringThNoTime(data.createdAt) : ""}</div>
        </div>
        <div className="grid  grid-cols-3  mb-2">
          <div className=" col-span-1 font-bold">ผู้สร้าง :</div>
          <div className=" col-span-2">{data.createdByName}</div>
        </div>
        <div className="grid  grid-cols-3  mb-2">
          <div className=" col-span-1 font-bold">มอบหมายให้ :</div>
          <div className=" col-span-2">{data.assignUsername}</div>
        </div>
      </div>
      <div>
        <div className="font-bold">เนื้อหา :</div>
        <div className=" ">{data.detail}</div>
      </div>

      <Divider />
      {data.maStatus === "process" ? (
        <MaSubmitForm updateMa={updateMa} maTypes={maTypes} />
      ) : (
        <MaSolution data={data} downloadFile={downloadFile} getImageBlob={getImageBlob} />
      )}
    </Card>
  );
};

export default MaDescriptionComponent;
