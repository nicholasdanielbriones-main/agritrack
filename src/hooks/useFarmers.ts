import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getFarmers } from "@/services/farmers"
import { toast } from "sonner"

// Hook to fetch all farmers
export function useFarmers() {
  return useQuery({
    queryKey: ["farmers"],
    queryFn: getFarmers,
  })
}