import "react-quill/dist/quill.snow.css";
import React, { useEffect, useState } from "react";
import { dateFormatTime } from "@/app/utils";
import { Button, Modal, Skeleton, Table, Tabs, Tag } from "antd";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ManageemailTemplateServices } from "../service/email-template.service";
const { confirm } = Modal;

import { ExclamationCircleFilled } from "@ant-design/icons";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

interface props {
  dataSource: any[];
  loading: boolean;
  setLoading: (value: boolean) => void;
}

const EmailTemplateTable: React.FC<props> = ({ dataSource, loading, setLoading }): React.ReactElement => {
  const { id24Axios } = useId24();
  const baseUrlIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const manageemailtemplateservices = ManageemailTemplateServices(baseUrlIntranet);
  const [openModal, setopenModal] = useState<boolean>(false);
  const [dataDetailTemplate, setDataDetailTemplate] = useState<string>("");
  const [setavtiveKey, setActiveKey] = useState<number>(0);
  const [dataTable, setDataTable] = useState<any[]>([]);

  useEffect(() => {
    if (loading) fecthDataSource();
  }, [loading, setavtiveKey]);

  const fecthDataSource = async () => {
    const dataResult = await manageemailtemplateservices.findByType(setavtiveKey);
    setDataTable(dataResult);
    setLoading(true);
  };

  const fecthOpenModal = (value: string) => {
    setopenModal(true);
    setDataDetailTemplate(value);
  };

  const showConfirm = (value: string) => {
    confirm({
      title: "Do you want to delete these items?",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      onOk: async () => {
        const result = await manageemailtemplateservices.delete(value);
        if (result) {
          setLoading(true);
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const columns: any = [
    { key: "id", dataIndex: "id", title: "Template ID" },
    { key: "name", dataIndex: "name", title: "Name" },
    { key: ["emailTemplateType", "name"], dataIndex: ["emailTemplateType", "name"], title: "Type" },
    {
      key: "status",
      dataIndex: "status",
      title: "status",
      align: "center",
      render: (value: string) => <Tag color={value === "inactive" ? "gray" : "green"}>{value}</Tag>,
    },
    {
      key: "used",
      dataIndex: "used",
      title: "Used Template",
      align: "center",
      render: (value: boolean) => <Tag color={value === true ? "green" : "gray"}>{value === true ? "Used" : "Unused"}</Tag>,
    },
    { key: "createAt", dataIndex: "createAt", title: "createAt", render: (value: string) => dateFormatTime(value) },
    { key: "updateAt", dataIndex: "updateAt", title: "updateAt", render: (value: string) => dateFormatTime(value) },
    {
      key: "id",
      dataIndex: "id",
      title: "Action",
      align: "center",
      render: (value: string, record: any) => {
        return (
          <div className="justify-center flex grid-cols-3 ">
            <div className="mr-1">
              <Button type="default" onClick={() => fecthOpenModal(record.htmlTemplate)}>{`Show Detail`}</Button>
            </div>
            <div className="mr-1">
              <Button type="primary" danger onClick={() => showConfirm(value)}>{`Del`}</Button>
            </div>
            <div>
              <Link href={`/page/setting/email-template/${value}`}>
                <Button type="primary">{`Edit`}</Button>
              </Link>
            </div>
          </div>
        );
      },
    },
  ];

  const getdata = (acc: any) => {
    setActiveKey(acc);
    setLoading(true);
  };

  const Items: any = [
    {
      label: "All",
      key: "0",
      children: (
        <Table
          size="small"
          rowKey={(row: any) => row.id}
          dataSource={dataTable}
          columns={columns}
          scroll={{ x: "max-content" }}
          locale={{
            emptyText: loading ? <Skeleton active={true} /> : undefined,
          }}
        />
      ),
    },
    ...dataSource.map((item: any) => ({
      label: item.name,
      key: `${item.id}`,
      children: (
        <Table
          size="small"
          rowKey={(row: any) => row.id}
          dataSource={dataTable}
          columns={columns}
          scroll={{ x: "max-content" }}
          locale={{
            emptyText: loading ? <Skeleton active={true} /> : undefined,
          }}
        />
      ),
    })),
  ];

  return (
    <div>
      {openModal && dataDetailTemplate ? (
        <Modal
          title={`Review Template`}
          open={openModal}
          onCancel={() => {
            setopenModal(false);
            setDataDetailTemplate("");
          }}
          footer={null}
          width={1000}>
          <div>
            <ReactQuill theme="snow" value={dataDetailTemplate} />
          </div>
        </Modal>
      ) : null}
      <Tabs tabPosition="left" size="small" type="card" defaultActiveKey="0" onChange={(key) => getdata(key)} items={Items} />
    </div>
  );
};

export default EmailTemplateTable;
