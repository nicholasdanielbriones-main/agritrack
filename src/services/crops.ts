import { Crop } from "@/types"

const API_URL = "http://localhost:3001/crops"

export async function getCrops(): Promise<Crop[]> {
  const res = await fetch(API_URL)
  if (!res.ok) throw new Error("Failed to fetch crops")
  return res.json()
}

export async function createCrop(data: Omit<Crop, "id" | "createdAt" | "updatedAt">): Promise<Crop> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
  })
  if (!res.ok) throw new Error("Failed to create crop")
  return res.json()
}

export async function updateCrop(id: string, data: Partial<Crop>): Promise<Crop> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      updatedAt: new Date().toISOString(),
    }),
  })
  if (!res.ok) throw new Error("Failed to update crop")
  return res.json()
}

export async function deleteCrop(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) throw new Error("Failed to delete crop")
}