import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getFarmers, createFarmer } from "@/services/farmers"
import { toast } from "sonner"

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
      // Invalidate the 'farmers' query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ["farmers"] })
      toast.success("Farmer added successfully!")
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add farmer")
    },
  })
}