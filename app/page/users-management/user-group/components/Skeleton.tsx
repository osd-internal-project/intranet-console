import { Card, Button, Skeleton } from "antd";

export const GroupManageSkeleton: React.FC = () => {
  return (
    <Card className="mx-2 my-2 md:my-0 " style={{ minHeight: " 500px" }}>
      <div className="grid grid-cols-1 gap-0 space-y-5 ">
        <div className="flex  justify-between ">
          <div className=" text-2xl  font-semibold inline-block">Group Detail</div>
          <div className=" inline-block space-x-4 ">
            <Button className="button-blue" type="primary" disabled>
              Add Sub Group
            </Button>
            <Button>Close</Button>
          </div>
        </div>

        <div>
          Group Id : <Skeleton.Input block={true} />
        </div>
        <div>
          Name : <Skeleton.Input block={true} />
        </div>
        <div>
          Description : <Skeleton.Input block={true} />
        </div>
        {/* <div>
      Name : <Input />
    </div> */}
        <div className="flex justify-end space-x-4 ">
          <Button className="button-blue" type="primary" disabled>
            Edit
          </Button>
          <Button type="primary" danger disabled>
            Delete
          </Button>
        </div>
        <div></div>
      </div>
    </Card>
  );
};
