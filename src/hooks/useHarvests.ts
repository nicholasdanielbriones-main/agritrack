import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getHarvests, createHarvest, updateHarvest, deleteHarvest } from "@/services/harvests"
import { toast } from "sonner"
import { Harvest } from "@/types"

export function useHarvests() {
  return useQuery({ queryKey: ["harvests"], queryFn: getHarvests })
}

export function useCreateHarvest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createHarvest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["harvests"] })
      toast.success("Harvest recorded successfully!")
    },
    onError: (error) => toast.error(error.message || "Failed to record harvest"),
  })
}

export function useUpdateHarvest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Harvest> }) => updateHarvest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["harvests"] })
      toast.success("Harvest updated successfully!")
    },
    onError: (error) => toast.error(error.message || "Failed to update harvest"),
  })
}

export function useDeleteHarvest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteHarvest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["harvests"] })
      toast.success("Harvest deleted successfully!")
    },
    onError: (error) => toast.error(error.message || "Failed to delete harvest"),
  })
}