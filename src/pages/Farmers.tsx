import { useState } from "react"
import { useFarmers, useCreateFarmer, useUpdateFarmer, useDeleteFarmer } from "@/hooks/useFarmers"
import { Button } from "@/components/ui/button"
import { Plus, AlertCircle, Pencil, Trash2 } from "lucide-react"
import { FarmerFormModal } from "@/components/farmers/FarmerFormModal"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { Farmer } from "@/types"
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
  const updateMutation = useUpdateFarmer()
  const deleteMutation = useDeleteFarmer()
  
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null)

  const handleOpenCreate = () => {
    setSelectedFarmer(null)
    setIsFormOpen(true)
  }

  const handleOpenEdit = (farmer: Farmer) => {
    setSelectedFarmer(farmer)
    setIsFormOpen(true)
  }

  const handleOpenDelete = (farmer: Farmer) => {
    setSelectedFarmer(farmer)
    setIsDeleteOpen(true)
  }

  const handleFormSubmit = (data: any) => {
    if (selectedFarmer) {
      updateMutation.mutate({ id: selectedFarmer.id, data }, {
        onSuccess: () => setIsFormOpen(false),
      })
    } else {
      const payload = { ...data, registrationDate: new Date().toISOString().split('T')[0] }
      createMutation.mutate(payload, {
        onSuccess: () => setIsFormOpen(false),
      })
    }
  }

  const handleDeleteConfirm = () => {
    if (selectedFarmer) {
      deleteMutation.mutate(selectedFarmer.id, {
        onSuccess: () => setIsDeleteOpen(false),
      })
    }
  }

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">Farmers</h1>
          <p className="text-sm text-neutral-500 mt-1">{farmers?.length || 0} total registered</p>
        </div>
        <Button onClick={handleOpenCreate} className="w-full sm:w-auto">
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
              <TableHead className="text-right font-semibold text-neutral-600">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {farmers?.map((farmer) => (
              <TableRow key={farmer.id}>
                <TableCell className="font-medium text-neutral-900">{farmer.name}</TableCell>
                <TableCell className="text-neutral-600 font-mono text-sm">{farmer.contact}</TableCell>
                <TableCell className="text-neutral-600">{farmer.location}</TableCell>
                <TableCell className="text-neutral-600 font-mono text-sm">{farmer.farmSize} ha</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleOpenEdit(farmer)}
                      aria-label={`Edit ${farmer.name}`}
                    >
                      <Pencil className="h-4 w-4 text-neutral-500 hover:text-primary-600" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleOpenDelete(farmer)}
                      aria-label={`Delete ${farmer.name}`}
                    >
                      <Trash2 className="h-4 w-4 text-neutral-500 hover:text-danger" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            
            {farmers?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-neutral-500">
                  No farmers found. Click "New farmer" to add one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* The key prop is the magic fix. It forces the form to rebuild every time! */}
      <FarmerFormModal 
        key={selectedFarmer?.id || 'new'}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        initialData={selectedFarmer}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete farmer?"
        description={`This will permanently remove ${selectedFarmer?.name}. This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}