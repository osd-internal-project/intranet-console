import { Card, Skeleton } from "antd";

/**
 * โครงร่างระหว่างรอโหลดรายละเอียดกลุ่มผู้ใช้งาน
 * รูปทรงตรงกับการ์ดจริงใน GroupManage เพื่อไม่ให้หน้ากระโดดตอนโหลดเสร็จ
 * @returns element การ์ดโครงร่าง
 */
export const GroupManageSkeleton: React.FC = () => {
  return (
    <Card
      className="h-full"
      title={<Skeleton.Input active size="small" style={{ width: 200 }} />}
    >
      <div className="min-h-[420px]">
        <Skeleton active paragraph={{ rows: 6 }} title={false} />
      </div>
    </Card>
  );
};
