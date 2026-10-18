import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getFarmers, createFarmer, updateFarmer, deleteFarmer } from "@/services/farmers"
import { toast } from "sonner"
import { Farmer } from "@/types"

// Hook to fetch all farmers
export function useFarmers() {
  return useQuery({
    queryKey: ["farmers"],
    queryFn: getFarmers,
  })
}

// Hook to create a new farmer
export function useCreateFarmer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createFarmer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farmers"] })
      toast.success("Farmer added successfully!")
    },
    onError: (error) => toast.error(error.message || "Failed to add farmer"),
  })
}

// Hook to update a farmer
export function useUpdateFarmer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Farmer> }) => updateFarmer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farmers"] })
      toast.success("Farmer updated successfully!")
    },
    onError: (error) => toast.error(error.message || "Failed to update farmer"),
  })
}

// Hook to delete a farmer
export function useDeleteFarmer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteFarmer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farmers"] })
      toast.success("Farmer deleted successfully!")
    },
    onError: (error) => toast.error(error.message || "Failed to delete farmer"),
  })
}