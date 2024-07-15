import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
// import { useRouter } from "../../node_modules/next/dist/client/router";
// import { useSession } from "../../node_modules/next-auth/src/react";
// import { useEffect } from "react";

export default async function Page() {
  // const { data: session, status } = useSession();
  // const router = useRouter();

  // useEffect(() => {
  //   if (status === "authenticated") {
  //     router.push("/home"); // ลิงก์ไปที่หน้า home หลังจากล็อคอินเสร็จสิ้น
  //   }
  // }, [status]);
  return (
    <div className=" flex justify-center items-center">
      <a
        href="https://teams.microsoft.com/l/meetup-join/19%3ameeting_MzZkYzE2NGUtYTc4ZC00NjQwLTg0YjctZGY0MjZjM2QzOTg0%40thread.v2/0?context=%7b%22Tid%22%3a%2241667c79-782f-4113-b9a5-105a562a81af%22%2c%22Oid%22%3a%2219490ea8-8a5f-46b5-9fbd-62509b2ebbdf%22%7d"
        rel="noopener noreferrer"
        target="_blank"
      >
        <img
          src="/images/cat-nyan-cat.gif"
          alt="logo-page"
          className={` w-172 h-auto`}
        />
      </a>
      <a
        href="https://teams.microsoft.com/l/meetup-join/19%3ameeting_N2JjMTdkMDAtNThiYy00ZGJkLTliZjQtYWU0MDg4NDU3NDcx%40thread.v2/0?context=%7b%22Tid%22%3a%2241667c79-782f-4113-b9a5-105a562a81af%22%2c%22Oid%22%3a%22a9928179-39f4-4f3a-af37-fdccbd738d72%22%7d"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Spin
          indicator={
            <img
              src="/images/cat-nyan-cat.gif"
              alt="logo-page"
              style={{ fontSize: 550 }}
            />
          }
        />
      </a>
    </div>
  );
}
