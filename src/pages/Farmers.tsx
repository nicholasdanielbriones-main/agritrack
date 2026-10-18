import { useState } from "react"
import { useFarmers, useCreateFarmer } from "@/hooks/useFarmers"
import { Button } from "@/components/ui/button"
import { Plus, AlertCircle } from "lucide-react"
import { FarmerFormModal } from "@/components/farmers/FarmerFormModal"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function Farmers() {
  const { data: farmers, isLoading, isError, error } = useFarmers()
  const createMutation = useCreateFarmer()
  
  // State to control the modal
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCreateSubmit = (data: any) => {
    // Add a default registration date for now
    const payload = { ...data, registrationDate: new Date().toISOString().split('T')[0] }
    
    createMutation.mutate(payload, {
      onSuccess: () => setIsModalOpen(false), // Close modal on success
    })
  }

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-neutral-900">Farmers</h1>
        <div className="bg-white rounded-card border border-neutral-200 p-8 text-center text-neutral-500">
          Loading farmers...
        </div>
      </div>
    )
  }

  // 2. Error State
  if (isError) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-neutral-900">Farmers</h1>
        <div className="bg-red-50 text-danger p-4 rounded-card border border-red-200 flex items-center gap-3">
          <AlertCircle className="h-5 w-5" />
          <p>Failed to load farmers: {error.message}</p>
        </div>
      </div>
    )
  }

  // 3. Success State
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">Farmers</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {farmers?.length || 0} total registered
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          New farmer
        </Button>
      </div>

      <div className="bg-white rounded-card border border-neutral-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50 hover:bg-neutral-50">
              <TableHead className="font-semibold text-neutral-600">Name</TableHead>
              <TableHead className="font-semibold text-neutral-600">Contact</TableHead>
              <TableHead className="font-semibold text-neutral-600">Location</TableHead>
              <TableHead className="font-semibold text-neutral-600">Farm Size</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {farmers?.map((farmer) => (
              <TableRow key={farmer.id}>
                <TableCell className="font-medium text-neutral-900">{farmer.name}</TableCell>
                <TableCell className="text-neutral-600 font-mono text-sm">{farmer.contact}</TableCell>
                <TableCell className="text-neutral-600">{farmer.location}</TableCell>
                <TableCell className="text-neutral-600 font-mono text-sm">{farmer.farmSize} ha</TableCell>
              </TableRow>
            ))}
            
            {farmers?.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-neutral-500">
                  No farmers found. Click "New farmer" to add one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* The Modal */}
      <FarmerFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateSubmit}
        isSubmitting={createMutation.isPending}
      />
    </div>
  )
}