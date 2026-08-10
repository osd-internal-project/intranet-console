import { useMemo, useState } from "react";
import { Button, Empty, Input, Tag, Tree, TreeSelectProps } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { DataNode } from "antd/es/tree";

/** โครงสร้าง node ที่ createTree() ใน page.tsx สร้างขึ้น */
interface GroupNode {
  value: string;
  key: string;
  title: string;
  groupName: string;
  children?: GroupNode[];
}

interface Props {
  readonly treeData: TreeSelectProps["treeData"];
  /** ฉีดเข้ามาโดย Form.Item */
  readonly value?: string[];
  /** ฉีดเข้ามาโดย Form.Item */
  readonly onChange?: (value: string[]) => void;
}

/**
 * แปลง treeData ของ TreeSelect ให้เป็น GroupNode[] ที่ใช้กับ Tree ได้
 * (ทำเป็น type guard แบบง่าย เพราะ treeData มาจาก any[] ฝั่ง page.tsx)
 * @param nodes ข้อมูล tree ดิบ
 * @returns รายการ GroupNode
 */
function toGroupNodes(nodes: TreeSelectProps["treeData"]): GroupNode[] {
  return (nodes ?? []) as unknown as GroupNode[];
}

/**
 * สร้าง Map ของ groupId -> ชื่อกลุ่ม เพื่อใช้แสดงรายการที่เลือกไว้ฝั่งขวา
 * @param nodes รายการ node ทั้งหมด (recursive)
 * @param acc Map สะสมระหว่าง recursive
 * @returns Map groupId -> groupName
 */
function buildNameMap(
  nodes: readonly GroupNode[],
  acc: Map<string, string> = new Map(),
): Map<string, string> {
  nodes.forEach((node) => {
    acc.set(node.key, node.groupName ?? node.title);
    if (node.children?.length) {
      buildNameMap(node.children, acc);
    }
  });
  return acc;
}

/**
 * กรอง tree ตามคำค้น โดยเก็บ node ที่ชื่อตรงกับคำค้น พร้อม "ต้นทาง" (ancestor) ของ node นั้นไว้ด้วย
 * เพื่อไม่ให้ลูกที่ match หายไปเพราะแม่ไม่ match
 * @param nodes รายการ node ที่จะกรอง
 * @param keyword คำค้น (lower-case แล้ว)
 * @returns tree ที่กรองแล้ว
 */
function filterTree(
  nodes: readonly GroupNode[],
  keyword: string,
): GroupNode[] {
  return nodes.reduce<GroupNode[]>((acc, node) => {
    const children = node.children?.length
      ? filterTree(node.children, keyword)
      : [];
    const isMatched = (node.groupName ?? node.title)
      .toLowerCase()
      .includes(keyword);

    if (isMatched || children.length > 0) {
      // ถ้าตัวเอง match ให้แสดงลูกทั้งหมด, ถ้าไม่ match ให้แสดงเฉพาะลูกที่ match
      acc.push({ ...node, children: isMatched ? node.children : children });
    }
    return acc;
  }, []);
}

/**
 * เก็บ key ทั้งหมดใน tree (ใช้สั่ง expand ทุก node ตอนค้นหา)
 * @param nodes รายการ node
 * @returns key ทั้งหมดแบบ flat
 */
function collectKeys(nodes: readonly GroupNode[]): string[] {
  return nodes.flatMap((node) => [
    node.key,
    ...(node.children?.length ? collectKeys(node.children) : []),
  ]);
}

/**
 * เติม title ของแต่ละ node ให้ไฮไลต์ส่วนที่ตรงกับคำค้น
 * @param nodes รายการ node ที่กรองแล้ว
 * @param keyword คำค้น (lower-case แล้ว)
 * @returns DataNode สำหรับ antd Tree
 */
function highlightNodes(
  nodes: readonly GroupNode[],
  keyword: string,
): DataNode[] {
  return nodes.map((node) => {
    const name = node.groupName ?? node.title;
    const matchIndex = keyword ? name.toLowerCase().indexOf(keyword) : -1;

    const title =
      matchIndex >= 0 ? (
        <span>
          {name.slice(0, matchIndex)}
          <span className="bg-yellow-200 font-semibold">
            {name.slice(matchIndex, matchIndex + keyword.length)}
          </span>
          {name.slice(matchIndex + keyword.length)}
        </span>
      ) : (
        name
      );

    return {
      key: node.key,
      title,
      children: node.children?.length
        ? highlightNodes(node.children, keyword)
        : undefined,
    };
  });
}

