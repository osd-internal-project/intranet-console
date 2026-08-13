"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Card,
  Descriptions,
  Empty,
  Form,
  Input,
  Modal,
  Space,
  Table,
  Tag,
  Tooltip,
  message,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  PlusOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import UserGroupServices from "@/app/services/usergroup.service";
import UserServices from "../../users/services/user.service";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import { notifyError, notifySuccess } from "@/app/utils/message";
import { ACTION_LABEL } from "@/app/config/messages";
import {
  ITUserGroup,
  ITUserGroupMember,
  ITUserGroupUpdate,
} from "@/app/common/user-group";
import { GroupManageSkeleton } from "./Skeleton";

/** ความยาวสูงสุดของชื่อกลุ่ม ตาม schema (group_name VarChar(200)) */
const GROUP_NAME_MAX_LENGTH = 200;

export interface props {
  readonly groupId: string | null;
  readonly selectedOrganize: string | null;
  /** เพิ่มค่าเมื่อข้อมูลกลุ่มถูกแก้ไข เพื่อสั่งโหลดรายละเอียดใหม่ทั้งที่ groupId เท่าเดิม */
  readonly refreshToken: number;
  readonly onRefresh: (groupId: string | null) => void;
}

/**
 * แปลงวันที่จาก API เป็นรูปแบบไทยแบบสั้น
 * @param value ค่าวันที่จาก API
 * @returns ข้อความวันที่ หรือ "-" เมื่อไม่มีค่า
 */
function formatDate(value: string | undefined): string {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString("th-TH");
}

/**
 * แผงจัดการกลุ่มผู้ใช้งานหนึ่งกลุ่ม — ดูรายละเอียด แก้ไข เพิ่มกลุ่มย่อย และลบ
 * @param props กลุ่มที่เลือกอยู่ องค์กรปัจจุบัน และ callback สั่งโหลดทรีใหม่
 * @returns element การ์ดรายละเอียดกลุ่ม
 */
