export interface typeDepartment {
  id: number;
  locationId: string;
  numberOfInventory: number;
  locationName: string;
  status: boolean;
  description: string;
  locationPlace: string;
  createdAt: Date;
  updatedAt: Date;
  imagesLocation: typeImagesdepartment[];
  inventory: typeInventory[];
  masterProductLocationMap: typeMasterProductLocationMap[];
  locationUserGroupMap: typeLocationUserGroupMap[];
  userGroup: string[];
  Inventory?: string;
  imagefile?: Blob;
}

export interface TreeNode {
  [key: string]: any; // type for unknown keys.
  children?: TreeNode[]; // type for a known property.
}

export interface typeDepartmentFilter {
  id: number;
  locationId: string;
  numberOfInventory: number;
  locationName: string;
  status: boolean;
  description: string;
  locationPlace: string;
  createdAt: Date[];
  updatedAt: Date;
  imagesLocation: typeImagesdepartment[];
  inventory: typeInventory[];
  masterProductLocationMap: typeMasterProductLocationMap[];
  locationUserGroupMap: typeLocationUserGroupMap[];
}

export interface typeImagesdepartment {
  id: number;
  idfile: string;
  path: string;
  namefile: string;
  createdAt: Date;
  updatedAt: Date;
  location: typeDepartment[];
  images_location: string;
}

export interface typeInventory {
  id: number;
  inventoryId: string;
  inventoryNumber: string;
  inventoryName: string;
  status: boolean;
  locationPlace: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
  location: typeDepartment[];
  locationId: number;
  //   inventoryStock  inventoryStock[]
  //   order           order[]
}

export interface typeMasterProductLocationMap {
  // id              :number;            @unique @default(autoincrement()) @map("id")
  // location        location?      @relation(fields: [locationId], references: [id])
  // locationId      :number;?           @map("location_id")
  // masterProduct   masterProduct? @relation(fields: [masterProductId], references: [id])
  // masterProductId :number;?           @map("master_product_id")
  // @@map("master_product_location_map")
}

export interface typeLocationUserGroupMap {
  // id          :number;        @unique @default(autoincrement()) @map("id")
  // userGroup   userGroup? @relation(fields: [userGroupId], references: [groupId], onDelete: Cascade)
  // userGroupId :string;    @map("user_group_id") @db.VarChar()
  // location    location?  @relation(fields: [locationId], references: [id], onDelete: Cascade)
  // locationId  :number;?       @map("location_id")
  // @@map("location_user_group_map")
}

export interface typeuserGroup {
  id: number;
  groupId: string;
  groupName: string;
  createdAt: Date;
  updatedAt: Date;
  parentGroupId: string | null;
  organizedGroupId: string | null;
  description: string;
}
