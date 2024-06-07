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
  location: typeLocation[];
  locationId: number;
  // inventoryStock  inventoryStock[]
  // order           order[]
}
export interface typeInventoryFIlters {
    id: number;
    inventoryId: string;
    inventoryNumber: string;
    inventoryName: string;
    status: boolean;
    locationPlace: string;
    phoneNumber: string;
    createdAt: Date[];
    updatedAt: Date;
    location: typeLocation[];
    locationId: number;
    // inventoryStock  inventoryStock[]
    // order           order[]
  }

export interface typeLocation {
  id: number;
  locationId: string;
  numberOfInventory: number;
  locationName: string;
  status: string;
  description: string;
  locationPlace: string;
  createdAt: Date;
  updatedAt: Date;
  // images_location          images_location[]
  // inventory                inventory[]
  // masterProductLocationMap masterProductLocationMap[]
  // locationUserGroupMap     locationUserGroupMap[]
}
