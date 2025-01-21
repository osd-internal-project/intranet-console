"use client";
import { redirect } from "next/navigation";
export default function Main() {
  // useEffect(() => {
  //   signIn();
  // }, []);

  return redirect("/page");
}
