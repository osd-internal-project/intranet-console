import "react-quill/dist/quill.snow.css";
import React, { useState } from "react";
import { dateFormatTime } from "@/app/utils";
import { Button, Modal, Table } from "antd";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ManageemailTemplateServices } from "../service/email-template.service";
const { confirm } = Modal;

import { ExclamationCircleFilled } from "@ant-design/icons";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

interface props {
  dataSource: any[];
  loading: boolean;
  setLoading: (value: boolean) => void;
}

const EmailTemplateTable: React.FC<props> = ({ dataSource, loading, setLoading }): React.ReactElement => {
  const [openModal, setopenModal] = useState<boolean>(false);
  const [dataDetailTemplate, setDataDetailTemplate] = useState<string>("");
  const intraAuth = useAxiosIntranet();
  const manageemailtemplateservices = ManageemailTemplateServices(intraAuth);

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
    { key: "type", dataIndex: "type", title: "Type" },

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
      <Table size="small" rowKey={(e: any) => e.id} loading={loading} dataSource={dataSource} columns={columns} scroll={{ x: "max-content" }} />
    </div>
  );
};

export default EmailTemplateTable;
