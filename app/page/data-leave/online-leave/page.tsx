"use client";
import React, { useEffect, useState } from "react";
import { Breadcrumb, Card, Col, Divider, Modal, Row, Typography, UploadFile, message } from "antd";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import DataLeaveService from "../services/index.service";
import { IDataUser, ISelect, ITypeDataLeave, ITypetypeleave, ITypeDataLeaveCreate } from "../common";
import { CreateOnlineLeave } from "./components/create-online-leave";
import { TableOnlineDetailLeave } from "./components/table-online-detail-leave";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import { useRouter } from "next/navigation";
import { RcFile, UploadProps } from "antd/es/upload";

export default function Page() {
  const router = useRouter();
  const Auth = useAxiosIntranet();
  const dataleaveservice = DataLeaveService(Auth);
  const { data: session } = useSession();
  const [getUser, setUser] = useState<IDataUser | null>(session ? session.user : null);
  const [getTypeLeaveOption, setTypeLeaveOption] = useState<ISelect[]>([]);
  const [getTypeLeave, setTypeLeave] = useState<ITypetypeleave[]>([]);
  const [getStartDate, setStartDate] = useState<Date>();
  const [getEndDate, setEndDate] = useState<Date>();
  const [checkSwitch, setCheckSwitch] = useState<boolean>(false);
  const [attendFiles, setAttendFiles] = useState<UploadFile[]>([]);
  const [createdataleaveForm] = useForm();

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (loading) loadDataTypeLeave();
  }, [loading]);

  const loadDataTypeLeave = async () => {
    const res = await dataleaveservice.getdataAll();
    const options = res.map((event: ITypetypeleave) => {
      return { value: event.typeId, label: event.typeName };
    });
    setTypeLeaveOption(options);
    setTypeLeave(res);
    setLoading(false);
  };

  const beforeUploadAttendFiles = (file: RcFile) => {
    if (attendFiles.find((oneFile) => oneFile.name === file.name)) {
      message.warning(`ชื่อไฟล์ ${file.name} ซ้ำ`);
      return false;
    }
    return false;
  };

  const handleChangeAttendFiles: UploadProps["onChange"] = async ({ fileList: newFileList }) => {
    return setAttendFiles(newFileList);
  };

  const onfinishCreate = (values: ITypeDataLeaveCreate) => {
    const startDate = values.startDate ? dayjs(values.startDate).startOf("day") : null;
    const endDate = values.endDate ? dayjs(values.endDate).endOf("day") : null;
    const startTime = values.startTime ? dayjs(values.startTime, "HH:mm") : null;
    const endTime = values.endTime ? dayjs(values.endTime, "HH:mm") : null;
    const selectedOption = getTypeLeaveOption.find((option) => option.value === values.type_id);
    const totalDays = startDate && endDate ? endDate.diff(startDate, "days").toFixed(0) : 0;
    const totalHours = startTime && endTime ? endTime.diff(startTime, "hour", true).toFixed(1) : 0;
    const base: ITypeDataLeave = {
      userId: values.userId,
      firstName: values.firstNameTh,
      lastName: values.lastNameTh,
      positionId: values.posId,
      position: values.position,
      typeId: values.type_id,
      typeName: selectedOption ? selectedOption.label : undefined,
      startDate: values.startDate,
      endDate: values.endDate,
      detail: values.detail,
      phoneNumber: values.phoneNumber,
      status: "waitting",
    };
    const condition: ITypeDataLeave = {
      ...base,
      ...(values.time_start_check
        ? { leaveHour: 8 }
        : {
            leaveHour: values.startTime && values.endTime ? Number(totalHours) : Number(totalDays) * 8,
            startTime: values.startTime,
            endTime: values.endTime,
          }),
    };
    Modal.confirm({
      title: "Add ",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to add this ?",
      okText: "Confirm",
      cancelText: "Cancel",
      okButtonProps: {
        style: {
          backgroundColor: "#00a1df",
          borderColor: "#00a1df",
        },
      },
      onOk: async () => {
        const result = await dataleaveservice.createDataLeave(condition);
        if (result) {
          if (attendFiles.length > 0) {
            attendFiles.forEach(async (file) => {
              const formData: any = new FormData();
              formData.append("type", "attend");
              formData.append("files", file.originFileObj);
              await dataleaveservice.uploadFiles(result.id, formData);
            });
          }
          message.success(`Add success`);
          createdataleaveForm.resetFields();
          setStartDate(undefined);
          setEndDate(undefined);
          setCheckSwitch(false);
          setLoading(true);
          router.push("/page/data-leave/detail-online-leave");
        }
      },
      onCancel() {
        setLoading(false);
      },
    });
  };

  return (
    <div>
      <Row>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page",
                title: <span>Home</span>,
              },
              {
                title: <span>Set Data Leave </span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font">{`Set Date Leave`}</div>
        </Divider>
      </Row>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={12}>
          <CreateOnlineLeave
            getUser={getUser}
            getTypeLeaveOption={getTypeLeaveOption}
            onfinishCreate={(e: ITypeDataLeaveCreate) => onfinishCreate(e)}
            createdataleaveForm={createdataleaveForm}
            setStartDate={(e: Date) => setStartDate(e)}
            setEndDate={(e: Date) => setEndDate(e)}
            setCheckSwitch={(e: boolean) => setCheckSwitch(e)}
            getStartDate={getStartDate}
            getEndDate={getEndDate}
            checkSwitch={checkSwitch}
            beforeUploadAttendFiles={(e: RcFile) => beforeUploadAttendFiles(e)}
            handleChangeAttendFiles={(e: any) => handleChangeAttendFiles(e)}
            attendFiles={attendFiles}
          />
        </Col>
        <Col span={12}>
          <TableOnlineDetailLeave />
        </Col>
      </Row>
    </div>
  );
}
