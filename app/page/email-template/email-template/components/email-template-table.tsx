import React, { useState } from "react";
import { dateFormatTime } from "@/app/utils";
import { Button, Modal, Table } from "antd";
import Link from "next/link";
import dynamic from "next/dynamic";

import { ManageemailTemplateServices } from "../../service/email-template.service";

const { confirm } = Modal;
import "react-quill/dist/quill.snow.css";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

interface props {
  dataSource: any[];
  loading: boolean;
}

const EmailTemplateTable: React.FC<props> = ({ dataSource, loading }): React.ReactElement => {
  const [openModal, setopenModal] = useState<boolean>(false);
  const [dataDetailTemplate, setDataDetailTemplate] = useState<string>("");
  const intraAuth = useAxiosIntranet();
  const manageemailtemplateservices = ManageemailTemplateServices(intraAuth);

  const fecthOpenModal = (value: string) => {
    setopenModal(true);
    setDataDetailTemplate(value);
  };

  const showConfirm = (value: number) => {
    confirm({
      title: "Do you want to delete these items?",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      onOk: async () => {
        await manageemailtemplateservices.delete(value);
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
      key: "htmlTemplate",
      dataIndex: "htmlTemplate",
      title: "",
      render: (value: string) => {
        return (
          <div className="justify-center flex">
            <Button type="default" onClick={() => fecthOpenModal(value)}>{`Show Detail`}</Button>
          </div>
        );
      },
    },
    {
      key: "id",
      dataIndex: "id",
      title: "Action",
      align: "center",
      render: (value: number) => {
        return (
          <div className="justify-around flex">
            <div>
              <Button type="primary" danger onClick={() => showConfirm(value)}>{`Del`}</Button>
            </div>
            <div>
              <Link href={`/page/email-template/${value}`}>
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
      <Table size="small" rowKey={(e: any) => e.id} loading={loading} dataSource={dataSource} columns={columns} scroll={{ x: "max-content" }} />
      {openModal && dataDetailTemplate ? (
        <Modal
          open={openModal}
          onCancel={() => {
            setopenModal(false);
            setDataDetailTemplate("");
          }}
          footer={null}>
          <ReactQuill theme="snow" value={dataDetailTemplate} />
        </Modal>
      ) : null}
    </div>
  );
};

export default EmailTemplateTable;
