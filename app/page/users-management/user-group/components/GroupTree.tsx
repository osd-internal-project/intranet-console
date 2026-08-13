"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card, Empty, Input, Spin, Tabs, Tree } from "antd";
import type { DataNode } from "antd/es/tree";
import { SearchOutlined } from "@ant-design/icons";
import UserGroupServices from "@/app/services/usergroup.service";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import { ITOrganize, ITUserGroup } from "@/app/common/user-group";

/** โหนดหนึ่งโหนดของทรีกลุ่มผู้ใช้งาน */
interface GroupNode {
  key: string;
  groupName: string;
  organizedGroupId: string | null;
  children: GroupNode[];
}

export interface props {
  readonly selectedOrganize: string | null;
  readonly selectedGroupId: string | null;
  readonly refreshToken: number;
  readonly onSelectOrganize: (organizedId: string | null) => void;
  readonly onSelectGroup: (groupId: string | null) => void;
}

/**
 * แปลงข้อมูลดิบจาก API ให้เหลือเฉพาะฟิลด์ที่ทรีนี้ใช้
 * @param groups ข้อมูลกลุ่มดิบจาก getUserGroupAll()
 * @returns รายการกลุ่มแบบ flat
 */
function toFlatGroups(groups: unknown): ITUserGroup[] {
  if (!Array.isArray(groups)) {
    return [];
  }
  // service คืน any จาก axios และคืน [] เมื่อเรียกไม่สำเร็จ — ตรวจว่าเป็น array แล้วจึงเชื่อรูปร่างตาม schema
  return groups as ITUserGroup[];
}

/**
 * สร้างโครงสร้างทรีจากกลุ่มแบบ flat ตาม parentGroupId เรียงตามชื่อในทุกระดับชั้น
 * @param groups รายการกลุ่มทั้งหมด
 * @param parentId groupId ของกลุ่มแม่ (null = ระดับบนสุด)
 * @returns โหนดของทรี
 */
function buildTree(
  groups: readonly ITUserGroup[],
  parentId: string | null,
): GroupNode[] {
  return groups
    .filter((group) => (group.parentGroupId ?? null) === parentId)
    // ใช้ localeCompare แบบ th เพื่อให้เรียงภาษาไทยได้ถูกต้อง (ไม่ใช่เรียงตามรหัส unicode)
    .sort((a, b) => a.groupName.localeCompare(b.groupName, "th"))
    .map((group) => ({
      key: group.groupId,
      groupName: group.groupName,
      organizedGroupId: group.organizedGroupId ?? null,
      children: buildTree(groups, group.groupId),
    }));
}

/**
 * กรองโหนดตามคำค้น โดยคงกลุ่มแม่ของกลุ่มที่ตรงคำค้นไว้ด้วย
 * เพื่อไม่ให้กลุ่มลูกที่ตรงคำค้นหายไปเพราะกลุ่มแม่ไม่ตรง
 * @param nodes โหนดที่ต้องการกรอง
 * @param keyword คำค้นที่แปลงเป็นตัวพิมพ์เล็กแล้ว
 * @returns โหนดที่ผ่านการกรอง
 */
function filterNodes(
  nodes: readonly GroupNode[],
  keyword: string,
): GroupNode[] {
  return nodes.reduce<GroupNode[]>((acc, node) => {
    const children = filterNodes(node.children, keyword);
    const isMatched = node.groupName.toLowerCase().includes(keyword);

    if (isMatched || children.length > 0) {
      // ถ้าตัวเองตรงคำค้นให้แสดงลูกทั้งหมด, ถ้าไม่ตรงให้แสดงเฉพาะลูกที่ตรง
      acc.push({ ...node, children: isMatched ? node.children : children });
    }
    return acc;
  }, []);
}

/**
 * เก็บ key ของทุกโหนด (ใช้สั่งกางทั้งทรี)
 * @param nodes โหนดของทรี
 * @returns key ทั้งหมดแบบ flat
 */
function collectKeys(nodes: readonly GroupNode[]): string[] {
  return nodes.flatMap((node) => [node.key, ...collectKeys(node.children)]);
}

/**
 * ทรีกลุ่มผู้ใช้งาน แยกตามองค์กรด้วยแท็บด้านซ้าย พร้อมช่องค้นหา
 * โหลดข้อมูลครั้งเดียวแล้วกรองในหน่วยความจำ — สลับแท็บหรือค้นหาไม่ต้องยิง API ซ้ำ
 * @param props องค์กร/กลุ่มที่เลือกอยู่ และ callback ตอนผู้ใช้เลือก
 * @returns element การ์ดทรีกลุ่มผู้ใช้งาน
 */
