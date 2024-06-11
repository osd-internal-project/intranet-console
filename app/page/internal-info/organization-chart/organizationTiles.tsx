import { Avatar, Card, Tag, Typography } from "antd";

type Props = {
  data: any;
};

const { Text } = Typography;

const HumanTiles: React.FC<Props> = ({ data }) => {
  return (
    <Card
      hoverable
      style={{ width: 300, margin: "auto" }}
    >
      <Text style={true ? { width: 300 } : undefined} ellipsis={true ? { tooltip: data.title } : false} strong>
        {data.title}
      </Text>
    </Card>
  );
};

export default HumanTiles;
