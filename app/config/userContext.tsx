"use client";
import React, { createContext, useContext, useState } from "react";
import { TUser } from "../common";
import { ROLES, RoleKey, TUserRoles } from "./user-roles";

export type UserContectType = {
  user: TUser | null;
  saveUser: (todo: TUser) => void;
  roles: TUserRoles | null;
  /** code สิทธิ์ดิบที่ได้จาก token เช่น ["admin", "ma-user"] */
  roleCodes: string[];
  saveRoles: (roles: string[]) => void;
  accessRole: (access: RoleKey[]) => boolean;
};

export const UserContext = createContext<UserContectType | null>(null);

const TodoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<TUser | null>(null);
  const [roles, setRoles] = useState<TUserRoles | null>(null);
  const [roleCodes, setRoleCodes] = useState<string[]>([]);
  const saveUser = async (user: TUser) => {
    setUser(user);
  };
  /**
   * แปลง code สิทธิ์จาก token เป็นแผนที่สิทธิ์ตาม ROLES
   * @param roles รายการ code สิทธิ์ที่ได้จาก token เช่น ["admin", "ma-user"]
   */
  const saveRoles = async (roles: string[]) => {
    const result = Object.fromEntries(
      Object.entries(ROLES)
        .filter(([, role]) => roles.includes(role.code))
        .map(([key]) => [key, true]),
    );
    setRoles(result);
    setRoleCodes(roles);
  };
  /**
   * ตรวจสิทธิ์การเข้าถึง — คืน true เมื่อผู้ใช้มีสิทธิ์ "อย่างน้อยหนึ่งอย่าง" ในรายการที่ส่งมา
   * @param access รายชื่อสิทธิ์ที่ยอมรับได้ เช่น ["admin", "maUser"]
   * @returns true เมื่อผู้ใช้มีสิทธิ์ใดสิทธิ์หนึ่ง
   */
  const accessRole = (access: RoleKey[]) => {
    return access.some((data) => roles?.[data] === true);
  };
  return (
    <UserContext.Provider
      value={{ user, saveUser, roles, roleCodes, saveRoles, accessRole }}
    >
      {children}
    </UserContext.Provider>
  );
};

/**
 * hook อ่านสิทธิ์ของผู้ใช้แบบ null-safe — ใช้แทนการ useContext + fallback เอง
 * @returns roles (แผนที่สิทธิ์), roleCodes (code ดิบจาก token) และ accessRole
 */
export const useUserAccess = () => {
  const context = useContext(UserContext);
  return {
    roles: context?.roles ?? null,
    roleCodes: context?.roleCodes ?? [],
    accessRole: context?.accessRole ?? (() => false),
  };
};

export default TodoProvider;