const GroupManage: React.FC<props> = ({
  groupId,
  selectedOrganize,
  refreshToken,
  onRefresh,
}): React.ReactElement => {
  const { id24Axios } = useId24();
  const baseUrlUser = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_USER);
  const [editForm] = Form.useForm<ITUserGroupUpdate>();
  const [addForm] = Form.useForm();

  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [group, setGroup] = useState<ITUserGroup | null>(null);
  const [members, setMembers] = useState<ITUserGroupMember[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [openMemberModal, setOpenMemberModal] = useState<boolean>(false);

  const fetchGroup = useCallback(async (): Promise<void> => {
    setIsEditing(false);
    setGroup(null);
    setMembers([]);

    if (!groupId) {
      return;
    }

    setLoading(true);
    const [detail, usersInGroup] = await Promise.all([
      UserGroupServices(baseUrlUser).getUserGroupByGroupId(groupId),
      UserServices(baseUrlUser).findUserInOnwerGroupByUserGroupId(groupId),
    ]);

    // service ทั้งสองตัวคืน [] หรือ error object เมื่อเรียกไม่สำเร็จ จึงต้องตรวจรูปร่างก่อนใช้
    const detailGroup =
      detail && !Array.isArray(detail) ? (detail as ITUserGroup) : null;
    setGroup(detailGroup);
    setMembers(Array.isArray(usersInGroup) ? usersInGroup : []);

    if (detailGroup) {
      editForm.setFieldsValue({
        groupName: detailGroup.groupName,
        description: detailGroup.description ?? "",
      });
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId, refreshToken]);

  useEffect(() => {
    fetchGroup();
  }, [fetchGroup]);

  /**
   * บันทึกการแก้ไขกลุ่ม — ส่งเฉพาะฟิลด์ที่ backend รับจริง
   * @param values ค่าจากฟอร์มแก้ไข
   */
  const onSubmitEdit = async (values: ITUserGroupUpdate): Promise<void> => {
    if (!group) {
      return;
    }
    setSaving(true);
    try {
      await UserGroupServices(baseUrlUser).updateUserGroup(group.groupId, {
        groupName: values.groupName,
        description: values.description ?? "",
      });
      notifySuccess("usergroup.update");
      setIsEditing(false);
      onRefresh(group.groupId);
    } catch (error) {
      notifyError(error, "usergroup.update");
    }
    setSaving(false);
  };

  /**
   * สร้างกลุ่มย่อยภายใต้กลุ่มที่เลือกอยู่
   * @param values ค่าจากฟอร์มเพิ่มกลุ่มย่อย
   */
  const onSubmitAdd = async (values: {
    groupName: string;
    description?: string;
  }): Promise<void> => {
    if (!group) {
      return;
    }
    setSaving(true);
    try {
      await UserGroupServices(baseUrlUser).addUserGroup({
        groupName: values.groupName,
        description: values.description ?? "",
        parentGroupId: group.groupId,
        organizeId: group.organizedGroupId ?? selectedOrganize,
      });
      notifySuccess("usergroup.create");
      setOpenAddModal(false);
      addForm.resetFields();
      onRefresh(group.groupId);
    } catch (error) {
      notifyError(error, "usergroup.create");
    }
    setSaving(false);
  };

  /** ยืนยันแล้วลบกลุ่มที่เลือกอยู่ */
  const onDelete = (): void => {
    if (!group) {
      return;
    }
    Modal.confirm({
      title: "ลบกลุ่มผู้ใช้งาน",
      icon: <ExclamationCircleFilled />,
      content: `ต้องการลบกลุ่ม "${group.groupName}" ใช่หรือไม่`,
      okText: "ลบ",
      cancelText: "ยกเลิก",
      okButtonProps: { danger: true },
      async onOk() {
        try {
          const response = await UserGroupServices(baseUrlUser).deleteUserGroup(
            group.groupId,
          );
          // backend คืน HTTP 200 พร้อม status 401 เมื่อลบไม่ได้ (มีกลุ่มย่อยหรือมีผู้ใช้อยู่)
          // ไม่ใช่ ApiError จึงต้องแสดงเหตุผลจาก backend เอง — notifyError จะกลืนข้อความนี้ทิ้ง
          if (response?.data?.status === 401) {
            message.error(
              `${ACTION_LABEL["usergroup.delete"]}ไม่สำเร็จ: ${response.data.message}`,
            );
            return;
          }
          notifySuccess("usergroup.delete");
          onRefresh(null);
        } catch (error) {
          notifyError(error, "usergroup.delete");
        }
      },
    });
  };

  if (!groupId) {
    return (
      <Card className="h-full">
        <div className="flex min-h-[420px] items-center justify-center">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="เลือกกลุ่มจากทรีด้านซ้ายเพื่อดูรายละเอียด"
          />
        </div>
      </Card>
    );
  }

  if (loading) {
    return <GroupManageSkeleton />;
  }

  // service คืน [] เมื่อเรียกไม่สำเร็จ — แสดงสถานะให้ผู้ใช้รู้ แทนที่จะค้างที่โครงร่าง
  if (!group) {
    return (
      <Card className="h-full">
        <div className="flex min-h-[420px] items-center justify-center">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="ไม่พบข้อมูลกลุ่มนี้"
          />
        </div>
      </Card>
    );
  }

  const isRootGroup = !group.parentGroupId;

  return (
    <>
      <Card
        className="h-full"
        title={
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">{group.groupName}</span>
            {isRootGroup && <Tag color="blue">{"กลุ่มระดับบนสุด"}</Tag>}
          </div>
        }
        extra={
          !isEditing && (
            <Space wrap>
              <Button
                icon={<PlusOutlined />}
                onClick={() => setOpenAddModal(true)}
              >
                {"เพิ่มกลุ่มย่อย"}
              </Button>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => setIsEditing(true)}
              >
                {"แก้ไข"}
              </Button>
              <Tooltip
                title={
                  isRootGroup ? "ลบกลุ่มระดับบนสุดไม่ได้" : "ลบกลุ่มนี้"
                }
              >
                {/* ครอบด้วย span เพื่อให้ Tooltip ยังทำงานตอนปุ่มถูก disabled */}
                <span>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    disabled={isRootGroup}
                    onClick={onDelete}
                  >
                    {"ลบ"}
                  </Button>
                </span>
              </Tooltip>
            </Space>
          )
        }
      >
        {isEditing ? (
          <Form
            form={editForm}
            layout="vertical"
            onFinish={onSubmitEdit}
            disabled={saving}
          >
            <Form.Item
              name="groupName"
              label="ชื่อกลุ่ม"
              rules={[{ required: true, message: "กรุณากรอกชื่อกลุ่ม" }]}
            >
              <Input maxLength={GROUP_NAME_MAX_LENGTH} showCount />
            </Form.Item>
            <Form.Item name="description" label="คำอธิบาย">
              <Input.TextArea rows={3} />
            </Form.Item>
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => {
                  setIsEditing(false);
                  editForm.setFieldsValue({
                    groupName: group.groupName,
                    description: group.description ?? "",
                  });
                }}
              >
                {"ยกเลิก"}
              </Button>
              <Button type="primary" htmlType="submit" loading={saving}>
                {"บันทึก"}
              </Button>
            </div>
          </Form>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <Descriptions bordered size="small" column={1}>
              <Descriptions.Item label="ชื่อกลุ่ม">
                {group.groupName}
              </Descriptions.Item>
              <Descriptions.Item label="คำอธิบาย">
                {group.description || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="สมาชิกในกลุ่ม">
                <div className="flex items-center gap-2">
                  <TeamOutlined className="text-slate-400" />
                  <span>{`${members.length} คน`}</span>
                  {members.length > 0 && (
                    <Button
                      type="link"
                      size="small"
                      className="!px-0"
                      onClick={() => setOpenMemberModal(true)}
                    >
                      {"ดูรายชื่อ"}
                    </Button>
                  )}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="แก้ไขล่าสุด">
                {formatDate(group.updatedAt)}
              </Descriptions.Item>
              <Descriptions.Item label="รหัสกลุ่ม">
                <span className="font-mono text-xs text-slate-500">
                  {group.groupId}
                </span>
              </Descriptions.Item>
            </Descriptions>

            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="mb-2 text-slate-600">
                {"การกำหนดสิทธิ์ของกลุ่มนี้จัดการที่หน้าอื่น"}
              </div>
              <Space wrap>
                <Button
                  type="link"
                  className="!px-0"
                  href="/page/users-management/user-role-access"
                >
                  {"สิทธิ์การเข้าถึงของกลุ่ม"}
                </Button>
                <Button
                  type="link"
                  href="/page/users-management/user-group-permission"
                >
                  {"สิทธิ์การเห็นข้อมูลตามโมดูล"}
                </Button>
              </Space>
            </div>
          </div>
        )}
      </Card>

      <Modal
        title="เพิ่มกลุ่มย่อย"
        open={openAddModal}
        footer={null}
        onCancel={() => {
          setOpenAddModal(false);
          addForm.resetFields();
        }}
      >
        <Form
          form={addForm}
          layout="vertical"
          onFinish={onSubmitAdd}
          disabled={saving}
        >
          <Form.Item label="กลุ่มแม่">
            <Input value={group.groupName} disabled />
          </Form.Item>
          <Form.Item
            name="groupName"
            label="ชื่อกลุ่มย่อย"
            rules={[{ required: true, message: "กรุณากรอกชื่อกลุ่มย่อย" }]}
          >
            <Input maxLength={GROUP_NAME_MAX_LENGTH} showCount />
          </Form.Item>
          <Form.Item name="description" label="คำอธิบาย">
            <Input.TextArea rows={3} />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => {
                setOpenAddModal(false);
                addForm.resetFields();
              }}
            >
              {"ยกเลิก"}
            </Button>
            <Button type="primary" htmlType="submit" loading={saving}>
              {"เพิ่ม"}
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        title={`สมาชิกในกลุ่ม ${group.groupName}`}
        open={openMemberModal}
        footer={null}
        onCancel={() => setOpenMemberModal(false)}
      >
        <Table<ITUserGroupMember>
          size="small"
          rowKey="userId"
          pagination={false}
          scroll={{ y: 360 }}
          dataSource={members}
          columns={[
            {
              title: "ชื่อ-นามสกุล",
              key: "name",
              render: (_, member) =>
                `${member.firstNameTh} ${member.lastNameTh}`,
            },
          ]}
        />
      </Modal>
    </>
  );
};

export default GroupManage;
