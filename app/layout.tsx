import "./globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
const roboto = Roboto({ weight: "400", subsets: ["latin"] });
import AuthProvider from "@/app/provider/AuthProvider";
import { ConfigProvider } from "antd";
import { signIn, useSession } from "next-auth/react";
export const metadata: Metadata = {
  title: "Intranet",
  description: "Intranet",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${roboto.className} m-0 `}>
        <AuthProvider>
          <ConfigProvider
            theme={{
              token: {
                fontSize: 16,
                colorPrimary: "#00a1df",
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
