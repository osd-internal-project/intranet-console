"use client";
import React, { createContext, useState } from "react";
import { TUser } from "../common";

export type UserContectType = {
  user: TUser | null;
  saveUser: (todo: TUser) => void;
};

export const UserContext = createContext<UserContectType | null>(null);

const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<TUser | null>(null);
  const saveUser = async (user: TUser) => {
    setUser(user);
  };
  return <UserContext.Provider value={{ user, saveUser }}>{children}</UserContext.Provider>;
};
export default TodoProvider;
