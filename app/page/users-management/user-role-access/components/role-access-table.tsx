"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Empty,
  Input,
  Modal,
  Spin,
  Switch,
  Table,
  Tag,
  Tooltip,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  SearchOutlined,
  ExclamationCircleFilled,
  CheckOutlined,
} from "@ant-design/icons";
import { ROLE_LIST } from "@/app/config/user-roles";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import UserGroupServices from "@/app/services/usergroup.service";
import UserMapRoleGroupServices from "@/app/services/user-map-role-group.service";
import { ITUserMapRoleGroup } from "@/app/common/user-map-role-group";
import { notifyError, notifySuccess } from "@/app/utils/message";

const { confirm } = Modal;

/** กลุ่มผู้ใช้งานแบบ flat ที่ได้จาก getUserGroupAll() (เอาเฉพาะฟิลด์ที่ใช้จริง) */
interface FlatGroup {
  groupId: string;
  groupName: string;
  parentGroupId: string | null;
}

/** แถวของตาราง = กลุ่มผู้ใช้งานหนึ่งกลุ่ม (children คือกลุ่มลูก) */
interface GroupRow {
  key: string;
  groupId: string;
  groupName: string;
  children?: GroupRow[];
}

/**
 * แปลงข้อมูลดิบจาก API ให้เหลือเฉพาะฟิลด์ที่ตารางนี้ใช้
 * @param groups ข้อมูลกลุ่มดิบจาก getUserGroupAll()
 * @returns รายการกลุ่มแบบ flat
 */
function toFlatGroups(groups: unknown): FlatGroup[] {
  if (!Array.isArray(groups)) {
    return [];
  }
  return groups.map((group) => ({
    groupId: String(group.groupId),
    groupName: String(group.groupName ?? ""),
    parentGroupId: group.parentGroupId ?? null,
  }));
}

/**
 * สร้างโครงสร้าง tree จากกลุ่มแบบ flat ตาม parentGroupId
 * เรียงตามชื่อกลุ่ม (ก-ฮ / A-Z) ในทุกระดับชั้น
 * ไม่ใส่ key children เมื่อไม่มีลูก เพื่อไม่ให้ antd แสดงลูกศรกางที่กดแล้วว่างเปล่า
 * @param groups รายการกลุ่มทั้งหมด
 * @param parentId groupId ของกลุ่มแม่ (null = ระดับบนสุด)
 * @returns แถวตารางแบบ tree
 */
function buildGroupRows(
  groups: readonly FlatGroup[],
  parentId: string | null,
): GroupRow[] {
  return (
    groups
      .filter((group) => (group.parentGroupId ?? null) === parentId)
      // ใช้ localeCompare แบบ th เพื่อให้เรียงภาษาไทยได้ถูกต้อง (ไม่ใช่เรียงตามรหัส unicode)
      .sort((a, b) => a.groupName.localeCompare(b.groupName, "th"))
      .map((group) => {
        const children = buildGroupRows(groups, group.groupId);
        return {
          key: group.groupId,
          groupId: group.groupId,
          groupName: group.groupName,
          ...(children.length > 0 ? { children } : {}),
        };
      })
  );
}

/**
 * กรองแถวตามคำค้น โดยคงกลุ่มแม่ของกลุ่มที่ตรงคำค้นไว้ด้วย
 * เพื่อไม่ให้กลุ่มลูกที่ match หายไปเพราะแม่ไม่ match
 * @param rows แถวที่ต้องการกรอง
 * @param keyword คำค้นที่แปลงเป็นตัวพิมพ์เล็กแล้ว
 * @returns แถวที่ผ่านการกรอง
 */
function filterRows(rows: readonly GroupRow[], keyword: string): GroupRow[] {
  return rows.reduce<GroupRow[]>((acc, row) => {
    const children = row.children ? filterRows(row.children, keyword) : [];
    const isMatched = row.groupName.toLowerCase().includes(keyword);

    if (isMatched || children.length > 0) {
      // ถ้าตัวเอง match ให้แสดงลูกทั้งหมด, ถ้าไม่ match ให้แสดงเฉพาะลูกที่ match
      const nextChildren = isMatched ? row.children : children;
      acc.push({
        ...row,
        ...(nextChildren?.length ? { children: nextChildren } : {}),
      });
    }
    return acc;
  }, []);
}

/**
 * กรองเฉพาะกลุ่มที่มีสิทธิ์อย่างน้อยหนึ่งรายการ (คงกลุ่มแม่ไว้เช่นเดียวกับการค้นหา)
 * @param rows แถวที่ต้องการกรอง
 * @param draft สถานะสิทธิ์ปัจจุบันบนหน้าจอ
 * @returns แถวที่ผ่านการกรอง
 */
