// These types match your Prisma schema (and your db.json) exactly.

export type Farmer = {
  id: string
  name: string
  contact: string
  location: string
  farmSize: number
  registrationDate: string
  createdAt: string
  updatedAt: string
}

export type Crop = {
  id: string
  cropName: string
  variety: string
  plantingDate: string
  harvestDate: string
  status: "Growing" | "Harvested" | "Planned"
  farmerId: string
  createdAt: string
  updatedAt: string
}

export type Inventory = {
  id: string
  itemName: string
  category: string
  quantity: number
  unit: string
  supplier: string
  reorderLevel: number
  createdAt: string
  updatedAt: string
}

export type Harvest = {
  id: string
  cropId: string
  quantity: number
  unit: string
  harvestDate: string
  qualityGrade: "A" | "B" | "C"
  notes: string
  createdAt: string
  updatedAt: string
}