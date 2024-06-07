import { Avatar, Card, Tag } from "antd";
type Props = {
  data: any;
};
const HumanTiles: React.FC<Props> = ({ data }) => {
  return <Tag color="default">{data.title}</Tag>;
};

export default HumanTiles;
