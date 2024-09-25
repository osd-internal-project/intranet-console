import "./globals.css";
import type { Metadata } from "next";
import {
  Roboto,
  Noto_Sans_Thai,
  Kanit,
  Prompt,
  Kodchasan,
  Sriracha,
} from "next/font/google";
const kodchasan = Kodchasan({ weight: "400", subsets: ["latin"] });
const notoSanThai = Noto_Sans_Thai({ subsets: ["latin"] });
const kanit = Kanit({ weight: "400", subsets: ["latin"] });
const sriracha = Sriracha({ weight: "400", subsets: ["latin"] });
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
      <body className={`${notoSanThai.className} m-0 `}>
        <AuthProvider>
          <ConfigProvider
            theme={{
              token: {
                fontSize: 14,
                colorPrimary: "#00a1df",
                fontFamily: `${notoSanThai}`,
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
