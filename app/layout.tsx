import "./globals.css";
import type { Metadata } from "next";
import { Sarabun } from "next/font/google";

const sarabun = Sarabun({ weight: "400", subsets: ["thai"] });
import AuthProvider from "@/app/provider/AuthProvider";
import { ConfigProvider } from "antd";
import { signIn, useSession } from "next-auth/react";
import { StepBackwardOutlined } from "@ant-design/icons";
export const metadata: Metadata = {
  title: "Intranet",
  description: "Intranet",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={` m-0 `}>
        <AuthProvider>
          <ConfigProvider
            theme={{
              token: {
                fontSize: 14,
                colorPrimary: "#00a1df",
                fontFamily: sarabun.style.fontFamily,
              },
            }}
          >
            {children}
          </ConfigProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
