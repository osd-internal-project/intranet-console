import {
  Button,
  message,
  Table,
  Space,
  Modal,
  Form,
  Input,
  Tag,
  Popconfirm,
  Tooltip,
  Switch,
  TableProps,
} from "antd";
import React, { useEffect, useState } from "react";
import { ManageemailTemplateServices } from "../service/emailtemplate.service";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { FormProps, useForm } from "antd/es/form/Form";
import { DeleteIcon, EditIcon } from "@/components/icon";
export interface emailTemplate {
  id: number;
  name: String;
  formdoc: String;
  createAt?: Date;
  updateAt?: Date;
}
const HtmlEditor = () => {
  const intraAuth = useAxiosIntranet();
  const [inputText, setInputText] = useState<string>("");
  const [htmlOutput, setHtmlOutput] = useState<string>("");
  const [emailTemplate, setemailTemplate] = useState<emailTemplate[]>([]);

  const [IsmodlaOpencreate, setIsmodlaOpencreate] = useState(false);
  const [IsmodlaOpenupdate, setIsmodlaOpenupdate] = useState(false);

  const manageemailTemplateServices = ManageemailTemplateServices(intraAuth);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [form] = useForm();
  const [formEdit] = useForm();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDataemailTemplate();
  }, []);

  const fetchDataemailTemplate = async () => {
    try {
      const maresponse =
        await manageemailTemplateServices.getemailTemplateQuery();
      const emailTemplate: emailTemplate[] = maresponse.map(
        (item: any, index: number) => ({
          ...item,
          key: index.toString(),
        })
      );
      setemailTemplate(emailTemplate);
      setSubmitLoading(false);
    } catch (error) {
      message.error("ไม่สามารถเรียกข้อมูลได้");
    }
  };
  const emailTemplateCreateDatacreate: FormProps<emailTemplate>["onFinish"] =
    async (values) => {
      setSubmitLoading(true);

      const informationNewsCreateData = {
        data: {
          name: values.name,
          formdoc: values.formdoc,
          updatedAt: new Date().toISOString(),
          createAt: new Date().toISOString(),
        },
      };
      try {
        const response = await manageemailTemplateServices.createemailTemplate(
          informationNewsCreateData
        );
        if (response) {
          message.success("เพิ่มประเภทข่าวสารสำเร็จ");
          form.resetFields();
          setIsmodlaOpencreate(false);
        } else {
          message.error("เพิ่มประเภทข่าวสารไม่สำเร็จ");
        }
        setSubmitLoading(false);
        fetchDataemailTemplate();
      } catch (error) {
        message.error("เพิ่มประเภทข่าวสารไม่สำเร็จ");
        setSubmitLoading(false);
      }
    };

  const updatedemailTemplate: FormProps<emailTemplate>["onFinish"] = async (
    values
  ) => {
    setSubmitLoading(true);

    try {
      const updatedemailTemplate = {
        id: values?.id,
        name: values?.name,
        formdoc: values?.formdoc,
        updatedAt: new Date().toISOString(),
      };
      await manageemailTemplateServices.updateemailTemplate(
        updatedemailTemplate
      );
      message.success("แก้ไขประเภทข่าวสารสำเร็จ");
      fetchDataemailTemplate();
      setSubmitLoading(false);
      setIsmodlaOpenupdate(false);
    } catch (error) {
      fetchDataemailTemplate();
      message.error("แก้ไขประเภทข่าวสารไม่สำเร็จ");
    }
  };

  const handleDeleteemailTemplate = async (id: number) => {
    try {
      await manageemailTemplateServices.deleteemailTemplate(id);
      setemailTemplate(emailTemplate.filter((item) => item.id !== id));
      message.success("ลบประเภทข่าวสารสำเร็จ");
      fetchDataemailTemplate();
    } catch (error) {
      message.error("ลบประเภทไม่ข่าวสารสำเร็จ");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const convertToHtml = () => {
    setHtmlOutput(inputText);
  };

  const handleclosecreate = () => {
    form.resetFields();
    setIsmodlaOpencreate(false);
  };
  const handlecloseupdate = () => {
    formEdit.resetFields();
    setIsmodlaOpenupdate(false);
  };
  const handleOpencreate = () => {
    form.resetFields();
    setIsmodlaOpencreate(true);
  };
  const handleOpenupdate = (record: emailTemplate) => {
    formEdit.setFieldsValue(record);
    setIsmodlaOpenupdate(true);
  };

  const dataWithKey = emailTemplate.map((item, index) => ({
    ...item,
    key: index + 1,
    index: index + 1,
  }));

  const columns: TableProps<emailTemplate>["columns"] = [
    {
      title: "ลำดับ",
      dataIndex: "key",
      key: "key",
      width: "40px",
      align: "center",
      fixed: "left",
    },
    {
      title: "ชื่ออีเมล",
      dataIndex: "name",
      key: "name",
      width: "300px",
      fixed: "left",
    },
    {
      title: "formtemplate",
      dataIndex: "formdoc",
      key: "formdoc",
      width: "170px",
    },
    {
      title: "วันที่สร้าง",
      dataIndex: "createAt",
      key: "createAt",
      width: "170px",
    },
    {
      title: "วันที่อัปเดต",
      dataIndex: "updateAt",
      key: "updateAt",
      width: "170px",
    },
    {
      title: "การจัดการ",
      dataIndex: "manage",
      key: "manage",
      align: "center",
      width: "70px",
      render: (record: emailTemplate, row: any) => (
        <Space size="middle">
          <Tooltip title="แก้ไข">
            <a onClick={() => handleOpenupdate(row)}>{EditIcon}</a>
          </Tooltip>
          <Popconfirm
            title="คุณแน่ใจหรือไม่ว่าต้องการลบประเภทข่าวสารนี้ ? "
            onConfirm={() => handleDeleteemailTemplate(row.idType)}
            okText="ใช่"
            cancelText="ไม่"
          >
            <Tooltip title="ลบ">
              <a>
                {" "}
                <DeleteIcon width="24" height="24" />{" "}
              </a>
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <div>
      <div
        style={{
          float: "right",
          margin: "13px 10px 0 10px ",
          padding: " 18px 30px 20px 30px",
          fontSize: "16px",
        }}
      >
        <Button type="primary" onClick={handleOpencreate}>
          Add form email
        </Button>
      </div>{" "}
      <Modal
        title="สร้างประเภทข้อมูลข่าวสาร"
        open={IsmodlaOpencreate}
        onCancel={handleclosecreate}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          onFinish={emailTemplateCreateDatacreate}
          layout="vertical"
        >
          <Form.Item
            name="id"
            label="ลำดับ :"
            rules={[{ required: true, message: "กรุณากรอกชื่อประเภทข่าวสาร" }]}
            style={{ width: "460px" }}
          >
            <Input placeholder="ชื่อประเภทข่าวสาร" showCount maxLength={50} />
          </Form.Item>

          <Form.Item
            name="name"
            label="ชื่ออีเมล:"
            rules={[{ required: true, message: "กรุณากรอกชื่อประเภทข่าวสาร" }]}
            style={{ width: "460px" }}
          >
            <Input placeholder="ชื่อประเภทข่าวสาร" showCount maxLength={50} />
          </Form.Item>

          <Form.Item
            name="formdoc"
            label="ฟอร์มเอกสาร :"
            rules={[{ required: true, message: "กรุณากรอกชื่อประเภทข่าวสาร" }]}
            style={{ width: "460px" }}
          >
            <Input.TextArea
              placeholder="ชื่อประเภทข่าวสาร"
              showCount
              rows={12}
            />
          </Form.Item>

          <div className="flex justify-end w-full">
            <Form.Item>
              <Button
                type="default"
                onClick={handleclosecreate}
                style={{ marginRight: 8 }}
              >
                ยกเลิก
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={submitLoading}>
                ตกลง
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
      <Modal
        title="สร้างประเภทข้อมูลข่าวสาร"
        open={IsmodlaOpenupdate}
        onCancel={handlecloseupdate}
        footer={null}
        destroyOnClose
      >
        <Form
          form={formEdit}
          onFinish={updatedemailTemplate}
          layout="vertical"
        >
          <Form.Item
            name="id"
            label="ลำดับ :"
            rules={[{ required: true, message: "กรุณากรอกชื่อประเภทข่าวสาร" }]}
            style={{ width: "460px" }}
          >
            <Input placeholder="ชื่อประเภทข่าวสาร" showCount maxLength={50} />
          </Form.Item>

          <Form.Item
            name="name"
            label="ชื่ออีเมล:"
            rules={[{ required: true, message: "กรุณากรอกชื่อประเภทข่าวสาร" }]}
            style={{ width: "460px" }}
          >
            <Input placeholder="ชื่อประเภทข่าวสาร" showCount maxLength={50} />
          </Form.Item>

          <Form.Item
            name="formdoc"
            label="ฟอร์มเอกสาร :"
            rules={[{ required: true, message: "กรุณากรอกชื่อประเภทข่าวสาร" }]}
            style={{ width: "460px" }}
          >
            <Input.TextArea
              placeholder="ชื่อประเภทข่าวสาร"
              showCount
              rows={12}
            />
          </Form.Item>

          <div className="flex justify-end w-full">
            <Form.Item>
              <Button
                type="default"
                onClick={handlecloseupdate}
                style={{ marginRight: 8 }}
              >
                ยกเลิก
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={submitLoading}>
                ตกลง
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
      <Table
        dataSource={dataWithKey}
        columns={columns}
        scroll={{ x: "max-content" }}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
      />
      <div style={{ padding: "20px" }}>
        <h1>ทดสอบ CODE HTML</h1>
        <textarea
          style={{ width: "100%", height: "100px", marginBottom: "20px" }}
          value={inputText}
          onChange={handleInputChange}
        ></textarea>
        <br />
        <Button type="primary" onClick={convertToHtml}>
          แปลง HTML
        </Button>
        <h3>HTML Output:</h3>
        <div
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginTop: "20px",
          }}
          dangerouslySetInnerHTML={{ __html: htmlOutput }}
        ></div>
      </div>
    </div>
  );
};

export default HtmlEditor;