const GroupTree: React.FC<props> = ({
  selectedOrganize,
  selectedGroupId,
  refreshToken,
  onSelectOrganize,
  onSelectGroup,
}): React.ReactElement => {
  const { id24Axios } = useId24();
  const baseUrlUser = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_USER);

  const [loading, setLoading] = useState<boolean>(true);
  const [organizes, setOrganizes] = useState<ITOrganize[]>([]);
  const [allNodes, setAllNodes] = useState<GroupNode[]>([]);
  const [keyword, setKeyword] = useState<string>("");
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  const fetchData = useCallback(async (): Promise<void> => {
    setLoading(true);
    const services = UserGroupServices(baseUrlUser);
    const [organizeList, groups] = await Promise.all([
      services.findAllOrganize(),
      services.getUserGroupAll(),
    ]);

    const organizeItems: ITOrganize[] = Array.isArray(organizeList)
      ? organizeList
      : [];
    setOrganizes(organizeItems);

    const nodes = buildTree(toFlatGroups(groups), null);
    setAllNodes(nodes);
    setExpandedKeys(collectKeys(nodes));
    setLoading(false);

    // เลือกแท็บองค์กรแรกให้อัตโนมัติ เพื่อให้เห็นทรีทันทีที่เปิดหน้า
    if (!selectedOrganize && organizeItems.length > 0) {
      onSelectOrganize(organizeItems[0].organizedId);
    }
    // selectedOrganize/onSelectOrganize ตั้งใจไม่ใส่ใน deps — ต้องการให้โหลดใหม่
    // เฉพาะตอน refreshToken เปลี่ยนเท่านั้น ไม่ใช่ทุกครั้งที่ผู้ใช้สลับแท็บ
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const search = keyword.trim().toLowerCase();

  const visibleNodes = useMemo(() => {
    // กรองที่ระดับบนสุดเท่านั้น — ลำดับชั้นหนึ่งชุดเป็นขององค์กรเดียว กลุ่มลูกจึงตามกลุ่มแม่มาเสมอ
    // กลุ่มที่ไม่ได้ระบุองค์กร (organizedGroupId = null) แสดงในทุกแท็บ เพื่อไม่ให้ข้อมูลหายไปจากหน้าจอ
    const byOrganize = allNodes.filter(
      (node) =>
        node.organizedGroupId === null ||
        node.organizedGroupId === selectedOrganize,
    );
    return search ? filterNodes(byOrganize, search) : byOrganize;
  }, [allNodes, selectedOrganize, search]);

  // เริ่มค้นหาเมื่อไหร่ ให้กางทุกโหนดที่เหลืออยู่ เพื่อไม่ให้ผลลัพธ์ที่ซ้อนลึกถูกซ่อน
  useEffect(() => {
    if (search) {
      setExpandedKeys(collectKeys(visibleNodes));
    }
  }, [search, visibleNodes]);

  /**
   * แปลงโหนดเป็นรูปแบบที่ antd Tree ใช้ พร้อมป้ายจำนวนกลุ่มย่อย
   * @param nodes โหนดที่ต้องการแปลง
   * @returns treeData ของ antd
   */
  const toTreeData = (nodes: readonly GroupNode[]): DataNode[] =>
    nodes.map((node) => ({
      key: node.key,
      title: (
        <span className="inline-flex items-center gap-2">
          <span>{node.groupName}</span>
          {node.children.length > 0 && (
            <span className="text-xs text-slate-400">
              {`(${node.children.length})`}
            </span>
          )}
        </span>
      ),
      ...(node.children.length > 0
        ? { children: toTreeData(node.children) }
        : {}),
    }));

  const tabItems = organizes.map((organize) => ({
    key: organize.organizedId,
    label: organize.organizedName,
  }));

  return (
    <Card className="h-full" styles={{ body: { padding: 16 } }}>
      <Spin spinning={loading}>
        <div className="grid grid-cols-1 gap-3">
          <Input
            allowClear
            prefix={<SearchOutlined className="text-slate-400" />}
            placeholder="ค้นหากลุ่มผู้ใช้งาน..."
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />

          {tabItems.length > 0 && (
            <Tabs
              size="small"
              activeKey={selectedOrganize ?? undefined}
              items={tabItems}
              onChange={(organizedId) => {
                onSelectOrganize(organizedId);
                onSelectGroup(null);
              }}
            />
          )}

          <div className="min-h-[420px] overflow-auto">
            {visibleNodes.length > 0 ? (
              <Tree
                blockNode
                showLine
                treeData={toTreeData(visibleNodes)}
                expandedKeys={expandedKeys}
                onExpand={(keys) => setExpandedKeys(keys as string[])}
                selectedKeys={selectedGroupId ? [selectedGroupId] : []}
                onSelect={(keys) => onSelectGroup((keys[0] as string) ?? null)}
                rootStyle={{ fontSize: 14 }}
              />
            ) : (
              !loading && (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    search ? "ไม่พบกลุ่มที่ค้นหา" : "ยังไม่มีกลุ่มในองค์กรนี้"
                  }
                />
              )
            )}
          </div>
        </div>
      </Spin>
    </Card>
  );
};

export default GroupTree;
