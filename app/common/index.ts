export type TUser = {
  id: number;
  username: string;
  firstNameTh: string;
  phoneNumber: string;
  capabilities: JSON;
  token: string;
  active: boolean;
  phone?: string;
  email: string;
  userType: UserType;
  createdAt: string;
  updatedAt: string;
  profileExtension: [{ extension: number }];
  groupOwner: {
    groupId: string;
    groupName: string;
  };
  profileAgent: { agentId: string; userLevel: number; umId: number };
  userMapGroup: [
    {
      group: {
        groupId: string;
        groupName: string;
      };
    },
  ];
  updateBy: {
    updateById: string;
    username: string;
  };
};

export type UserType = "local" | "ldap";
