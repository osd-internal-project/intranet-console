export type TcreateOrganizeDto = {
  positionParent: string;
  positionName: string;
  description?: string;
  parentPositionId: string;
};

export type TupdateOrganizeDto = {
  positionId: string;
  positionName: string;
  description?: string;
};

export type TfindAllOrganizeDto = {
  id: number;
  positionId: string;
  description: string;
  positionName: string;
  parentPositionId?: string;
  createdAt: string;
  updatedAt: string;
  icon?: any;
  children?: any;
};

export type TfindChildrenOrganizeById = {
  id: number;
  position_id: string;
  description: string;
  position_name: string;
  parent_position_id: string;
  created_at: string;
  updated_at: string;
};
