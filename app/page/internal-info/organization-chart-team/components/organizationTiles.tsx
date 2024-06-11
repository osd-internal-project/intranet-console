import { Avatar, Card, Tag, Typography } from "antd";

import Meta from "antd/es/card/Meta";

type Props = {
  data: any;
};
// {
//   key: number;
//   title: any;
//   children: string;
//   userId: string;
//   username: string;
//   firstNameEn: string;
//   lastNameEn: string;
//   email: string;
// };

const { Text } = Typography;

const HumanTiles: React.FC<Props> = ({ data }) => {
  return (
    <Card
      hoverable
      style={{ width: 300, margin: "auto" }}
      // cover={<img alt="profile pic" src={`https://api.dicebear.com/7.x/miniavs/svg?seed=1`} width={70} height={70} />}
    >
      {data.type === "position" ? (
        <Avatar size={"large"} style={{ backgroundColor: "#f56a00" }}>
          K
        </Avatar>
      ) : (
        ""
      )}
      <div>{data.type === "position" ? `${data.firstNameEn} ${data.lastNameEn}` : ""}</div>
      <Text style={true ? { width: 300, } : undefined} ellipsis={true ? { tooltip: data.title } : false} strong>
        {data.title}
      </Text>
    </Card>
  );
};

export default HumanTiles;
