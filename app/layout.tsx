import "./globals.css";
import type { Metadata } from "next";
import { Sarabun } from "next/font/google";

const sarabun = Sarabun({ weight: "400", subsets: ["thai"] });
import { ConfigProvider } from "antd";
import AuthProviderId24 from "./provider/AuthProvider";
import TodoProvider from "./config/userContext";
export const metadata: Metadata = {
  title: "Intranet",
  description: "Intranet",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
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
                  fontFamily: sarabun.style.fontFamily,
                },
              }}>
              {children}
            </ConfigProvider>
          </TodoProvider>
        </AuthProviderId24>
      </body>
    </html>
  );
}
