"use client";
import React, { createContext, useState } from "react";
import { TUser } from "../common";
import { TUserRoles, UserRoles } from "./user-roles";

export type UserContectType = {
  user: TUser | null;
  saveUser: (todo: TUser) => void;
  roles: TUserRoles | null;
  saveRoles: (roles: string[]) => void;
  accessRole: (access: (keyof TUserRoles)[]) => boolean;
};

export const UserContext = createContext<UserContectType | null>(null);

const TodoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<TUser | null>(null);
  const [roles, setRoles] = useState<TUserRoles | null>(null);
  const saveUser = async (user: TUser) => {
    setUser(user);
  };
  const saveRoles = async (roles: string[]) => {
    const result = Object.fromEntries(
      Object.entries(UserRoles)
        .filter(([key, value]) => roles.includes(value))
        .map(([key]) => [key, true]),
    );
    setRoles(result);
  };
  /**
   * ตรวจสิทธิ์การเข้าถึง — คืน true เมื่อผู้ใช้มีสิทธิ์ "อย่างน้อยหนึ่งอย่าง" ในรายการที่ส่งมา
   * @param access รายชื่อสิทธิ์ที่ยอมรับได้ เช่น ["admin", "maUser"]
   * @returns true เมื่อผู้ใช้มีสิทธิ์ใดสิทธิ์หนึ่ง
   */
  const accessRole = (access: (keyof TUserRoles)[]) => {
    return access.some((data) => roles?.[data] === true);
  };
  return (
    <UserContext.Provider
      value={{ user, saveUser, roles, saveRoles, accessRole }}
    >
      {children}
    </UserContext.Provider>
  );
};
export default TodoProvider;
