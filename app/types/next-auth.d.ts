import NextAuth from "next-auth/next";

declare module "next-auth" {
  interface Session {
    user: {
      userId: string;
      username: string;
      firstNameTh: string;
      lastNameTh: string;
      phoneNumber: string;
      email: string;
      ownerGroup: string;
      departmentId: number;
      typeLeaveDisabledMap: [ItypeLeaveDisabledMap];
    };
    rulelist: string[];
    grouplist: string[];
    accessToken: string;
    refreshToken: string;
    error?: string;
  }
  interface ItypeLeaveDisabledMap {
    userId: number;
  }
}