/**
 * ตัวเลือกกลุ่มสิทธิ์แบบ checkbox tree ที่มองเห็นตลอดเวลา พร้อมช่องค้นหาและแผงสรุปรายการที่เลือก
 * ใช้ checkStrictly เพื่อให้การติ๊ก "กลุ่มแม่" ไม่ลามไปติ๊กกลุ่มลูกอัตโนมัติ
 * (คงพฤติกรรมเดิมของ TreeSelect แบบ multiple ที่ส่งเฉพาะ id ที่เลือกจริง)
 * @param props treeData และ value/onChange ที่ Form.Item ฉีดให้
 * @returns element ตัวเลือกกลุ่มสิทธิ์
 */
export const PermissionGroupTree: React.FC<Props> = ({
  treeData,
  value,
  onChange,
}) => {
  const [searchValue, setSearchValue] = useState<string>("");

  const groupNodes = useMemo(() => toGroupNodes(treeData), [treeData]);
  const nameMap = useMemo(() => buildNameMap(groupNodes), [groupNodes]);

  const keyword = searchValue.trim().toLowerCase();
  const visibleNodes = useMemo(
    () => (keyword ? filterTree(groupNodes, keyword) : groupNodes),
    [groupNodes, keyword],
  );
  const displayNodes = useMemo(
    () => highlightNodes(visibleNodes, keyword),
    [visibleNodes, keyword],
  );
  // ตอนค้นหาให้กาง node ทั้งหมดเพื่อให้เห็นผลลัพธ์ที่ซ้อนอยู่ลึก ๆ
  const expandedKeys = useMemo(
    () => collectKeys(visibleNodes),
    [visibleNodes],
  );

  const selectedKeys = value ?? [];

  /**
   * ลบกลุ่มที่เลือกไว้ออกหนึ่งรายการ
   * @param key groupId ที่ต้องการเอาออก
   */
  const removeSelected = (key: string): void => {
    onChange?.(selectedKeys.filter((selected) => selected !== key));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex flex-col gap-2">
        <Input
          allowClear
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="ค้นหากลุ่มสิทธิ์..."
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />
        <div className="border border-gray-200 rounded-lg p-2 h-80 overflow-auto">
          {displayNodes.length > 0 ? (
            <Tree
              checkable
              checkStrictly
              blockNode
              selectable={false}
              treeData={displayNodes}
              checkedKeys={selectedKeys}
              // ระหว่างค้นหาบังคับกางทุก node, นอกนั้นปล่อยให้ผู้ใช้พับ/กางเอง
              {...(keyword ? { expandedKeys } : { defaultExpandAll: true })}
              onCheck={(checked) => {
                // checkStrictly ทำให้ค่าที่ได้เป็น { checked, halfChecked }
                const keys = Array.isArray(checked) ? checked : checked.checked;
                onChange?.(keys.map(String));
              }}
            />
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={keyword ? "ไม่พบกลุ่มที่ค้นหา" : "ไม่มีข้อมูลกลุ่ม"}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between h-8">
          <span className="text-gray-600">
            เลือกแล้ว <b>{selectedKeys.length}</b> กลุ่ม
          </span>
          <Button
            type="link"
            size="small"
            disabled={selectedKeys.length === 0}
            onClick={() => onChange?.([])}
          >
            ล้างทั้งหมด
          </Button>
        </div>
        <div className="border border-gray-200 rounded-lg p-2 h-80 overflow-auto bg-gray-50">
          {selectedKeys.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedKeys.map((key) => (
                <Tag
                  key={key}
                  closable
                  color="blue"
                  className="!m-0 !py-1"
                  onClose={() => removeSelected(key)}
                >
                  {nameMap.get(key) ?? key}
                </Tag>
              ))}
            </div>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="ยังไม่ได้เลือกกลุ่มสิทธิ์"
            />
          )}
        </div>
      </div>
    </div>
  );
};
