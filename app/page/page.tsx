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
      <a href="https://teams.microsoft.com/l/meetup-join/19%3ameeting_N2JjMTdkMDAtNThiYy00ZGJkLTliZjQtYWU0MDg4NDU3NDcx%40thread.v2/0?context=%7b%22Tid%22%3a%2241667c79-782f-4113-b9a5-105a562a81af%22%2c%22Oid%22%3a%22a9928179-39f4-4f3a-af37-fdccbd738d72%22%7d" target="blank">
        <img
          src="https://media.tenor.com/VvKVHL5DogYAAAAi/anime-dancing.gif"
          alt="My Image"
        />
      </a>
    </div>
  );
}