function filterAssignedRows(
  rows: readonly GroupRow[],
  draft: Map<string, Set<string>>,
): GroupRow[] {
  return rows.reduce<GroupRow[]>((acc, row) => {
    const children = row.children
      ? filterAssignedRows(row.children, draft)
      : [];
    const hasRole = (draft.get(row.groupId)?.size ?? 0) > 0;

    if (hasRole || children.length > 0) {
      acc.push({ ...row, ...(children.length ? { children } : {}) });
    }
    return acc;
  }, []);
}

/**
 * เก็บ key ของทุกแถว (ใช้สั่งกางทุกแถวตอนค้นหา)
 * @param rows แถวตาราง
 * @returns key ทั้งหมดแบบ flat
 */
function collectRowKeys(rows: readonly GroupRow[]): string[] {
  return rows.flatMap((row) => [
    row.key,
    ...(row.children ? collectRowKeys(row.children) : []),
  ]);
}

/**
 * เทียบว่าสิทธิ์สองชุดต่างกันหรือไม่
 * @param a ชุดสิทธิ์ที่บันทึกไว้
 * @param b ชุดสิทธิ์บนหน้าจอ
 * @returns true เมื่อมีการเปลี่ยนแปลง
 */
function isDifferent(
  a: Set<string> | undefined,
  b: Set<string> | undefined,
): boolean {
  const left = a ?? new Set<string>();
  const right = b ?? new Set<string>();
  if (left.size !== right.size) {
    return true;
  }
  return Array.from(left).some((code) => !right.has(code));
}

/**
 * ตารางกำหนดสิทธิ์การเข้าถึงให้กลุ่มผู้ใช้งาน
 * แถว = กลุ่มผู้ใช้งาน (แสดงเป็นลำดับชั้น), คอลัมน์ = สิทธิ์จาก ROLE_LIST
 * แก้ไขได้หลายกลุ่มพร้อมกันแล้วกดบันทึกครั้งเดียว
 * @returns element ตารางกำหนดสิทธิ์การเข้าถึง
 */
