import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getInventory, createInventory, updateInventory, deleteInventory } from "@/services/inventory"
import { toast } from "sonner"
import { Inventory } from "@/types"

export function useInventory() {
  return useQuery({ queryKey: ["inventory"], queryFn: getInventory })
}

export function useCreateInventory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] })
      toast.success("Item added successfully!")
    },
    onError: (error) => toast.error(error.message || "Failed to add item"),
  })
}

export function useUpdateInventory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Inventory> }) => updateInventory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] })
      toast.success("Item updated successfully!")
    },
    onError: (error) => toast.error(error.message || "Failed to update item"),
  })
}

export function useDeleteInventory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] })
      toast.success("Item deleted successfully!")
    },
    onError: (error) => toast.error(error.message || "Failed to delete item"),
  })
}