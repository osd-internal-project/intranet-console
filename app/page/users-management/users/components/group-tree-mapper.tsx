import React from "react";
import { CarryOutOutlined } from "@ant-design/icons";
import { GroupWithSubgroups } from "../page";

export const groupWithSubGroupsToGroupTree = (groupWithSubGroups: GroupWithSubgroups): any => ({
  title: groupWithSubGroups.name,
  value: groupWithSubGroups.id,
  icon: <CarryOutOutlined />,
  children: (groupWithSubGroups.subGroups.length > 0 && groupWithSubGroups.subGroups.map(groupWithSubGroupsToGroupTree)) || undefined,
});
