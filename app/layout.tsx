import "./globals.css";
import type { Metadata } from "next";
// import { Sarabun } from "next/font/google";

// const sarabun = Sarabun({ weight: "400", subsets: ["thai"] });
import { ConfigProvider } from "antd";
import AuthProviderId24 from "./provider/AuthProvider";
import TodoProvider from "./config/userContext";
export const metadata: Metadata = {
  title: "Intranet - OSD",
  description: "Intranet - OSD",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={` m-0 `}>
        <AuthProviderId24>
          <TodoProvider>
            <ConfigProvider
              theme={{
                token: {
                  fontSize: 14,
                  colorPrimary: "#00a1df",
                },
                components: {
                  Table: {
                    // headerBg: "transparent",
                    headerColor: "#185FA5",
                    colorBorder: "#B5D4F4",
                    rowHoverBg: "#F4F9FE",
                    borderColor: "#EAF2FB",
                    // colorText: colorTextPrimary
                    // ไม่มี stripe · ไม่มี pill
                    // headerBg: "#0C447C",
                    // headerColor: "#fff",
                    // colorBgHeader: "#1d2b4f",
                    // colorTextHeading: "#8ba3cc",
                    // colorBgRowHover: "#e6f0ff",
                    // colorBgRowHoverSecondary: "#f5faff",
                    fontSize: 12,
                  },
                },
              }}
            >
              {children}
            </ConfigProvider>
          </TodoProvider>
        </AuthProviderId24>
      </body>
    </html>
  );
}
