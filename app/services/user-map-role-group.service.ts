import { AxiosInstance } from "axios";
import { ITUserMapRoleGroup } from "../common/user-map-role-group";

interface TServices {
  findAll: () => Promise<ITUserMapRoleGroup[]>;
  findRoleCodesByGroupId: (groupId: string) => Promise<string[]>;
  setRolesByGroupId: (groupId: string, roleCodes: string[]) => Promise<string[]>;
}

/**
 * บริการจัดการการผูกสิทธิ์การเข้าถึง (role code) เข้ากับกลุ่มผู้ใช้งาน
 * @param axiosInstance axios ที่ผูก base url ของ user service ไว้แล้ว
 * @returns ชุดฟังก์ชันเรียก API ของ /user-map-role-group
 */
const UserMapRoleGroupServices = (axiosInstance: AxiosInstance): TServices => {
  const baseUrl = "/user-map-role-group";
  return {
    /**
     * ดึงการผูกสิทธิ์ทั้งหมดในครั้งเดียว เพื่อนำไปสร้างตาราง กลุ่ม x สิทธิ์
     * @returns รายการ mapping ทั้งหมด (คืน [] เมื่อเรียกไม่สำเร็จ)
     */
    findAll: async () => {
      return await axiosInstance
        .get(`${baseUrl}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },

    /**
     * ดึง role code ของกลุ่มเดียว
     * @param groupId groupId ของกลุ่มผู้ใช้งาน
     * @returns รายการ role code (คืน [] เมื่อเรียกไม่สำเร็จ)
     */
    findRoleCodesByGroupId: async (groupId: string) => {
      return await axiosInstance
        .get(`${baseUrl}/group/${groupId}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },

    /**
     * บันทึกสิทธิ์ของกลุ่ม (ฝั่ง backend จะลบของเดิมทั้งหมดแล้วสร้างใหม่)
     * ไม่ดัก error ไว้เอง เพราะหน้าจอต้องรู้ว่ากลุ่มไหนบันทึกไม่สำเร็จ
     * @param groupId groupId ของกลุ่มผู้ใช้งาน
     * @param roleCodes รายการ role code ที่ต้องการให้กลุ่มนี้มี
     * @returns รายการ role code ที่บันทึกจริง (ตัดค่าซ้ำแล้วโดย backend)
     */
    setRolesByGroupId: async (groupId: string, roleCodes: string[]) => {
      const res = await axiosInstance.post(`${baseUrl}/set`, {
        groupId: groupId,
        roleCodes: roleCodes,
      });
      return res.data;
    },
  };
};

export default UserMapRoleGroupServices;
