import Link from "next/link";
import { Card, Button, Space } from "antd";
export default function NotFound() {
  return (
    <div className="flex justify-center  h-screen bg-gray-100">
      <div className="  mt-20 ">
        <Card className=" p-10 ">
          <div className="title-page-font">Not found – 404!</div>
          <br />
          <div>
            <Button ghost type="primary">
              <Link href="/page/">Go back to Home</Link>{" "}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
