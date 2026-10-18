import { Harvest } from "@/types"

const API_URL = "http://localhost:3001/harvests"

export async function getHarvests(): Promise<Harvest[]> {
  const res = await fetch(API_URL)
  if (!res.ok) throw new Error("Failed to fetch harvests")
  return res.json()
}

export async function createHarvest(data: Omit<Harvest, "id" | "createdAt" | "updatedAt">): Promise<Harvest> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
  })
  if (!res.ok) throw new Error("Failed to create harvest record")
  return res.json()
}

export async function updateHarvest(id: string, data: Partial<Harvest>): Promise<Harvest> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      updatedAt: new Date().toISOString(),
    }),
  })
  if (!res.ok) throw new Error("Failed to update harvest record")
  return res.json()
}

export async function deleteHarvest(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Failed to delete harvest record")
}