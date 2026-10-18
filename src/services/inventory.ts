import { Inventory } from "@/types"

const API_URL = "http://localhost:3001/inventory"

export async function getInventory(): Promise<Inventory[]> {
  const res = await fetch(API_URL)
  if (!res.ok) throw new Error("Failed to fetch inventory")
  return res.json()
}

export async function createInventory(data: Omit<Inventory, "id" | "createdAt" | "updatedAt">): Promise<Inventory> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
  })
  if (!res.ok) throw new Error("Failed to create item")
  return res.json()
}

export async function updateInventory(id: string, data: Partial<Inventory>): Promise<Inventory> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      updatedAt: new Date().toISOString(),
    }),
  })
  if (!res.ok) throw new Error("Failed to update item")
  return res.json()
}

export async function deleteInventory(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Failed to delete item")
}