export const RoleAccessTable: React.FC = () => {
  const { id24Axios } = useId24();
  const baseUrlUser = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_USER);

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [groupRows, setGroupRows] = useState<GroupRow[]>([]);
  /** สิทธิ์ที่บันทึกไว้ในฐานข้อมูล (ใช้เทียบหาแถวที่ถูกแก้ไข) */
  const [original, setOriginal] = useState<Map<string, Set<string>>>(new Map());
  /** สิทธิ์ที่กำลังแก้ไขอยู่บนหน้าจอ */
  const [draft, setDraft] = useState<Map<string, Set<string>>>(new Map());
  const [keyword, setKeyword] = useState<string>("");
  const [onlyAssigned, setOnlyAssigned] = useState<boolean>(false);
  /** แถวที่กางอยู่ — ค่าเริ่มต้นคือกางทุกแถวเพื่อให้เห็นกลุ่มทั้งหมดทันทีที่เปิดหน้า */
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
    // โหลดครั้งเดียวตอน mount — การรีเฟรชหลังบันทึกเรียก fetchData() ตรง ๆ
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * โหลดกลุ่มผู้ใช้งานและการผูกสิทธิ์ทั้งหมด แล้วรีเซ็ตสถานะการแก้ไข
   */
  async function fetchData(): Promise<void> {
    setLoading(true);
    const [groups, mappings] = await Promise.all([
      UserGroupServices(baseUrlUser).getUserGroupAll(),
      UserMapRoleGroupServices(baseUrlUser).findAll(),
    ]);

    const flatGroups = toFlatGroups(groups);
    const rows = buildGroupRows(flatGroups, null);
    setGroupRows(rows);
    setExpandedKeys(collectRowKeys(rows));

    const roleMap = new Map<string, Set<string>>();
    mappings.forEach((item: ITUserMapRoleGroup) => {
      const current = roleMap.get(item.groupId) ?? new Set<string>();
      current.add(item.roleCode);
      roleMap.set(item.groupId, current);
    });
    setOriginal(roleMap);
    setDraft(
      new Map(Array.from(roleMap, ([id, codes]) => [id, new Set(codes)])),
    );
    setLoading(false);
  }

  /** groupId ของกลุ่มที่ถูกแก้ไขแต่ยังไม่บันทึก */
  const dirtyGroupIds = useMemo(() => {
    const ids = new Set<string>(
      Array.from(original.keys()).concat(Array.from(draft.keys())),
    );
    return Array.from(ids).filter((groupId) =>
      isDifferent(original.get(groupId), draft.get(groupId)),
    );
  }, [original, draft]);

  /** ชื่อกลุ่มสำหรับใช้ในข้อความแจ้งเตือน */
  const groupNameById = useMemo(() => {
    const map = new Map<string, string>();
    const walk = (rows: readonly GroupRow[]): void => {
      rows.forEach((row) => {
        map.set(row.groupId, row.groupName);
        if (row.children) {
          walk(row.children);
        }
      });
    };
    walk(groupRows);
    return map;
  }, [groupRows]);

  const search = keyword.trim().toLowerCase();
  const visibleRows = useMemo(() => {
    const assignedFiltered = onlyAssigned
      ? filterAssignedRows(groupRows, draft)
      : groupRows;
    return search ? filterRows(assignedFiltered, search) : assignedFiltered;
  }, [groupRows, draft, onlyAssigned, search]);

  const isFiltering = search.length > 0 || onlyAssigned;

  // เริ่มค้นหา/กรองเมื่อไหร่ ให้กางทุกแถวที่เหลืออยู่ เพื่อไม่ให้ผลลัพธ์ที่ซ้อนอยู่ลึก ๆ ถูกซ่อน
  useEffect(() => {
    if (isFiltering) {
      setExpandedKeys(collectRowKeys(visibleRows));
    }
  }, [isFiltering, visibleRows]);

  /**
   * ติ๊ก/ยกเลิกสิทธิ์หนึ่งรายการของกลุ่มหนึ่งกลุ่ม
   * @param groupId กลุ่มที่แก้ไข
   * @param roleCode code ของสิทธิ์
   * @param checked true = ให้สิทธิ์
   */
  function toggleRole(
    groupId: string,
    roleCode: string,
    checked: boolean,
  ): void {
    setDraft((previous) => {
      const next = new Map(previous);
      const codes = new Set(next.get(groupId) ?? []);
      if (checked) {
        codes.add(roleCode);
      } else {
        codes.delete(roleCode);
      }
      next.set(groupId, codes);
      return next;
    });
  }

  /**
   * บันทึกเฉพาะกลุ่มที่ถูกแก้ไข — backend ไม่มี endpoint แบบ bulk จึงยิงทีละกลุ่ม
   * ใช้ allSettled เพื่อไม่ให้กลุ่มที่ล้มเหลวกลบผลของกลุ่มที่สำเร็จ
   * หมายเหตุ: ฝั่ง backend เป็นการลบทิ้งแล้วสร้างใหม่โดยไม่มี transaction
   * ถ้าพังกลางทาง กลุ่มนั้นอาจเหลือสิทธิ์ 0 รายการ — จึง refetch เสมอเพื่อให้เห็นค่าจริง
   */
  async function onSave(): Promise<void> {
    setSaving(true);
    const services = UserMapRoleGroupServices(baseUrlUser);
    const results = await Promise.allSettled(
      dirtyGroupIds.map((groupId) =>
        services.setRolesByGroupId(
          groupId,
          Array.from(draft.get(groupId) ?? []),
        ),
      ),
    );

    const failedIndexes = results.flatMap((result, index) =>
      result.status === "rejected" ? [index] : [],
    );

    if (failedIndexes.length === 0) {
      notifySuccess("useraccess.assign", `${dirtyGroupIds.length} กลุ่ม`);
    } else {
      const failedNames = failedIndexes
        .map(
          (index) =>
            groupNameById.get(dirtyGroupIds[index]) ?? dirtyGroupIds[index],
        )
        .join(", ");
      const firstError = results[failedIndexes[0]];
      notifyError(
        firstError.status === "rejected" ? firstError.reason : undefined,
        "useraccess.assign",
      );
      console.error(
        "[useraccess.assign] กลุ่มที่บันทึกไม่สำเร็จ:",
        failedNames,
      );
    }

    setSaving(false);
    await fetchData();
  }

  /** ยกเลิกการแก้ไขทั้งหมด กลับไปใช้ค่าที่บันทึกไว้ */
  function onCancel(): void {
    confirm({
      title: "ยกเลิกการแก้ไข",
      icon: <ExclamationCircleFilled />,
      content: `การเปลี่ยนแปลงของ ${dirtyGroupIds.length} กลุ่มจะถูกยกเลิกทั้งหมด`,
      okText: "ยกเลิกการแก้ไข",
      cancelText: "กลับไปแก้ไขต่อ",
      okButtonProps: { danger: true },
      onOk: () => {
        setDraft(
          new Map(Array.from(original, ([id, codes]) => [id, new Set(codes)])),
        );
      },
    });
  }

  const columns: ColumnsType<GroupRow> = [
    {
      title: "กลุ่มผู้ใช้งาน",
      dataIndex: "groupName",
      key: "groupName",
      width: 320,
      fixed: "left",
      render: (groupName: string, row: GroupRow) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{groupName}</span>
          {dirtyGroupIds.includes(row.groupId) && (
            <Tag color="orange" className="!m-0">
              แก้ไข
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "สิทธิ์การเข้าถึง",
      key: "roles",
      // แสดงสิทธิ์เป็น chip พร้อมชื่อกำกับในทุกแถว จึงยังอ่านออกแม้เลื่อนจนหัวตารางหลุดจอ
      render: (_: unknown, row: GroupRow) => (
        <div className={`grid grid-cols-${Math.ceil(ROLE_LIST.length)} gap-2`}>
          {ROLE_LIST.map((role) => {
            const isChecked = draft.get(row.groupId)?.has(role.code) ?? false;
            return (
              <div>
                <Tooltip
                  key={role.code}
                  title={`${role.code} — ${role.description}`}
                >
                  <Tag.CheckableTag
                    checked={isChecked}
                    onChange={(checked) =>
                      toggleRole(row.groupId, role.code, checked)
                    }
                    className={`!m-0 !px-3 !py-1 !rounded-full !border ${
                      isChecked
                        ? "!border-blue-500"
                        : "!border-gray-300 !text-gray-600"
                    }`}
                  >
                    <span className="inline-flex items-center gap-1">
                      {isChecked && <CheckOutlined />}
                      {role.name}
                    </span>
                  </Tag.CheckableTag>
                </Tooltip>
              </div>
            );
          })}
        </div>
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <div className="grid grid-cols-1 gap-y-3">
        {/* <Alert
          type="warning"
          showIcon
          message="สิทธิ์ที่กำหนดที่นี่จะถูกรวมเพิ่มเข้ากับสิทธิ์จาก token ของ ID24"
          description="มีผลกับผู้ใช้ที่มีกลุ่มต้นสังกัด (ownerGroupId) เป็นกลุ่มนั้นโดยตรง ไม่ตกทอดไปยังกลุ่มลูก และจะเห็นผลเมื่อผู้ใช้โหลดหน้าใหม่ครั้งถัดไป — การติ๊กสิทธิ์ผู้ดูแลระบบให้กลุ่มใด เท่ากับให้สมาชิกทุกคนในกลุ่มนั้น"
        /> */}

        <div className="flex flex-wrap items-center justify-between gap-2">
          <Input
            allowClear
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="ค้นหากลุ่มผู้ใช้งาน..."
            style={{ width: 320 }}
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <div className="flex items-center gap-2">
            {/* <span className="text-gray-600">แสดงเฉพาะกลุ่มที่มีสิทธิ์</span>
            <Switch checked={onlyAssigned} onChange={setOnlyAssigned} /> */}
          </div>
        </div>

        <Table<GroupRow>
          size="small"
          rowKey="key"
          columns={columns}
          dataSource={visibleRows}
          pagination={false}
          scroll={{ x: "max-content" }}
          sticky
          rowClassName={(row) =>
            dirtyGroupIds.includes(row.groupId) ? "bg-orange-50" : ""
          }
          // กางทุกแถวเป็นค่าเริ่มต้น แต่ยังพับ/กางเองได้
          expandable={{
            expandedRowKeys: expandedKeys,
            onExpandedRowsChange: (keys) => setExpandedKeys(keys as string[]),
          }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  isFiltering
                    ? "ไม่พบกลุ่มที่ค้นหา"
                    : "ไม่มีข้อมูลกลุ่มผู้ใช้งาน"
                }
              />
            ),
          }}
        />

        {dirtyGroupIds.length > 0 && (
          <div className="sticky bottom-0 z-10 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-orange-200 bg-orange-50 px-4 py-2">
            <span className="text-orange-700">
              แก้ไข <b>{dirtyGroupIds.length}</b> กลุ่ม ยังไม่ได้บันทึก
            </span>
            <div className="flex gap-2">
              <Button onClick={onCancel} disabled={saving}>
                ยกเลิก
              </Button>
              <Button type="primary" loading={saving} onClick={onSave}>
                บันทึก
              </Button>
            </div>
          </div>
        )}
      </div>
    </Spin>
  );
};
