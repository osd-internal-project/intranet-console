import { Avatar, Card, Typography } from "antd";

type Props = {
  data: any;
};

const { Text } = Typography;

const HumanTiles: React.FC<Props> = ({ data }) => {
  return (
    <Card hoverable style={{ width: 300, margin: "auto" }}>
      {data.type === "position" ? (
        <Avatar size={128} style={{ backgroundColor: "#00a1df" }} src={data.imageId ? URL.createObjectURL(data.imageId ? data.imageId : "") : ""} />
      ) : (
        ""
      )}
      <div>{data.type === "position" ? `${data.firstNameEn} ${data.lastNameEn}` : ""}</div>
      <Text style={true ? { width: 300 } : undefined} ellipsis={true ? { tooltip: data.title } : false} strong>
        {data.title}
      </Text>
    </Card>
  );
};

export default HumanTiles;
