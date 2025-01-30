"use client";
import React, { createContext, useState } from "react";
import { TUser } from "../common";
import { TUserRoles, UserRoles } from "./user-roles";

export type UserContectType = {
  user: TUser | null;
  saveUser: (todo: TUser) => void;
  roles: TUserRoles | null;
  saveRoles: (roles: string[]) => void;
};

export const UserContext = createContext<UserContectType | null>(null);

const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
  return <UserContext.Provider value={{ user, saveUser, roles, saveRoles }}>{children}</UserContext.Provider>;
};
export default TodoProvider;
