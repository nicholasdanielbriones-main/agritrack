import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getCrops, createCrop, updateCrop, deleteCrop } from "@/services/crops"
import { toast } from "sonner"
import { Crop } from "@/types"

export function useCrops() {
  return useQuery({ queryKey: ["crops"], queryFn: getCrops })
}

export function useCreateCrop() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createCrop,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crops"] })
      toast.success("Crop added successfully!")
    },
    onError: (error) => toast.error(error.message || "Failed to add crop"),
  })
}

export function useUpdateCrop() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Crop> }) => updateCrop(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crops"] })
      toast.success("Crop updated successfully!")
    },
    onError: (error) => toast.error(error.message || "Failed to update crop"),
  })
}

export function useDeleteCrop() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteCrop,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crops"] })
      toast.success("Crop deleted successfully!")
    },
    onError: (error) => toast.error(error.message || "Failed to delete crop"),
  })
}