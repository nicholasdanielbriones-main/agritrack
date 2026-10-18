import { Farmer } from "@/types"

// The base URL for our mock json-server
const API_URL = "http://localhost:3001/farmers"

// GET all farmers
export async function getFarmers(): Promise<Farmer[]> {
  const res = await fetch(API_URL)
  if (!res.ok) throw new Error("Failed to fetch farmers")
  return res.json()
}

// GET a single farmer by ID
export async function getFarmer(id: string): Promise<Farmer> {
  const res = await fetch(`${API_URL}/${id}`)
  if (!res.ok) throw new Error("Failed to fetch farmer")
  return res.json()
}

// CREATE a new farmer
export async function createFarmer(data: Omit<Farmer, "id" | "createdAt" | "updatedAt">): Promise<Farmer> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
  })
  if (!res.ok) throw new Error("Failed to create farmer")
  return res.json()
}

// UPDATE a farmer
export async function updateFarmer(id: string, data: Partial<Farmer>): Promise<Farmer> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      updatedAt: new Date().toISOString(),
    }),
  })
  if (!res.ok) throw new Error("Failed to update farmer")
  return res.json()
}

// DELETE a farmer
export async function deleteFarmer(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) throw new Error("Failed to delete farmer")
}