import React from "react";
import { Button } from "antd";
import Link from "next/link";

const EmailTemplateCreate: React.FC = (): React.ReactElement => {
  return (
    <div className="w-full mb-2">
      <div className="flex justify-end">
        <Link href="/page/email-template/add-template">
          <Button type="primary">{`Add Email Template`}</Button>
        </Link>
      </div>
    </div>
  );
};

export default EmailTemplateCreate;
