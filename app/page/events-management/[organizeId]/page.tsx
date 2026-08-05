"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Popconfirm,
  DatePicker,
  Select,
  Breadcrumb,
  notification,
  Upload,
  Spin,
  type GetProp,
  Tag,
  Tooltip,
  Modal,
} from "antd";
import { PlusOutlined, DeleteOutlined, CheckCircleOutlined, PlusCircleOutlined, EditOutlined } from "@ant-design/icons";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import UserServices from "@/app/services/user.service";
import MasterRestaurantServices from "@/app/services/master-restaurant.service";
import OrganizeManagementServices from "@/app/services/organize-management-task.service";
import { ColumnsType } from "antd/es/table";
import { handleCompress } from "@/app/utils";
import { statusOptions, ITSelect, TaskNode } from "./utils";
import { useParams } from "next/navigation";
import { organizeManagementTaskCreateInput } from "@/app/common/organize-management-task";
import { RcFile, type UploadFile, type UploadProps } from "antd/es/upload";
import dayjs from "dayjs";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export default function Page() {
  const params = useParams<{ organizeId: string }>();
  const [api, contextHolder] = notification.useNotification();
  const { id24Axios } = useId24();
  const baseUrIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const baseUrlUser = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_USER);
  const userservices = UserServices(baseUrlUser);
  const masterrestaurantServices = MasterRestaurantServices(baseUrIntranet);
  const organizemanagementServices = OrganizeManagementServices(baseUrIntranet);
  const [data, setData] = useState<TaskNode[]>([]);
  const [dataDetail, setDataDetail] = useState<organizeManagementTaskCreateInput>();
  const [optionsUsers, setOptionsUsers] = useState<ITSelect[]>([]);
  const [optionsRestaurant, setOptionsRestaurant] = useState<ITSelect[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (params.organizeId || loading) fecthData(params.organizeId);
  }, [params, loading]);

  useEffect(() => {
    if (params.organizeId) masterData(params.organizeId);
  }, [params.organizeId]);

  const fecthData = async (organizeId: string) => {
    const response = await organizemanagementServices.getByOrganizeId(organizeId);
    const mapped = mapApiToTaskNode(response || []);
    setData(mapped);
    setLoading(false);
  };

  const masterData = async (organizeId: string) => {
    const organizedDetail = await organizemanagementServices.getDataById(organizeId);
    setDataDetail(organizedDetail);
    const masterUsers = await userservices.getUsersAllDropdown();
    const masterRestaurant = await masterrestaurantServices.dataOptions();
    const mappedNameOptions = masterUsers.map((option: ITUser) => {
      return {
        value: option.userId,
        label: `${option.firstNameTh} ${option.lastNameTh}`,
      };
    });
    const mappedRestaurantOptions = masterRestaurant.map((e) => {
      return { value: e.name, label: e.name };
    });
    setOptionsUsers(mappedNameOptions);
    setOptionsRestaurant(mappedRestaurantOptions);
  };
  const handleManage = (key: string, field: keyof TaskNode, value: any) => {
    const newData = [...data];
    const updateRecursive = (list: TaskNode[]) => {
      for (let item of list) {
        if (item.key === key) {
          (item as any)[field] = value;
          return true;
        }
        if (item.children && updateRecursive(item.children)) return true;
      }
      return false;
    };
    updateRecursive(newData);
    setData(newData);
  };
  const addMainTask = () => {
    const newRow: TaskNode = {
      key: `main-${Date.now()}`,
      name: "",
      assigned: undefined,
      dueDate: undefined,
      status: undefined,
      remark: undefined,
      children: [],
    };

    setData([...data, newRow]);
  };

  const addSubTask = (parentKey: string) => {
    const newData = [...data];
    const findAndAdd = (list: TaskNode[]) => {
      for (let item of list) {
        if (item.key === parentKey) {
          if (!item.children) item.children = [];

          item.children.push({
            key: `sub-${Date.now()}`,
            name: "",
            assigned: undefined,
            dueDate: "",
            status: "",
            remark: "",
          });

          return true;
        }
        if (item.children && findAndAdd(item.children)) return true;
      }
      return false;
    };

    findAndAdd(newData);
    setData(newData);
  };

  // const deleteTask = async (key: string, parentNode: string, record: any) => {
  //   const { children, files, id, ...conditions } = record || {};
  //   const filterRecursive = (list: TaskNode[]): TaskNode[] => {
  //     return list
  //       .filter((item) => item.key !== key)
  //       .map((item) => ({
  //         ...item,
  //         children: item.children ? filterRecursive(item.children) : undefined,
  //       }));
  //   };
  //   setData(filterRecursive(data));
  //   if (parentNode === "parent") {
  //     await organizemanagementServices.deleteTask(id);
  //     api.success({
  //       message: "Delete Task success",
  //     });
  //     setLoading(true);
  //   } else {
  //     await organizemanagementServices.deleteSubTask(id);
  //     api.success({
  //       message: "Delete Task success",
  //     });
  //     setLoading(true);
  //   }
  // };

  const deleteTask = async (key: string, parentNode: string, record: any) => {
    const { id } = record || {};
    const filterRecursive = (list: TaskNode[]): TaskNode[] => {
      return list
        .filter((item) => item.key !== key)
        .map((item) => ({
          ...item,
          children: item.children ? filterRecursive(item.children) : undefined,
        }));
    };
    setData(filterRecursive(data));
    if (!id) {
      return;
    }

    try {
      if (parentNode === "parent") {
        await organizemanagementServices.deleteTask(id);
      } else {
        await organizemanagementServices.deleteSubTask(id);
      }
      api.success({
        message: "Delete Task success",
      });
      setLoading(true);
    } catch (error) {
      api.error({
        message: "Delete failed",
      });
    }
  };
  const createTask = async (key: string, parentNode: string, record: any) => {
    const { children, files, ...conditions } = record || {};
    try {
      if (parentNode === "parent") {
        const formData = new FormData();
        formData.append("record", JSON.stringify({ ...conditions, organizedId: params.organizeId }));

        if (files?.[0]?.originFileObj) {
          formData.append("files", files[0].originFileObj as RcFile);
        }
        await organizemanagementServices.createTask(formData);
        api.success({
          message: "create Task success",
        });
      } else {
        const parent = findParent(data, record.key);
        const formData = new FormData();
        formData.append("record", JSON.stringify({ ...conditions, organizedId: params.organizeId, organizeTaskId: parent ? parent?.id : undefined }));
        if (files?.[0]?.originFileObj) {
          formData.append("files", files[0].originFileObj as RcFile);
        }
        await organizemanagementServices.createSubTask(formData);
        api.success({
          message: "create Sub Task success",
        });
      }
      setLoading(true);
    } catch (error) {
      api.error({
        message: "create Task failed",
      });
    }
  };
  const editTask = async (key: string, parentNode: string, record: any) => {
    const { children, files, ...conditions } = record || {};
    try {
      if (parentNode === "parent") {
        const formData = new FormData();
        formData.append("record", JSON.stringify({ ...conditions, organizedId: params.organizeId }));
        if (files?.[0]?.originFileObj) {
          formData.append("files", files[0].originFileObj as RcFile);
        }
        await organizemanagementServices.updateTask(record.id, formData);
        api.success({
          message: "create Task success",
        });
      } else {
        const parent = findParent(data, record.key);
        const formData = new FormData();
        formData.append("record", JSON.stringify({ ...conditions, organizedId: params.organizeId, organizeTaskId: parent ? parent?.id : undefined }));
        if (files?.[0]?.originFileObj) {
          formData.append("files", files[0].originFileObj as RcFile);
        }
        await organizemanagementServices.updateSubTask(record.id, formData);
        api.success({
          message: "create Sub Task success",
        });
      }
      setLoading(true);
    } catch (error) {
      api.error({
        message: "update Task failed",
      });
    }
  };
  const isParent = (record: TaskNode) => record.children && record.children.length > 0;
  const findParent = (list: TaskNode[], childKey: string): TaskNode | null => {
    for (let item of list) {
      if (item.children?.some((c) => c.key === childKey)) {
        return item;
      }
      if (item.children) {
        const found = findParent(item.children, childKey);
        if (found) return found;
      }
    }
    return null;
  };

  const mapApiToTaskNode = (tasks: any[]): TaskNode[] => {
    console.log(tasks);

    return tasks.map((task) => ({
      key: `main-${task.id}`, // 👈 สำคัญ (ต้อง unique)
      id: task.id,
      name: task.name,
      assigned: task.assigned,
      assignedDate: task.assignedDate,
      dueDate: task.dueDate,
      status: task.status,
      remark: task.remark,
      pathFiles: task.pathFiles,
      expenses: task.expenses,
      files: task.pathFiles.objectName
        ? [
            {
              uid: "-1",
              name: task.pathFiles.originalName,
              status: "done",
              url: task.fileUrl,
            },
          ]
        : undefined,
      children: task.organizeSubTasks?.map((sub: any) => {
        return {
          key: `sub-${sub.id}`,
          id: sub.id,
          name: sub.name,
          assigned: sub.assigned,
          assignedDate: sub.assignedDate,
          dueDate: sub.dueDate,
          status: sub.status,
          remark: sub.remark,
          pathFiles: sub.pathFiles,
          expenses: sub.expenses,
          files: sub.pathFiles.objectName
            ? [
                {
                  uid: "-1",
                  name: sub.pathFiles.originalName,
                  status: "done",
                  url: sub.fileUrl,
                },
              ]
            : undefined,
        };
      }),
    }));
  };

  const isCreated = (record: TaskNode) => {
    return !!record.id;
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    setPreviewImage(src);
    setPreviewOpen(true);
  };

  const downloadFile = async (data: { objectName: string; originalName: string }) => {
    try {
      const blob = await organizemanagementServices.download(data.objectName);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", data.originalName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  const columns: ColumnsType<TaskNode> = [
    {
      title: "Task",
      dataIndex: "name",
      render: (text: string, record: TaskNode) => {
        const parent = findParent(data, record.key);
        const isChild = !!parent;
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {isChild && <span style={{ color: "#bae0ff", fontSize: 18, lineHeight: 1, flexShrink: 0 }}>└</span>}

            <Input
              size="small"
              value={text}
              onChange={(e) => handleManage(record.key, "name", e.target.value)}
              placeholder="Please Input"
              style={{
                fontWeight: isChild ? 400 : 600,
                borderColor: isChild ? undefined : "#4096ff",
                background: isChild ? undefined : "#f0f5ff",
              }}
            />
          </div>
        );
      },
    },
    {
      title: "มอบหมายให้",
      dataIndex: "assigned",
      render: (_: any, record: TaskNode) => {
        // if (isParent(record)) return null;
        return (
          <Select
            size="small"
            value={_}
            showSearch
            allowClear
            optionFilterProp="label"
            style={{ width: "100%" }}
            options={optionsUsers}
            onChange={(val) => handleManage(record.key, "assigned", val)}
            placeholder={`Please Select`}
          />
        );
      },
    },
    {
      title: "วันที่ได้รับมอบหมาย",
      dataIndex: "assignedDate",
      render: (_: any, record: TaskNode) => {
        // if (isParent(record)) return null;
        return (
          <DatePicker
            size="small"
            value={_ ? dayjs(_) : undefined}
            style={{ width: "100%" }}
            onChange={(date) => handleManage(record.key, "assignedDate", date ? date.toISOString() : undefined)}
          />
        );
      },
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      render: (_: any, record: TaskNode) => {
        // if (isParent(record)) return null;
        return (
          <Select
            size="small"
            value={_ ? _ : undefined}
            showSearch
            optionFilterProp="label"
            allowClear
            style={{ width: "100%" }}
            options={statusOptions}
            onChange={(val) => handleManage(record.key, "status", val)}
            placeholder={`Please Select`}
          />
        );
      },
    },
    {
      title: "หมายเหตุ",
      dataIndex: "remark",
      render: (_: any, record: TaskNode) => {
        // if (isParent(record)) return null;
        return (
          <Input.TextArea
            size="small"
            value={_}
            showCount
            maxLength={250}
            placeholder={`Please Input`}
            onChange={(e) => handleManage(record.key, "remark", e.target.value)}
          />
        );
      },
    },
    {
      title: "ค่าใช้จ่าย",
      dataIndex: "expenses",
      width: "150px",
      render: (_: any, record: TaskNode) => {
        return (
          <Input
            size="small"
            prefix="฿"
            suffix="THB"
            type="number"
            value={_}
            placeholder={`Input number`}
            onChange={(e) => handleManage(record.key, "expenses", e.target.value)}
          />
        );
      },
    },
    {
      title: "วันครบกำหนด",
      dataIndex: "dueDate",
      render: (_: any, record: TaskNode) => {
        return (
          <DatePicker
            size="small"
            value={_ ? dayjs(_) : undefined}
            style={{ width: "100%" }}
            onChange={(date) => handleManage(record.key, "dueDate", date ? date.toISOString() : undefined)}
          />
        );
      },
    },
    {
      title: "แนบไฟล์",
      dataIndex: "files",
      align: "center",
      render: (_: any, record: TaskNode) => {
        return (
          <div className="grid grid-cols-1 text-center items-center w-full gap-2">
            <div className="flex justify-center">
              <Upload
                className="upload-small"
                fileList={record.files ? record.files : []}
                listType="picture-card"
                maxCount={1}
                beforeUpload={async (file) => {
                  const compressed = await handleCompress(file);
                  return compressed;
                }}
                onChange={({ fileList }) => handleManage(record.key, "files", fileList)}
                onPreview={onPreview}
              >
                {(record.files?.length || 0) < 1 && "+ Upload"}
              </Upload>
            </div>
            <Button type="link" onClick={() => downloadFile(record.pathFiles)} disabled={record.files ? false : true}>{`ดาวน์โหลดไฟล์`}</Button>
          </div>
        );
      },
    },
    {
      title: "...",
      align: "center",
      render: (_: any, record: TaskNode) => {
        const parent = findParent(data, record.key);
        const isChild = !!parent;
        const doneStatus = record.status === "done";
        const created = isCreated(record);

        return (
          <Space>
            {!isChild && ( // ← ซ่อนถ้ายังไม่มี sub
              <Tooltip title="เพิ่ม Sub Task">
                <Button type="text" icon={<PlusCircleOutlined style={{ color: "#4096ff" }} />} onClick={() => addSubTask(record.key)} />
              </Tooltip>
            )}
            <Popconfirm title="ลบ?" onConfirm={() => deleteTask(record.key, isChild ? "children" : "parent", record)}>
              <Button danger type="text" icon={<DeleteOutlined />} />
            </Popconfirm>
            {!created && (
              <Popconfirm title="ยืนยัน ?" onConfirm={() => createTask(record.key, isChild ? "children" : "parent", record)}>
                <Button type="text" icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />} />
              </Popconfirm>
            )}
            {created && !doneStatus && (
              <Popconfirm title="ยืนยัน ?" onConfirm={() => editTask(record.key, isChild ? "children" : "parent", record)}>
                <Button type="text" icon={<EditOutlined style={{ color: "#1677ff" }} />} />
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <Spin spinning={!dataDetail ? true : false}>
      <div>
        {contextHolder}
        <Breadcrumb items={[{ title: "หน้าหลัก" }, { title: "รายละเอียดกิจกรรม" }, { title: `${dataDetail?.name}` }]} />
        <div style={{ marginTop: 10, display: "flex", justifyContent: "end" }}>
          <Button size="small" type="primary" icon={<PlusOutlined />} onClick={addMainTask}>
            เพิ่มหัวข้อ
          </Button>
        </div>
        <Table
          onRow={() => ({ style: { verticalAlign: "top" } })}
          size="small"
          style={{ marginTop: 10 }}
          columns={columns}
          dataSource={data}
          rowKey="key"
          pagination={false}
          rowClassName={(record) => {
            const parent = findParent(data, record.key);
            return parent ? "row-child" : "row-parent";
          }}
          expandable={{
            defaultExpandAllRows: true,
            indentSize: 0,
          }}
        />
        {previewOpen ? (
          <Modal open={previewOpen} footer={null} onCancel={() => setPreviewOpen(false)} centered width="fit-content">
            <img src={previewImage} alt="preview" style={{ maxWidth: "80vw", maxHeight: "80vh", objectFit: "contain" }} />
          </Modal>
        ) : null}
      </div>
    </Spin>
  );
}
